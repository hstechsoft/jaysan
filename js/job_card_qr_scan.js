
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
    get_dep_section();
    get_current_qr(current_user_id);

    $("#unamed").text(localStorage.getItem("ls_uname"))

    if ($("#section_select").val() != null) {
        $(".qr_section").removeClass("d-none");
    }
    else {
        $(".qr_section").addClass("d-none");
    }

    $("#section_select").on("change", function () {
        if ($("#section_select").val() != null) {
            $(".qr_section").removeClass("d-none");
        }
        else {
            $(".qr_section").addClass("d-none");
        }
    })

    let html5QrCode;
    let isScanning = false;

    $("#openScannerBtn").click(function () {

        if (isScanning) return;

        $("#qr-reader").removeClass("d-none");

        html5QrCode = new Html5Qrcode("qr-reader");

        Html5Qrcode.getCameras().then(devices => {

            if (devices && devices.length) {

                // Prefer back camera on mobile
                let cameraId = devices.find(device =>
                    device.label.toLowerCase().includes("back")
                )?.id || devices[0].id;

                html5QrCode.start(
                    cameraId,
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 }
                    },
                    onScanSuccess
                );

                isScanning = true;
            }

        }).catch(err => {
            salert("Error", "Camera access denied or not supported", "error");
            console.error(err);
        });

    });

    $("#start_work").click(function () {

        if ($("#job_ass_id").val() > 0 && $("#section_select").val() > 0) {
            insert_qr_work_entry(current_user_id, $("#job_ass_id").val(), $("#section_select").val());
        }
        else{
            salert("Warning", "Data missing, try later", "warning");
        }
    })

    $("#timing_section").on("click", "#end_work", function () {

        let qrValue = $(this).val();

        if (!qrValue) {
            salert("Warning", "Data missing, try later", "warning");
            return;
        }

        Swal.fire({
            title: "Work Completed?",
            html: "Have you assembled all parts and sub-assemblies? 🤔",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Completed",
            cancelButtonText: "No",
            confirmButtonColor: "#198754",
            cancelButtonColor: "#dc3545",
            reverseButtons: true
        }).then((result) => {

            if (result.isConfirmed) {
                update_qr_end_time(qrValue);
            }

        });

    });

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



function insert_qr_work_entry(emp_id, qr_code, sec_id) {

    $.ajax({
        url: "php/insert_qr_work_entry.php",
        type: "post", //send it through get method
        data: {

            emp_id: emp_id,
            qr_code: qr_code,
            sec_id: sec_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == "ok") {
                $("#start_work").prop("disabled", true).text("Time Started");
                get_current_qr(current_user_id)
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}


function update_qr_end_time(qr_work_id) {

    $.ajax({
        url: "php/update_qr_end_time.php",
        type: "post", //send it through get method
        data: {

            qr_work_id: qr_work_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == "ok") {
                $("#end_work").prop("disabled", true).text("Work Ended")
                window.location.reload();
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}


function get_current_qr(emp_id) {

    $.ajax({
        url: "php/get_current_qr.php",
        type: "get",
        data: {
            emp_id: emp_id,
        },
        success: function (response) {
            if (response.trim() != "error") {
                $("#timing_section").empty();
                if (response.trim() != "0 result") {
                    $("#scan_section").addClass("d-none");
                    $("#timing_section").removeClass("d-none");

                    var obj = JSON.parse(response);

                    obj.forEach(function (item) {

                        $("#timing_section").append(`
                            <div class="card machine-card">

                                <div class="card-header">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5 class="mb-0 fw-bold text-uppercase">
                                                ${item.product} ${item.model_name} ${item.type_name}
                                            </h5>
                                            <small class="text-light opacity-75">
                                                ${item.sub_type}
                                            </small>
                                        </div>

                                        <span class="status-badge">
                                            🟢 Active
                                        </span>
                                    </div>
                                </div>

                                <div class="card-body text-center">

                                    <div class="motivation-box mb-3">
                                        🚀 <strong>Production in Progress</strong><br>
                                        Precision today, perfection tomorrow.
                                    </div>

                                    <div class="time-box">
                                        <i class="fa-solid fa-clock text-success"></i>
                                        Started at: <strong>${item.start_time}</strong>
                                    </div>

                                </div>

                                <div class="card-footer text-center">

                                    <button type="button"
                                        class="btn btn-danger px-4 fw-bold shadow-sm "
                                        id="end_work" value='${item.qr_work_id}'>
                                        ⏹ End Work
                                    </button>

                                </div>

                            </div>
                        `);
                    });

                }
            }
        },
        error: function (xhr) {

        },
    })
}

function onScanSuccess(decodedText) {

    $("#scan_result")
        .removeClass("d-none")
        .html("✅ Scanned: <strong>" + decodedText + "</strong>");

    $("#job_ass_id").val(decodedText);

    stopScanner();

    fetchJobDetails(decodedText);
}

function stopScanner() {
    if (html5QrCode && isScanning) {
        html5QrCode.stop().then(() => {
            $("#qr-reader").addClass("d-none");
            isScanning = false;
        });
    }
}

function fetchJobDetails(jobId) {

    $.ajax({
        url: "php/get_job_card_details.php",
        type: "GET",
        data: { job_id: jobId },
        success: function (response) {
            console.log(response);

            // You can redirect or update UI
        }
    });

}


function get_dep_section() {

    $.ajax({
        url: "php/get_dep_section.php",
        type: "get", //send it through get method
        data: {
            dep_id: 29,

        },
        success: function (response) {
            console.log(response);


            if (response.trim() != "error") {
                $("#section_select").empty();
                if (response.trim() != "0 result") {





                    var obj = JSON.parse(response);
                    var count = 0
                    $("#section_select").append("<option class='' value='null'> select section...  </option>")

                    obj.forEach(function (obj) {
                        count = count + 1;


                        $("#section_select").append("<option class='' value=" + obj.dep_sec_id + " data-sec_name='" + obj.sec_name + "' data-dep_id='" + obj.dep_id + "'>" + obj.sec_name + "</option>")


                    });


                }
                else {
                    // $("#section_da").append("<li disabled><a class='dropdown-item' >NO DATA</a></li>")

                }
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