
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


    get_planner_report_summary();

    $('#part').on('input', function () {
        //check the value not empty
        $(this).removeData("part_id");
        $('#bom_process').empty().append(`<option selected disabled value="">BOM Process</option>`)
        $("#bom_list").empty().append("<option  value='0' disabled selected>Bom  List</option>")
        $("#qty").val(0).trigger('focusout');

        if ($('#part').val() != "") {
            $('#part').autocomplete({
                //get data from database return as array of object which contain label,value
                source: function (request, response) {
                    $.ajax({
                        url: "php/get_parts.php",
                        type: "get", //send it through get method
                        data: {

                            part: $('#part').val(),
                            term: '',

                        },
                        dataType: "json",
                        success: function (data) {
                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.part_name + "-" + item.part_no,
                                    value: item.part_name,
                                    id: item.part_id,
                                    part_no: item.part_no
                                };
                            }));
                        }
                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {
                    $(this).data("part_id", ui.item.id);
                    get_bom_list1(ui.item.id);
                },
            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.value + "</strong> - " + item.part_no + "</div>")
                    .appendTo(ul);
            };
        }
    });

    $("#excel_report_search").on("input", function () {

        const searchValue = $(this).val().trim().toLowerCase();
        let visibleCount = 0;

        $("#excel_need_material_tbody tr").each(function () {

            const rowText = $(this).text().toLowerCase();
            const matches = rowText.includes(searchValue);

            $(this).toggle(matches);

            if (matches && $(this).find("td").length === 4) {
                visibleCount++;
            }
        });

        // Show filtered count
        $("#excel_record_count").text(visibleCount);
    });


    $("#excel_download_btn").on("click", function () {

        if (typeof XLSX === "undefined") {
            salert("Error", "Excel library is not loaded.", "error");
            return;
        }

        const $rows = $("#excel_need_material_tbody tr:visible");
        const exportData = [
            ["S.No", "Part", "Process", "Needed Qty"]
        ];

        let serialNo = 0;

        $rows.each(function () {

            const $cells = $(this).find("td");

            // Skip empty-state rows
            if ($cells.length !== 4) {
                return;
            }

            serialNo++;

            exportData.push([
                serialNo,
                $cells.eq(1).text().trim(),
                $cells.eq(2).text().trim(),
                $cells.eq(3).text().trim()
            ]);
        });

        if (serialNo === 0) {
            salert("Warning", "No material records to export.", "warning");
            return;
        }

        // Read part and quantity fields
        const partName = ($("#part").val() || "part")
            .trim()
            .replace(/[\\/:*?"<>|]/g, "-")
            .replace(/\s+/g, " ");

        const qty = ($("#qty").val() || "0")
            .trim()
            .replace(/[\\/:*?"<>|]/g, "-");

        // Local date: YYYY_MM_DD
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");

        const date = `${yyyy}_${mm}_${dd}`;

        const filename = `${partName}_${qty}_qty_${date}.xlsx`;

        const worksheet = XLSX.utils.aoa_to_sheet(exportData);

        worksheet["!cols"] = [
            { wch: 10 },
            { wch: 35 },
            { wch: 25 },
            { wch: 18 }
        ];

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Material Report"
        );

        XLSX.writeFile(workbook, filename);
    });

    $("#production_plan_report_tbody").on('click', '.progress-segment', function () {

        let index = Number($(this).attr('data-plan'));
        let filter = $(this).attr('data-filter');

        let row = productionPlanData[index];

        if (!row) return;

        let detailRow = $('#production_detail_' + index);
        let detailContent = $('#production_detail_content_' + index);

        // If the same filter is clicked again, close the details
        if (
            detailRow.is(':visible') &&
            detailRow.attr('data-current-filter') === filter
        ) {
            detailRow.hide();
            return;
        }

        let demands = parseJSON(row.demand_details);

        // Render matching part details
        let detailsHtml = renderDemandDetails(demands, filter);

        detailContent.html(detailsHtml);

        detailRow.attr('data-current-filter', filter);

        // Close other expanded rows
        $('.detail-row').not(detailRow).hide();

        // Show selected details
        detailRow.show();

        // Scroll selected detail into view
        detailRow[0].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });

    });

});



function get_planner_report_summary() {

    $.ajax({
        url: "php/get_planner_report_summary.php",
        type: "get",
        data: {
        },
        success: function (response) {

            console.log("Original Response:", response);

            try {
                response = JSON.parse(response);

                console.log("Parsed Response:", response);
                console.log("Is Array:", Array.isArray(response));

                renderProductionPlanReport(response);

            } catch (e) {
                console.error("JSON Parsing Error:", e);
            }
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });

}


// HTML escape
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

// Safely parse JSON
function parseJSON(value) {
    if (Array.isArray(value)) return value;

    try {
        return typeof value === 'string' ? JSON.parse(value || '[]') : [];
    } catch (e) {
        return [];
    }
}

// Number formatting
function qty(value) {
    return Number(value || 0).toLocaleString('en-IN', {
        maximumFractionDigits: 2
    });
}

// Percentage
function percentage(value, total) {
    return total > 0 ? (value / total) * 100 : 0;
}

// Date formatting
function displayDate(date) {
    if (!date || date.startsWith('0000') || date === '00-00-0000') {
        return '-';
    }

    return escapeHTML(date);
}

function renderOrders(orders) {

    if (!orders.length) {
        return '<span class="no-data">No orders</span>';
    }

    return orders.map(function (order) {

        return `
            <div class="order-item">
                <div class="order-heading">
                    Order #${escapeHTML(order.order_no)}
                </div>

                <div class="info-line">
                    <strong>Customer:</strong>
                    ${escapeHTML(order.cus_name)}
                </div>

                <div class="info-line">
                    <strong>Employee:</strong>
                    ${escapeHTML(order.emp_name)}
                </div>

                <div class="info-line">
                    <strong>Quantity:</strong>
                    ${qty(order.required_qty || order.sof_re_qty)}
                    &nbsp; | &nbsp;
                    <strong>Type:</strong>
                    ${escapeHTML(order.order_category)}
                </div>

                <div class="info-line">
                    <strong>Commit:</strong>
                    ${displayDate(order.commitment_date)}
                </div>
            </div>
        `;

    }).join('');
}

function renderGodowns(demands) {

    let godowns = new Set();

    demands.forEach(function (demand) {

        let workOrders = demand.work_orders || [];

        workOrders.forEach(function (wo) {

            if (wo.wo_godown_name) {
                godowns.add(wo.wo_godown_name);
            }

        });

    });

    if (!godowns.size) {
        return '<span class="no-data">Not assigned</span>';
    }

    return [...godowns].map(function (name) {

        return `
            <div class="godown-item">
                <i class="bi bi-building"></i>
                ${escapeHTML(name)}
            </div>
        `;

    }).join('');
}

function renderProgressBars(row, index) {

    let demand = Number(row.sum_demand_qty || 0);
    let unassigned = Number(row.sum_remaining_unassigned_qty || 0);

    // Derived assigned quantity
    let assigned = Math.max(0, demand - unassigned);

    let woTotal = Number(row.sum_total_wo_qty || 0);
    let woPending = Number(row.sum_total_wo_pending_qty || 0);
    let woCompleted = Number(row.sum_total_wo_completed_qty || 0);

    let assignedPercent = percentage(assigned, demand);
    let unassignedPercent = percentage(unassigned, demand);

    let completedPercent = percentage(woCompleted, woTotal);
    let pendingPercent = percentage(woPending, woTotal);

    return `

        <!-- Demand Allocation -->

        <div class="summary-block">

            <div class="summary-heading">
                <span>Demand Allocation</span>
                <span class="summary-total">${qty(demand)} Qty</span>
            </div>

            <div class="progress">

                <button type="button"
                    class="progress-segment assigned-segment"
                    style="width:${assignedPercent}%"
                    title="Assigned: ${qty(assigned)}"
                    data-plan="${index}"
                    data-filter="assigned">
                    ${assignedPercent >= 15 ? qty(assigned) : ''}
                </button>

                <button type="button"
                    class="progress-segment unassigned-segment"
                    style="width:${unassignedPercent}%"
                    title="Unassigned: ${qty(unassigned)}"
                    data-plan="${index}"
                    data-filter="unassigned">
                    ${unassignedPercent >= 15 ? qty(unassigned) : ''}
                </button>

            </div>

            <div class="summary-legend">

                <span>
                    <i class="legend-dot" style="background:#198754"></i>
                    Assigned: ${qty(assigned)}
                </span>

                <span>
                    <i class="legend-dot" style="background:#f59e0b"></i>
                    Unassigned: ${qty(unassigned)}
                </span>

            </div>

        </div>


        <!-- Work Order Progress -->

        <div class="summary-block">

            <div class="summary-heading">
                <span>Work Order Progress</span>
                <span class="summary-total">${qty(woTotal)} Qty</span>
            </div>

            <div class="progress">

                <button type="button"
                    class="progress-segment completed-segment"
                    style="width:${completedPercent}%"
                    title="Completed: ${qty(woCompleted)}"
                    data-plan="${index}"
                    data-filter="completed">
                    ${completedPercent >= 15 ? qty(woCompleted) : ''}
                </button>

                <button type="button"
                    class="progress-segment pending-segment"
                    style="width:${pendingPercent}%"
                    title="Pending: ${qty(woPending)}"
                    data-plan="${index}"
                    data-filter="pending">
                    ${pendingPercent >= 15 ? qty(woPending) : ''}
                </button>

            </div>

            <div class="summary-legend">

                <span>
                    <i class="legend-dot" style="background:#0d9488"></i>
                    Completed: ${qty(woCompleted)}
                </span>

                <span>
                    <i class="legend-dot" style="background:#64748b"></i>
                    Pending: ${qty(woPending)}
                </span>

            </div>

        </div>

    `;
}

function renderDemandDetails(demands, filter) {

    let filtered = demands.filter(function (d) {

        switch (filter) {
            case 'assigned':
                return Number(d.total_wo_qty) > 0;

            case 'unassigned':
                return Number(d.remaining_unassigned_qty) > 0;

            case 'pending':
                return Number(d.total_wo_pending_qty) > 0;

            case 'completed':
                return Number(d.total_wo_completed_qty) > 0;

            default:
                return true;
        }

    });

    if (!filtered.length) {
        return `
            <div class="text-center text-muted p-3">
                No matching production parts found.
            </div>
        `;
    }

    let headings = {
        assigned: 'Assigned Parts',
        unassigned: 'Unassigned Parts',
        pending: 'Pending Work Order Parts',
        completed: 'Completed Work Order Parts'
    };

    let html = `
        <div class="detail-container">

            <div class="detail-header">
                <span>
                    ${headings[filter]}
                </span>

                <span>
                    ${filtered.length} Parts
                </span>
            </div>

            <div class="table-responsive">

                <table class="table table-bordered table-sm part-table">

                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Part Details</th>
                            <th>Process</th>
                            <th>Demand Qty</th>
                            <th>Assigned Qty</th>
                            <th>Pending Qty</th>
                            <th>Completed Qty</th>
                            <th>Unassigned Qty</th>
                            <th>Work Order Details</th>
                        </tr>
                    </thead>

                    <tbody>
    `;

    filtered.forEach(function (d, i) {

        let workOrders = d.work_orders || [];

        let woHtml = workOrders.length
            ? workOrders.map(function (wo) {

                return `
                    <div class="wo-item">

                        <strong>WO #${escapeHTML(wo.work_order_id)}</strong>

                        <div>
                            Qty: ${qty(wo.wo_qty)}
                            |
                            Pending: ${qty(wo.wo_pending_qty)}
                        </div>

                        <div>
                            ${escapeHTML(wo.wo_godown_name || '-')}
                        </div>

                        <div>
                            ${escapeHTML(wo.wo_dep_name || '-')}
                            /
                            ${escapeHTML(wo.wo_sec_name || '-')}
                        </div>

                        <div>
                            Due: ${displayDate(wo.due_date)}
                        </div>

                    </div>
                `;

            }).join('')
            : '<span class="no-data">No work orders</span>';

        html += `
            <tr>

                <td>${i + 1}</td>

                <td>
                    <strong>${escapeHTML(d.final_part)}</strong>

                    <div class="info-line">
                        Part ID: ${escapeHTML(d.final_part_id)}
                        |
                        Demand ID: ${escapeHTML(d.demand_id)}
                    </div>
                </td>

                <td>
                    ${escapeHTML(d.process_name || '-')}
                </td>

                <td>
                    <span class="qty-badge qty-info">
                        ${qty(d.demand_qty)}
                    </span>
                </td>

                <td>
                    <span class="qty-badge qty-success">
                        ${qty(d.total_wo_qty)}
                    </span>
                </td>

                <td>
                    <span class="qty-badge qty-warning">
                        ${qty(d.total_wo_pending_qty)}
                    </span>
                </td>

                <td>
                    <span class="qty-badge qty-success">
                        ${qty(d.total_wo_completed_qty)}
                    </span>
                </td>

                <td>
                    <span class="qty-badge qty-warning">
                        ${qty(d.remaining_unassigned_qty)}
                    </span>
                </td>

                <td style="min-width:200px;">
                    ${woHtml}
                </td>

            </tr>
        `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    return html;
}

function renderProductionPlanReport(response) {
    // Parse JSON if response is a string
    if (typeof response === 'string') {
        try {
            response = JSON.parse(response);
        } catch (e) {
            console.error("Invalid JSON response:", response);
            return;
        }
    }

    // Identify the actual array
    if (Array.isArray(response)) {
        productionPlanData = response;

    } else if (Array.isArray(response?.data)) {
        productionPlanData = response.data;

    } else if (Array.isArray(response?.result)) {
        productionPlanData = response.result;

    } else if (Array.isArray(response?.records)) {
        productionPlanData = response.records;

    } else if (Array.isArray(response?.data?.data)) {
        productionPlanData = response.data.data;

    } else if (response && typeof response === 'object' && response.product) {
        productionPlanData = [response];

    } else {

        console.error("Unable to identify production plan array:", response);

        $('#production_plan_report_tbody').html(`
            <tr>
                <td colspan="7" class="text-center text-danger p-4">
                    Invalid production plan response.
                </td>
            </tr>
        `);

        return;
    }

    let html = '';

        productionPlanData.forEach(function (row, index) {

        let orders = parseJSON(row.order_details);
        let demands = parseJSON(row.demand_details);

        html += `

            <tr class="production-main-row">

                <!-- Serial Number -->

                <td class="text-center">
                    <strong>${index + 1}</strong>
                </td>


                <!-- Product Details -->

                <td style="min-width:150px;">

                    <div class="product-title">
                        ${escapeHTML(row.product)}
                    </div>

                    <div class="info-line">
                        Model:
                        <strong>${escapeHTML(row.model_name)}</strong>
                    </div>

                    <div class="info-line">
                        Type:
                        <strong>${escapeHTML(row.type_name)}</strong>
                    </div>

                    <div class="info-line">
                        Sub Type:
                        <strong>${escapeHTML(row.sub_type)}</strong>
                    </div>

                </td>


                <!-- Created By & Planner -->

                <td style="min-width:130px;">

                    <div>
                        <i class="bi bi-person-circle"></i>
                        <strong>${escapeHTML(row.pp_created_by_name)}</strong>
                    </div>

                    <div class="info-line">
                        Plan Date:
                        ${displayDate(row.production_plan_date)}
                    </div>

                    <span class="planner-id">
                        Planner ID: ${escapeHTML(row.planner_id)}
                    </span>

                </td>


                <!-- Order Details -->

                <td style="min-width:200px;">

                    ${renderOrders(orders)}

                </td>


                <!-- Godown Details -->

                <td style="min-width:150px;">

                    ${renderGodowns(demands)}

                </td>


                <!-- Commit Date & Request Count -->

                <td style="min-width:130px;">

                    <div class="commit-date">
                        ${displayDate(row.approx_commit_date)}
                    </div>

                    <span class="request-count">
                        <i class="bi bi-clipboard-check"></i>
                        ${qty(row.production_request_count)} Requests
                    </span>

                </td>


                <!-- Total Input Summary -->

                <td style="min-width:300px;">

                    ${renderProgressBars(row, index)}

                </td>

            </tr>

            <!-- Expandable Part Details -->

            <tr class="detail-row"
                id="production_detail_${index}"
                style="display:none;">

                <td colspan="7" id="production_detail_content_${index}">

                </td>

            </tr>

        `;

    });

    $('#production_plan_report_tbody').html(
        html || `
            <tr>
                <td colspan="7" class="text-center text-muted p-4">
                    No production plans found.
                </td>
            </tr>
        `
    );
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