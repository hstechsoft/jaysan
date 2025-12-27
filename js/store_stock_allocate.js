// const { jsx } = require("react/jsx-runtime");

var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];

const part_id = urlParams.get("part_id");
const req = urlParams.get("req");

console.log(part_id, req);

$(document).ready(function () {





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


    get_jaysan_stock_request()
    get_jaysan_stock_available()

    check_login();

    $("#unamed").text(localStorage.getItem("ls_uname"))


    $('#allocate_section').on('input', function () {
        // alert()
        //check the value not empty
        if ($('#allocate_section').val() !== "") {
            $('#allocate_section').autocomplete({
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


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#allocate_department').on('input', function () {
        // alert()
        //check the value not empty
        if ($('#allocate_department').val() !== "") {
            $('#allocate_department').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_departments_auto2.php",
                        type: "get", //send it through get method
                        data: {
                            term: request.term,

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.dep_name,
                                    value: item.dep_name,
                                    id: item.dep_id,
                                    godown: item.godown_id,
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("dep_id", ui.item.id);
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#allocate_unit').on('input', function () {
        // alert()
        //check the value not empty
        if ($('#allocate_unit').val() !== "") {
            $('#allocate_unit').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_creditors_auto.php",
                        type: "get", //send it through get method
                        data: {
                            term: request.term,

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.creditor_name,
                                    value: item.creditor_name,
                                    id: item.creditor_id,
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("godown_id", ui.item.id);
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $(".allocate_uds").on("change", function () {

        $(".allocate_uds").not(this).prop("checked", false);

        $("#allocate_unit, #allocate_department, #allocate_section")
            .addClass("d-none")
            .val("");

        if (this.checked) {
            switch (this.id) {
                case "unit_chk":
                    $("#allocate_unit").removeClass("d-none");
                    break;
                case "department_chk":
                    $("#allocate_department").removeClass("d-none");
                    break;
                case "section_chk":
                    $("#allocate_section").removeClass("d-none");
                    break;
            }
        }
    });

    var select_modalBtn = '';
    $("#modal").on("click", function () {
        $("#stockModal").modal("show");


    })

    $("#stockModal").on("change", "#allocated_qty", function () {
        // var part_id = select_modalBtn.data("part_id");
        var available_qty = select_modalBtn.data("available_qty");
        var entered_qty = $(this).val();
        alert("ava" + available_qty + "-" + "  enter " + entered_qty);
        if (entered_qty < 0) {
            alert("<0");

            $(this).val(0);
        }
        else if (entered_qty > available_qty) {
            alert("1");
            $(this).val(available_qty);
        }
    })

    $("#allocate_btn").on("click", function () {
        $("#stockModal").modal("hide");
        var part_id = select_modalBtn.data("part_id");

    })


    $("#store_stock_exchange_btn").on("click", function () {
        $("#store_stock_exchangeModal").modal("show");

    })

    $("#material_requested_details").on("click", '.req-check', function () {
        if ($(this).is(":checked")) {
            console.log($(this).val());

        }
    })

    $("#store_stock_allocate_tbody").on("input", "td:eq(3)", function () {

        let cell = $(this);
        let row = cell.closest("tr");

        let available_qty = Number(row.find("td").eq(2).text().trim());
        let entered_text = cell.text().trim();
        let entered_qty = Number(entered_text);

        if (entered_text === "") {
            row.find("td").eq(4).text(available_qty);
            return;
        }

        if (isNaN(entered_qty) || entered_qty < 0) {
            cell.text(0);
            entered_qty = 0;
        }


        if (entered_qty > available_qty) {
            cell.text(available_qty);
            entered_qty = available_qty;
        }


        let balance = available_qty - entered_qty;
        row.find("td").eq(4).text(balance);
    });



    $("#allocate_button").on("click", function () {

        // ------------------ RESET ------------------
        $("#allocation_summary_tbody").empty();

        let selectedRequests = [];
        let selectedFromPlaces = [];

        // ------------------ COLLECT REQUESTS ------------------
        $("#material_requested_details tr").each(function () {

            let qtyText = $(this).find("td").eq(3).text().trim();
            let qty = Number(qtyText);

            if (!isNaN(qty) && qty > 0) {
                selectedRequests.push({
                    req_id: $(this).find("td").eq(3).data("req_id"),
                    t_place_id: $(this).find("td").eq(3).data("t_place_id"),
                    t_place_type: $(this).find("td").eq(3).data("t_place_type"),
                    place: $(this).find("td").eq(1).text().trim(),
                    qty: qty
                });
            }
        });

        // ------------------ COLLECT FROM PLACES ------------------
        $("#store_stock_allocate_tbody tr").each(function () {

            let qtyText = $(this).find("td").eq(3).text().trim();
            let qty = Number(qtyText);

            if (!isNaN(qty) && qty > 0) {
                selectedFromPlaces.push({
                    f_place_id: $(this).find("td").eq(3).data("f_place_id"),
                    f_place_type: $(this).find("td").eq(3).data("f_place_type"),
                    place: $(this).find("td").eq(1).text().trim(),
                    qty: qty
                });
            }
        });

        // ------------------ BASIC VALIDATION ------------------
        if (selectedRequests.length === 0 || selectedFromPlaces.length === 0) {
            salert("Warning", "Please enter allocation quantities", "warning");
            return;
        }

        // ------------------ TOTAL QTY VALIDATION ------------------
        let totalReqQty = selectedRequests.reduce((sum, r) => sum + r.qty, 0);
        let totalFromQty = selectedFromPlaces.reduce((sum, f) => sum + f.qty, 0);

        if (totalFromQty != totalReqQty) {
            salert("Warning", "Requested quantity and available stock Quantity has to be same", "warning");
            return;
        }

        // ------------------ SCENARIO DETECTION ------------------
        let isOneToMany = selectedRequests.length === 1 && selectedFromPlaces.length > 1;
        let isManyToOne = selectedRequests.length > 1 && selectedFromPlaces.length === 1;
        let isOneToOne = selectedRequests.length === 1 && selectedFromPlaces.length === 1;

        if (!isOneToMany && !isManyToOne && !isOneToOne) {
            salert("Warning", "Invalid allocation selection", "warning");
            return;
        }


        let count = 1;

        // ------------------ ONE → ONE ------------------
        if (isOneToOne) {

            let req = selectedRequests[0];
            let fp = selectedFromPlaces[0];

            console.log(req.t_place_id, fp.f_place_id);

            if (req.t_place_id === fp.f_place_id) {
                salert("Warning", "You cannot exchange the stock from the same place!", "warning");
                return;
            }
            $("#stock_summary_table").removeClass("d-none");
            $("#allocation_summary_tbody").append(`
            <tr>
                <td>${count}</td>
                <td>${$("#part_name_as_title").text()}</td>

                <td data-req_id="${req.req_id}"
                    data-t_place_id="${req.t_place_id}"
                    data-t_place_type="${req.t_place_type}">
                    ${req.place}
                </td>

                <td class="from_data"
                    data-f_place_id="${fp.f_place_id}"
                    data-f_place_type="${fp.f_place_type}">
                    ${fp.place}
                </td>

                <td>${req.qty}</td>
            </tr>
        `);
        }


        // ------------------ ONE REQUEST → MANY FROM PLACES ------------------
        if (isOneToMany) {
            // let count = 1;
            let req = selectedRequests[0];

            // Validate first
            const invalid = selectedFromPlaces.some(fp => fp.f_place_id === req.t_place_id);
            if (invalid) {
                salert("Warning", "You cannot exchange the stock from the same place!", "warning");
                return;
            }
            $("#stock_summary_table").removeClass("d-none");

            selectedFromPlaces.forEach(fp => {

                $("#allocation_summary_tbody").append(`
                <tr>
                    <td>${count++}</td>
                    <td>${$("#part_name_as_title").text()}</td>

                    <td data-req_id="${req.req_id}"
                        data-t_place_id="${req.t_place_id}"
                        data-t_place_type="${req.t_place_type}">
                        ${req.place}
                    </td>

                    <td class="from_data"
                        data-f_place_id="${fp.f_place_id}"
                        data-f_place_type="${fp.f_place_type}">
                        ${fp.place}
                    </td>

                    <td>${fp.qty}</td>
                </tr>
            `);
            });
        }

        // ------------------ MANY FROM PLACES → ONE REQUEST ------------------
        if (isManyToOne) {
            // let count = 1;
            let fp = selectedFromPlaces[0];

            const invalid = selectedRequests.some(req => req.t_place_id === fp.f_place_id);
            if (invalid) {
                salert("Warning", "You cannot exchange the stock from the same place!", "warning");
                return;
            }
            $("#stock_summary_table").removeClass("d-none");
            selectedRequests.forEach(req => {
                $("#allocation_summary_tbody").append(`
                <tr>
                    <td>${count++}</td>
                    <td>${$("#part_name_as_title").text()}</td>

                    <td data-req_id="${req.req_id}"
                        data-t_place_id="${req.t_place_id}"
                        data-t_place_type="${req.t_place_type}">
                        ${req.place}
                    </td>

                    <td class="from_data"
                        data-f_place_id="${fp.f_place_id}"
                        data-f_place_type="${fp.f_place_type}">
                        ${fp.place}
                    </td>

                    <td>${req.qty}</td>
                </tr>
            `);
            });
        }

        // $("#stock_summary_table").addClass("d-none");
    });

    $("#confirm_allocation_btn").on("click", function () {

        let allocation_json = [];

        $("#allocation_summary_tbody tr").each(function () {

            let req_id = $(this).find("td").eq(2).data("req_id");
            let t_place_id = $(this).find("td").eq(2).data("t_place_id");
            let t_place_type = $(this).find("td").eq(2).data("t_place_type");

            let f_place_id = $(this).find("td").eq(3).data("f_place_id");
            let f_place_type = $(this).find("td").eq(3).data("f_place_type");

            let qty = Number($(this).find("td").eq(4).text().trim());

            if (isNaN(qty) || qty <= 0) return;

            allocation_json.push({
                part_id: part_id,
                from_place_id: f_place_id,
                from_place_type: f_place_type,
                to_palce_id: t_place_id,
                to_place_type: t_place_type,
                qty: qty,
                req_no: req_id,
                allocation_cat: "internal_request",
                created_by: current_user_id
            });
        });

        if (allocation_json.length === 0) {
            alert("No allocation data found");
            return;
        }

        insert_stock_allocation(allocation_json);
    });



});






function get_jaysan_stock_request(min_order_query, from_date, to_date, creditor_query, dep_query, sec_query, part_query, qty_query, request_query) {

    $.ajax({
        url: "php/get_jaysan_stock.php",
        type: "get", //send it through get method
        data: {


            from_date: from_date,
            to_date: to_date,
            creditor_query: creditor_query,
            dep_query: dep_query,
            sec_query: sec_query,
            part_query: part_id,
            qty_query: qty_query,
            min_order_query: min_order_query,
            requst_query: req,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() !== "error") {

                if (response.trim() !== "ok") {

                    var obj = JSON.parse(response);

                    $("#material_requested_details").empty();

                    var count = 0;
                    var s_count = 0;

                    obj.forEach(function (item) {

                        $("#part_name_as_title").text(item.part_name);




                        // ---------- REQUEST DETAILS ----------
                        if (item.req_details) {

                            var reqWrapper = JSON.parse(item.req_details);

                            reqWrapper.forEach(function (wrapper) {

                                if (wrapper.req_details) {

                                    wrapper.req_details.forEach(function (req) {

                                        count++;

                                        $("#material_requested_details").append(`
                                            <tr>
                                                <td>${count}</td>
                                                <td>${req.store}</td>
                                                <td>${req.qty}</td>
                                                <td contenteditable='true' data-req_id='${req.req_id}' data-t_place_id='${req.store_id}' data-t_place_type='${req.store_type}'>0</td>
                                                <td>${req.dated}</td>
                                            </tr>
                                        `);
                                    });
                                }
                            });
                        }
                    });

                } else {
                    $("#material_requested_details").append(
                        "<tr><td colspan='5'>No request found</td></tr>"
                    );
                }
            }






        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function get_jaysan_stock_available(min_order_query, from_date, to_date, creditor_query, dep_query, sec_query, part_query, qty_query, request_query) {

    $.ajax({
        url: "php/get_jaysan_stock.php",
        type: "get", //send it through get method
        data: {


            from_date: from_date,
            to_date: to_date,
            creditor_query: creditor_query,
            dep_query: dep_query,
            sec_query: sec_query,
            part_query: part_id,
            qty_query: qty_query,
            min_order_query: min_order_query,
            requst_query: "",
        },
        success: function (response) {
            console.log(response);



            if (response.trim() !== "error") {

                if (response.trim() !== "ok") {

                    var obj = JSON.parse(response);

                    $("#store_stock_allocate_tbody").empty();

                    var count = 0;
                    var s_count = 0;

                    obj.forEach(function (item) {

                        $("#part_name_as_title").text(item.part_name);

                        // ---------- STOCK DETAILS ----------
                        var unitList = typeof item.unit_total === "string"
                            ? JSON.parse(item.unit_total)
                            : item.unit_total;

                        var tbody = "";

                        unitList.forEach(function (u) {

                            var departments = u.department_details || [];

                            departments.forEach(function (d) {

                                if (d.department === "no-department") {

                                    s_count++;
                                    tbody += `
                                            <tr>
                                                <td>${s_count}</td>
                                                <td>${u.unit}</td>
                                                <td>${u.godown_qty}</td>
                                                <td contenteditable='true' class="allocated_qty" data-f_place_id='${u.godown_id}' data-f_place_type='${u.store_type}'>${u.godown_qty}</td>
                                                <td class="balance_qty">${u.godown_qty}</td>
                                            </tr>`;

                                } else {

                                    var sections = d.section_details || [];

                                    sections.forEach(function (s) {

                                        s_count++;

                                        if (s.section === "no-section") {

                                            tbody += `
                                                    <tr>
                                                        <td>${s_count}</td>
                                                        <td>${d.department}</td>
                                                        <td>${d.department_qty}</td>
                                                        <td contenteditable='true' class="allocated_qty" data-f_place_id='${d.dep_id}' data-f_place_type='${d.store_type}'>0</td>
                                                        <td class="balance_qty">${d.department_qty}</td>
                                                    </tr>`;

                                        } else {

                                            tbody += `
                                                    <tr>
                                                        <td>${s_count}</td>
                                                        <td>${s.section}</td>
                                                        <td>${s.Section_qty}</td>
                                                        <td contenteditable='true' class="allocated_qty" data-f_place_id='${s.sec_id}' data-f_place_type='${s.store_type}'>0</td>
                                                        <td class="balance_qty">${s.Section_qty}</td>
                                                    </tr>`;
                                        }
                                    });
                                }
                            });
                        });
                        $("#store_stock_allocate_tbody").append(tbody);

                    });

                } else {
                    $("#store_stock_allocate_tbody").append(
                        "<tr><td colspan='5'>Stock Not Available</td></tr>"
                    );
                }
            }






        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function insert_stock_allocation(allocation_json) {
    console.log(allocation_json);

    $.ajax({
        url: "php/insert_stock_allocation.php",
        type: "post", //send it through get method
        data: {

            allocation_json: JSON.stringify(allocation_json)
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == "ok") {
                if (response.trim() === "ok") {
                    window.location.href = "http://localhost/jaysan/json_stock.html";
                } else {
                    console.log(response);
                }
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