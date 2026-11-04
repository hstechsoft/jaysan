
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
let allBomData = [];
let productionPlanData = [];
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

    // if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(
    //         function (position) {
    //             console.log("Latitude:", position.coords.latitude);
    //             console.log("Longitude:", position.coords.longitude);
    //             console.log("Accuracy:", position.coords.accuracy + " meters");
    //             get_godown_locations(position.coords.latitude, position.coords.longitude)
    //         },
    //         function (error) {
    //             console.log(error.message);
    //         }
    //     );
    // } else {
    //     console.log("Geolocation is not supported.");
    // }

    // $("#excel_report_search").on("keyup", function () {
    //     var value = $(this).val().toLowerCase();

    //     $("#excel_need_material_tbody tr").filter(function () {
    //         $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    //     });
    // });

    check_login();

    $("#unamed").text(localStorage.getItem("ls_uname"))


    fillter();
    get_jaysan_final_product();

    $('#process_id').on('input', function () {
        //check the value not empty
        $(this).data("process_id", '');

        if ($('#process_id').val() != "") {
            $('#process_id').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_part_semi_auto.php",
                        type: "get", //send it through get method
                        data: {


                            part: $('#process_id').val(),
                            term: 'part',

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.final_part,
                                    value: item.final_part,
                                    id: item.output_part,
                                    process_id: item.process_id,
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("process_id", ui.item.process_id);
                    fillter();

                },

            })
        }

    });

    $('#godown_id').on('input', function () {
        $(this).removeData("godown_id");
        if ($(this).val().trim() === '') {
            $(this).removeData("godown_id");
        }

        $('#dep_id').val('');
        $('#sec_id').val('');

        //check the value not empty
        if ($('#godown_id').val() != "") {
            $('#godown_id').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_creditors_auto.php",
                        type: "get", //send it through get method
                        data: {
                            term: request.term,


                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.creditor_name,
                                    value: item.creditor_name,
                                    id: item.creditor_id
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("godown_id", ui.item.id);
                    get_department(ui.item.id);
                    fillter();


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#customer_id').on('input', function () {
        if ($(this).val().trim() !== "") {
            $("label[for='customer_id']").fadeOut(300);
        } else {
            $("label[for='customer_id']").fadeIn(300);
        }
        //check the value not empty
        if ($('#customer_id').val() != "") {

            $('#customer_id').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    get_customer_autocomplete(request, response, "pname");
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {
                    //console.logui.item.cus_id);

                    $(this).data("customer_id", ui.item.cus_id);
                    fillter();

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

    $("#dep_id").on("change", function () {
        $('#sec_id').val('');

        get_dep_section($(this).val());
        fillter();
    });

    $("#sec_id").on("change", function () {
        fillter();
    });


    $('#product_id').change(function () {
        get_jaysan_final_productmodel()
        fillter();
    });

    $('#model_id').change(function () {
        get_jaysan_final_producttype()
        fillter();
    });

    $('#type_id').change(function () {
        fillter();
    });

    $("#clear_production_filters").on("click", function () {
        $('#process_id').val('').removeData("process_id");
        $('#display_expired_due').prop('checked', false);
        $('#display_pending_wo_only').prop('checked', true);
        $('#godown_id').val('').removeData("godown_id");
        $('#dep_id').val('');
        $('#sec_id').val('');
        $('#customer_id').val('').removeData("customer_id");
        $('#product_id').val('');
        $('#model_id').val('');
        $('#type_id').val('');

        fillter();
    });

});

function fillter() {
    var process_id = $('#process_id').data("process_id") || '';
    var display_expired_due = $('#display_expired_due').is(":checked") ? 'yes' : '';
    var godown = $('#godown_id').data('godown_id') || '';
    var display_pending_wo_only = $('#display_pending_wo_only').is(":checked") ? 'yes' : '';
    var dep = $('#dep_id').val() || '';
    var sec = $('#sec_id').val() || '';
    var customer_id = $('#customer_id').data('customer_id') || '';
    var product_id = $('#product_id').val() || '';
    var model_id = $('#model_id').val() || '';
    var type_id = $('#type_id').val() || '';

    get_place_wise_planner(process_id, display_expired_due, display_pending_wo_only, godown, dep, sec, customer_id, product_id, model_id, type_id);
}

function get_customer_autocomplete(request, response) {
    var cusname = $('#customer_id').val() + '%';
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
                        cus_addr: obj.cus_address,
                        value: obj.cus_name,
                        cus_name: obj.cus_name,
                        cus_phone: obj.cus_phone,
                        cus_type_id: obj.cus_type_id,
                        sub_group_name: obj.sub_group_name,
                        pincode: obj.pincode


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


    // //console.logcustomer)


    // return customer;

}

function get_department(godown_id) {

    $.ajax({
        url: "php/get_department.php",
        type: "get", //send it through get method
        data: {
            godown_id: godown_id

        },
        success: function (response) {
            console.log(response);


            if (response.trim() != "error") {
                $("#dep_id").empty();

                $("#dep_id").append(`<option selected disabled value="">Department...</option>`);
                if (response.trim() != "0 result") {




                    var obj = JSON.parse(response);
                    var count = 0


                    obj.forEach(function (obj) {
                        count = count + 1;

                        $("#dep_id").append(`<option value="${obj.dep_id}">${obj.dep_name}</option>`);



                    });


                }
                else {
                    // $("#dep_id").append("<li disabled><a class='dropdown-item'  >NO DATA</a></li>")

                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });


}

function get_dep_section(dept_id) {

    $.ajax({
        url: "php/get_dep_section.php",
        type: "get", //send it through get method
        data: {
            dep_id: dept_id

        },
        success: function (response) {
            console.log(response);


            if (response.trim() != "error") {
                $("#sec_id").empty();
                $("#sec_id").append(`<option selected disabled value="">Section...</option>`);
                if (response.trim() != "0 result") {





                    var obj = JSON.parse(response);
                    var count = 0;

                    obj.forEach(function (obj) {
                        count = count + 1;

                        $("#sec_id").append(`<option value="${obj.dep_sec_id}">${obj.sec_name}</option>`);



                    });


                }
                else {
                    // $("#sec_id").append("<li disabled><a class='dropdown-item' >NO DATA</a></li>")

                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });


}

function get_jaysan_final_productmodel() {

    //console.log$('#product').val());

    $.ajax({
        url: "php/get_jaysan_final_productmodel.php",
        type: "get", //send it through get method
        data: {
            product_id: $('#product_id').val()


        },
        success: function (response) {
            $('#model_id').removeAttr('disabled')
            $('#model_id').empty()
            $('#type_id').empty()
            $('#model_id').append("<option value='' selected disabled>Choose Model...</option>")
            $('#type_id').append("<option value='' selected disabled>Choose Type...</option>")
            //console.log

            if (response.trim() != "error") {

                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0


                    obj.forEach(function (obj) {
                        count = count + 1;
                        $('#model_id').append("<option value = '" + obj.model_id + "'>" + obj.model_name + "</option>")

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

function get_jaysan_final_producttype() {

    $.ajax({
        url: "php/get_jaysan_final_producttype.php",
        type: "get", //send it through get method
        data: {
            model_id: $('#model_id').val()


        },
        success: function (response) {
            $('#type_id').removeAttr('disabled')
            $('#type_id').empty()
            $('#type_id').append("<option value='' selected disabled>Choose Type...</option>")
            //console.log

            if (response.trim() != "error") {

                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0


                    obj.forEach(function (obj) {
                        count = count + 1;
                        $('#type_id').append("<option value = '" + obj.mtid + "'>" + obj.type_name + "</option>")

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

function get_jaysan_final_product() {


    $.ajax({
        url: "php/get_jaysan_final_product.php",
        type: "get", //send it through get method
        data: {

        },
        success: function (response) {

            $('#product_id').empty()
            $('#product_id').append("<option value='' selected disabled>Choose Product...</option>")
            if (response.trim() != "error") {
                //console.log

                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0


                    obj.forEach(function (obj) {
                        count = count + 1;
                        $('#product_id').append("<option  value = '" + obj.product_id + "'>" + obj.product_name + "</option>")

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

function get_place_wise_planner(process_id, display_expired_due, display_pending_wo_only, godown, dep, sec, customer_id, product_id, model_id, type_id) {

    console.log("process_id:", process_id, "display_expired_due:", display_expired_due, "display_pending_wo_only:", display_pending_wo_only, "godown:", godown, "dep:", dep, "sec:", sec, "customer_id:", customer_id, "product_id:", product_id, "model_id:", model_id, "type_id:", type_id);

    $.ajax({

        url: "php/get_place_wise_planner.php",
        type: "GET",
        data: {
            process_id: process_id,
            display_expired_due: display_expired_due,
            display_pending_wo_only: display_pending_wo_only,
            godown: godown,
            dep: dep,
            sec: sec,
            customer_id: customer_id,
            product_id: product_id,
            model_id: model_id,
            type_id: type_id,
        },
        dataType: "json",

        success: function (response) {

            console.log("Planner Report:", response);
            $("#planned_work_order_report_tbody").html(``);
            renderPlannedWorkOrderReport(response);

        },

        error: function (xhr) {

            console.error("AJAX Error:", xhr.responseText);

            $('#planned_work_order_report_tbody').html(`
                <tr>
                    <td colspan="6" class="text-center text-danger p-4">
                        Failed to load planned work order report.
                    </td>
                </tr>
            `);

        }

    });

}

function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, function (char) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char];
    });
}

function parseJSON(value) {

    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value !== 'string' || !value.trim()) {
        return [];
    }

    try {
        let parsed = JSON.parse(value);

        return Array.isArray(parsed) ? parsed : [];

    } catch (e) {
        console.error("JSON parsing error:", e);
        return [];
    }
}

function qty(value) {
    return Number(value || 0).toLocaleString('en-IN', {
        maximumFractionDigits: 2
    });
}

function displayDate(value) {

    if (
        !value ||
        value === '0000-00-00' ||
        value === '0000-00-00 00:00:00' ||
        value === '00-00-0000'
    ) {
        return '-';
    }

    return escapeHTML(value);
}

function renderGodownDetails(row) {

    return `
        <div class="godown-title">
            <i class="bi bi-building"></i>
            ${escapeHTML(row.wo_godown_name || '-')}
        </div>

        <div class="godown-sub">
            <i class="bi bi-diagram-3"></i>
            ${escapeHTML(row.wo_dep_name || '-')}
        </div>

        <span class="godown-badge">
            <i class="bi bi-gear"></i>
            ${escapeHTML(row.wo_dep_sec_name || '-')}
        </span>
    `;
}

function renderPlannerDetails(plan) {

    return `
        <div class="planner-name">
            <i class="bi bi-person-circle"></i>
            ${escapeHTML(plan.pp_created_by_name || '-')}
        </div>

        <div class="planner-date">
            <i class="bi bi-calendar3"></i>
            ${displayDate(plan.plan_date)}
        </div>

        <span class="godown-badge">
            Planner ID: ${escapeHTML(plan.plan_id)}
        </span>
    `;
}

function renderOrderDetails(orders) {

    if (!orders.length) {
        return '<span class="report-empty">No order details</span>';
    }

    return orders.map(function (order) {

        return `
            <div class="order-card">

                <div class="order-title">
                    <i class="bi bi-receipt"></i>
                    ${escapeHTML(order.order_category || 'Order')}
                    #${escapeHTML(order.order_no)}
                </div>

                <div class="order-customer">
                    <i class="bi bi-person"></i>
                    ${escapeHTML(order.cus_name || '-')}
                </div>

                <div class="order-meta">

                    <div>
                        <strong>Product:</strong>
                        ${escapeHTML(order.product || '-')}
                    </div>

                    <div>
                        <strong>Model:</strong>
                        ${escapeHTML(order.model_name || '-')}
                        |
                        <strong>Type:</strong>
                        ${escapeHTML(order.type_name || '-')}
                    </div>

                    <div>
                        <strong>Sub Type:</strong>
                        ${escapeHTML(order.sub_type || '-')}
                    </div>

                    <div>
                        <strong>Date:</strong>
                        ${displayDate(order.dated)}
                    </div>

                    <div>
                        <span class="order-qty">
                            Qty: ${qty(order.required_qty)}
                        </span>
                    </div>

                </div>

            </div>
        `;

    }).join('');
}

function renderProcessDetails(processes) {

    if (!processes.length) {
        return '<span class="report-empty">No process details</span>';
    }

    return processes.map(function (process) {

        let workOrders = process.work_order_details || [];

        let woHtml = workOrders.length
            ? workOrders.map(function (wo) {

                return `
                    <div class="wo-row">

                        <span class="wo-id">
                            WO #${escapeHTML(wo.wo_work_order_id)}
                        </span>

                        <span class="wo-qty">
                            Qty: ${qty(wo.wo_qty)}
                        </span>

                        <span class="wo-pending">
                            Pending: ${qty(wo.wo_pending_qty)}
                        </span>

                        <span class="text-success">
                            Completed: ${qty(wo.wo_completed_qty)}
                        </span>

                        <span class="wo-date">
                            <i class="bi bi-calendar-check"></i> Due Date: 
                            ${displayDate(wo.wo_due_date)}
                        </span>

                        <span class="wo-date">
                            By: ${escapeHTML(wo.wo_created_by_name || '-')}
                        </span>

                    </div>
                `;

            }).join('')
            : '<span class="report-empty">No work orders assigned</span>';

        return `
            <div class="process-card">

                <div class="process-heading">

                    <span class="process-name">
                        <i class="bi bi-gear-wide-connected"></i>
                        ${escapeHTML(process.process_name || '-')}
                    </span>

                    <span class="process-count">
                        ${workOrders.length} Work Orders
                    </span>

                </div>

                <div class="process-part">
                    <i class="bi bi-box-seam"></i>
                    ${escapeHTML(process.final_part || '-')}
                </div>

                <div class="process-wo">
                    ${woHtml}
                </div>

            </div>
        `;

    }).join('');
}

function renderPlannedWorkOrderReport(response) {

    // Parse outer response
    if (typeof response === 'string') {
        response = JSON.parse(response);
    }

    if (!Array.isArray(response)) {
        console.error("Invalid response:", response);

        $('#planned_work_order_report_tbody').html(`
            <tr>
                <td colspan="6" class="text-center text-danger p-4">
                    Invalid response format.
                </td>
            </tr>
        `);

        return;
    }

    let html = '';

    response.forEach(function (row, index) {

        // Parse nested plan details
        let plans = parseJSON(row.plan_details);

        // Get matching plan using plan_id
        let plan = plans.find(function (p) {
            return String(p.plan_id) === String(row.plan_id);
        }) || plans[0] || {};

        // Parse order details from plan
        let orders = plan.order_details || [];

        // Parse process details from the current godown row
        let processes = parseJSON(row.process_details);

        html += `

            <tr>

                <!-- Serial Number -->

                <td class="text-center">
                    <strong>${index + 1}</strong>
                </td>


                <!-- Godown Details -->

                <td style="max-width:100px;">
                    ${renderGodownDetails(row)}
                </td>


                <!-- Planned By -->

                <td style="max-width:100px;">
                    ${renderPlannerDetails(plan)}
                </td>


                <!-- Order Details -->

                <td style="max-width:150px;">
                    ${renderOrderDetails(orders)}
                </td>


                <!-- Process Details -->

                <td style="max-width:200px;">
                    ${renderProcessDetails(processes)}
                </td>


                <!-- Total Work Order Summary -->

                <td style="max-width:50px;">

                    ${renderWorkOrderSummary(processes)}

                </td>

            </tr>

        `;

    });

    $('#planned_work_order_report_tbody').html(
        html || `
            <tr>
                <td colspan="6" class="text-center text-muted p-4">
                    No Planned Work Orders Found.
                </td>
            </tr>
        `
    );
}

function renderWorkOrderSummary(processes) {

    let total = 0;
    let pending = 0;
    let completed = 0;

    processes.forEach(function (process) {

        (process.work_order_details || []).forEach(function (wo) {

            total += Number(wo.wo_qty || 0);
            pending += Number(wo.wo_pending_qty || 0);
            completed += Number(wo.wo_completed_qty || 0);

        });

    });

    let pendingPercent = total > 0
        ? (pending / total) * 100
        : 0;

    let completedPercent = total > 0
        ? (completed / total) * 100
        : 0;

    return `

        <div class="mb-3">

            <div class="d-flex justify-content-between mb-1">
                <strong>Work Order Qty</strong>
                <strong>${qty(total)}</strong>
            </div>

            <div class="progress" style="height:17px;">

                <div class="progress-bar bg-success"
                    style="width:${completedPercent}%">
                    ${completedPercent >= 15 ? qty(completed) : ''}
                </div>

                <div class="progress-bar bg-warning"
                    style="width:${pendingPercent}%">
                    ${pendingPercent >= 15 ? qty(pending) : ''}
                </div>

            </div>

            <div class="d-flex justify-content-between mt-2"
                style="font-size:11px;">

                <span class="text-success">
                    ● Completed: ${qty(completed)}
                </span>

                <span class="text-warning">
                    ● Pending: ${qty(pending)}
                </span>

            </div>

        </div>

        <div class="text-muted" style="font-size:11px;">
            ${processes.length} Processes
        </div>

    `;
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