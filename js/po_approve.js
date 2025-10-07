
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


    $("#get_po_list").on("click", "tr", function () {
        let po_id = $(this).data("po_id");
        get_jaysan_po_material(po_id);
    })

    $("#po_approve_btn").on("click", function () {
        var app_material = [];
        $("#selected_materials").find("tr").each(function () {
            let checkbox = $(this).find("td").eq(0).find("input[type='checkbox']");
            if (checkbox.length && checkbox.is(":checked")) {
                app_material.push($(this).data("jaysan_po_material_id"));
            }
        });

        update_jaysan_po_material_sts(app_material);
    })

    check_login();
    get_po_list();

    $("#unamed").text(localStorage.getItem("ls_uname"))






});







function update_jaysan_po_material_sts(app_material) {
    $.ajax({
        url: "php/update_jaysan_po_material_sts.php",
        type: "post", //send it through get method
        data: {
            jaysan_po_material_id: app_material,
        },
        success: function (response) {
            console.log(response);

            if (response.trim() == "ok") {


                location.reload();

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



function get_jaysan_po_material(po_id) {
    $.ajax({
        url: "php/get_jaysan_po_material.php",
        type: "get", //send it through get method
        data: {
            jaysan_po_id: po_id,
        },
        success: function (response) {
            console.log(response);


            $("#po_dashboard").empty();

            $("#selected_materials").empty();

            if (response.trim() != "error") {
                var obj = JSON.parse(response);


                obj.forEach(function (obj) {

                    $("#company_name").text("Company Name: " + obj.con_name);
                    var po_order_to = obj.po_order_to;
                    var po_delivery_to = obj.po_delivery_to;
                    var materials_list = obj.materials_list;

                    var company = obj.company_address;
                    var terms = obj.terms;
                    var consignee = "Consignee (Ship to) <br>" + obj.con_name + "<br>" + obj.con_addr + "<br>e-mail : " + obj.con_email + "<br>GSTIN/UIN : " + obj.con_gst + "<br>State Name : " + obj.con_state_name;
                    var supplier = "Supplier (Bill from) <br>" + obj.sub_name + "<br>" + obj.sub_addr + "<br>GSTIN/UIN : " + obj.sub_gst + "<br>State Name : " + obj.sub_state_name + "<br>Contact person : " + obj.sub_contact_person + "<br>Contact : " + obj.sub_contact + "<br>e-mail : " + obj.sub_email;


                    var mat = JSON.parse(materials_list);

                    mat.forEach(function (mat) {
                        console.log(mat.due_on);
                        var approve_chk = ""
                        if (mat.is_approved == 1) {
                            approve_chk = "disabled"
                        }
                        $("#selected_materials").append(
                            "<tr data-batch_id='" + mat.batch_id + "' data-uom='" + mat.uom + "' data-raw_material_rate='" + mat.material_rate + "' data-gst_rate='" + mat.gst + "' data-approve='" + mat.is_approved + "' data-jaysan_po_material_id='" + mat.jaysan_po_material_id + "'>" +
                            "<td><input class='form-check-input material-check' type='checkbox' value='" + mat.batch_id + "' " + approve_chk + " ></td>" +
                            "<td>" + mat.material_name + "</td>" +
                            "<td>" + mat.batch_date + "</td>" +
                            "<td>" + mat.due_on + "</td>" +
                            "<td data-batch_qty='" + mat.qty + "'>" + mat.qty + "</td>" +
                            "<td>" + mat.material_rate + "</td>" +
                            "<td>" + mat.discount + "</td>" +
                            "</tr>"
                        );

                    })


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



function get_po_list() {
    $.ajax({
        url: "php/get_po_list.php",
        type: "get", //send it through get method
        data: {


        },
        success: function (response) {

            console.log(response);

            if (response.trim() != "error") {
                var obj = JSON.parse(response);
                var count = 0;

                var ic = ""
                obj.forEach(function (obj) {
                    count += 1;
                    if (obj.approve_sts == '0') {
                        ic = "<i class='fa fa-times-circle' style='color:red'></i>"
                        $("#get_po_list").append("<tr data-po_id=" + obj.po_id + "><td>" + count + "</td><td>" + obj.po_id + "</td><td>" + obj.order_to_name + "</td><td>" + obj.po_date + "</td><td class='text-center'>" + ic + "</td></tr>")
                    }



                });
                if ($("#get_po_list").length == 0) {
                    $("#get_po_list").append("<tr><td colspan='5'>No Po is for Approval</td><tr>");
                }

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