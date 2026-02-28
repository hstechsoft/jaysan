
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

    get_current_qr_list();

    get_assigned_order_db();


});





function get_current_qr_list() {

    $.ajax({
        url: "php/get_current_qr_list.php",
        type: "get", //send it through get method
        data: {

        },
        success: function (response) {
            console.log(response);



            if (response.trim() != "error") {
                $("#job_card_dashboard_tbody").empty();
                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);

                    obj.forEach(function (obj) {
                        var scanned = JSON.parse(obj.qr_details);
                        var scann = '';

                        scanned.forEach(function (scan) {
                            var status = ` border border-success rounded-2`;
                            if (!scan.end_time) {
                                status = ` border  rounded-2  border-danger`;
                            }
                            scann += `
                                    <li class="py-2 px-2 ${status}">

                                        <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-1 small">

                                            <!-- Section + Time -->
                                            <div class="flex-grow-1">

                                                <div class="fw-semibold">
                                                    Section: <b class='text-dark'>${scan.sec_name}</b>
                                                    ${scan.end_time ? `<span class="ms-2 text-success"><i class="fa-solid fa-check-circle"></i></span>` : `<span class="ms-2 text-danger"><i class="fa-solid fa-hourglass-half"></i></span>`}
                                                </div>

                                                <div class="text-muted ">
                                                    <b class='badge bg-success'>${scan.start_time || "-"}</b>
                                                    ${scan.end_time ? ` → <b class='badge bg-primary'>${scan.end_time}</b>` : ` <b class='text-danger'>• In Process</b>`}
                                                </div>

                                            </div>

                                            <!-- Employee -->
                                            <div class="fw-semibold text-primary">
                                                ${scan.emp_name}
                                            </div>

                                        </div>

                                    </li>`;
                        })

                        $("#job_card_dashboard_tbody").append(`<tr><td class='text-center align-middle'>${obj.production_id}</td><td class='text-center align-middle'>${obj.emp_name}</td><td  class='text-center align-middle'>${obj.cus_name}</td><td class="py-1 text-center align-middle">
                            <div class="small">
                                <div class="fw-semibold">
                                    ${obj.product}
                                    <span class="text-muted">${obj.model_name}</span>
                                    <span class="badge bg-info text-dark ms-1">${obj.type_name}</span>
                                </div>

                                <div class="text-secondary border border-success rounded-2 px-2 py-1 mt-1 bg-light">
                                    ${obj.sub_type}
                                </div>
                            </div>
                        </td><td class='text-center align-middle'><span class='badge bg-success'>Scanned</span></td><td class="p-1 text-center align-middle"><ul class="list-unstyled mb-0">${scann}</ul></td></tr>`);


                    })
                }
                else {
                    $("#job_card_dashboard_tbody").append(`<tr><td colspan='6' class='text-center text-danger'>No Product Has been Assigned</td></tr>`)
                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}




function get_assigned_order_db() {
    $.ajax({
        url: "php/get_assigned_order.php",
        type: "get", //send it through get method
        data: {

        },
        success: function (response) {
            console.log(response);



            if (response.trim() != 'error') {
                $("#dashboard_scanned_data_tbody").empty();
                if (response.trim() != '0 results') {


                    var obj = JSON.parse(response);


                    obj.forEach(function (obj) {
                        $("#dashboard_scanned_data_tbody").append(`<tr><td class='text-center align-middle'>${obj.qr_no}</td><td class='text-center align-middle'>${obj.emp_name} </td><td>${obj.cus_name}</td><td class="py-1 text-center align-middle">
                            <div class="small">
                                <div class="fw-semibold">
                                    ${obj.product}
                                    <span class="text-muted">${obj.model}</span>
                                    <span class="badge bg-info text-dark ms-1">${obj.type}</span>
                                </div>

                                <div class="text-secondary border border-success rounded-2 px-2 py-1 mt-1 bg-light">
                                    ${obj.sub_type}
                                </div>
                            </div>
                        </td></tr>`)
                    });

                }
                else {
                    $("#dashboard_scanned_data_tbody").append(`<tr><td colspan='4' class="text-center text-danger">No Product Assigned</td></tr>`)

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