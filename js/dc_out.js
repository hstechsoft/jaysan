
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
let allBomData = [];

let historyQueue = [];
let currentIndex = 0;
let output_qty = 0;

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


    $(".part_search").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        $("#available_part_tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    check_login();

    $("#unamed").text(localStorage.getItem("ls_uname"))


    $('#godown').on('input', function () {
        $(this).removeData("godown_id");

        //check the value not empty
        if ($('#godown').val() != "") {
            $('#godown').autocomplete({
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
                    get_company_dc(ui.item.id);


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $("#same_as").on("change", function () {
        if ($(this).is(":checked")) {
            $("#ship_to").val($("#godown").val());
        } else {
            $("#ship_to").val('');
        }
    })

    $('#from_godown').on('input', function () {
        $(this).removeData("from_godown_id");

        //check the value not empty
        if ($('#from_godown').val() != "") {
            $('#from_godown').autocomplete({
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

                    $(this).data("from_godown_id", ui.item.id);


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $("#available_part_tbody").on("click", ".add_btn", function () {

        let process_id = $(this).parent().parent().find(".process_select").val();
        let godown_id = $('#godown').data("godown_id");
        let f_godown_id = $('#from_godown').data("from_godown_id");
        let output_qty = $(this).parent().parent().find(".output_qty").val();

        if (process_id == null || process_id == "") {
            salert("Warning", "Please select process", "warning");
        }
        else if (godown_id == null || godown_id == "") {
            salert("Warning", "Please select Vendor", "warning");
        }
        else if (f_godown_id == null || f_godown_id == "") {
            salert("Warning", "Please select From Godown", "warning");
        }
        else {
            $(this).parent().parent().find(".process_select").prop("disabled", true);
            $(this).prop("disabled", true);
            $('html, body').animate({
                scrollTop: 0
            }, 500);

            get_parts_dc(process_id, godown_id, f_godown_id, output_qty);
        }


    });

    function val(v) {
        return (v === null || v === undefined || v === "null") ? "-" : v;
    }

    function num(v) {
        return (v === null || v === undefined || v === "" || isNaN(v)) ? 0 : v;
    }

    function parseJsonDeep(data) {

        while (typeof data === "string") {
            try {
                data = JSON.parse(data);
            } catch (e) {
                break;
            }
        }

        return data;
    }

    $("#selected_part_tbody").on("click", ".History_btn", function () {

        let row = $(this).closest("tr");
        let stock_reserve_details = $(this).data("stock_reserve_details");
        let work_time_details = $(this).data("work_time_details");
        let part_name = $(this).data("part_name");
        let output_part_name = $(this).data("output_part_name");
        let output_part_qty = $(this).data("output_part_qty");
        let need_qty = $(this).data("need_qty");

        $("#stock_qty_add_btn").data("row", row);

        $("#stock_reserve_modal .modal-title").text(`Stock Reserve & Work Time Details - ${part_name}`);

        $("#stock_reserve_modal").modal("show");

        $("#stock_reserve_accordion").empty();
        $("#work_time_accordion").empty();
        $(".out_stock").empty();

        // ==========================================
        // STOCK RESERVE ACCORDION
        // ==========================================

        let stockData = parseJsonDeep(stock_reserve_details);

        $(".out_stock").append(`<strong class='text-secodary small'>${output_part_name} <span class='float-end badge bg-success'>${output_part_qty} - Qty</span></strong>`);

        let firstEligibleFound = false;

        if (Array.isArray(stockData)) {

            stockData.forEach(function (item, index) {

                let reserveBody = "";

                // Check if current row should be disabled
                let isDisabled = (item.same_des_godown == 1 || item.godown == 1233);

                // Determine value
                let qtyValue = 0;

                if (!isDisabled && !firstEligibleFound) {
                    qtyValue = need_qty;
                    firstEligibleFound = true;
                }

                if (item.reserve_details && item.reserve_details.length > 0) {

                    item.reserve_details.forEach(function (reserve) {

                        reserveBody += `
                            <div class="reserve-type-card">

                                <div class="reserve-type-header">
                                    ${val(reserve.reserve_type).toUpperCase()}
                                </div>

                                <div class="p-2">

                                    <table class="table table-sm table-bordered mb-0" ${item.reserve_qty == 0 ? 'disabled' : ''}>
                                        <thead>
                                            <tr>
                                                <th>Type ID</th>
                                                <th>Qty</th>
                                                <th>Reserve ID</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                            `;

                        if (reserve.reserve_details && reserve.reserve_details.length > 0 && item.reserve_qty > 0) {

                            reserve.reserve_details.forEach(function (detail) {

                                reserveBody += `
                                    <tr>
                                        <td>${val(reserve.reserve_type)}</td>
                                        <td>${num(detail.reserve_qty)}</td>
                                        <td>${num(detail.reserve_id)}</td>
                                    </tr>
                                    `;
                            });
                        }
                        else {
                            reserveBody += `<tr><td colspan='3'><div class="text-danger text-center">No Reserve Details Available</div></td></tr>`;
                        }

                        reserveBody += `
                            </tbody>
                        </table>

                    </div>

                </div>`;
                    });
                }

                $("#stock_reserve_accordion").append(`

                                    <div class="accordion-item">

                                        <h2 class="accordion-header">

                                            <button class="accordion-button collapsed"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#stockReserve${index}">

                                                <div class="w-100">

                                                    <div class="row align-items-center">

                                                        <div class="col-md-6 text-start">
                                                            <small class="text-muted">Godown</small><br>
                                                            <span class="fw-semibold small">
                                                                ${val(item.godown_name)}
                                                            </span>
                                                        </div>

                                                        <div class="col-2 text-center">
                                                            <small class="text-muted">Stock</small><br>
                                                            <span class="badge bg-primary">
                                                                ${num(item.qty)}
                                                            </span>
                                                        </div>

                                                        <div class="col-2 text-center">
                                                            <small class="text-muted">Reserved</small><br>
                                                            <span class="badge bg-warning text-dark">
                                                                ${num(item.reserve_qty)}
                                                            </span>
                                                        </div>

                                                        <div class="col-2 text-center">
                                                            <input type="number"
                                                                class="form-control form-control-sm rounded-3"
                                                                value="${qtyValue}"
                                                                ${isDisabled ? "disabled" : ""}
                                                                id="allo_qty"
                                                                data-stock_id="${item.stock_id}"
                                                                placeholder="Qty">
                                                        </div>

                                                    </div>

                                                </div>

                                            </button>

                                        </h2>

                                        <div id="stockReserve${index}"
                                            class="accordion-collapse collapse"
                                            data-bs-parent="#stock_reserve_accordion">

                                            <div class="accordion-body">

                                                ${reserveBody}

                                            </div>

                                        </div>

                                    </div>`
                );
            });
        }

        // ==========================================
        // WORK TIME ACCORDION
        // ==========================================

        let workData = parseJsonDeep(work_time_details);

        if (Array.isArray(workData)) {

            workData.forEach(function (item, index) {

                $("#work_time_accordion").append(`

                <div class="accordion-item">

                    <h2 class="accordion-header">

                        <button class="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#workTime${index}">

                            <div class="w-100">

                                <div class="row align-items-center">

                                    <div class="col-md-8 text-start">

                                        <small class="text-muted">
                                            Godown
                                        </small><br>

                                        <span class="fw-semibold">
                                            ${val(item.godown_name)}
                                        </span>

                                    </div>

                                    <div class="col-2 text-center">

                                        <small class="text-muted">
                                            Min
                                        </small><br>

                                        <span class="badge bg-success">
                                            ${num(item.min_time)}
                                        </span>

                                    </div>

                                    <div class="col-2 text-center">

                                        <small class="text-muted">
                                            Max
                                        </small><br>

                                        <span class="badge bg-danger">
                                            ${num(item.max_time)}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </button>

                    </h2>

                    <div id="workTime${index}"
                         class="accordion-collapse collapse"
                         data-bs-parent="#work_time_accordion">

                        <div class="accordion-body">

                            <div class="row g-2">

                                <div class="col-md-3">
                                    <div class="info-card">
                                        <small class="text-muted">Cost</small><br>
                                        <b>${num(item.cost)}</b>
                                    </div>
                                </div>

                                <div class="col-md-3">
                                    <div class="info-card">
                                        <small class="text-muted">Default</small><br>
                                        <b>${item.is_default === 1 ? 'Yes' : 'No'}</b>
                                    </div>
                                </div>

                                <div class="col-md-3 d-none">
                                    <div class="info-card">
                                        <small class="text-muted">WT ID</small><br>
                                        <b>${num(item.wtid)}</b>
                                    </div>
                                </div>

                                <div class="col-md-3">
                                    <div class="info-card">
                                        <small class="text-muted">Department</small><br>
                                        <b>${val(item.dep_name)}</b>
                                    </div>
                                </div>

                                <div class="col-md-3">
                                    <div class="info-card">
                                        <small class="text-muted">Section</small><br>
                                        <b>${val(item.sec_name)}</b>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>`);
            });
        }

    });

    $("#selected_part_tbody").on("change", ".form-check-input", function () {

        let row = $(this).closest("tr");

        let qtyInput = row.find(".qty_input");
        let rateInput = row.find(".rate_input");

        if ($(this).is(":checked")) {

            qtyInput.prop("disabled", false);
            rateInput.prop("disabled", false);

        } else {
            var amount = parseFloat(row.find(".amount_td").text()) || 0;
            var total_amount = parseFloat($(".total_amount").data("amount")) || 0;

            total_amount -= amount;
            $(".total_amount").data("amount", total_amount);
            $(".total_amount").text("₹" + Number(total_amount.toFixed(2)).toLocaleString("en-IN"));

            qtyInput.prop("disabled", true);
            rateInput.prop("disabled", true);

            rateInput.val(0);
            row.find(".amount_td").text("0");
        }

    });

    $("#selected_part_tbody").on("focusout", ".qty_input, .rate_input", function () {

        let row = $(this).closest("tr");
        let total_amount = parseFloat($(".total_amount").data("amount")) || 0;
        let amount = parseFloat(row.find(".amount_td").text()) || 0;

        total_amount -= amount;
        $(".total_amount").data("amount", total_amount);

        let qty = parseFloat(row.find(".qty_input").val()) || 0;
        let rate = parseFloat(row.find(".rate_input").val()) || 0;

        amount = qty * rate;
        row.find(".amount_td").text(amount.toFixed(2));
        total_amount += amount;

        $(".total_amount").data("amount", total_amount);
        $(".total_amount").text("₹" + Number(total_amount.toFixed(2)).toLocaleString("en-IN"));

    }
    );

    $("#stock_qty_add_btn, .modal_close_btn").on("click", function () {

        let row = $("#stock_qty_add_btn").data("row");

        console.log(row);


        var stock_id_qty = [];
        // var qty_cou = [];
        var qty = 0;

        $("#stock_reserve_accordion button").each(function () {

            // alert()
            var enter_qty = Number($(this).find("#allo_qty").val());

            if (enter_qty > 0) {
                qty += enter_qty;

                stock_id_qty.push({ stock_id: $(this).find("#allo_qty").data("stock_id"), qty: enter_qty });
                // qty_cou.push(enter_qty);
            }
        })

        console.log(stock_id_qty);

        row.find("td").eq(4).find("input").data("stock_id_qty", stock_id_qty);
        row.find("td").eq(4).find("input").val(qty);


        currentIndex++;

        processNextPart();
    })




    $("#add_to_table").on("click", function () {

        let godown_id = $('#godown').data("godown_id");
        let bill_to = $('#godown').val();
        let from_godown_id = $('#from_godown').data("from_godown_id");
        let ship_to = $('#ship_to').val();
        let dc_no = $("#dc_no").val();
        let dc_date = $("#dc_date").val();
        let transport_mode = $("#transport_mode").val();
        let vehicle_type = $("#vehicle_type").val();
        let vehicle_no = $("#vehicle_no").val() || '';
        let driver_name = $("#driver_name").val() || '';
        let contact_no = $("#contact_no").val() || '';
        let vehicle_description = $("#vehicle_description").val() || '';
        let e_invoice = $("#e_invoice").val() || '';
        let mode_of_payment = $("#mode_of_payment").val() || '';
        let supplier_ref_order_no = $("#supplier_ref_order_no").val() || '';
        let dispatch_doc_no = $("#dispatch_doc_no").val() || '';
        let dispatched_through = $("#vehicle_type").val() || '';
        let date_time_of_issue = $("#date_time_of_issue").val() || '';
        let duration_of_process = $("#duration_of_process").val() || '';
        let nature_of_processing = $("#nature_of_processing").val() || '';
        let challan_no = $("#challan_no").val() || '';

        let emp_id = current_user_id;
        let dc_type = "dc";

        let transport_godown = null;

        let parts = [];
        let dc_parts_location = [];
        let dc_process = [];

        $("#selected_part_tbody tr").each(function () {

            let part_name = $(this).find("td").eq(0).text();
            let part_id = $(this).data("part_id");
            let part_pre_process_id = $(this).data("in_previous_process_id");
            let process_name = $(this).find("td").eq(1).text();
            let process_id = $(this).data("process_id");
            let qty = parseFloat($(this).find(".qty_input").val()) || 0;
            // let reserve_qty = $(this).find(".qty_input").data("qty_cou");
            let stock_id_qty = $(this).find(".qty_input").data("stock_id_qty");
            let rate = parseFloat($(this).find(".rate_input").val()) || 0;
            let amount = parseFloat($(this).find(".amount_td").text()) || 0;
            let is_checked = $(this).find(".form-check-input").is(":checked");

            console.log(stock_id_qty);

            if (is_checked) {
                parts.push({
                    part_id: part_id,
                    part_pre_process_id: part_pre_process_id,
                    qty: qty,
                    rate: rate,
                });
                stock_id_qty.forEach(item => {
                    dc_parts_location.push({
                        emp_id: emp_id,
                        stock_id: item.stock_id,
                        qty: item.qty
                    });
                });

                let existing = dc_process.find(item => item.process_id == process_id);

                if (existing) {
                    existing.qty += qty;
                } else {
                    dc_process.push({
                        process_id: process_id,
                        qty: qty,
                        rate: 0
                    });
                }
            }
        });

        if (parts.length == 0) {
            salert("Warning", "Please select at least one part", "warning");
            return;
        }

        if (dc_process.length == 0) {
            salert("Warning", "Process Data Missing", "warning");
            return;
        }

        if (dc_parts_location.length == 0) {
            salert("Warning", "Part Location Missing", "warning");
            return;
        }

        if (!dc_date || !dc_no) {
            salert("Warning", "Enter DC/No And DC Date", "warning");
            return;
        }

        console.log(dc_no, dc_date, transport_mode, vehicle_description, vehicle_no, driver_name, contact_no, mode_of_payment, supplier_ref_order_no, dispatch_doc_no, dispatched_through, date_time_of_issue, duration_of_process, nature_of_processing, challan_no, emp_id, dc_type, from_godown_id, godown_id, bill_to, ship_to, transport_godown, parts, dc_parts_location, dc_process);


        insert_delivery_challan(dc_no, dc_date, transport_mode, vehicle_description, vehicle_no, driver_name, contact_no, mode_of_payment, supplier_ref_order_no, dispatch_doc_no, dispatched_through, date_time_of_issue, duration_of_process, nature_of_processing, challan_no, emp_id, dc_type, from_godown_id, godown_id, bill_to, ship_to, transport_godown, JSON.stringify(parts), JSON.stringify(dc_parts_location), JSON.stringify(dc_process));
    })

    $("#transport_modal_btn").on("click", function () {
        get_transport_all();
    })
});


function processNextPart() {

    if (currentIndex >= historyQueue.length) {
        return;
    }

    let data = historyQueue[currentIndex];

    console.log(data.item)
    let row = $(`
        <tr data-in_previous_process_id='${data.part.in_previous_process_id}' data-part_id='${data.part.part_id}' data-process_id='${data.item.process_id}'>
            <td>${data.part.part_name}</td>
            <td>${data.item.process_name}</td>
            <td>${data.part.total_stock_qty ?? 0}</td>
            <td>${data.part.reserved_qty ?? 0}</td>

            <td>
                <input type="number"
                    class="form-control form-control-sm qty_input"
                    value="${parseFloat(data.part.qty) * output_qty}" >
            </td>

            <td>
                <input type="number"
                    class="form-control form-control-sm rate_input"
                    value="0" >
            </td>

            <td class="amount_td">0</td>

            <td>
                <input type="checkbox" checked class="form-check-input">

                <button
                    type="button"
                    class="btn btn-secondary btn-sm History_btn "
                    data-stock_reserve_details='${JSON.stringify(data.part.stock_reserve_details)}'
                    data-work_time_details='${JSON.stringify(data.item.work_time_details)}'
                    data-part_name='${data.part.part_name}'
                    data-output_part_name='${data.item.out_part_name}'
                    data-output_part_qty='${data.item.out_part_qty}'
                    data-need_qty='${parseFloat(data.part.qty) * output_qty}'>
                    <i class="fas fa-clock"></i>
                </button>
            </td>
        </tr>
    `);

    $("#selected_part_tbody").append(row);
    setTimeout(function () {
        row.find(".History_btn").trigger("click");
    }, 800);
}

function get_parts_dc(process_id, godown_id, f_godown_id, output_qtyy) {

    console.log(process_id, godown_id, f_godown_id, output_qtyy);

    $.ajax({
        url: "php/get_parts_dc.php",
        type: "get", //send it through get method
        data: {

            godown_id: f_godown_id,
            process_id: process_id,
            dest_godown_id: godown_id
        },
        success: function (response) {
            console.log(response);



            if (response.trim() != "error") {

                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);

                    historyQueue = [];
                    currentIndex = 0;
                    output_qty = parseFloat(output_qtyy) || 0;

                    obj.forEach(function (item) {

                        if (item.part_details != null && item.part_details != "" && item.has_godown == "1") {

                            let part_details = JSON.parse(item.part_details);

                            part_details.forEach(function (part) {

                                historyQueue.push({
                                    item: item,
                                    part: part
                                });

                            });
                        }
                    });

                    if (historyQueue.length <= 0) {
                        salert("Warning", "The Parts For Process Are Not Mapped To the From Godown You Selected.", "warning");
                        return;
                    }
                    processNextPart();
                }
                else {
                    salert("Warning", "No Data Found ", "warning");
                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function get_company_dc(godown_id) {

    $.ajax({
        url: "php/get_company_dc.php",
        type: "get", //send it through get method
        data: {

            godown_id: godown_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() != "error") {
                $("#available_part_tbody, #selected_part_tbody").empty();

                if (response.trim() != "0 result") {

                    var obj = JSON.parse(response);
                    var count = 0;

                    obj.forEach(function (item) {

                        count++;

                        let process_title = `<select class="form-select form-select-sm process_select"><option value="" disabled selected>Select Process</option>`;

                        if (item.process_details != null && item.process_details != "") {

                            let process_details = JSON.parse(item.process_details);

                            process_details.forEach(function (process) {

                                process_title += `<option value="${process.process_id}" data-is_default="${process.is_default}">${process.process_title}</option>`;

                            });

                        } else {

                            process_title += `<option value="" data-is_default="0">No Process</option>`;

                        }

                        process_title += `</select>`;

                        $("#available_part_tbody").append(`<tr><td>${count}</td><td>${item.part_name}</td><td>${process_title}</td><td><input type="number" class="form-control form-control-sm output_qty" value="1"></td><td>
                    <button type="button" class="btn btn-primary btn-sm add_btn" data-part="${item.part_name}" data-output_part="${item.output_part}" data-cat="${item.cat}" data-component_cat="${item.component_cat}" data-part_name="${item.part_name}">Add</button></td></tr>`);

                    });

                }
                else {
                    salert("Warning", "No DC Found for this Vendor ", "warning");
                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function insert_delivery_challan(dc_no, dc_date, transport_mode, transport_des, vehicle_no, driver_name, driver_contact, mode_of_payment, supplier_ref_order_no, dispatch_doc_no, dispatched_through, date_time_of_issue, duration_of_process, nature_of_processing, challan_no, emp_id, dc_type, dc_from, dc_to, bill_to, ship_to, transport_godown, dc_parts, dc_parts_location, dc_process) {

    $.ajax({
        url: "php/insert_delivery_challan.php",
        type: "post", //send it through get method
        data: {

            dc_no: dc_no,
            dc_date: dc_date,
            transport_mode: transport_mode,
            transport_des: transport_des,
            vehicle_no: vehicle_no,
            driver_name: driver_name,
            driver_contact: driver_contact,
            mode_of_payment: mode_of_payment,
            supplier_ref_order_no: supplier_ref_order_no,
            dispatch_doc_no: dispatch_doc_no,
            dispatched_through: dispatched_through,
            date_time_of_issue: date_time_of_issue,
            duration_of_process: duration_of_process,
            nature_of_processing: nature_of_processing,
            challan_no: challan_no,
            emp_id: emp_id,
            dc_type: dc_type,
            dc_from: dc_from,
            dc_to: dc_to,
            bill_to: bill_to,
            ship_to: ship_to,
            transport_godown: 1166,
            dc_parts: dc_parts,
            dc_parts_location: dc_parts_location,
            dc_process: dc_process,
        },
        success: function (response) {
            console.log(response);

            console.log(response.status);
            console.log('http://localhost/jaysan/' + response.download_url);

            if (response.status == 'ok') {

                window.open(
                    'http://localhost/jaysan/' + response.download_url, '_blank'
                );

            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function get_transport_all(godown_id) {

    $.ajax({
        url: "php/get_transport_parts_all.php",
        type: "get", //send it through get method
        data: {

            transport_godown: 1233,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() != "error") {
                $(".dc_details").empty();
                if (response.trim() != "0 results") {
                    $("#transport_modal").modal('show');

                    var obj = JSON.parse(response);
                    var count = 0;

                    obj.forEach(function (item, index) {

                        let parts = JSON.parse(item.parts);
                        let stock_id_qty = [];

                        let html = `
                                    <div class="accordion mb-2" id="dcAccordion${index}">
                                        <div class="accordion-item border shadow-sm">

                                            <h2 class="accordion-header" id="heading${index}">
                                                <button class="accordion-button collapsed py-2 px-3"
                                                        type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target="#collapse${index}">

                                                    <div class="w-100 d-flex justify-content-between align-items-center me-2">

                                                        <div>
                                                            <strong>DC #${item.dc_no}</strong>
                                                            <span class="badge bg-primary ms-2">
                                                                ${item.reserve_type.toUpperCase()}
                                                            </span>
                                                        </div>

                                                        <small class="text-muted">
                                                            ${item.bill_to}
                                                        </small>

                                                    </div>
                                                </button>
                                            </h2>

                                            <div id="collapse${index}"
                                                class="accordion-collapse collapse"
                                                data-bs-parent="#dcAccordion${index}">

                                                <div class="accordion-body p-2">

                                                    <div class="row g-2 mb-2">
                                                        <div class="col-6">
                                                            <small class="text-muted">Bill To</small>
                                                            <div class="fw-semibold small">${item.bill_to}</div>
                                                        </div>

                                                        <div class="col-6">
                                                            <small class="text-muted">Ship To</small>
                                                            <div class="fw-semibold small">${item.ship_to}</div>
                                                        </div>
                                                    </div>`;

                        parts.forEach(function (group) {

                            html += `
                                <div class="border rounded p-2 mb-2 bg-light">

                                    <div class="d-flex gap-2 mb-2">
                                        <span class="badge bg-success">
                                            ${group.creditor_name}
                                        </span>

                                        ${group.dep_name ? `<span class="badge bg-warning text-dark">${group.dep_name}</span>` : ''}
                                </div>`;

                            group.parts.forEach(function (part) {

                                stock_id_qty.push({
                                    stock_reserve_id: part.stock_reserve_id,
                                    qty: part.qty
                                });

                                html += `
                                    <div class="d-flex justify-content-between align-items-center border-bottom py-1">

                                        <div>
                                            <div class="fw-semibold small">
                                                ${part.part_name}
                                            </div>

                                            <small class="text-muted">
                                                ${part.process_name}
                                            </small>
                                        </div>

                                        <span class="badge bg-secondary">
                                            ${part.qty}
                                        </span>
                                    </div>`;
                            });

                            html += `</div>`;
                        });

                        html += `</div></div></div></div>`;

                        $(".dc_details").append(html);
                    });

                }
                else {
                    $("#transport_modal").modal('hide');
                    salert("Warning", "No DC Found In Transport Godown.", "warning");
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