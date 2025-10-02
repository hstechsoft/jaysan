
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



    // mail function
    $("#mail_print").on("click", function (e) {
        e.preventDefault();
        var element = document.getElementById("preview_Purchase");

        html2pdf().from(element).outputPdf("blob").then(function (pdfBlob) {
            var formData = new FormData();
            formData.append("pdf", pdfBlob, "purchase_order.pdf");
            formData.append("to", "sanjay040611@gmail.com");
            formData.append("subject", "Purchase Order Report");

            $.ajax({
                url: "php/sendMail.php",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    alert(response);
                },
                error: function (err) {
                    alert("❌ Error sending mail");
                }
            });
        });
    });

    get_mrf_po_details();


    $("#po_report").on("click", " tr ", function (e) {
        e.preventDefault();

        $("#company_name").text("Company Name: " + $("#order_to").text());
        get_mrf_po_company_wise($(this).data("po_order_to"));
    })

    $("#po_dashboard").on("input", "tr td", function () {
        var order_qnty = parseInt($(this).text());

        var original_qnty = parseInt($(this).closest("tr").find("td").eq(2).text());

        if (order_qnty > original_qnty) {
            $(this).text($(this).closest("tr").find("td").eq(2).text())
        }
    })

    $("#po_dashboard").on("change", ".material-check", function () {
        console.log("changed");

        let row = $(this).closest("tr");
        let isChecked = $(this).is(":checked");
        let batch_id = row.data("batch_id");

        if (isChecked) {
            row.find("td:eq(3)").attr("contenteditable", "false");
            row.find("td:eq(5) input.date-input").prop("disabled", true);

            if ($("#selected_materials tr[data-batch_id='" + batch_id + "']").length === 0) {
                let newRow = "<tr data-batch_id='" + batch_id + "'>" +
                    "<td>" + row.find("td:eq(1)").text() + "</td>" +
                    "<td>" + row.find("td:eq(4)").text() + "</td>" +
                    "<td>" + row.find("td:eq(5)").text().trim() + "</td>" +
                    "<td>" + row.find("td:eq(3)").text() + "</td>" +
                    "</tr>";

                if ($("#selected_materials tr#totalRow").length > 0) {
                    $("#selected_materials tr#totalRow").before(newRow);
                } else {
                    $("#selected_materials").append(newRow);
                }
            }
        } else {
            row.find("td:eq(3)").attr("contenteditable", "true");
            row.find("td:eq(5) input.date-input").prop("disabled", false);
            $("#selected_materials tr[data-batch_id='" + batch_id + "']").remove();
        }

        let total = 0;
        $("#selected_materials tr[data-batch_id]").each(function () {
            let qty = parseFloat($(this).find("td:eq(2)").text()) || 0;
            total += qty;
        });

        if ($("#selected_materials tr#totalRow").length === 0) {
            $("#selected_materials").append(
                "<tr id='totalRow'><th scope='col' colspan='2'>Total</th><td colspan='2'>" + total + "</td></tr>"
            );
        } else {
            $("#selected_materials tr#totalRow td").text(total);
        }
    });




    $("#po_submit").on("click", function (e) {
        e.preventDefault();

        $("#preview_Purchase").removeClass("d-none");

        if ($("#selected_materials tr").length == 0) {
            salert("Error", "Please select at least one material.", "error");
            return;
        }

        else {
            $("#terms").modal("show");
        }
    });

    $("#terms_btn").on("click", function (e) {
        e.preventDefault();

        let terms = $("#terms_of_delivery_input").val().trim();

        if (terms === "") {
            salert("Error", "Please enter the terms of delivery.", "error");
            return;
        }

        $("#terms_of_delivery").html("Terms of Delivery:<br>" + terms);
        $("#terms").modal("hide");
        salert("Success", "Terms of delivery set successfully.", "success");
    });

});




function get_mrf_po_details() {
    $.ajax({
        url: "php/get_mrf_po_details.php",
        type: "get", //send it through get method
        data: {


        },
        success: function (response) {


            if (response.trim() != "error") {
                var obj = JSON.parse(response);
                var count = 0;


                obj.forEach(function (obj) {
                    count = count + 1;
                    $("#po_report").append("<tr data-po_order_to=" + obj.po_order_to + "><td>" + count + "</td><td id='order_to'>" + obj.order_to + "</td><td>" + obj.raw_material_part_id + "</td><td>" + obj.batch_date + "</td><td>2025-10-04</td><td>" + obj.batch_qty + "</td></tr>");
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


function get_mrf_po_company_wise(order_to) {
    $.ajax({
        url: "php/get_mrf_po_company_wise.php",
        type: "get", //send it through get method
        data: {
            order_to_id: order_to,
        },
        success: function (response) {
            console.log(response);

            if (response.trim() != "error") {
                var obj = JSON.parse(response);



                obj.forEach(function (obj) {
                    $("#po_dashboard").append(
                        "<tr data-batch_id='" + obj.batch_id + "'>" +
                        "<td><input class='form-check-input material-check' type='checkbox' value='" + obj.mrf_purchase_id + "'></td>" +
                        "<td>" + obj.raw_material_part_id + "</td>" +
                        "<td>" + obj.batch_qty + "</td>" +
                        "<td contenteditable='true'>" + obj.batch_qty + "</td>" +
                        "<td>" + obj.batch_date + "</td>" +
                        "<td><input type='date' class='form-control date-input' value='2025-10-04'></td>" +
                        "</tr>"
                    );
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