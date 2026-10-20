
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


    get_work_order_report(0, 0);

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

    $("#bom_list").on("change", function () {
        $("#qty").val(0).trigger('focusout');

        var part_id = $(this).find(':selected').data("part_id");
        var component_cat = $(this).val();

        $('#bom_process').empty().append(`<option selected disabled value="">BOM Process</option>`)

        get_bom_process_details_summary1(part_id, component_cat);

    });

    $("#bom_process").on("change", function () {
        $("#qty").val(0).trigger('focusout');

        var production_process = $(this).find(':selected').data("process_id") || 0;
        get_work_order_report(production_process, $("#show_all").is(":checked") ? 1 : 0);
    });

    $("#show_all").on("change", function () {
        var production_process = $("#bom_process").find(':selected').data("process_id") || 0;
        if ($(this).is(":checked")) {
            get_work_order_report(production_process, 1);
        } else {
            get_work_order_report(production_process, 0);
        }
    });

    $("#dc_report_tbody").on("dblclick", "strong.strong, li.strong", function () {
        var process_id = Number($(this).attr("data-process_id")) || 0;
        console.log(process_id);

        if (process_id > 0) {
            get_work_order_report(
                process_id,
                $("#show_all").is(":checked") ? 1 : 0
            );
        }
    });

    $("#qty").on("focusout", function () {
        $(".modern_report").removeClass("d-none");
        $(".excel_report").addClass("d-none");

        var qty = $(this).val() ?? 0;
        var production_process = $("#bom_process").find(':selected').data("process_id") || 0;

        if (qty <= 0) {
            // salert("Warning", "Quantity Must Be Greater Than 0.", "warning");
            return;
        }

        if (production_process <= 0) {
            salert("Warning", "Select The Process.", "warning");
            return;
        }

        $(".modern_report").addClass("d-none");
        $(".excel_report").removeClass("d-none");
        get_real_process_summary_inputs1(production_process, qty);
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


});



function get_work_order_report(production_process, all) {

    $.ajax({
        url: "php/get_work_order_report.php",
        type: "get",
        data: {
            process_id: '',
            production_process: production_process,
            emp_id: current_user_id
        },
        success: function (response) {

            console.log(response);
            $("#dc_report_tbody").empty();

            if (response.trim() == '0 result') {
                $("#dc_report_tbody").append(`<tr><td colspan='8' class='text-center'>Nothing Found.</td></tr>`);
                return;
            }
            let data = JSON.parse(response);


            data.forEach((item, index) => {

                let woDetails = JSON.parse(item.work_order_details);

                let rowSpan = woDetails.length;

                let total_input_required_qty = parseFloat(item.total_input_required_qty) || 0;
                let total_stock_allocation_qty = parseFloat(item.total_stock_allocation_qty) || 0;
                let total_dc_qty = parseFloat(item.total_dc_qty) || 0;
                let total_transport_qty = parseFloat(item.total_transport_qty) || 0;
                let total_input_needed = parseFloat(item.total_input_needed) || 0;
                let total_internal_reserve_qty = parseFloat(item.total_internal_reserve_qty) || 0;

                let total_internal_reserve_qtyPer = total_input_required_qty > 0 ? (total_internal_reserve_qty / total_input_required_qty) * 100 : 0;

                let total_input_neededPer = total_input_required_qty > 0 ? (total_input_needed / total_input_required_qty) * 100 : 0;

                let total_stock_allocation_qtyPer = total_stock_allocation_qty > 0 ? (total_stock_allocation_qty / total_input_required_qty) * 100 : 0;

                let total_dc_qtyPer = total_dc_qty > 0 ? (total_dc_qty / total_input_required_qty) * 100 : 0;

                let total_transport_qtyPer = total_transport_qty > 0 ? (total_transport_qty / total_input_required_qty) * 100 : 0;


                woDetails.forEach((wo, woIndex) => {

                    // ===========================
                    // Work Order Details
                    // ===========================
                    let employeeHtml = "";
                    let createdDateHtml = "";
                    let ageHtml = "";
                    let workOrderNoHtml = "";


                    // ===========================
                    // for show all material filter
                    // ===========================
                    let isFullyReserved = wo.input_details.every(input => {
                        let required = parseFloat(input.required_qty) || 0;
                        let reserved = parseFloat(input.total_reserve_qty) || 0;

                        return required > 0 && reserved >= required;
                    });

                    if (isFullyReserved && all == 0) {
                        return; // Skip this work order row
                    }
                    // ===========================
                    // end for show all material filter
                    // ===========================

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
                                    ${workOrder.work_order_id ?? "-"}
                                </div><br><span class="badge ${workOrder.due_date_overdue == 0 ? 'bg-primary' : 'bg-danger'}">${workOrder.due_date ?? "-"}</span>
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
                                <span class="badge bg-light text-dark" title="Total Pending Process">${wo.total_pending_process}</span>
                                <span class="badge bg-warning text-dark" title="Total External Reserved">${wo.total_exreserve_qty}</span>
                                <span class="badge bg-success" title="Total Internal Reserved">${wo.total_internal_reserve_qty}</span>
                                <span class="badge bg-primary" title="Total Internal Stock Transfer">${wo.total_stock_allocation_qty}</span>
                                <span class="badge bg-dark" title="Total DC Reserved Qty">${wo.total_dc_qty ?? 0}</span>
                                <span class="badge bg-secondary" title="Total Transport Qty">${wo.total_transport_qty ?? 0}</span>
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
                        let dc_qty = parseFloat(input.dc_qty) || 0;
                        let transport_qty = parseFloat(input.transport_qty) || 0;
                        let reserved = parseFloat(input.total_reserve_qty) || 0;
                        let stock_transfer = parseFloat(input.stock_allocation_qty) || 0;
                        let external = parseFloat(input.ex_qty) || 0;
                        let needed = parseFloat(input.needed) || 0;

                        // Percentage calculations
                        let reservedPer = required > 0 ? (reserved / required) * 100 : 0;
                        let transport_qtyPer = required > 0 ? (transport_qty / required) * 100 : 0;
                        let dc_qtyPer = required > 0 ? (dc_qty / required) * 100 : 0;
                        let stock_transferPer = required > 0 ? (stock_transfer / required) * 100 : 0;
                        let neededPer = required > 0 ? (needed / required) * 100 : 0;
                        let externalPer = required > 0 ? (external / required) * 100 : 0;

                        // Prevent external bar from overflowing
                        externalPer = Math.min(externalPer, 100);

                        // Skip the entire row if fully internally reserved
                        if (required > 0 && reserved >= required && all == 0) {
                            return;
                        }

                        inputDetails += `

                            <li class="list-group-item px-2 py-2">

                                <strong class='strong' data-process_id="${input.previous_process_id}">${input.input_part_name}</strong>

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
                                    <div class="progress-bar progress-bar-striped bg-success"
                                        style="width:${reservedPer}%"
                                        title="Internal Reserved : ${reserved}">
                                        ${reserved > 0 ? reserved : ""}
                                    </div>

                                    <!-- Stock Transfer -->
                                    <div class="progress-bar progress-bar-striped bg-primary"
                                        style="width:${stock_transferPer}%"
                                        title="Internal Stock Transfer : ${stock_transfer}">
                                        ${stock_transfer > 0 ? stock_transfer : ""}
                                    </div>

                                    <!-- DC Qty -->
                                    <div class="progress-bar progress-bar-striped bg-dark text-white"
                                        style="width:${dc_qtyPer}%"
                                        title="DC Qty : ${dc_qty}">
                                        ${dc_qty > 0 ? dc_qty : ""}
                                    </div>

                                    <!-- Transport Qty -->
                                    <div class="progress-bar progress-bar-striped bg-secondary"
                                        style="width:${transport_qtyPer}%"
                                        title="Transport Qty : ${transport_qty}">
                                        ${transport_qty > 0 ? transport_qty : ""}
                                    </div>

                                    <!-- Needed -->
                                    <div class="progress-bar progress-bar-striped bg-danger"
                                        style="width:${neededPer}%"
                                        title="Needed : ${needed}">
                                        ${needed > 0 ? needed : ""}
                                    </div>

                                </div>

                                <!-- Stock Transfer -->
                                <small class="text-primary d-block mt-2">
                                    Internal Stock Transfer : ${input.stock_allocation_qty} 
                                </small>

                                <!-- External Reserve -->
                                <small class="text-muted d-block mt-2">
                                    External Availability 
                                </small>

                                <div class="progress" style="height:10px;">

                                    <div class="progress-bar progress-bar-striped bg-warning"
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

                                    ${woIndex === 0 ? ` <td rowspan="${rowSpan}" class="align-middle text-center">${index + 1}</td><td rowspan="${rowSpan}" class="align-middle text-center"><strong class='strong' data-process_id="${item.process_id}">${item.final_part}</strong> <span class="badge bg-primary input_godown_details_btn" data-final_part="${item.final_part}" data-process_name="${item.process_name}" data-godown_details=${encodeURIComponent(item.godown_details)} data-input_parts=${encodeURIComponent(item.input_parts)}>${item.process_name}</span></td>
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
                                                Total Required : ${total_input_required_qty}
                                            </div>

                                            <div class="progress" style="height:20px;">

                                                <div class="progress-bar bg-success"
                                                    style="width:${total_internal_reserve_qtyPer}%"
                                                    title="Total Reserved ${total_internal_reserve_qty}">
                                                    ${total_internal_reserve_qty}
                                                </div>

                                                <div class="progress-bar bg-primary"
                                                    style="width:${total_stock_allocation_qtyPer}%"
                                                    title="Total Stock Transfer ${total_stock_allocation_qty}">
                                                    ${total_stock_allocation_qty}
                                                </div>

                                                <div class="progress-bar bg-dark text-white"
                                                    style="width:${total_dc_qtyPer}%"
                                                    title="Total DC Qty ${total_dc_qty}">
                                                    ${total_dc_qty}
                                                </div>

                                                <div class="progress-bar bg-secondary"
                                                    style="width:${total_transport_qtyPer}%"
                                                    title="Total Transport Qty ${total_transport_qty}">
                                                    ${total_transport_qty}
                                                </div>

                                                <div class="progress-bar bg-danger"
                                                    style="width:${total_input_neededPer}%"
                                                    title="Total Needed ${total_input_needed}">
                                                    ${total_input_needed}
                                                </div>

                                            </div>

                                            <div class="d-flex justify-content-between small mt-1">
                                                <span class="text-success">
                                                    <i class="fas fa-check-circle"></i>
                                                    Reserved: ${total_internal_reserve_qty}
                                                </span>

                                                <span class="text-primary">
                                                    <i class="fas fa-check-circle"></i>
                                                    Stock Transfer: ${total_stock_allocation_qty}
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

function get_real_process_summary_inputs1(process_id, qty) {
    console.log(process_id, qty);


    $.ajax({
        url: "php/get_real_process_summary_inputs.php",
        type: "get",
        data: {
            process_id: process_id,
            qty_needed: qty
        },

        success: function (response) {

            console.log(response);

            if (typeof response !== "string") {
                response = JSON.stringify(response);
            }

            response = response.trim();

            if (response === "error") {
                salert("Error", "Server Error", "error");
                return;
            }

            const $tbody = $("#excel_need_material_tbody");
            $tbody.empty();

            if (response === "0 result") {
                $tbody.html(`
                    <tr>
                        <td colspan="4" class="text-center text-secondary py-4">
                            <i class="fa-solid fa-box-open fa-2x d-block mb-2"></i>
                            No materials found.
                        </td>
                    </tr>
                `);

                $("#excel_record_count").text("0");
                return;
            }

            let data;

            try {
                data = JSON.parse(response);
            } catch (error) {
                console.error("Invalid JSON:", response);
                salert("Error", "Invalid server response", "error");
                return;
            }

            if (!Array.isArray(data)) {
                salert("Error", "Unexpected server response", "error");
                return;
            }

            data.sort((a, b) =>
                Number(b.max_level || 0) - Number(a.max_level || 0)
            );

            let count = 0;
            let html = "";

            data.forEach(item => {

                if (Number(item.production_qty || 0) <= 0) {
                    return;
                }

                count++;

                html += `
                    <tr>
                        <td class="text-center text-secondary">${count}</td>

                        <td>
                            <span class="fw-semibold text-dark">
                                ${item.output_part_name ?? ""}
                            </span>
                        </td>

                        <td>
                            <span class="badge rounded-pill bg-light text-dark border">
                                ${item.process_name ?? ""}
                            </span>
                        </td>

                        <td class="text-end">
                            <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-2">
                                ${item.production_qty}
                            </span>
                        </td>
                    </tr>
                `;
            });

            if (count === 0) {
                html = `
                    <tr>
                        <td colspan="4" class="text-center text-secondary py-4">
                            No materials with a required quantity greater than zero.
                        </td>
                    </tr>
                `;
            }

            $tbody.html(html);
            $("#excel_record_count").text(count);
        }

    });

}

function get_bom_list1(part_id) {


    $.ajax({
        url: "php/get_bom_list_wel.php",
        type: "get", //send it through get method
        data: {
            part_id: part_id

        },
        success: function (response) {
            console.log(response);

            $('#bom_list').empty()

            if (response.trim() != "error") {

                if (response.trim() != "0 result") {


                    $("#bom_list").empty()
                    $("#bom_list").append("<option  value='0' disabled selected>Bom  List</option>")

                    var obj = JSON.parse(response);
                    var count = 0


                    obj.forEach(function (obj) {
                        count = count + 1;

                        $("#bom_list").append("<option value='" + obj.component_cat + "' data-part_id='" + obj.part_id + "' data-process_count='" + obj.process_count + "' data-bom_list='" + obj.bom_list + "'>" + obj.component_cat + "</option>")


                    });





                }
                else {
                    $('#bom_list_item').append("<li class='list-group-item'>No BOM Found</li>")

                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function get_bom_process_details_summary1(part_id, component_cat) {

    console.log(part_id, component_cat);


    $.ajax({
        // url: "php/get_bom.php",
        url: "php/get_bom_process_details_summary.php",
        type: "get", //send it through get method
        data: {
            part_id: part_id,
            component_cat: component_cat
        },
        success: function (response) {
            console.log(response);
            if (response.trim() != "error") {

                $('#bom_process').empty()
                $('#bom_process').append(`<option selected disabled value="">BOM Process</option>`)
                if (response.trim() != "0 result") {



                    var obj = JSON.parse(response);
                    var count = 0

                    obj.forEach(function (obj) {

                        count = count + 1;
                        $("#bom_process").append("<option value='" + obj.process_id + "' data-part_id='" + obj.output_part + "' data-component_cat='" + obj.component_cat + "' data-process_id='" + obj.process_id + "' data-process_title='" + obj.process_title + "' data-is_default='" + obj.is_default + "'>" + component_cat + "(" + obj.process_title + ")" + (obj.is_default > 0 ? "<span class='badge bg-primary blink'>Default</span>" : "") + "</option>")



                    });
                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
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