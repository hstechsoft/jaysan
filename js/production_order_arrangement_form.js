
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
$(document).ready(function () {
    var allWeldingData = [];

    var processData = {
        process_id: "297",

    };


    var arr_obj = []
    arr_obj[1] = [];
    arr_obj[0] = [];
    arr_obj[1].push({
        godown_id: "1",
        dep_id: "1",
        dep_sec_id: "",
        dep_sec_machine_id: "",
        min_time: "",
        max_time: "",
        cost: ""

    });

    arr_obj[1].push({
        godown_id: "10",
        dep_id: "1",
        dep_sec_id: "",
        dep_sec_machine_id: "",
        min_time: "",
        max_time: "",
        cost: ""
    });

    allWeldingData.push({
        input_parts: arr_obj[0],
        process: processData,


    });

    processData = {
        process_id: "298",

    };
    allWeldingData.push({
        input_parts: arr_obj[1],
        process: processData,


    });

    console.log(allWeldingData);


    $.ajax({
        url: "php/ref_delete.php",
        type: "POST", //send it through get method
        data: {
            allWeldingData: JSON.stringify(allWeldingData),
        },
        success: function (response) {


            if (response.trim() != "error") {
                console.log(response);

                if (response.trim() != "0 result") {




                }
                else {
                    // $("#@id@") .append("<td colspan='0' scope='col'>No Data</td>");

                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
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



    check_login();

    $("#unamed").text(localStorage.getItem("ls_uname"))


    $("#arrange_date").on("change", function () {
        if ($(this).val() != "") {
            get_machine_report($(this).val());
        }
    })

    let old_line_no = null;
    let old_ass_id = null;

    $("#arrange_order_tbody").sortable({

        start: function (event, ui) {
            // Store original values
            ui.item.data("old_index", ui.item.index());
            old_line_no = ui.item.data('line_no');
            old_ass_id = ui.item.data('ass_id');
        },

        update: function (event, ui) {

            // Refresh line numbers in DOM (optional but clean)
            // updateLineNumbers();

            // Find the row that is BELOW the dragged row
            let oldIndex = ui.item.data("old_index");
            let newIndex = ui.item.index();
            // console.log(nextRow.html());

            let new_line_no = null;
            let new_ass_id = null;

            if (newIndex < oldIndex) {
                let nextRow = ui.item.next("tr");
                new_line_no = nextRow.data("line_no");
                new_ass_id = nextRow.data("ass_id");
            } else {
                // Moved DOWN → take previous row
                let prevRow = ui.item.prev("tr");
                new_line_no = prevRow.data("line_no");
                new_ass_id = prevRow.data("ass_id");
            }
            console.log(old_line_no, old_ass_id, new_line_no, new_ass_id);

            // Call your API
            update_machine_production(old_line_no, old_ass_id, new_line_no, new_ass_id);
        }

    }).disableSelection();




});




// function updateLineNumbers() {
//     $("#arrange_order_tbody tr").each(function (index) {
//         let new_no = index + 1;

//         $(this).find("td:first").text(new_no);
//         $(this).attr("data-line_no", new_no);
//     });
// }




function update_machine_production(old_line_no, old_ass_id, new_line_no, new_ass_id) {

    $.ajax({
        url: "php/update_machine_production.php",
        type: "get", //send it through get method
        data: {
            old_ass_id: old_ass_id,
            new_ass_id: new_ass_id,
            old_line_no: old_line_no,
            new_line_no: new_line_no


        },
        success: function (response) {
            console.log(response);


            if (response.trim() == "ok") {
                get_machine_report($("#arrange_date").val());
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

function get_machine_report(production_date) {
    $.ajax({
        url: "php/get_machine_report.php",
        type: "get", //send it through get method
        data: {
            production_date: production_date,


        },
        success: function (response) {
            console.log(response);


            if (response.trim() != "error") {
                $("#arrange_order_tbody").empty();
                if (response.trim() != "0 result") {
                    var obj = JSON.parse(response);

                    var all_items = [];
                    var count = 0;

                    // Step 1: Flatten & collect all assign details
                    obj.forEach(function (row) {

                        var ass_d = JSON.parse(row.assign_details);

                        ass_d.forEach(function (item) {
                            all_items.push({
                                line_no: item.line_no,
                                ass_id: item.ass_id,
                                cus_name: row.cus_name,
                                cus_phone: row.cus_phone,
                                product: row.product,
                                model_name: row.model_name,
                                type_name: row.type_name,
                                sub_type: row.sub_type
                            });
                        });

                    });

                    // Step 2: Sort by line_no ASCENDING
                    all_items.sort((a, b) => a.line_no - b.line_no);

                    // Step 3: Append sorted rows to table
                    all_items.forEach(function (item) {

                        count++;

                        var details = `
                            <div class="card shadow-sm border-0" style="border-radius: 10px;">
                                <div class="card-body py-1 px-2 d-flex justify-content-between align-items-center">
                                    <span class="text-muted small">${item.model_name}</span>
                                    <span class="fw-semibold text-primary">${item.product}</span>
                                    <span class="badge bg-success">${item.type_name}</span>
                                </div>

                                <div class="card-footer py-0 px-1 bg-light border-0">
                                    <small class="text-muted">
                                        ${item.sub_type}
                                    </small>
                                </div>
                            </div>
                        `;

                        $("#arrange_order_tbody").append(`
                            <tr class='text-center' style="cursor: grab; font-size: 12px"
                                data-ass_id='${item.ass_id}' 
                                data-line_no='${item.line_no}'>
                                <td>${count}</td>
                                <td>${item.cus_name} - ${item.cus_phone}</td>
                                <td>${details}</td>
                            </tr>
                        `);

                    });



                }
                else {
                    $("#arrange_order_tbody").append("<tr><td colspan='3' class='text-danger text-center'>No Machine Production On This Date</td></tr>")
                }
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