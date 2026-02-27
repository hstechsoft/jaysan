
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
$(document).ready(function () {
    var details = '';



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


    $("#production_line_search").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        $("#arrange_order_tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });


    check_login();

    $("#unamed").text(localStorage.getItem("ls_uname"))
    get_assign_order();




    $("#sale_order").on("change", function () {

        $("#show_customer").prop("checked", false).trigger("change");
        $("#chase_entry_table").addClass("d-none");
        $("#chase_no").val('');
        $("#prepared_by").val('');
        // $("#chase_entry_table").empty();

        $("#chase_entry_preview_btn").removeClass('d-none')
        $("#chase_entry_btn").addClass('d-none')
        $("#bom_table").removeClass("d-none")

        const encodedDetails = $(this).find("option:selected").data("details");
        if (encodedDetails) {

            details = JSON.parse(decodeURIComponent(encodedDetails));
            $("#customer").val(details.cus_name);
            console.log(" Details loaded:", details);
        } else {
            console.warn("No details found in selected option");
            details = null;
        }
    });

    $("#show_customer").on("change", function () {
        if ($(this).is(":checked")) {
            $("#cus_row").removeClass("d-none");
        }
        else {
            $("#cus_row").addClass("d-none");
        }
    })

    $("#chase_entry_preview_btn").on("click", function () {
        if (
            $("#sale_order").val() !== null &&
            $("#chase_no").val() !== "" &&
            $("#prepared_by").val() !== "" &&
            $("#department").val() !== ""
        ) {


            const chase = $("#chase_no").val();
            const prepare = $("#prepared_by").val();
            const department = $("#department").val();

            $("#chase_no_val").text(chase);
            $("#prepared_by_val").html("Prepared By: <strong>" + prepare + "</strong>");
            $("#department_val").html("<strong>" + department + "</strong>");

            if (details !== null) {
                var mcd = details.commitment_date.trim().split(" ");
                $("#sale_order_no").text(details.order_no || "");
                $("#customer_name").text(details.cus_name || "")
                $("#model").text(details.model || "");
                $("#type").text(details.type || "");
                $("#sub_type").text(details.sub_type || "");
                $("#mcd").text(mcd[0] || "");
                $("#marketing_person_name").text(details.emp_name || "");
                $("#line_no").text(details.line_no || "");
                // $("#pcd").text(details.sale_order_date || "");
                $("#transport_type").text(details.loading_type || "");
                $("#ins_note").text(details.color_choice || "" + " " + details.any_other_spec || "" + " " + details.any_other_spec || "" + " " + details.color_choice_des || "");


                const qrData = details.ass_id;

                // Clear old QR code
                document.getElementById("qrcode").innerHTML = "";
                // $("#ass_id").html("QR Code: <b class='text-primary'>" + qrData + "</b>");
                // $("#chase_entry_btn").val(qrData)

                // Generate new QR code
                // new QRCode(document.getElementById("qrcode"), {
                //     text: qrData,
                //     width: 150,
                //     height: 150,
                // });


                update_assign_product_fd(qrData)

            } else {
                salert("Error", "No details found for selected sale order", "error");
            }

            $(this).addClass('d-none')
            $("#chase_entry_btn").removeClass('d-none')
            if ($("#switchCheckDefault").is(":checked")) {
                $("#switchCheckDefault").trigger("click");
            } else {
                $("#chase_entry_table").removeClass("d-none");
            }

        } else {
            salert("Error", "Please fill all required fields", "error");
        }
    });

    // $("#chase_entry_btn").on("click", function () {
    //     setTimeout(() => {
    //         window.print();
    //     }, 500);
    // })
    $("#chase_entry_btn").on("click", function (event) {

        print()
        // if ($(this).val()) {
        //     update_assign_product_fd($(this).val())
        // }
        // else {
        //     salert("Warning", "Try again later", "warning")
        // }
    });


    $("#switchCheckDefault").on("click", function () {
        $(this).html();
        if ($(this).is(":checked")) {
            $("#all_line_production_data").removeClass("d-none");
            $("#chase_entry_table").addClass("d-none");
        }
        else {
            $("#all_line_production_data").addClass("d-none");
            if ($("#chase_entry_preview_btn").hasClass("d-none")) {

                $("#chase_entry_table").removeClass("d-none");


            }
        }
    })



});


function get_assign_order() {

    $.ajax({
        url: "php/get_assign_order.php",
        type: "get", //send it through get method
        data: {

        },
        success: function (response) {
            // console.log(response);



            if (response.trim() != 'error') {
                if (response.trim() != '0 results') {


                    var obj = JSON.parse(response);
                    $("#sale_order").empty();
                    $("#sale_order").append("<option value='null' disabled selected>Select Sale Order</option>")


                    obj.forEach(function (obj) {
                        let label = obj.order_no + " - " + obj.product + " - " + obj.cus_name + " - " + obj.commitment_date;
                        if (obj.order_type === "Emergency") {
                            label += " 🚨";
                        }
                        $("#sale_order").append("<option data-details='" + encodeURIComponent(JSON.stringify(obj)) + "'>" + label + "</option>")




                        var details = `
                            <div class="card shadow-sm border-0" style="border-radius: 10px;">
                                <div class="card-body py-1 px-2 d-flex justify-content-between align-items-center">
                                    <span class="text-muted small">${obj.model}</span>
                                    <span class="fw-semibold text-primary">${obj.product}</span>
                                    <span class="badge bg-success">${obj.type}</span>
                                </div>

                                <div class="card-footer py-0 px-1 bg-light border-0">
                                    <small class="text-muted">
                                        ${obj.sub_type}
                                    </small>
                                </div>
                            </div>
                        `;
                        $("#arrange_order_tbody").append(`
                            <tr class='text-center' style=" font-size: 13px"
                                data-ass_id='${obj.ass_id}'>
                                <td>${obj.line_no}</td>
                                <td>${obj.cus_name} - ${obj.cus_phone}</td>
                                <td>${details}</td>
                            </tr>
                        `);
                        $("#mobile_view_arrange_order_tbody").append(`<div class="card border-info mb-3" style="max-width: 18rem; font-size: 12px;">
                            <div class="card-header">Line no: <b class=' float-end badge bg-danger'>${obj.line_no}</b></div>
                            <div class="card-body">
                                <h6 class="card-title text-info">${obj.cus_name} - ${obj.cus_phone}</h6>
                                <p class="card-text">${details}</p>
                            </div>
                        </div>`)
                    });

                }
                else {
                    $("#sale_order").append("<option >No data exist</option>")

                }



            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function update_assign_product_fd(ass_id) {
    console.log(ass_id);

    $.ajax({
        url: "php/update_assign_product_fd.php",
        type: "post", //send it through get method
        data: {

            ass_id: ass_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == 'ok') {
                get_assigned_order_ass_id(ass_id);
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function get_assigned_order_ass_id(ass_id) {
    console.log(ass_id);

    $.ajax({
        url: "php/get_assigned_order_ass_id.php",
        type: "get", //send it through get method
        data: {

            ass_id: ass_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() != "error") {
                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);

                    obj.forEach(function (items) {
                        
                        $("#qrcode").innerHTML = "";
                        $("#ass_id").html("QR Code: <b class='text-primary'>" + items.qr_no + "</b>");
                        // $("#chase_entry_btn").val(qrData)

                        // Generate new QR code
                        new QRCode(document.getElementById("qrcode"), {
                            text: items.qr_no,
                            width: 150,
                            height: 150,
                        });

                    });
                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function print() {
    var invoiceHtml = $("#chase_entry_table").prop("outerHTML");

    // Encode it to protect HTML structure in POST

    var encodedHtml = encodeURIComponent(invoiceHtml);
    $.ajax({
        url: "pdf_handler.php",
        method: "POST",
        data: {
            save_path: "storage/pdf/jobcard",
            file_name: "jobcard.pdf",
            unique_file: "yes",
            header_html: "<h3>Jaysan Agri Industial - Job Card</h3>",
            footer_html: "<p>Generated by HS Tech Soft ERP</p>",
            body_html: encodedHtml,
            orientation: "portrait",
            paper_size: "A4",
            stream: "no",
            // email_to: "nklharish1@gmail.com",
            // email_subject: "Invoice #1001",
            // email_body: "Hello, please find attached your invoice.",
            // pdf_password: "",        // optional
            // watermark_text: ""       // optional
        },
        success: function (res) {
            console.log(res);
            if (res.download_url) {
                // 3️⃣ open PDF and trigger browser print dialog
                const win = window.open(res.download_url, "_blank");
                // Some browsers need a delay before printing
                const printTimer = setInterval(() => {
                    if (win.document.readyState === "complete") {
                        clearInterval(printTimer);
                        win.focus();
                        win.print();
                    }
                }, 500);
            } else {
                alert("PDF generated, but no download URL returned");
            }
        },
        error: function (xhr) {
            alert("Error: " + xhr.responseText);
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