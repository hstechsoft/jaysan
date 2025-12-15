
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
var godown_id = '';
var dep_id = '';
var sec_id = '';
$(document).ready(function () {

    $("#section_stock_tabel_search").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        $("#section_stock_tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });



    $("#menu_bar").load('menu.html',
        function () {
            var lo = (window.location.pathname.split("/").pop());
            var web_addr = "#" + (lo.substring(0, lo.indexOf(".")))


            if ($(web_addr).find("a").hasClass('nav-link')) {
                $(web_addr).find("a").toggleClass('active')
            }
            else if ($(web_addr).find("a").hasClass('dropdown-item')) {
                $(web_addr).parent().parent().find("a").eq(0).toggleClass('active')
            }


        }
    );


    $("#mobile_form_view_btn").on("change", function(){
        if($(this).is(":checked")){
            $("#mobile_form_view").css("display", "block");
        }else{
            $("#mobile_form_view").css("display", "none");
        }
    })

    check_login();

    $("#unamed").text(localStorage.getItem("ls_uname"))

    $('#section').on('input', function () {

        //check the value not empty
        if ($('#section').val() != "") {
            $('#section').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_sections_full_auto.php",
                        type: "get", //send it through get method
                        data: {
                            term: request.term,

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.sec_name,
                                    value: item.sec_name,
                                    id: item.dep_sec_id,
                                    dep: item.dep_id,
                                    godown: item.godown_id,
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("sec_id", ui.item.id);
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)
                    dep_id = ui.item.dep;
                    godown_id = ui.item.godown;
                    sec_id = ui.item.id;
                    get_jaysan_stock(ui.item.id, ui.item.dep, ui.item.godown);


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#part').on('input', function () {
        //check the value not empty
        if ($('#part').val() != "") {
            $('#part').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_part_name_auto1.php",
                        type: "get", //send it through get method
                        data: {

                            part: $('#part').val(),
                            term: 'part',



                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.part_name,
                                    value: item.part_name,
                                    id: item.part_id,
                                    // part_name: item.part_name
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("part_id", ui.item.id);
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)
                    //  get_bom(ui.item.id)


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $("#section_stock_btn").on("click", function () {

        var secc_id = $("#section").data("sec_id");
        var part = $("#part").data("part_id");
        var qty = $("#qty").val();
        console.log(sec_id, part, qty);

        if (secc_id == undefined || part == undefined || qty == '') {
            salert("Warning", "Please enter the fields", "warning");
        }
        else {
            insert_jaysan_stock(part, godown_id, dep_id, secc_id, qty, '{}');
        }

    })

    $("#section_stock_tbody").on("keydown", "span", function (e) {

        if (e.key === "Enter") {
            e.preventDefault();

            var part = $(this).data("part_id") || '';
            var godown = $(this).data("unit_id") || '';
            var department = $(this).data("dep_id") || '';
            var section = $(this).data("sec_id") || '';
            var qty = $(this).text().trim();

            console.log("part", part, "godown", godown, "department", department, "section", section, "qty", qty);

            insert_jaysan_stock(part, godown, department, section, qty, '{}');

        }
    });


    $("#section_stock_tbody").on("click", "#fa-bell", function () {
        let part_id = $(this).data("part_id");
        let qtyy = $(this).data("qty");

        // store values in modal button
        $("#req_btn").data("part_id", part_id);
        $("#req_btn").data("qty", qtyy);
    });
    $("#req_btn").on("click", function () {
        let part_id = $(this).data("part_id");
        let qtyy = $(this).data("qty");
        $("#requestModal").modal("hide");

        console.log("REQUEST:", part_id, qtyy);

        insert_emp_material_request(sec_id, part_id, qtyy);
    });


    $("#section_min_max_view").on("change", function(){
        get_jaysan_stock(sec_id, dep_id, godown_id);
    })
    // get_jaysan_stock(27)



});




function insert_jaysan_stock(part, godown_id, dep_id, sec_id, qty, stock_master_json) {
    console.log("part" + part, "godown" + godown_id, "department" + dep_id, "section" + sec_id, qty, "stock_master " + stock_master_json);


    $.ajax({
        url: "php/insert_jaysan_stock.php",
        type: "get", //send it through get method
        data: {

            godown: godown_id,
            dep: dep_id,
            sec: sec_id,
            qty: qty,
            part_id: part,
            batch_id: '',
            finished_godown: '',
            remark: '',
            stock_master: stock_master_json,
            emp_id: current_user_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == "ok") {
                get_jaysan_stock(sec_id, dep_id, godown_id);
                $("#stock_part").val('');
                $("#stock_part").data('part_id', '');
                $("#qty").val('');

                $("#stock_insert_btn").prop("disabled", false);
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function get_jaysan_stock(sec_query, dep_query, creditor_query) {
    $("#tog").removeClass("d-none")
    // console.log("fd " + from_date, "td " + to_date, "g " + creditor_query, "d " + dep_query, "s " + sec_query, "p " + part_query, "q " + qty_query, "min_order_query " + min_order_query);

    $.ajax({
        url: "php/get_jaysan_stock.php",
        type: "get", //send it through get method
        data: {

            from_date: '',
            to_date: '',
            creditor_query: creditor_query,
            dep_query: dep_query,
            sec_query: sec_query,
            part_query: '',
            qty_query: '',
            min_order_query: '',
        },
        success: function (response) {
            console.log(response);



            if (response.trim() != 'error') {
                $("#section_stock_tbody").empty();

                if (response.trim() != '0 result') {

                    // assume `response` is the JSON string you showed
                    var obj = JSON.parse(response);
                    var count = 0;

                    obj.forEach(function (item) {
                        count++;

                        // safe-parse unit_total (it is a JSON string in your API)
                        var unitTotals = [];
                        try {
                            unitTotals = JSON.parse(item.unit_total || "[]");
                        } catch (e) {
                            unitTotals = [];
                        }

                        // compute how many section-rows this item will produce (across all units & departments)
                        var itemRowSpan = 0;
                        unitTotals.forEach(function (u) {
                            if (Array.isArray(u.department_details)) {
                                u.department_details.forEach(function (d) {
                                    if (Array.isArray(d.section_details)) {
                                        itemRowSpan += d.section_details.length;
                                    }
                                });
                            }
                        });

                        console.log(itemRowSpan);

                        // if there are no unit/department/section details, still render one row for the part
                        if (itemRowSpan === 0) {
                            var trEmpty = "<tr>";
                            trEmpty += `<td>${count}</td>`;
                            trEmpty += `<td>${item.part_name || ""} - ${item.total_stock} <span class='badge bg-danger'>${item.total_stock}</span> </td>`;
                            trEmpty += `<td colspan="4">No unit/department/section data</td>`;
                            trEmpty += "</tr>";
                            $("#section_stock_tbody").append(trEmpty);
                            return;
                        }

                        // iterate units -> departments -> sections and build rows
                        unitTotals.forEach(function (unitObj, unitIndex) {
                            var unitName = unitObj.unit || "";
                            // compute unit rowspan = total sections inside this unit
                            var unitRowSpan = 0;
                            if (Array.isArray(unitObj.department_details)) {
                                unitObj.department_details.forEach(function (d) {
                                    if (Array.isArray(d.section_details)) unitRowSpan += d.section_details.length;
                                });
                            }

                            (unitObj.department_details || []).forEach(function (depObj, depIndex) {
                                var depName = depObj.department || "";
                                var sections = depObj.section_details || [];

                                sections.forEach(function (secObj, secIndex) {
                                    var tr = `<tr class='text-center align-middle'>`;

                                    // Part-level cells: only on the very first row for this item
                                    if (unitIndex === 0 && depIndex === 0 && secIndex === 0) {
                                        var blink = '';
                                        var total_stock = item.total_stock ?? 0;
                                        if (item.total_stock <= item.min_order_qty) { blink = `blink`; }
                                        tr += `<td rowspan="${itemRowSpan}">${count}</td>`;
                                        tr += `<td rowspan="${itemRowSpan}"> ${item.part_name || ""}</td>`;
                                    }

                                    // Unit cell: only for first department/first section inside this unit
                                    // if (depIndex === 0 && secIndex === 0) {
                                    //     var blink = '';
                                    //     var req = '';
                                    //     let godown_min = unitObj.godown_min ?? 0;
                                    //     let godown_max = unitObj.godown_max ?? 0;
                                    //     if (unitObj.godown_req !== null) {
                                    //         var g_req_count = 0;
                                    //         unitObj.godown_req.forEach(function (greq) {
                                    //             g_req_count++;
                                    //         })
                                    //         req = `<span class='badge blink bg-warning me-2'><i class="fa-regular fa-bell"></i> ${g_req_count}</span>`
                                    //     }
                                    //     if (unitObj.godown_qty <= unitObj.godown_min) { blink = `blink`; }
                                    //     tr += `<td rowspan="${unitRowSpan}">${req} ${unitName} - <span contenteditable class="border border-primary p-2 me-2 border-2 rounded-3"   data-stock_id='${item.stock_id}' data-part_id='${item.part_id}' data-unit_id='${unitObj.godown_id}'>${unitObj.godown_qty}</span> <span class='badge bg-danger ${blink}'>${godown_min}</span><span class='badge bg-success ms-1'>${godown_max}</span></td>`;
                                    // }

                                    // Department cell: only for first section of this department
                                    // if (secIndex === 0) {
                                    //     var blink = '';
                                    //     var dd_req = '';
                                    //     let dep_min = depObj.dep_min ?? 0;
                                    //     let dep_max = depObj.dep_max ?? 0;
                                    //     if (depObj.dep_req !== null) {
                                    //         var d_req_count = 0;
                                    //         depObj.dep_req.forEach(function (greq) {
                                    //             d_req_count++;
                                    //         })
                                    //         dd_req = `<span class='badge blink bg-warning me-2'><i class="fa-regular fa-bell"></i> ${d_req_count}</span>`
                                    //     }
                                    //     if (depObj.department_qty <= depObj.dep_min) { blink = `blink`; }
                                    //     tr += `<td rowspan="${sections.length}">${dd_req} ${depName} - <span contenteditable class="border border-primary p-2 me-2 border-2 rounded-3"  data-stock_id='${item.stock_id}' data-part_id='${item.part_id}' data-unit_id='${unitObj.godown_id}' data-dep_id='${depObj.dep_id}'>${depObj.department_qty}</span> <span class='badge bg-danger ${blink}'>${dep_min}</span><span class='badge bg-success ms-1'>${dep_max}</span> </td>`;
                                    // }

                                    // Section and Section_qty
                                    var blink = '';
                                    var s_min_max = '';
                                    var remaining_qut = 0;
                                    let sec_min = secObj.sec_min ?? 0;
                                    let sec_max = secObj.sec_max ?? 0;
                                    remaining_qut = parseFloat(secObj.sec_max) - parseFloat(secObj.Section_qty);
                                    console.log(isNaN(remaining_qut) ? 0 : remaining_qut, "item.part_id : " + item.part_id);

                                    if (secObj.Section_qty <= secObj.sec_min) { blink = `blink`; }
                                    if($("#section_min_max_view").is(":checked")){
                                        s_min_max = `<span class=' ms-2 badge bg-danger ${blink}'>${sec_min}</span><span class='badge bg-success ms-1'>${sec_max}</span>`;
                                    }
                                    // tr += `<td>${ss_req} ${secObj.section || ""} <span class='badge bg-danger ${blink}'>${sec_min}</span><span class='badge bg-success ms-1'>${sec_max}</span></td>`;
                                    tr += `<td><span class="border border-primary px-3 py-1  border-2 rounded-1" contenteditable data-stock_id='${item.stock_id}' data-part_id='${item.part_id}' data-unit_id='${unitObj.godown_id}' data-dep_id='${depObj.dep_id}' data-sec_id='${secObj.sec_id}'>${secObj.Section_qty != null ? secObj.Section_qty : ""}</span>${s_min_max}</td>
                                    
                                    <td><button class='btn' data-bs-toggle="modal" data-bs-target="#requestModal" data-part_id='${item.part_id}' data-qty='${isNaN(remaining_qut) ? 0 : remaining_qut}'  id='fa-bell'><i class="fa-regular fa-bell text-success"></i> </button></td>`;

                                    tr += "</tr>";
                                    $("#section_stock_tbody").append(tr);
                                });
                            });
                        });
                    });

                }

                else {
                    $("#stock_tbady").append(
                        `<tr><td class='text-danger text-center' colspan='6'>No stock</td></tr>`
                    );
                }
            }






        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function insert_emp_material_request(store_id, part_id, qtyy) {
    console.log(store_id, part_id, qtyy);


    $.ajax({
        url: "php/insert_emp_material_request.php",
        type: "get", //send it through get method
        data: {

            emp_id: current_user_id,
            store_id: store_id,
            store_type: 'sec',
            dated: '',
            part_id: part_id,
            qty: qtyy,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == 'ok') {

                get_jaysan_stock(sec_id, dep_id, godown_id);


            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}


function insert_new_process(processId) {

    $.ajax({
        url: "php/insert_nprocess.php",
        type: "get", //send it through get method
        data: {

            process_id: processId,
            edit_process_id: edit_process_id,
            input_part_id: sel_input_part_id,
            output_part_id: sel_output_part_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim()) {
                sessionStorage.setItem('editProcessId', response.trim());
                sessionStorage.setItem('breadcrumb', $('#out_breadcrumb').html());
                // Reload the page
                location.reload();
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}













function check_login() {

    if (localStorage.getItem("logemail") == null && phone_id == null) {
        window.location.replace("login.html");
    }
    else if (localStorage.getItem("logemail") == null && phone_id != null) {
        get_current_userid_byphoneid();
        $('#menu_bar').hide()
    }

    else {

    }
}


function get_current_userid_byphoneid() {
    $.ajax({
        url: "php/get_current_employee_id_byphoneid.php",
        type: "get", //send it through get method
        data: {
            phone_id: phone_id,


        },
        success: function (response) {


            if (response.trim() != "error") {
                var obj = JSON.parse(response);


                console.log(response);


                obj.forEach(function (obj) {
                    current_user_id = obj.emp_id;
                    current_user_name = obj.emp_name;
                });

                //    get_sales_order()
            }

            else {
                salert("Error", "User ", "error");
            }



        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });
}


function shw_toast(title, des, theme) {


    $('.toast-title').text(title);
    $('.toast-description').text(des);
    var toast = new bootstrap.Toast($('#myToast'));
    toast.show();
}

function get_millis(t) {

    var dt = new Date(t);
    return dt.getTime();
}



function get_cur_millis() {
    var dt = new Date();
    return dt.getTime();
}


function get_today_date() {
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    var hour = date.getHours();
    var mins = date.getMinutes();

    console.log(mins)

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    var today = year + "-" + month + "-" + day + "T" + hour + ":" + mins;
    return today;
}

function get_today_start_millis() {
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    var today = year + "-" + month + "-" + day + "T00:00";

    return get_millis(today)

}


function get_today_end_millis() {
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    var today = year + "-" + month + "-" + day + "T23:59";

    return get_millis(today)

}

function salert(title, text, icon) {


    swal({
        title: title,
        text: text,
        icon: icon,
    });
}



function millis_to_date(millis) {
    var d = new Date(millis); // Parameter should be long value


    return d.toLocaleString('en-GB');

}