
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
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



    check_login();

    $("#unamed").text(localStorage.getItem("ls_uname"))


    $('#part_name').on('input', function () {
        //check the value not empty
        if ($('#part_name').val() != "") {
            $('#part_name').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_part_name_auto_wel.php",
                        type: "get", //send it through get method
                        data: {
                            term: "name",
                            part: request.term,


                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.part_name + "-" + item.part_no,
                                    value: item.part_name,
                                    id: item.part_id,
                                    part_no: item.part_no
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("selected-part_id", ui.item.id);
                    get_bom_list(ui.item.id)

                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.value + "</strong> - " + item.part_no + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $("#bom_list_select").on("change", function () {
        var part_id = $(this).find(":selected").data("part_id");
        var component_cat = $(this).val();
        console.log($(this).html());

        console.log(part_id, component_cat);

        if (part_id && component_cat) {
            get_bom_correction('', '', '', component_cat, part_id);
        }
        else {
            salert("Warring", "Data miss Try again", "warning")
        }

    })


    $("#bom_correction_tbody").on("click", ".submit_btn", function () {
        var row = $(this).closest("tr");
        var bom_id = row.find("select").find(":selected").val()

        if (bom_id) {
            update_bom_default(bom_id, 1);
        }
        else {
            salert("Warning", "Select BOM", "warning");
        }

    })


    $("#bom_correction_tbody, #duplicate_bom_tbody").on("click", "button.trash_btn", function () {

        var bom_id = $(this).data("bom_id");

        console.log("bom_id:", bom_id);
        console.log("type:", typeof bom_id);
        console.log("parsed:", parseInt(bom_id));
        if (parseInt(bom_id) > 0) {

            // swal({
            //     title: "Warning",
            //     text: "Are you sure? Do you want to delete?",
            //     icon: "warning",
            //     buttons: true,
            //     dangerMode: true
            // }).then(function (confirm) {

            //     if (confirm) {
            delete_bom(bom_id);
            //     }

            // });

        } else {
            salert('Warning', 'Data missing, try later', 'warning');
        }

    });

    get_duplicate_bom()

    $("#excle").on("click", function () {

        var table = document.getElementById("bom_excel_table");

        if (!table) {
            salert("Warning", "Table not found", "warning");
            return;
        }

        var workbook = XLSX.utils.table_to_book(table, { sheet: "BOM Report" });

        XLSX.writeFile(workbook, "BOM_Report.xlsx");

    });
});







function get_bom_list(part_id) {


    $.ajax({
        url: "php/get_bom_list.php",
        type: "get", //send it through get method
        data: {
            part_id: part_id

        },
        success: function (response) {
            console.log(response);

            $('#bom_list_select').empty()

            if (response.trim() != "error") {

                if (response.trim() != "0 result") {


                    $("#bom_list_select").empty()
                    $("#bom_list_select").append("<option  value='0' disabled selected>Bom  List</option>")

                    var obj = JSON.parse(response);
                    var count = 0


                    obj.forEach(function (obj) {
                        count = count + 1;
                        //  $("#bom_list_item").append("<li  data-bom_id='"+ obj.bom_id+"' data-part_id='"+obj.part_id+" ' class=' list-group-item'>"+obj.component_cat + "</li>")
                        $("#bom_list_select").append("<option value='" + obj.component_cat + "' data-part_id='" + obj.part_id + "'>" + obj.component_cat + "</option>")

                        // $('#bom_table').append("<tr class='small'> <td>"+ count + "</td> <td data-part-id="+obj.part_id+">"+ obj.part_name+ " </td> <td contenteditable='true' class='qty-editable'>"+obj.qty +  "</td> <td><button class='btn btn-outline-danger border-0'><i class='fa fa-trash ' aria-hidden='true'></i></button></td> </tr>") 


                    });





                }
                else {
                    $('#bom_list_item').append("<li class='list-group-item'>No BOM Found</li>")

                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}


function get_bom_correction(bom_id, correction_sts, duplication_sts, component_cat, part_id) {

    $.ajax({
        url: "php/get_bom_correction.php",
        type: "get", //send it through get method
        data: {

            bom_id: bom_id,
            correction_sts: correction_sts,
            duplication_sts: duplication_sts,
            component_cat: component_cat,
            part_id: part_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() !== 'error') {

                $("#bom_correction_tbody").empty();
                $("#sample_tbody").empty();

                if (response.trim() !== '0 result') {

                    var obj = JSON.parse(response);

                    $("#sample_tbody").empty();

                    var grouped = {};

                    obj.forEach(function (smpl) {

                        if (!grouped[smpl.part_path]) {
                            grouped[smpl.part_path] = [];
                        }

                        grouped[smpl.part_path].push(smpl);

                    });

                    var index = 1;

                    Object.keys(grouped).forEach(function (path) {

                        var inputParts = "";
                        var level = "";

                        grouped[path].forEach(function (smpl) {

                            var bom_list = [];
                            var bom_html = "";

                            if (smpl.bom_list) {
                                try {
                                    bom_list = JSON.parse(smpl.bom_list);
                                } catch (e) {
                                    bom_list = [];
                                }
                            }

                            bom_list.forEach(function (b) {
                                bom_html += `<li class="text-muted small">- ${b.component_cat}</li>`;
                            });

                            level = smpl.level;
                            inputParts += `
                                        <li>
                                            <strong>${smpl.input_part_name}</strong> (Qty: ${smpl.qty})
                                            ${bom_html ? `<ul class="ps-4">${bom_html}</ul>` : ""}
                                        </li>
                                    `;

                        });

                        $("#sample_tbody").append(`
                            <tr>
                                <td>${index++}</td>
                                <td>${path}</td>
                                <td>
                                    <ul class="mb-0 ps-3">
                                        ${inputParts}
                                    </ul>
                                </td>
                                <td>${level}</td>
                            </tr>
                        `);

                    });


                    // 🔹 Group data by level
                    var levelMap = {};

                    obj.forEach(function (item) {
                        if (!levelMap[item.level]) {
                            levelMap[item.level] = [];
                        }
                        levelMap[item.level].push(item);
                    });

                    // 🔹 Sort levels numerically
                    var levels = Object.keys(levelMap).sort(function (a, b) {
                        return parseInt(a) - parseInt(b);
                    });

                    // 🔹 Loop level by level
                    for (let lvl of levels) {

                        var currentLevelItems = levelMap[lvl];

                        // 🔹 Add Level Header
                        $("#bom_correction_tbody").append(`
                            <tr class="table-primary">
                                <td colspan="4" class="fw-bold">
                                    Level ${lvl}
                                </td>
                            </tr>
                        `);

                        // 🔹 Render rows for this level
                        currentLevelItems.forEach(function (item, index) {

                            var select_field = `<option selected disabled value="">Choose...</option>`;
                            var bom_option = [];

                            if (item.bom_list) {
                                try {
                                    bom_option = JSON.parse(item.bom_list);
                                } catch (e) {
                                    bom_option = [];
                                }
                            }

                            bom_option.forEach(function (bom) {
                                select_field += `
                                <option value="${bom.bom_id}" 
                                    ${bom.bom_id == item.bomlist_id ? "selected" : ""}>
                                    ${bom.component_cat}
                                </option>`;
                            });

                            var rowColor = item.correction_status === "invalid"
                                ? "table-danger"
                                : "table-success";


                            var buttons = `<button class='btn btn-primary submit_btn' ><i class="fa-solid fa-upload"></i></button>`
                            if (item.duplication_status == 'duplicate') {
                                buttons += `<button class='btn btn-danger trash_btn' data-bom_id='${item.parent_bom_id}'><i class='fa fa-trash'></i></button>`
                            }

                            $("#bom_correction_tbody").append(`
                                    <tr class="${rowColor}">
                                        <td>${parseInt(lvl) + 1}.${index + 1}</td>
                                        <td>${item.input_part_name}</td>
                                        <td>
                                        ${select_field == '<option selected disabled value="">Choose...</option>' ? 'Only one BOM' : `<div class="form-floating">
                                                <select class="form-select default_bom"
                                                    data-input_part_id="${item.input_part_id}"
                                                    data-parent_bom_id="${item.parent_bom_id}">
                                                    ${select_field}
                                                </select>
                                                <label>Select BOM</label>
                                            </div>`}
                                            
                                        </td>
                                        <td>${select_field == '<option selected disabled value="">Choose...</option>' ? '' : buttons}</td>
                                    </tr>
                                `);

                        });

                        var allValid = currentLevelItems.every(function (item) {
                            return item.correction_status === "valid";
                        });

                        if (!allValid) {
                            break;
                        }
                    }

                } else {

                    $("#bom_correction_tbody").append(`
                        <tr>
                            <td colspan="4" class="text-center text-danger">
                                No data found
                            </td>
                        </tr>
                    `);

                }
            }




        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function delete_bom(bom_id) {

    $.ajax({
        url: "php/delete_bom.php",
        type: "post", //send it through get method
        data: {

            bom_id: bom_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == 'ok') {
                get_bom_correction(208, '', '', '', '');
                get_duplicate_bom();
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function get_duplicate_bom() {

    $.ajax({
        url: "php/get_duplicate_bom.php",
        type: "post", //send it through get method
        data: {

        },
        success: function (response) {
            console.log(response);



            if (response.trim() != 'error') {
                $("#duplicate_bom_tbody").empty();
                if (response.trim() != '0 result') {
                    var obj = JSON.parse(response);
                    obj.forEach(function (item, index) {
                        $("#duplicate_bom_tbody").append(`<tr><td >${index + 1}</td><td >${item.part_name}</td><td >${item.component_cat}</td><td><button class='btn btn-danger trash_btn' data-bom_id='${item.bom_id}'><i class='fa fa-trash'></i></button></td></tr>`);
                    })
                } else {
                    $("#duplicate_bom_tbody").append("<tr><td class='text-center text-danger' colspan='4'>No duplicate data found</td></tr>")
                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function update_bom_default(bom_id, is_default) {

    $.ajax({
        url: "php/update_bom_default.php",
        type: "post", //send it through get method
        data: {

            bom_id: bom_id,
            is_default: is_default,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == 'ok') {
                get_bom_correction('', '', '', $("#bom_list_select").val(), $("#bom_list_select").find(":selected").data("part_id"));
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}


function insert_new_process(processId) {

    $.ajax({
        url: "php/get_bom_correction.php",
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