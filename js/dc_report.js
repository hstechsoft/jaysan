
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


    $("#dc_report_tbody ").on("click", "tr td .input_godown_details_btn", function () {

        $("#input_details").empty();
        $("#godown_details").empty();
        $("#input_godown_details_modalLabel").empty();

        var final_part = $(this).data("final_part");
        var process_name = $(this).data("process_name");

        var input_parts = decodeURIComponent($(this).data("input_parts"));
        input_parts = JSON.parse(input_parts);

        var godown_details = decodeURIComponent($(this).data("godown_details"));
        godown_details = JSON.parse(godown_details)

        $("#input_godown_details_modal").modal("show");
        $("#input_godown_details_modalLabel").html(final_part + ` - <span class="badge bg-primary">${process_name}</span>`);


        input_parts.forEach(function (item) {

            $("#input_details").append(`
                    <div class="list-group-item py-2 px-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="fw-semibold">${item.part}</span>

                            <span class="badge bg-primary rounded-pill">
                                ${item.qty}
                            </span>
                        </div>
                    </div>
                `);

        });



        godown_details.forEach(function (item) {

            $("#godown_details").append(`
                    <div class="list-group-item py-2">

                        <div class="d-flex justify-content-between align-items-start">

                            <div>
                                <div class="fw-semibold">
                                    <i class="fas fa-warehouse text-success me-1"></i>
                                    ${item.godown_name}
                                </div>

                                <small class="text-muted">
                                    ${item.department ?? '-'}
                                    ${item.section ? ' / ' + item.section : ''}
                                </small>
                            </div>

                            <div class="text-end">

                                <span class="badge bg-warning text-dark">
                                    ₹ ${item.cost}
                                </span>

                                <br>

                                <span class="badge bg-success mt-1">
                                    Max ${item.max_time}m
                                </span>

                                <span class="badge bg-danger mt-1">
                                    Min ${item.min_time}m
                                </span>

                            </div>

                        </div>

                    </div>
                `);

        });


        console.log(input_parts);
        console.log(godown_details);
        console.log(final_part, process_name);

    })


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

                let rowSpan = woDetails.length;

                let total_input_required_qty = parseFloat(item.total_input_required_qty) || 0;
                let total_input_needed = parseFloat(item.total_input_needed) || 0;
                let total_internal_reserve_qty = parseFloat(item.total_internal_reserve_qty) || 0;

                let total_internal_reserve_qtyPer = total_input_required_qty > 0 ? (total_internal_reserve_qty / total_input_required_qty) * 100 : 0;

                let total_input_neededPer = total_input_required_qty > 0 ? (total_input_needed / total_input_required_qty) * 100 : 0;

                woDetails.forEach((wo, woIndex) => {

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
                                    <span class="badge bg-secondary">
                                        ${workOrder.created_by} - ${workOrder.created_date} - ${workOrder.hour_since} Hrs
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

                            <strong>${wo.creditor_name ?? " "}</strong>

                            <hr class="my-1">

                            <strong class='d-none'>Department :</strong>
                            ${wo.dep_name ?? " "}

                            <br>

                            <strong class='d-none'>Section :</strong>
                            ${wo.sec_name ?? " "}

                            <div class="d-flex justify-content-between mt-2">
                                <span class="badge bg-info" title="Total Process">${wo.total_process}</span>
                                <span class="badge bg-secondary" title="Pending Process">${wo.total_pending_process}</span>
                                <span class="badge bg-warning text-dark" title="External Reserved">${wo.total_exreserve_qty}</span>
                                <span class="badge bg-success" title="Internal Reserved">${wo.total_internal_reserve_qty}</span>
                            </div>

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

                                <span class="text-primary">Total Required: ${required}</span>

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

                                    ${woIndex === 0 ? ` <td rowspan="${rowSpan}" class="align-middle text-center">${index + 1}</td><td rowspan="${rowSpan}" class="align-middle text-center">${item.final_part} <span class="badge bg-primary input_godown_details_btn" data-final_part="${item.final_part}" data-process_name="${item.process_name}" data-godown_details=${encodeURIComponent(item.godown_details)} data-input_parts=${encodeURIComponent(item.input_parts)}>${item.process_name}</span></td>
                                        ` : ""}

                                    <td class="align-middle text-center">${employeeHtml}</td>

                                    <td class="align-middle text-center">${workOrderNoHtml}</td>

                                    <td  class="align-middle text-center">${godownDetails}</td>

                                    <td class="align-middle text-center">
                                        <span class="badge bg-primary">${wo.total_required_qty}</span>
                                    </td>

                                    <td  class="align-middle text-center" style="min-width:320px;">
                                        ${inputDetails}
                                    </td>

                                    ${woIndex === 0 ? `
                                        <td rowspan="${rowSpan}" class="align-middle text-center">
                                            <div class="small fw-bold mb-1">
                                                Required : ${total_input_required_qty}
                                            </div>

                                            <div class="progress" style="height:20px;">

                                                <div class="progress-bar bg-success"
                                                    style="width:${total_internal_reserve_qtyPer}%"
                                                    title="Reserved ${total_internal_reserve_qty}">
                                                    ${total_internal_reserve_qty}
                                                </div>

                                                <div class="progress-bar bg-danger"
                                                    style="width:${total_input_neededPer}%"
                                                    title="Needed ${total_input_needed}">
                                                    ${total_input_needed}
                                                </div>

                                            </div>

                                            <div class="d-flex justify-content-between small mt-1">
                                                <span class="text-success">
                                                    <i class="fas fa-check-circle"></i>
                                                    Reserved: ${total_internal_reserve_qty}
                                                </span>

                                                <span class="text-danger">
                                                    <i class="fas fa-exclamation-circle"></i>
                                                    Needed: ${total_input_needed}
                                                </span>
                                            </div>

                                            <div class="d-flex justify-content-between small mt-2">
                                                <span class="badge bg-primary">
                                                    Total Process: ${Number(item.total_process)}
                                                </span>
                                                <span class="badge bg-warning  text-dark">
                                                    Total Pending Process: ${Number(item.total_pending_process)}
                                                </span>
                                            </div>
                                        </td>` : ""}

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