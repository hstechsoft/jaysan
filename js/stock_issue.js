
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


    get_allocation_report();
    get_allocated_details();

    check_login();

    $("#unamed").text(localStorage.getItem("ls_uname"))


    $("#quotation_view_switch").on("change", function () {

        if ($(this).is(":checked")) {
            $("#quotation_allocation").removeClass("d-none");
            $("#internal_allocation").addClass("d-none");
        } else {
            $("#quotation_allocation").addClass("d-none");
            $("#internal_allocation").removeClass("d-none");
        }

    })

    $("#internal_allocation_tbody").on("click", ".fa_check_circle", function () {
        $("#confirmationModal").modal("show");
        $("#stock_confirm_btn").prop("disabled", false);
        var qty = $(this).data("qty");
        var created_by = $(this).data("created_by");
        var allocation_id = $(this).data("allocation_id");
        console.log(qty, created_by, allocation_id);


        $("#confirmationModalLabel").text($(this).data("part_name"));
        $("#confirm_qty").val(qty);
        $("#confirm_qty").data("allocation_id", allocation_id);
        $("#confirm_qty").data("created_by", created_by);
    })

    $("#stock_confirm_btn").on("click", function () {
        $(this).prop("disabled", true);
        var qty = $("#confirm_qty").val();
        var created_by = $("#confirm_qty").data("created_by");
        var allocation_id = $("#confirm_qty").data("allocation_id");
        var remark = $("#remark").val() || "";

        console.log(qty, created_by, allocation_id);

        if (qty == '' || created_by == '' || allocation_id == '') {
            salert("Warning", "Data missing", "warning");
            return;
        }
        update_stock_allocation_store(allocation_id, qty, created_by, remark);
    })



});






function get_allocation_report() {

    $.ajax({
        url: "php/get_allocation_report.php",
        type: "get", //send it through get method
        data: {
            allocation_sts: "create",

        },
        success: function (response) {
            console.log(response);



            if (response.trim() != 'error') {
                if (response.trim() != '0 result') {
                    $("#internal_allocation_tbody").empty();

                    var obj = JSON.parse(response);
                    var count = 0;
                    obj.forEach(function (item) {
                        count += 1;

                        $("#internal_allocation_tbody").append(`<tr><td>${count}</td><td>${item.part_name}</td><td>${item.from_place_name}</td><td>${item.to_place_name}</td><td>${item.qty}</td><td><button type="button" data-part_name='${item.part_name}' data-qty='${item.qty}' data-created_by='${item.created_by}' data-allocation_id='${item.allocation_id}' class="btn btn-success fa_check_circle p-0"><i class="fa fa-check-circle m-1"></i></button></td></tr>`);
                    })
                } else {
                    $("#internal_allocation_tbody").append(`<tr><td colspan='7' class='text-center'>Nothing Allocated. Enjoy Your day 😁!</td></tr>`)
                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function get_allocated_details() {

    $.ajax({
        url: "php/get_allocation_report.php",
        type: "get", //send it through get method
        data: {
            allocation_sts: "delivered",

        },
        success: function (response) {
            console.log(response);



            if (response.trim() != 'error') {
                if (response.trim() != '0 result') {
                    $("#allocated_list_tbody").empty();

                    var obj = JSON.parse(response);
                    var count = 0;
                    obj.forEach(function (item) {
                        count += 1;

                        $("#allocated_list_tbody").append(`<tr><td>${count}</td><td>${item.part_name}</td><td>${item.to_place_name}</td><td>${item.allocation_qty}</td></tr>`);
                    })
                } else {
                    $("#allocated_list_tbody").append(`<tr><td colspan='7' class='text-center'>Nothing Allocated. Enjoy Your day 😁!</td></tr>`)
                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function update_stock_allocation_store(allocation_id, qty, created_by, remark) {

    $.ajax({
        url: "php/update_stock_allocation_store.php",
        type: "get", //send it through get method
        data: {

            allocation_id: allocation_id,
            allocation_qty: qty,
            allocated_by: created_by,
            allocation_remark: remark,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == "ok") {
                location.reload();
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