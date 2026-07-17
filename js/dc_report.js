
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
let allBomData = [];
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

    // Current Location

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                console.log("Latitude:", position.coords.latitude);
                console.log("Longitude:", position.coords.longitude);
                console.log("Accuracy:", position.coords.accuracy + " meters");
                get_godown_locations(position.coords.latitude, position.coords.longitude)
            },
            function (error) {
                console.log(error.message);
            }
        );
    } else {
        console.log("Geolocation is not supported.");
    }

    $("#summary_search").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        $("#all_bom_table tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    check_login();

    $("#unamed").text(localStorage.getItem("ls_uname"))


    get_work_order_report()



});



function get_work_order_report() {

    $.ajax({
        url: "php/get_work_order_report.php",
        type: "get",
        data: {

        },
        success: function (response) {

            let data = JSON.parse(response);
            $("#all_bom_table").empty();

            $("#dc_report_tbody").empty();

            $("#dc_report_tbody").empty();

            data.forEach((item, index) => {

                let woDetails = JSON.parse(item.work_order_details);

                woDetails.forEach((wo) => {

                    // ===========================
                    // Work Order Details
                    // ===========================
                    let employeeHtml = "";
                    let createdDateHtml = "";
                    let ageHtml = "";
                    let workOrderNoHtml = "";

                    wo.work_order_details.forEach((workOrder) => {

                        employeeHtml += `
                                <div class="mb-2">
                                    <span class="badge bg-primary">
                                        ${workOrder.created_by}
                                    </span>
                                </div>
                            `;

                                        createdDateHtml += `
                                <div class="mb-2">
                                    ${workOrder.created_date}
                                </div>
                            `;

                                        ageHtml += `
                                <div class="mb-2">
                                    ${workOrder.hour_since} Hrs
                                </div>
                            `;

                                        workOrderNoHtml += `
                                <div class="mb-2">
                                    ${workOrder.work_order_no ?? "-"}
                                </div>
                            `;              

                    });

                    // ===========================
                    // Godown Details
                    // ===========================
                    let godownDetails = `
                        <div class="small">

                            <strong>${wo.creditor_name ?? "-"}</strong>

                            <hr class="my-1">

                            <strong>Department :</strong>
                            ${wo.dep_name ?? "-"}

                            <br>

                            <strong>Section :</strong>
                            ${wo.sec_name ?? "-"}

                        </div>
                    `;

                    // ===========================
                    // Input Details
                    // ===========================
                    let inputDetails = `
                        <ul class="list-group list-group-flush">
                    `;

                    wo.input_details.forEach((input) => {

                        let required = parseFloat(input.required_qty) || 0;
                        let reserved = parseFloat(input.total_reserve_qty) || 0;
                        let external = parseFloat(input.ex_qty) || 0;
                        let needed = parseFloat(input.needed) || 0;

                        // Percentage calculations
                        let reservedPer = required > 0 ? (reserved / required) * 100 : 0;
                        let neededPer = required > 0 ? (needed / required) * 100 : 0;
                        let externalPer = required > 0 ? (external / required) * 100 : 0;

                        // Prevent external bar from overflowing
                        externalPer = Math.min(externalPer, 100);

                        inputDetails += `

                            <li class="list-group-item px-2 py-2">

                                <strong>${input.input_part_name}</strong>

                                <div class="mt-2 d-flex flex-wrap gap-1 d-none">

                                    <span class="badge bg-primary">
                                        Required : ${required}
                                    </span>

                                    <span class="badge bg-success">
                                        Internal : ${reserved}
                                    </span>

                                    <span class="badge bg-warning text-dark">
                                        External : ${external}
                                    </span>

                                    <span class="badge bg-danger">
                                        Needed : ${needed}
                                    </span>

                                </div>

                                <div class="progress mt-1" style="height:18px;">

                                    <!-- Internal Reserved -->
                                    <div class="progress-bar bg-success"
                                        style="width:${reservedPer}%"
                                        title="Internal Reserved : ${reserved}">
                                        ${reserved > 0 ? reserved : ""}
                                    </div>

                                    <!-- Needed -->
                                    <div class="progress-bar bg-danger"
                                        style="width:${neededPer}%"
                                        title="Needed : ${needed}">
                                        ${needed > 0 ? needed : ""}
                                    </div>

                                </div>

                                <!-- External Reserve -->
                                <small class="text-muted d-block mt-2">
                                    External Availability
                                </small>

                                <div class="progress" style="height:10px;">

                                    <div class="progress-bar bg-warning"
                                        style="width:${externalPer}%"
                                        title="External Reserved : ${external}">
                                    </div>

                                </div>

                            </li>

                            `;

                    });

                    inputDetails += "</ul>";

                    // ===========================
                    // Append Row
                    // ===========================

                    $("#dc_report_tbody").append(`

            <tr>

                <td>${index + 1}</td>

                <td>${employeeHtml}</td>

                <td>${createdDateHtml}</td>

                <td>${ageHtml}</td>

                <td>${workOrderNoHtml}</td>

                <td>${godownDetails}</td>

                <td class="text-center">
                    <span class="badge bg-info">
                        ${wo.total_process}
                    </span>
                </td>

                <td class="text-center">
                    <span class="badge bg-secondary">
                        ${wo.total_pending_process}
                    </span>
                </td>

                <td class="text-center">
                    <span class="badge bg-warning text-dark">
                        ${wo.total_exreserve_qty}
                    </span>
                </td>

                <td class="text-center">
                    <span class="badge bg-success">
                        ${wo.total_internal_reserve_qty}
                    </span>
                </td>

                <td class="text-center">
                    <span class="badge bg-primary">
                        ${wo.total_required_qty}
                    </span>
                </td>

                <td style="min-width:320px;">
                    ${inputDetails}
                </td>

                <td class="text-center">
                    <span class="badge bg-primary">
                        ${item.total_input_required_qty}
                    </span>
                </td>

                <td class="text-center">
                    <span class="badge bg-danger">
                        ${item.total_input_needed}
                    </span>
                </td>

                <td class="text-center">
                    <span class="badge bg-success">
                        ${item.total_internal_reserve_qty}
                    </span>
                </td>

            </tr>

        `);

                });

            });

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