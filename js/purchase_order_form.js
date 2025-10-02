
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

        $("#company_name").text("Company Name: " + $(this).closest("tr").find("td").eq(2).text());
        get_mrf_po_company_wise($(this).data("po_order_to"));
    })

    $("#po_dashboard").on("input", "tr td", function () {
        var order_qnty = parseInt($(this).text());

        var original_qnty = parseInt($(this).closest("tr").find("td").eq(3).data("batch_qty"));


        if (order_qnty > original_qnty) {
            $(this).text($(this).closest("tr").find("td").eq(3).data("batch_qty"))
        }
    })

    $("#po_dashboard").on("change", ".material-check", function () {


        let row = $(this).closest("tr");
        let isChecked = $(this).is(":checked");
        let batch_id = row.data("batch_id");
        let batch_qty = row.find("td:eq(3)").text();
        let uom = row.data("uom");
        let raw_material_rate = row.data("raw_material_rate");
        let gst_rate = row.data("gst_rate");
console.log(gst_rate);

        if (isChecked) {
            row.find("td:eq(3)").attr("contenteditable", "false");
            // row.find("td:eq(5) input.date-input").prop("disabled", true);


            if ($("#selected_materials tr[data-batch_id='" + batch_id + "']").length === 0) {
                let newRow = "<tr data-batch_id='" + batch_id + "' data-batch_qty='" + batch_qty + "' data-gst_rate='" + gst_rate + "'>" +
                    "<td>" + row.find("td:eq(1)").text() + "</td>" +
                    "<td>" + row.find("td:eq(4)").text() + "</td>" +
                    "<td>" + row.find("td:eq(5)").find('input').val() + "</td>" +
                    "<td>" + row.find("td:eq(3)").text() + " " + uom + "</td>" +
                    "<td>" + raw_material_rate + "</td>" +
                    "<td>" + raw_material_rate * row.find("td:eq(3)").text() + "</td>" +
                    "</tr>";

                if ($("#selected_materials tr#totalRow").length > 0) {
                    $("#selected_materials tr#totalRow").before(newRow);
                } else {
                    $("#selected_materials").append(newRow);
                }
            }
        } else {
            row.find("td:eq(3)").attr("contenteditable", "true");
            // row.find("td:eq(5) input.date-input").prop("disabled", false);
            $("#selected_materials tr[data-batch_id='" + batch_id + "']").remove();
        }

        var total = 0;
        var raw_material_total_amount = 0;
        var gst_0 = [];
        var gst_5 = [];
        var gst_12 = [];
        var gst_18 = [];
        var gst_28 = [];
        var gst_40 = [];
        $("#selected_materials tr[data-batch_id]").each(function () {
            let qty = parseFloat($(this).find("td:eq(3)").text()) || 0;
            total += qty;
            let amount = parseFloat($(this).find("td:eq(5)").text()) || 0;
            raw_material_total_amount += amount;
           

            switch ($(this).data("gst_rate")) {
                case 0:
                    gst_0.push(amount);
                    break;
                case 5:
                    gst_5.push(amount);
                    break;
                case 12:
                    gst_12.push(amount);
                    break;
                case 18:
                    gst_18.push(amount);
                    break;
                case 28:
                    gst_28.push(amount);
                    break;
                case 40:
                    gst_40.push(amount);
                    break;

                default:
                    break;
            }


        });
      

        var gst_details = '';
        var gst_amount_details = '';

        
        // if (gst_0.length > 0) {
        // var total = 0
        //     $.each(gst_0, function (key, val) {
        //         var gst_text = "input cgst @0%"+'<br>'+"input sgst @0%";
        //         gst_details += gst_text + '<br>';
        //         total += val
        //     });
        //    total = total *0.6;
        //    gst_amount_details +=  total.toFixed(2) +   '<br>' + total.toFixed(2) + '<br>' 
        // }
        if(gst_12.length > 0) {
            var total = 0
            $.each(gst_12, function (key, val) {
                var gst_text = "input cgst @6%"+'<br>'+"input sgst @6%";
                gst_details += gst_text + '<br>';
                total += val
            });
           total = total *0.6;
           gst_amount_details +=  total.toFixed(2) +   '<br>' + total.toFixed(2) + '<br>' 
        }
        if(gst_18.length > 0) {
          var total = 0
            $.each(gst_18, function (key, val) {
                var gst_text = "input cgst @9%"+'<br>'+"input sgst @9%";
                gst_details += gst_text + '<br>';
                total += val
            });
           total = total *0.9;
           gst_amount_details +=  total.toFixed(2) +   '<br>' + total.toFixed(2) + '<br>' 
        }
        // if(gst_28.length > 0) {
        //     $.each(gst_28, function (key, val) {
        //         gst_details += 'GST 0%: ' + val.toFixed(2) + '<br>';
        //     });
            
        // }
        // if(gst_40.length > 0) {
        //     $.each(gst_40, function (key, val) {
        //         gst_details += 'GST 0%: ' + val.toFixed(2) + '<br>';
        //     });
            
        // }

        
        if ($("#selected_materials tr#totalRow").length === 0) {
          

            $("#selected_materials").append(
                "<tr  id ='totalRow'><th scope='col' colspan='3'>Total</th><td id='total'>" + total + "</td><td></td><td id='raw_material_total_amount_id'>" + raw_material_total_amount + "</td></tr>"
            );
        } else {
           
            $("#total").text(total);
            $("#raw_material_total_amount_id").text(raw_material_total_amount);
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

                    var order_type_badge = "";

                    if (obj.order_type == "Regular") {
                        order_type_badge = "<span class='ms-1 badge bg-success'>R</span>"
                    }
                    else if (obj.order_type == "Emergency") {
                        order_type_badge = "<span class='ms-1 blink badge bg-danger'>E</span>"
                    }


                    var commitment_sts = "";
                    if (obj.approx_del_date != null && obj.approx_del_date != "" && obj.approx_del_date != "0" && obj.approx_del_date != "undefined") {
                        commitment_sts = obj.approx_del_date
                    }
                    else {
                        commitment_sts = "<i class='fa-solid fa-hourglass-start'></i>"
                        // commitment_sts = obj.commitment_date
                    }

                    count = count + 1;
                    $("#po_report").append("<tr data-po_order_to='" + obj.po_order_to + "'><td>" + count + "</td><td><ul class='list-group ' ><li class='list-group-item '> <div class='d-flex justify-content-between align-content-around'> <div class = 'small'><span class='text-bg-light fw-bold'>  " + obj.mrf_id + ". </span>" + obj.part_name + order_type_badge + "<span class='ms-1 small  badge bg-primary'>" + obj.total_part_count + "</span></div> <div> <button class='btn btn-outline-danger btn-sm border-0 history_btn' " +
                        "data-bs-toggle='popover' data-bs-html='true' data-bs-placement='left' " +
                        "data-history=\"" + obj.form_history.replace(/"/g, '&quot;') + "\" title='History'>" +
                        "<i class='fa fa-clock-o' aria-hidden='true'></i></button></div></div></li><li class='list-group-item '><div class='d-flex justify-content-between align-content-around'> <div class='small'>" + obj.req_date_format + " </div> <div class='small'>" + commitment_sts + "  </div></div></li></ul></td><td id='order_to'>" + obj.order_to + "</td><td>" + obj.raw_material_part_id + "</td><td>" + obj.batch_date + "</td><td>" + obj.batch_qty_with_uom + "</td></tr>");
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
         

            $("#po_dashboard").empty();

            $("#selected_materials").empty();

            if (response.trim() != "error") {
                var obj = JSON.parse(response);



                obj.forEach(function (obj) {
                    $("#po_dashboard").append(
                        "<tr data-batch_id='" + obj.batch_id + "' data-uom='" + obj.uom + "' data-raw_material_rate='" + obj.raw_material_rate + "' data-gst_rate='" + obj.gst_rate + "'>" +
                        "<td><input class='form-check-input material-check' type='checkbox' value='" + obj.mrf_purchase_id + "'></td>" +
                        "<td>" + obj.raw_material_part_id + "</td>" +
                        "<td>" + obj.batch_qty_with_uom + "</td>" +
                        "<td data-batch_qty='" + obj.batch_qty + "' contenteditable='true'>" + obj.batch_qty + "</td>" +
                        "<td>" + obj.batch_date + "</td>" +
                        "<td><input type='date'disabled class='form-control date-input' value='" + obj.approx_due_date + "'></td>" +
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