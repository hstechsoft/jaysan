
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
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


    $("#material_id").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        $("#nesting_job_card_tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    check_login();

    $("#unamed").text(localStorage.getItem("ls_uname"))






    get_unassigned_job_card('');

    get_all_machine();

    $("#nesting_job_card_tbody, .nesting_job_card_mobile").on("click", ".view_btn", function () {
        let path = $(this).data("path");


        window.open(path, "_blank");
    });

    $("#nesting_job_card_tbody, .nesting_job_card_mobile").on("click", ".allocate_btn", function () {
        let machine_id = $(this).data("machine_id");
        let nesting_details_id = $(this).data("nesting_details_id");
        let remaining_qty = $(this).data("remaining_qty") || 0;

        if (machine_id && nesting_details_id && remaining_qty > 0) {
            $("#assign_Work_btn").data("machine_id", machine_id);
            $("#assign_Work_btn").data("nesting_details_id", nesting_details_id);
            $("#qty").data("remaining_qty", remaining_qty);

            $("#assignWorkModal").modal("show");
        }
        else {
            salert("Warning", "Data Missing/ Qty Is Lesser Than 1, Try Later.", "warning");
        }
    });

    $("#qty").on("focusout", function(){
        var entered_qty = $(this).val();
        var remaining_qty = $(this).data("remaining_qty");
        
        if(entered_qty <= 0){
            $(this).val(remaining_qty);
        }
        else if(entered_qty > remaining_qty){
            $(this).val(remaining_qty);
        }
    })

    $("#assign_Work_btn").on("click", function () {

        let machine_id = $("#machine").val();
        let nesting_details_id = $(this).data("nesting_details_id");
        let shift = $("#shift").val();
        let assign_date = $("#assign_date").val();
        let qty = $("#qty").val();

        console.log(machine_id, shift, assign_date, current_user_id, nesting_details_id);

        if (machine_id > 0 && nesting_details_id > 0 && shift && assign_date && qty > 0) {

            laser_job_card_create(machine_id, shift, assign_date, current_user_id, nesting_details_id, qty);
        }
        else {
            salert("Warning", "Data Missing!, Try Later.", "warning");
        }

    })

    $(".close_model_btn").on("click", function () {

        $("#machine").val('');
        $("#shift").val('');
        $("#assign_date").val('');
        $("#qty").val(1);
    })
});




function laser_job_card_create(machine_id, shift, assign_date, assigned_by, nesting_details_id, qty) {

    console.log(machine_id, shift, assign_date, assigned_by, nesting_details_id, qty);

    $.ajax({
        url: "php/laser_job_card_create.php",
        type: "post",
        data: {
            machine_id: machine_id,
            shift: shift,
            assign_date: assign_date,
            assigned_by: assigned_by,
            nesting_details_id: nesting_details_id,
            qty: qty,
        },
        success: function (response) {
            console.log(response);

            if (response.trim() == "ok") {
                window.location.reload();
            }
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });

}

function get_unassigned_job_card(show_all) {

    console.log(show_all);

    $.ajax({
        url: "php/get_unassigned_job_card.php",
        type: "GET",
        data: { show_all: show_all },
        success: function (response) {
            console.log(response);

            if (response.trim() != "error") {


                $("#nesting_job_card_tbody").empty();
                $(".nesting_job_card_mobile").empty();

                if (response.trim() != '0 result') {

                    var obj = JSON.parse(response);


                    obj.forEach(function (item, index) {
                        index++;



                        $("#nesting_job_card_tbody").append(`
                            <tr>
                                <td>${index}</td>
                                <td>${item.nesting_name}</td>
                                <td>${item.material_name}</td>
                                <td>
                                    <span class='badge bg-success'>Total: ${item.material_qty}</span>
                                    <span class='badge bg-primary'>Assigned: ${item.total_assigned_qty}</span>
                                    <span class='badge bg-danger'>Remaining: ${item.remaining_qty}</span>
                                </td>
                                <td>${item.run_time}</td>
                                <td><span class='badge ${item.nesting_type == 'std' ? 'bg-success' : 'bg-warning text-dark'}'>${item.nesting_type}</td>
                                <td>${item.emp_name}</td>
                                <td>
                                    <button class="btn btn-outline-primary view_btn btn-sm" data-path="${item.path}">View</button>
                                    <button class="btn btn-outline-secondary btn-sm allocate_btn" 
                                        data-nesting_details_id="${item.nesting_details_id}" 
                                        data-machine_id="${item.machine_id}"
                                        data-remaining_qty="${item.remaining_qty}">
                                        Allocate
                                    </button>
                                </td>
                            </tr>
                        `);


                        $(".nesting_job_card_mobile").append(`
                            <div class="card mb-3 shadow-sm border-0 rounded-3">
                                <div class="card-body p-3">

                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h6 class="mb-0 fw-bold">${item.nesting_name}</h6>
                                        <span class="badge bg-primary">${index}</span>
                                    </div>

                                    <div class="small text-muted mb-2">${item.material_name}</div>

                                    <div class="mb-2">
                                        <span class='badge bg-success'>Total: ${item.material_qty}</span>
                                        <span class='badge bg-primary'>Assigned: ${item.total_assigned_qty}</span>
                                        <span class='badge bg-danger'>Remaining: ${item.remaining_qty}</span>
                                    </div>

                                    <div class="d-flex justify-content-between small mb-2">
                                        <span>⏱ ${item.run_time}</span>
                                        <span>👤 ${item.emp_name}</span>
                                    </div>

                                    <div class="small mb-2">
                                        <span class='badge ${item.nesting_type == 'std' ? 'bg-success' : 'bg-warning text-dark'}'>${item.nesting_type}
                                    </div>

                                    <div class="d-flex gap-2">
                                        <button class="btn btn-sm btn-primary w-50 view_btn btn-sm" data-path="${item.path}">
                                            View
                                        </button>
                                        <button class="btn btn-sm btn-secondary w-50 allocate_btn btn-sm" 
                                            data-nesting_details_id="${item.nesting_details_id}" 
                                            data-machine_id="${item.machine_id}"
                                            data-remaining_qty="${item.remaining_qty}">
                                            Allocate
                                        </button>
                                    </div>

                                </div>
                            </div>
                        `);

                    });

                } else {
                    $("#nesting_job_card_tbody").html(`<tr><td colspan='8' class='text-center text-danger'>No Data Found</td></tr>`);
                    $(".nesting_job_card_mobile").html(`<div class='text-center text-danger'>No Data Found</div>`);
                }
            }
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });

}

function get_all_machine(show_all) {

    console.log(show_all);

    $.ajax({
        url: "php/get_all_machine.php",
        type: "GET",
        data: {},
        success: function (response) {
            console.log(response);

            if (response.trim() != "error") {

                $("#machine").empty();

                if (response.trim() != '0 result') {

                    var obj = JSON.parse(response);
                    $("#machine").append(`<option selected disabled value="">Choose...</option>`);

                    obj.forEach(function (item, index) {
                        index++;

                        // convert path to web path

                        $("#machine").append(`<option value="${item.machine_id}">${item.machine_name}</option>
                        `);
                    });

                } else {
                    $("#machine").append(`<option selected disabled value="">Choose...</option>`);
                }
            }
        },
        error: function (xhr) {
            console.log(xhr);
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