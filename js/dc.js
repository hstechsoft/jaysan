
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
let count = 1;
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

    $("#common_dc_details :input:visible:first").focus();

    $(document).on("keydown", "#common_dc_details :input:visible", function (e) {

        const inputs = $("#common_dc_details :input:visible:not([disabled]):not([readonly])");
        const index = inputs.index(this);
        const el = $(this);


        if (e.key === "Enter" && !el.hasClass("pincode") && !el.hasClass("rate")) {
            e.preventDefault();

            if (el.hasClass("godown_type")) {
                const selectedValue = el.val
            }

            if (index + 1 < inputs.length) {
                inputs.eq(index + 1).focus();
            }
        }

        else if (e.key === "Escape") {
            e.preventDefault();

            if (index - 1 >= 0) {
                inputs.eq(index - 1).focus();
            }
        }

        else if (el.hasClass("pincode") && e.key === "Enter") {
            e.preventDefault();

            if ($("#quotation_body tr").length === 0) {
                addQuotationRow();
            } else if (index + 1 < inputs.length) {
                inputs.eq(index + 1).focus();
            }
        }



        else if (el.hasClass("rate") && e.key === "Enter") {
            e.preventDefault();

            const row = el.closest("tr");

            const part = row.find(".part_name").val();
            const qty = row.find(".qty").val();
            const uom = row.find(".uom").val();
            const material = row.find(".material_from").val();
            const deliver = row.find(".deliver_to").val();
            const rate = row.find(".rate").val();
            console.log(part, qty, uom, material, deliver, rate);

            if (part && qty && uom && material && deliver && rate && row.is(":last-child")) {
                addQuotationRow();
            }
            else if (part && qty && uom && material && deliver && rate && row.is(":not(:last-child)")) {
                inputs.eq(index + 1).focus();
            }
            else {
                salert("Warning", "Fill the fields", "warning");
                $(".swal-button").on("click", function () {
                    el.focus();
                })
            }
        }
    });

    function addQuotationRow() {
        $("#quotation_body").append(`
        <tr>
            <td>${count++}</td>
            <td><input type="text" class="form-control rounded-3 part_name" placeholder="Part"></td>
            <td><input type="number" class="form-control rounded-3 qty" placeholder="Qty"></td>
            <td><input type="text" class="form-control rounded-3 uom" placeholder="UOM"></td>
            <td><input type="text" class="form-control rounded-3 material_from" placeholder="Material From"></td>
            <td><input type="text" class="form-control rounded-3 deliver_to" placeholder="Deliver to"></td>
            <td><input type="number" class="form-control rounded-3 rate" placeholder="Rate"></td>
            <td class="total_amount"></td>
        </tr>
    `);

        $("#quotation_body tr:last .part_name").focus();
    }


    $("#dc_preview_btn").on("click", function () {
        $("#dcModal").modal("show")
    })



});






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