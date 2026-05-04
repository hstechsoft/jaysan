// updated For App


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js'
import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyArBOz33-zRE8lMCj7d8mlzytL4hH6OSNQ",
    authDomain: "jaysan-8fa8d.firebaseapp.com",
    databaseURL: "https://jaysan-8fa8d-default-rtdb.firebaseio.com",
    projectId: "jaysan-8fa8d",
    storageBucket: "jaysan-8fa8d.appspot.com",
    messagingSenderId: "1077120566221",
    appId: "1:1077120566221:web:17e8bd20996c16bcc8fa84",
    measurementId: "G-6JNJZT1YCV"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const demoRef = ref(db, 'demo');

onValue(demoRef, (snapshot) => {
    if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(data);

        // Example: access name
        console.log(data.name); // harish
    } else {
        console.log("No data found");
    }
});

window.onLocationReceived = function (lat, lng) {
    console.log("GPS Location received:", lat, lng);

    // Example: Show it in an alert or update your UI
    // alert("Latitude: " + lat + "\nLongitude: " + lng);

    // You can now use lat and lng for your business logic
    // For example, update a hidden input or send to your server via AJAX
    $("#lat_input").val(lat);
    $("#lng_input").val(lng);
};

// End Update




var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var dcf_id_para = urlParams.get('dcf_id_para');

var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var dcf_id1 = 0;
var cus_id = '';
$(document).ready(function () {



    // updated For App
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is logged in");
            console.log("UID:", user.uid);
            console.log("Email:", user.email);

            // you can store in localStorage if needed
            localStorage.setItem("firebase_uid", user.uid);

        } else {
            console.log("User is NOT logged in");

            // clear if needed
            localStorage.removeItem("firebase_uid");
        }
    });




    $("#demo").on("click", function (event) {
        event.preventDefault();
        // TODO: handle click here
        AndroidBridge.vibrate(200);
        alert("vibrate")
        console.log("vibrate");

        AndroidBridge.getLocation();
    });


    $("#qr_btn").on("click", function (event) {
        event.preventDefault();
        console.log(window.AndroidBridge);

        if (window.AndroidBridge) {
            AndroidBridge.openScanner();
        }
    });
    // 1. Capture a live photo (Auto-compressed to < 256KB)
    $("#live_photo_btn").on("click", function (event) {
        event.preventDefault();
        captureWithDbData();
    });

    $("#select_any_file_btn").on("click", function (event) {
        event.preventDefault();
        uploadFile();
    });

    $("#select_pdf_btn").on("click", function (event) {
        event.preventDefault();
        uploadPdf();
    });

    $("#select_image_btn").on("click", function (event) {
        event.preventDefault();
        uploadPhoto();
    });

    // End Update




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

    $("#dcf_search").on("keyup", function () {
        const value = $(this).val().toLowerCase();

        $("#dcf_list tr").each(function () {
            const rowText = $(this).text().toLowerCase();
            $(this).toggle(rowText.indexOf(value) !== -1);
        });

        $("#dcf_list_mobile_view li").each(function () {
            const rowText = $(this).text().toLowerCase();
            $(this).toggle(rowText.indexOf(value) !== -1);
        });
    });

    console.log(getIndianDateTime());


    check_login();

    $("#unamed").text(localStorage.getItem("ls_uname"))


    get_dcf()

    $("#search_btn").on("click", function (event) {
        event.preventDefault();
        // TODO: handle click here

        get_dcf()
    });

    $('#cus_name').on('input', function () {

        //check the value not empty
        if ($('#cus_name').val() != "") {
            $('#cus_name').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    get_customer_autocomplete(request, response, "pname");
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    cus_id = ui.item.cus_id;

                },
                //display no result 
                response: function (event, ui) {
                    // if (!ui.content.length) {
                    //     var noResult = { value:"",label:"No results found" };
                    //     ui.content.push(noResult);
                    // }
                }
            });
        }

    });


    $('#dcf_list').on('click', 'button', function () {
        document.getElementById("dcf_report").scrollIntoView({
            behavior: "smooth"
        });
        get_dcf_details($(this).val())
    })
    $('#dcf_list_mobile_view').on('click', 'button', function () {
        document.getElementById("dcf_report").scrollIntoView({
            behavior: "smooth"
        });
        get_dcf_details($(this).val())
    })


    $('#print_button').on('click', function () {

        var dcf_id = $(this).val();

        if (window.AndroidBridge) {
            // You are inside the Android App
            console.log("App detected");
alert("App detected")


            event.preventDefault();

            var invoiceHtml = $("#dcf_report").prop("outerHTML");
            var encodedHtml = encodeURIComponent(invoiceHtml);
            var company_con = dcf_id || '';
            var fileName = "dcf_" + company_con + ".pdf";

            $.ajax({
                url: "pdf_handler.php",
                method: "POST",
                data: {
                    save_path: "storage/dcf_report/dcf_" + company_con,
                    file_name: "dcf_" + company_con,
                    unique_file: "yes",
                    header_html: "<h3 class='text-center' style='text-align: center;'>DCF Report</h3>",
                    footer_html: "<p>Generated by HS Tech Soft ERP</p>",
                    body_html: encodedHtml,
                    orientation: "portrait",
                    paper_size: "A4",
                    stream: "yes",
                    pdf_password: "",
                    watermark_text: ""
                },
                xhrFields: {
                    responseType: 'blob' // Receive as binary blob
                },
                success: function (res) {

                    // let blob = new Blob([data], { type: 'application/pdf' });
                    // let url = URL.createObjectURL(blob);
                    // window.open(url);
                    // 'res' is the PDF blob
                    const reader = new FileReader();
                    reader.onloadend = function () {
                        // Convert blob to base64 and remove the "data:...;base64," prefix
                        const base64Data = reader.result.split(',')[1];

                        if (typeof AndroidBridge !== 'undefined') {
                            /**
                             * FEATURE 1 & 2: 
                             * You can now choose to Share or Download.
                             * For this example, I'll show a simple confirm dialog.
                             */
                            if (confirm("Do you want to SHARE this PDF? (Press Cancel to DOWNLOAD instead)")) {
                                // Share to WhatsApp, Email, etc.
                                AndroidBridge.sharePdf(base64Data, fileName);
                            } else {
                                // Save directly to phone Downloads folder
                                AndroidBridge.downloadPdf(base64Data, fileName);
                            }
                        } else {
                            // Fallback for desktop browsers
                            let blob = new Blob([res], { type: 'application/pdf' });
                            let url = window.URL.createObjectURL(blob);
                            window.open(url);
                        }
                    };
                    reader.readAsDataURL(res);
                },
                error: function (xhr) {
                    alert("Error generating PDF: " + xhr.statusText);
                }
            });

        } else {
            // You are in a regular mobile or desktop browser
            console.log("Browser detected");
alert("Browser detected")
            print()
        }

    });

    $('#approve_button').on('click', function () {
        submit_dcf_invoice()

    });

});


function get_customer_autocomplete(request, response) {

    var cusname = $('#cus_name').val() + '%';
    var customer = [];
    var object = {};
    $.ajax({
        url: "php/get_customer_autocomplete.php",
        type: "get", //send it through get method
        data: {
            cus_name: cusname,


        },
        success: function (data) {


            if (data.trim() != "0 result") {
                var obj = JSON.parse(data);




                obj.forEach(function (obj) {

                    object = {

                        label: obj.cus_name + " - " + obj.cus_phone,
                        cus_id: obj.cus_id,

                        value: obj.cus_name,




                    };
                    customer.push(object);


                });

                response(customer);
            }

            // else {
            //   customer = [];
            //   var object = {

            //     value:"No data",
            //     cus_id : "",
            //     cus_addr : ""

            // };
            //  customer.push(object);


            // }



        },
        error: function (xhr) {
            //Do Something to handle error

            customer = [];
            var object = {

                value: "No data",
                cus_id: "",
                cus_addr: ""

            };
            customer.push(object);

        }
    });


    // console.log(customer)


    // return customer;

}
function submit_dcf_invoice() {

    $("#print_invoice_by").html(current_user_name + " (" + getIndianDateTime() + ")")
    $("#print_invoice_no").html($('#invoice_no').val())
    $("#print_driver").html($('#transport_driver').val())
    $("#print_vno").html($('#transport_vno').val())


    $.ajax({
        url: "php/update_dcf_invoice.php",
        type: "post", //send it through get method
        data: {
            dcf_invoice_by: current_user_id,
            dcf_id: dcf_id1,
            dcf_report: $('#dcf_report').html(),
            dcf_invoice_no: $('#invoice_no').val(),
            transport_driver: $('#transport_driver').val(),
            transport_vno: $('#transport_vno').val(),

        },
        success: function (response) {


            if (response.trim() == "ok") {

                get_dcf()
                shw_toast("Success", "DCF Approved", "success")
                $('#invoice_no').val("")
                $('#transport_driver').val("")
                $('#transport_vno').val("")

            }
            else if (response.trim() == "0 result") {


            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}








function get_dcf_details(dcf_id) {


    $.ajax({
        url: "php/get_dcf_details.php",
        type: "get", //send it through get method
        data: {
            dcf_id: dcf_id

        },
        success: function (response) {

            console.log(response);

            if (response.trim() != "error") {

                if (response.trim() != "0 result") {

                    $('#print_button').val(dcf_id)

                    var obj = JSON.parse(response);
                    var count = 0


                    obj.forEach(function (obj) {



                        count = count + 1;
                        $('#dcf_report').html(obj.dcf_report)

                        if (obj.sts == "invoice" || obj.sts == "delivery") {
                            $(".dcf-watermark")
                                .html(`<i class="fa-solid fa-thumbs-up me-2"></i>DCF APPROVED`)
                                .css("color", "rgb(17 200 8 / 42%)");
                        }

                        dcf_id1 = obj.dcf_id


                    });


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




}


function get_dcf() {


    $.ajax({
        url: "php/get_dcf_report.php",
        //send it through get method
        data: {
            dcf_sts: $('#dcf_sts').val() || '',
            customer: cus_id || '',
            order_no: $('#order_no_txt').val() || ''

        },
        success: function (response) {



            $('#dcf_list').empty();
            $('#dcf_list_mobile_view').empty();
            $('#dcf_report').empty();
            if (response.trim() != "error") {

                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0


                    obj.forEach(function (obj) {


                        var sale_order = JSON.parse(obj.sale_order);


                        console.log(sale_order);
                        var li = ""
                        sale_order.forEach(function (so) {
                            li = li + "<li class='list-group-item small'>Order No : " + so.order_no + " | Sales Person : " + so.emp + "</li>" + so.product;

                        });
                        count = count + 1;
                        $('#dcf_list').append("<tr class = 'small'><td>" + count + "</td><td>" + obj.dcf_id + "</td><td>" + obj.dated + "</td><td>" + obj.emp_name + "</td><td style = 'min-width: 350px;'><ul class='list-group'>" + li + "</ul></td><td>" + obj.consignee + "</td><td>" + obj.sts + "</td><td> <button class='btn btn-sm btn-primary' value='" + obj.dcf_id + "'>View</button></td></tr>");

                        $("#dcf_list_mobile_view").append("<li class='list-group-item d-md-none'> <div class='d-block justify-content-between align-items-center'> <div> <strong>DCF ID:</strong> " + obj.dcf_id + "<br><strong>Date:</strong> " + obj.dated + "<br><strong>Employee:</strong> " + obj.emp_name + "<br><strong>Consignee:</strong> " + obj.consignee + "<br><strong>Status:</strong> " + obj.sts + "<br><strong>Orders:</strong><ul class='list-group small'>" + li + "</ul></div> <button class='btn btn-sm btn-primary mt-2 p-1 float-end' value='" + obj.dcf_id + "' style='font-size:10px'>View</button> </div> </li>");

                    });

                    if (dcf_id_para != null) {
                        get_dcf_details(dcf_id_para)
                        $('html, body').animate({
                            scrollTop: $('#dcf_report').offset().top
                        }, 500);
                    }

                }
                else {
                    // $("#@id@") .append("<td colspan='5' scope='col'>No Data</td>");

                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}




function print() {



    $('#dcf_report').printThis({




    });


}









// updated For App


function uploadPhoto() {
    var myParams = { "user_id": "123", "doc_type": "Photo" };
    // Parameters are passed as the only argument
    AndroidBridge.pickImage(JSON.stringify(myParams));
}


function uploadPdf() {
    var myParams = { "user_id": "123", "doc_type": "PDF" };
    // Parameters are passed as the second argument
    AndroidBridge.pickFile("application/pdf", JSON.stringify(myParams));
}


function captureWithDbData() {
    console.log("capture");

    var params = {
        "user_id": "452",
        "action_type": "delivery_proof",
        "remark": "Packages delivered at gate"
    };

    if (window.AndroidBridge) {
        // Kotlin will take the photo, compress it, 
        // and include these params in the POST request to app_upload.php
        AndroidBridge.takePhoto(JSON.stringify(params));
    }
}


function uploadFile() {
    var myParams = { "user_id": "123", "doc_type": "PDF" };
    // Parameters are passed as the second argument
    if (window.AndroidBridge) {
        AndroidBridge.pickFile("*/*", JSON.stringify(myParams));
    }


}

window.receiveScanResult = function (result) {
    console.log("Scanned result: " + result);

    $("#qr_result").val(result);
};


// Global callbacks called by the Android app
window.onUploadSuccess = function (response) {
    console.log("Upload Success:", response);
    alert("Photo uploaded successfully!");
};

window.onUploadError = function (error) {
    console.error("Upload Error:", error);
    alert("Upload failed. Error code: " + error);
};

// End Update












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
function getIndianDateTime() {
    let date = new Date();
    let indianOffset = 5.5 * 60 * 60 * 1000;
    let utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    let indianDate = new Date(utc + indianOffset);

    let day = indianDate.getDate().toString().padStart(2, '0');
    let month = (indianDate.getMonth() + 1).toString().padStart(2, '0');
    let year = indianDate.getFullYear();

    let hours = indianDate.getHours();
    let minutes = indianDate.getMinutes().toString().padStart(2, '0');
    let seconds = indianDate.getSeconds().toString().padStart(2, '0');

    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12
    hours = hours.toString().padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
}




