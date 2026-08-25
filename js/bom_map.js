
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
$(document).ready(function () {


    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });



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


    $('#bom_part_search').on('input', function () {

        $("#back").empty();
        $("#bom_list_table").addClass("d-none");
        $("#bom_process_table").addClass("d-none");
        $("#bom_material_table, #bom_required_material_table").addClass("d-none");
        $("#bom_process_summary_table").addClass("d-none");
        $("#bom_part_search").data("part_id", '');
        $("#qty_needed_field").addClass("d-none");
        $("#qty_needed").val("").data("process_id", 0);
        $("#stock_check_box").prop("checked", false);

        //check the value not empty
        if ($('#bom_part_search').val() != "") {
            $('#bom_part_search').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/get_part_name_auto_wel.php",
                        type: "get", //send it through get method
                        data: {

                            part: $("#bom_part_search").val(),
                            term: ""

                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.part_name,
                                    value: item.part_name,
                                    id: item.part_id,
                                    // part_name: item.part_name
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("part_id", ui.item.id);
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)
                    get_bom_list(ui.item.id);
                    console.log(ui.item.id);



                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        }

    });


    $("#bom_list_table_body").on("click", "li", function () {

        var part_id = $(this).data("part_id");
        var component_cat = $(this).data("component_cat");


        $("#back").empty();
        $("#bom_process_table").addClass("d-none");
        $("#bom_material_table, #bom_required_material_table").addClass("d-none");
        $("#bom_process_summary_table").addClass("d-none");

        if ($(this).data("process") == 1) {
            $("#back").append(`<li class="breadcrumb-item" data-part_id='${part_id}'><a href="#"><i>${$('#bom_part_search').val()}</i> (<span></span>)</a></li>`);
            $("#bom_process_table_cardHeader").empty();
            get_bom_process_summary(part_id, component_cat)
        }
        else {
            get_bom_process_summary(part_id, component_cat)
        }
    })

    $("#multi_process_list").on("click", "li", function () {

        var part_id = $(this).data("part_id");
        var component_cat = $(this).data("component_cat");
        var process_title = $(this).data("process_title");
        var process_id = $(this).data("process_id");
        $("#back li:first-child").data("previous_process_id", process_id);
        $("#back li:first-child").find("span").text(process_title);
        $("#multi_process").modal("hide");
        get_process_graph($('#bom_part_search').val(), component_cat, process_id, process_title);
        get_process_summary(process_id);
        get_bom(part_id, component_cat);
        get_process_summary_inputs(process_id);
        get_process_summary_godown(process_id);



        $("#stock_check_box").prop("checked", false);
        $("#stock_section").addClass("d-none");
        $("#qty_needed").val('').data("process_id", process_id);
        $("#qty_needed_field").addClass("d-none");


        $("#godown_summary, #input_parts_summary").empty();
    })


    $("#bom_material_table_body").on("click", "tr", function () {
        var part_id = $(this).data("part_id");
        if (part_id !== undefined) {

            $("#bom_list_table").addClass("d-none");
            $("#bom_process_table").addClass("d-none");
            $("#bom_material_table, #bom_required_material_table").addClass("d-none");
            $("#bom_process_summary_table").addClass("d-none");



            $("#bom_part_search").val($(this).find("td").eq(0).text());
            $("#bom_part_search").data("part_id", part_id);
            get_bom_list(part_id);

        }
    })

    $("#processFlow").on("click", "li", function () {

        var previous_process_id = $(this).data("previous_process_id");
        var previous_process_name = $(this).data("previous_process_name");
        var part_id = $(this).data("part_id");
        var part_name = $(this).find("span").text();
        if (previous_process_id && part_id) {

            $("#back").append(`<li class="breadcrumb-item" data-part_id='${part_id}' data-previous_process_id='${previous_process_id}'><a href="#"><i>${part_name}</i> (<span>${previous_process_name}</span>)</a></li>`);
            $("#bom_process_table_cardHeader").empty();
            get_process_graph(part_name, '', previous_process_id, previous_process_name);
            get_process_summary(previous_process_id);
            get_process_summary_inputs(previous_process_id);
            get_process_summary_godown(previous_process_id);



            $("#stock_check_box").prop("checked", false);
            $("#stock_section").addClass("d-none");
            $("#qty_needed").val('').data("process_id", previous_process_id);
            $("#qty_needed_field").addClass("d-none");


            $("#godown_summary, #input_parts_summary").empty();


        }
    })


    $("#back").on("click", "li", function () {
        var part_id = $(this).data("part_id");
        var process_id = $(this).data("previous_process_id");
        var part_name = $(this).find("i").text();
        var previous_process_name = $(this).find("span").text();
        if (part_id !== undefined && !process_id) {



            $("#bom_list_table").addClass("d-none");
            $("#bom_process_table").addClass("d-none");
            $("#bom_material_table, #bom_required_material_table").addClass("d-none");
            $("#bom_process_summary_table").addClass("d-none");

            var index = $(this).nextAll().length;
            for (var i = 0; i <= index; i++) {
                $("#back").children().last().remove();
            }


            $("#bom_part_search").val($(this).text());
            $("#bom_part_search").data("part_id", part_id);
            get_bom_list(part_id);

            return;
        }

        if (process_id && part_id != null) {

            var index = $(this).nextAll().length;
            for (var i = 1; i <= index; i++) {
                $("#back").children().last().remove();
            }

            get_process_graph(part_name, '', process_id, previous_process_name);
            get_process_summary(process_id);
            get_process_summary_inputs(process_id);
            get_process_summary_godown(process_id);

            $("#stock_check_box").prop("checked", false);
            $("#stock_section").addClass("d-none");
            $("#qty_needed").val('').data("process_id", process_id);
            $("#qty_needed_field").addClass("d-none");

            $("#godown_summary, #input_parts_summary").empty();



        }
    })


    $("#processFlow").on("click", ".flow-title", function () {

        var title = $(this).text().trim();
        $(".process-card").removeClass("active-card");

        $("#bom_process_summary_table .process-card").each(function () {
            var heading = $(this).find("h6").find("i").text().trim();


            if (title === heading) {
                $(this).addClass("active-card");
            }
        });
    });

    $("#processFlow").on("click", ".stock_gddown_list", function () {

        let part_id = $(this).attr("data-part_id");
        let process_id = $(this).attr("data-process_id");

        if (!part_id || !process_id) {
            salert("Warning", "Missing Data", "warning");
        }
        else {
            get_manual_stock(process_id);

        }

    });


    // Show/Hide Reason Input
    $("#stock_details_modal").on("change", ".stock_status_switch", function () {

        const card = $(this).closest(".card");

        card.find(".reason_input").toggleClass("d-none", !this.checked);

    });


    $("#stock_details_modal").on("click", ".opening_qty_btn", function () {

        const card = $(this).closest(".card");
        const part_id = $(this).data("part_id");
        const process_id = $(this).data("process_id");
        const qty = card.find(".opening_stock_qty").val();
        const stock_reserve = card.find(".stock_status_switch").is(":checked") ? 1 : 0;
        const reserve_type = card.find(".reason_input").val();
        const godown = $(this).data("godown");
        const dep = $(this).data("dep");
        const sec = $(this).data("sec");

        console.log({
            part_id,
            process_id,
            qty,
            stock_reserve,
            reserve_type,
            godown,
            dep,
            sec
        });

        update_manual_process_stock1(godown, dep, sec, process_id, part_id, qty, stock_reserve, reserve_type);


    });

    $("#refreshBtn").on("click", function () {

        const process_id = $(this).val();

        if (process_id) {
            get_manual_stock(process_id);
        }
    });


    $("#showDemandBtn").on("click", function () {
        // if the demand table is already visible, hide it, otherwise show it also change icon
        if ($(".demand_tbl").is(":visible")) {
            $(".demand_tbl").hide();
            $(this).html('<i class="fas fa-eye"></i>');
        } else {
            $(".demand_tbl").show();
            $(this).html('<i class="fas fa-eye-slash"></i>');
        }
    });



    // Stock 

    $("#stock_check_box").on("change", function () {

        if ($("#bom_part_search").data("part_id")) {
            if ($(this).is(":checked")) {

                $("#qty_needed_field").removeClass("d-none");
            } else {
                $("#qty_needed_field").addClass("d-none");
            }
        }
        else {
            $(this).prop("checked", false);
            salert("Warning", "Select Part First.", 'warning');
        }

    })

    $("#qty_needed").on("focusout", function () {

        var qty = $(this).val();
        var process_id = $(this).data("process_id");

        if (qty > 0 && process_id > 0) {

            $("#stock_section").removeClass("d-none");

            document.getElementById("godown_summary")
                .scrollIntoView({
                    behavior: "smooth",
                });

            get_real_process_summary_inputs(process_id, qty);
            get_real_process_summary_godown(process_id, qty);


        } else {
            salert("Warning", "Enter Valid Qty/ Data Missing.", "warning");
        }
    })


    // PDF 

    $("#godown_summary_pdf_btn").click(function () {

        let element = document.getElementById("godown_summary");

        let opt = {
            margin: .3,
            filename: 'Godown_Summary.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true
            },
            jsPDF: {
                unit: 'in',
                format: 'a4',
                orientation: 'portrait'
            }
        };

        html2pdf().set(opt).from(element).save();

    });



    $("#input_parts_summary_pdf_btn").click(function () {

        let element = document.getElementById("input_parts_summary");

        let opt = {
            margin: .3,
            filename: 'Materials_Stock.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true
            },
            jsPDF: {
                unit: 'in',
                format: 'a4',
                orientation: 'portrait'
            }
        };

        html2pdf().set(opt).from(element).save();

    });

    $("#timing_dounut_chart").on("dblclick", function () {
        $("#timeModal").modal("show");
    });

    $("#cost_bar_chart").on("dblclick", function () {
        $("#costModal").modal("show");
    })
});







function get_manual_stock(process_id) {
    console.log(process_id);
    $.ajax({
        url: "php/get_manual_stock.php",
        type: "get",
        data: {

            process_id: process_id,
        },

        success: function (response) {

            $("#bom_material_table_body").empty();

            if (response.trim() === "error") {
                salert("Error", "Server Error", "error");
                return;
            }

            if (response.trim() === "0 result") {
                $("#stock_details_modal .modal-body").html(`
                    <div class="text-center py-5">
                        <i class="fa fa-box-open fa-3x text-secondary mb-3"></i>
                        <h5>No Stock Details Found</h5>
                    </div>
                `);
                $("#bom_material_table_body").append('<p class="text-center text-muted small">Loading...</p>');
                $("#stock_details_modal").modal("show");
                return;
            }

            $("#refreshBtn").val(process_id);
            console.log(response);

            let responseData = JSON.parse(response);

            if (!responseData.length) {
                return;
            }


            let result = responseData[0];


            let stock_details = [];

            if (result.stock_details) {
                stock_details = JSON.parse(result.stock_details);
            }

            var other = `<table class="table small table-bordered table-sm">

                                            <thead class="table-light small">
                                                <tr>
                                                    <th>Reserve Type</th>
                                                    <th>Qty</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>

                                            <tbody class="small"></tbody></table>`

            let html = `
                    <div class="alert small alert-primary d-flex justify-content-between mb-2 p-2">
                        <div class="bg-light border rounded-3 p-1">
                            <strong>Total Available Qty :</strong>
                            ${result.total_available_qty}
                        </div>
                        <div  class="bg-light border rounded-3 p-1">
                            <strong>Total Reserve Qty :</strong>
                            ${result.total_reserve_qty}
                        </div>
                        <div  class="bg-light border rounded-3 p-1">
                            <strong>Total Qty :</strong>
                            ${parseInt(result.total_reserve_qty) + parseInt(result.total_available_qty)}
                        </div>
                    </div>
                `;

            if (stock_details.length > 0) {

                stock_details.forEach(stock => {

                    html += `
                            <div class="card shadow-sm mb-3 border-0">

                                <div class="card-header bg-light">

                                    <div class="row g-2 align-items-center">

                                        <div class="col-lg-4">
                                            <h6 class="mb-0">${stock.creditor_name}</h6>

                                            <small class="text-muted">
                                                ${stock.dep_name ?? "-"}
                                                ${stock.sec_name ? " / " + stock.sec_name : ""}
                                            </small>
                                        </div>

                                        <div class="col-lg-2">
                                            <input
                                                type="number"
                                                class="form-control form-control-sm opening_stock_qty"
                                                placeholder="Opening Qty">
                                        </div>

                                        <div class="col-lg-auto">

                                            <div class="form-check form-switch">
                                                <input
                                                    class="form-check-input stock_status_switch"
                                                    type="checkbox">
                                            </div>

                                        </div>

                                        <div class="col-lg-2">

                                            <input
                                                type="text"
                                                class="form-control form-control-sm reason_input d-none"
                                                placeholder="Reason">

                                        </div>

                                        <div class="col-lg-auto">

                                            <button
                                                class="btn btn-sm btn-primary opening_qty_btn"
                                                data-process_id="${result.process_id}"
                                                data-part_id="${result.part_id}"
                                                data-godown="${stock.godown}"
                                                data-dep="${stock.dep}"
                                                data-sec="${stock.sec}">
                                                OK
                                            </button>

                                        </div>

                                        <div class="col text-end">

                                            <span class="badge bg-secondary">
                                                Stock ID : ${stock.stock_id}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                                <div class="card-body">

                                    <div class="row mb-3 text-center">

                                    
                                        <div class="col-md-4">
                                            <small class="text-muted">Actual Qty</small>
                                            <h6 class="text-success">${stock.qty}</h6>
                                        </div>

                                        <div class="col-md-4">
                                            <small class="text-muted">Reserved Qty</small>
                                            <h6 class="text-danger">
                                                ${stock.reserve_qty}
                                            </h6>
                                        </div>

                                        <div class="col-md-4">
                                            <small class="text-muted">Available</small>
                                            <h6 class="text-info">${stock.available_qty}</h6>
                                        </div>

                                    </div>

                                    <div class="d-flex justify-content-between">
                                        <table class="table small table-bordered table-sm">

                                            <thead class="table-light small">
                                                <tr>
                                                    <th>Reserve Type</th>
                                                    <th>Qty</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>

                                            <tbody class="small">
                            `;

                    stock.reserve_details.forEach(type => {

                        type.reserve_details.forEach(detail => {

                            if (detail.reserve_qty >= 0) {
                                html += `
                                        <tr>

                                            <td>
                                                ${(type.reserve_type != null ? type.reserve_type.replaceAll("_", " ").toUpperCase() : '')}
                                            </td>

                                            <td>${detail.reserve_qty}</td>

                                            <td>
                                                <span class="badge bg-success">
                                                    ${detail.reserve_status}
                                                </span>
                                            </td>

                                        </tr>
                                    `;
                            }
                            else {
                                html += `<tr><td colspan='3' class="text-danger text-center">Nothing Reserved</td></tr>`;
                            }



                        });

                    });

                    html += `</tbody></table></div></div></div>`;

                });

            } else {

                html += `
                    <div class="text-center py-5">

                        <i class="fa fa-box-open fa-3x text-secondary mb-3"></i>

                        <h5>No Stock Details Found</h5>

                    </div>
                `;
            }

            $("#stock_details_modal .modal-body").html(html);

            // get demand material details
            get_demand_material_details(process_id);
            get_external_material_details(process_id);
            sec_work_order_report(process_id);


            $("#stock_details_modal").modal("show");
        },

        error: function () {
            salert("Error", "Network issue", "error");
        }
    });
}


function get_external_material_details(process_id) {
    $.ajax({
        url: "php/get_jobwork_reserve.php",
        type: "get",
        data: {

            process_id: process_id,

        },

        success: function (response) {
            console.log("External Material Details Response:", response);
            $("#demand_material_jobwork_table_body").empty();
            if (response.trim() == "0 result") {

                $("#demand_material_jobwork_table_body").append(`
                    <tr>
                        <td colspan="3" class="text-center">No External Material Details Found</td>
                    </tr>
                `);
            }

            else {
                var demandData = JSON.parse(response);
                // card with table

                var body_html = '';
                var total_reserved_qty = 0;
                demandData.forEach(demand => {
                    total_reserved_qty += parseFloat(demand.reserved_qty);
                    body_html += `<tr>
                        <td>${demand.godown_name == null ? '' : demand.godown_name}${demand.dep_name == null ? '' : '|' + demand.dep_name}${demand.sec_name == null ? '' : '|' + demand.sec_name}</td>
                        <td>${demand.reserved_qty}</td>
                    </tr>`;
                });
                // show total reserved qty in the last row
                body_html += `<tr>
                    <td class="text-end"><b>Total Reserved Qty</b></td>
                    <td><b>${total_reserved_qty}</b></td>
                </tr>`;
                $("#demand_material_jobwork_table_body").append(body_html);
            }

        },
        error: function () {
            salert("Error", "Network issue", "error");
        }
    });

}


function sec_work_order_report(process_id) {
    $.ajax({
        url: "php/sec_work_order_report.php",
        type: "get",
        data: {

            process_id: process_id,

        },

        success: function (response) {
            console.log(" Material summary Details Response:", response);
            $("#demand_material_summary_table_body").empty();
            if (response.trim() == "0 result") {

                $("#demand_material_summary_table_body").append(`
                    <tr>
                        <td colspan="8" class="text-center">No Material Summary Details Found</td>
                    </tr>
                `);
            }

            else {
                var obj = JSON.parse(response);

                var body_html = "";
                var count = 0;

                obj.forEach(function (item) {

                    count++;

                    var input_parts = JSON.parse(item.input_parts || "[]");
                    var raw_materials = JSON.parse(item.raw_materials_needed || "[]");
                    var work_orders = JSON.parse(item.work_orders || "[]");

                    //=========================
                    // Input Parts
                    //=========================
                    var input_parts_html = `
                            <ul class="list-group list-group-flush small">
                                ${input_parts.map(function (part) {
                        return `
                                        <li class="list-group-item px-2 py-1 d-flex justify-content-between align-items-center">
                                            <span>${part.part}</span>
                                            <span class="badge bg-primary rounded-pill">${part.qty}</span>
                                        </li>
                                    `;
                    }).join("")}
                            </ul>
                        `;

                    //=========================
                    // Raw Materials
                    //=========================
                    var raw_materials_html = `
                            <ul class="list-group list-group-flush small">
                                ${raw_materials.map(function (part) {
                        return `
                                        <li class="list-group-item px-2 py-1 d-flex justify-content-between align-items-center">
                                            <span>${part.part_name}</span>
                                            <span class="badge bg-secondary rounded-pill">${part.qty}</span>
                                            <span class="badge bg-warning text-dark rounded-pill">${part.needed_qty}</span>
                                        </li>
                                    `;
                    }).join("")}
                            </ul>
                        `;

                    //=========================
                    // Work Orders
                    //=========================
                    var work_orders_html = `
                            <ul class="list-group list-group-flush small">
                                ${work_orders.map(function (wo) {

                        return `
                                        <li class="list-group-item px-2 py-2">

                                            <div class="d-flex justify-content-between">
                                                <strong>${wo.work_order_no ?? ('WO-' + wo.work_order_id)}</strong>
                                                <span class="badge bg-warning text-dark">
                                                    Pending : ${wo.pending_qty}
                                                </span>
                                            </div>

                                            <div class="row mt-1 g-1">

                                                <div class="col-6">
                                                    <small class="text-muted">Qty</small><br>
                                                    <strong>${wo.qty}</strong>
                                                </div>

                                                <div class="col-6">
                                                    <small class="text-muted">Age</small><br>
                                                    <strong>${wo.days} Days</strong>
                                                </div>

                                                <div class="col-12">
                                                    <small class="text-muted">Date</small><br>
                                                    <strong>${wo.dated}</strong>
                                                </div>

                                            </div>

                                        </li>
                                    `;

                    }).join("")}
                            </ul>
                        `;


                    body_html += `
                                <tr>

                                    <td class="align-middle">${count}</td>

                                    <td class="align-middle">
                                        <strong>${item.godown_name}</strong><br>
                                        <small class="text-muted">
                                            ${item.dep_name ?? ''} ${item.sec_name ? ' / ' + item.sec_name : ''}
                                        </small>
                                    </td>

                                    <td class="align-middle">${input_parts_html}</td>

                                    <td class="align-middle">
                                        <span class="badge bg-info text-dark">
                                            ${item.process_name}
                                        </span>
                                    </td>

                                    <td class="align-middle">${item.final_part}</td>

                                    <td class="text-center align-middle fw-bold">
                                        ${item.pending_process_qty}
                                    </td>

                                    <td class="align-middle">${raw_materials_html}</td>

                                    <td class="align-middle">${work_orders_html}</td>

                                </tr>
                            `;

                });

                $("#demand_material_summary_table_body").html(body_html);
            }

        },
        error: function () {
            salert("Error", "Network issue", "error");
        }
    });

}

function get_demand_material_details(process_id) {
    $.ajax({
        url: "php/get_input_demand.php",
        type: "get",
        data: {

            process_id: process_id,

        },

        success: function (response) {
            $("#demand_material_table_body").empty();
            console.log("Demand Material Details Response:", response);
            if (response.trim() === "0 result") {

                $("#demand_material_table_body").append(`
                    <tr>
                        <td colspan="4" class="text-center">No Demand Material Details Found</td>
                    </tr>
                `);
            }

            else {
                var demandData = JSON.parse(response);
                // card with table
                var total_required_qty = 0;
                var body_html = '';
                demandData.forEach(demand => {
                    total_required_qty += parseFloat(demand.required_qty);
                    body_html += `<tr>
                        <td>${demand.godown_name == null ? '' : demand.godown_name}${demand.dep_name == null ? '' : '|' + demand.dep_name}${demand.sec_name == null ? '' : '|' + demand.sec_name}</td>
                        <td>${demand.required_qty}</td>
                        <td>${demand.total_reserve_qty}</td>
                        <td>${demand.needed}</td>
                    </tr>`;
                });


                // show total required qty in the last row
                body_html += `<tr>
                    <td class="text-end" colspan="3"><b>Total Required Qty</b></td>
                    <td><b>${total_required_qty}</b></td>
                </tr>`;
                $("#demand_material_table_body").append(body_html);
            }

        },
        error: function () {
            salert("Error", "Network issue", "error");
        }
    });

}

function update_manual_process_stock1(godown, dep, sec, process_id, part_id, qty, stock_reserve, reserve_type) {
    console.log(godown, dep, sec, process_id, part_id, qty, stock_reserve, reserve_type);


    $.ajax({
        url: "php/update_manual_process_stock1.php",
        type: "post",
        data: {
            godown: godown,
            dep: dep,
            sec: sec,
            process_id: process_id,
            part_id: part_id,
            qty: qty,
            stock_reserve: stock_reserve,
            reserve_type: reserve_type
        },

        success: function (response) {

            console.log(response);

            if (response.trim() == "ok") {
                get_manual_stock(process_id);
                salert("Success", "Stock updated successfully", "success");
            }


        }
    });

}

function get_real_process_summary_godown(process_id, qty) {
    $.ajax({
        url: "php/get_real_process_summary_godown.php",
        type: "get",
        data: {
            process_id: process_id,
            qty_needed: qty,
        },

        success: function (response) {

            if (response.trim() === "error") {
                salert("Error", "Server Error", "error");
                return;
            }

            if (response.trim() === "0 result") {
                $("#godown_summary").html(
                    `<div class="alert alert-warning">Nothing Found</div>`
                );
                return;
            }
            let obj = JSON.parse(response);

            let html = `<div class="row g-3">`;

            obj.forEach(function (company) {

                let processes = JSON.parse(company.process_details || "[]");

                html += `
                    <div class="col-lg-6 col-12">

                    <div class="company-box">

                    <!-- COMPANY HEADER -->
                    <div class="company-head">
                        <div class="company-name">
                            🏭 ${company.production_place || 'Internal Production'}
                        </div>

                        <div class="summary-stats">

                            <div class="sum-pill cost">
                                <small>Total Cost</small>
                                <b>₹ ${company.total_cost}</b>
                            </div>

                            <div class="sum-pill time">
                                <small>Min Time</small>
                                <b>${company.total_min_time} min</b>
                            </div>

                            <div class="sum-pill time2">
                                <small>Max Time</small>
                                <b>${company.total_max_time} min</b>
                            </div>

                        </div>
                    </div>
                    `;


                processes.forEach(function (proc) {

                    let inputs = '';

                    (proc.input_details || []).forEach(inp => {

                        inputs += `
                            <div class="input-row">
                            <span>${inp.input_part_name}</span>
                            <span class="qty-badge">
                                Qty ${inp.qty}
                            </span>
                            </div>
                            `;

                    });


                    html += `

                        <div class="process-box">

                        <div class="process-title">
                        ⚙ ${proc.process_name}
                        </div>

                        <div class="process-stats">

                        <span class="mini-pill">
                        ₹ ${proc.cost || 0}
                        </span>

                        <span class="mini-pill green">
                        ${proc.min_time || 0} min
                        </span>

                        <span class="mini-pill orange">
                        ${proc.max_time || 0} min
                        </span>

                        </div>

                        <div class="inputs-box">
                        ${inputs}
                        </div>

                        </div>

                        `;

                });


                html += `
                    </div>
                    </div>
                    `;

            });

            html += `</div>`;

            $("#godown_summary").html(html);
        }
    });
}


function get_real_process_summary_inputs(process_id, qty) {
    console.log(process_id, qty);


    $.ajax({
        url: "php/get_real_process_summary_inputs.php",
        type: "get",
        data: {
            process_id: process_id,
            qty_needed: qty
        },

        success: function (response) {

            if (response.trim() == "error") {
                salert("Error", "Server Error", "error");
                return;
            }

            if (response.trim() == "0 result") {
                $("#input_parts_summary").html(
                    `<div class="alert alert-warning">
                        Nothing Found
                    </div>`
                );
                return;
            }


            let data = JSON.parse(response);

            // highest level first
            data.sort((a, b) => b.max_level - a.max_level);

            let html = `<div class="flow-container">`;

            data.forEach((item, index) => {

                let inputs = '';

                (item.input_parts || "[]").forEach(part => {

                    inputs += `
                        <span class='part'>
                        ${part.input_part_name}
                        (Qty ${part.qty})
                        </span>
                        `;

                });

                html += `

                        <div class="flow-step">

                        <div class="flow-card ${index == data.length - 1 ? 'final-node' : ''}">

                        <div class="level-badge">
                        Level ${item.max_level}
                        </div>

                        <div class="proc-title">
                        ${item.process_name}
                        </div>

                        <div class="stats">
                        <span class="company">
                        🏭 ${item.production_godown_name || 'Internal'}
                        </span>

                        <span class="qty">
                        📦 ${item.production_qty}
                        </span>

                        <span class="available_qty">
                        AVQ - ${item.available_qty}
                        </span>

                        <span class="requseted_qty">
                        RQ - ${item.required_qty}
                        </span>

                        <span class="time">
                        ⏱ ${item.production_min_time || 0}
                        -
                        ${item.production_max_time || 0}
                        </span>

                        <span class="cost">
                        ₹ ${item.production_cost || 0}
                        </span>
                        </div>

                        <div class="inputs">
                        ${inputs}
                        </div>

                        <p class="output_part m-1">
                            ${item.output_part_name}
                        </p>
                        </div>

                        </div>

                        `;

            });

            html += `</div>`;

            $("#input_parts_summary").html(html);
        }
    });

}


function get_process_summary(process_id) {
    $.ajax({
        url: "php/get_process_summary.php",
        type: "get",
        data: { process_id },

        success: function (response) {

            if (response.trim() === "error") {
                salert("Error", "Server Error", "error");
                return;
            }

            if (response.trim() === "0 result") {
                $("#bom_process_summary_table").html(
                    `<div class="alert alert-warning">No Process Summary Found</div>`
                ).removeClass("d-none");
                return;
            }
            console.log(response);


            const data = JSON.parse(response);
            let html = `<div class="card shadow-sm p-1">`;
            let totalCost = 0;
            let totalMinTime = 0;
            let totalMaxTime = 0;
            let ex_pro_count = 0;

            data.forEach((p, index) => {

                const extraItems = JSON.parse(p.extra);

                totalCost += parseFloat(p.cost ?? 0);
                totalMinTime += parseFloat(p.min_time ?? 0);
                totalMaxTime += parseFloat(p.max_time ?? 0);

                html += `
                    <div class="process-card shadow-sm rounded p-1 mb-2">

                        <!-- TITLE + EXTRA COUNT -->
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h6 class="process-title m-0">
                                <span class="step-index">${index + 1}.</span> <i>${p.process_name ?? ''}</i>
                            </h6>

                            <span class="badge bg-danger rounded-pill px-2 py-1">
                                ${p.process_extra_count ?? ''}
                            </span>
                        </div>

                        <!-- COST + TIME -->
                        <div class="small mt-2">
                            <div class="d-flex justify-content-between mb-1">
                                <span class="label">Cost <span class="value text-success fw-bold">₹${p.cost ?? 0}</span></span>
                                
                                <span class="label">Time <span class="value text-primary fw-bold">${p.min_time ?? 0} – ${p.max_time ?? 0} mins</span></span>
                                
                            </div>


                            <div class="d-flex justify-content-between align-items-center">
                                <span class="label">Creditor <span class="value fw-semibold">${p.creditor_name ?? ''}</span></span>

                                <button class="btn btn-sm btn-outline-primary toggle-details rounded-pill ms-2 px-3"
                                    data-target="#details-${index}">
                                    Details
                                </button>
                            </div>
                        </div>

                        <!-- HIDDEN DETAILS SECTION -->
                        <div id="details-${index}" class="details-box d-none mt-2 px-1 py-1 rounded shadow-sm">

                            <div class="fw-semibold text-secondary mb-0  text-center">Process Details</div>

                            <div class="detail-item"><b>Department:</b> ${p.dep_name ?? ''}</div>
                            <div class="detail-item d-flex justify-content-between"><div><b>Section:</b> ${p.sec_name ?? ''}</div><div> <b>Machine:</b> ${p.machine_name ?? ''}</div></div>

                            <!-- EXTRA PROCESS -->
                            ${extraItems.length > 0 ? `
                            <div class="fw-semibold text-secondary mt-1  text-center">Extra Processes</div>
                            <ul class="list-group mt-0">
                                ${extraItems
                            .map(
                                ex => `
                                    <li class="list-group-item extra-item">
                                        <div class="fw-bold">${ex.creditor_name ?? ''}</div>
                                        <small>${ex.dep_name ?? ''} • ${ex.sec_name ?? ''} • ${ex.machine_name ?? ''} • <span class="text-primary fw-semibold">${ex.min_time ?? 0}–${ex.max_time ?? 0} mins</span> • <span class="text-success fw-bold ms-2">₹${ex.cost ?? 0}</span></small>
                                    </li>`
                            )
                            .join("")}
                            </ul>
                            ` : ""}
                        </div>

                    </div>
                    `;
            });

            // TOTAL SUMMARY
            html += `
                <div class="total-summary-card mt-0 p-1 rounded shadow-sm">
                    <h6 class="fw-bold text-center text-primary mb-1">TOTAL SUMMARY</h6>

                    <div class="summary-row d-flex justify-content-between px-2">
                        <div class="summary-label text-secondary fw-semibold">Total Cost</div>
                        <div class="summary-value text-success fw-bold">₹${totalCost}</div>
                    </div>

                    <div class="summary-row d-flex justify-content-between px-2 mt-2">
                        <div class="summary-label text-secondary fw-semibold">Total Time</div>
                        <div class="summary-value text-primary fw-bold">${totalMinTime} – ${totalMaxTime} mins</div>
                    </div>
                </div>
            </div>`;


            $("#bom_process_summary_table").html(html).removeClass("d-none");

            // CLICK HANDLER FOR SHOW/HIDE DETAILS
            $(".toggle-details").on("click", function () {
                let target = $(this).data("target");
                $(target).toggleClass("d-none");
                $(this).text($(target).hasClass("d-none") ? "Details" : "Hide Details");
            });
        }
    });
}


function get_process_graph(part_name, component_cat, process_id, process_title) {
    console.log(part_name, component_cat, process_id, process_title);

    $.ajax({
        url: "php/get_process_graph.php",
        type: "get", //send it through get method
        data: {
            process_id: process_id,


        },
        success: function (response) {


            console.log(response);

            if (response.trim() != "error") {
                let part = part_name ?? '';
                let process = process_title ?? '';

                let title = `${part} - ${component_cat}${process ? ` (${process})` : ''} process flow`;

                $("#bom_process_table_cardHeader").text(title);

                $("#bom_process_table_body").empty();
                if (response.trim() != "0 result") {

                    $("#bom_process_table").removeClass("d-none");



                    const data = JSON.parse(response);
                    const container = document.getElementById("processFlow");
                    container.innerHTML = "";

                    const icons = ["⚙️", "🛠️", "🔩", "📦", "📐", "🧩", "🔧", "🧪"];
                    var prev_process_name = '';
                    data.forEach((p, i) => {

                        const step = document.createElement("div");
                        step.className = "flow-step";

                        // Prepare materials list
                        var parts = JSON.parse(p.parts);
                        let materialsHTML = "<ul>";
                        var m_count = 0;
                        parts.forEach(part => {
                            materialsHTML += `<li data-part_id=${part.part_id} data-previous_process_name='${part.previous_process_name}' data-previous_process_id=${part.previous_process_id}>${m_count + 1} • <span class=${(part.previous_process_id != null && part.part_id != null) ? "cursor_point" : 'text-dark'}>${part.part_name !== null ? part.part_name : prev_process_name}</span> - Qty: ${part.qty}</li>`
                            m_count++;
                        })


                        step.innerHTML = `
                            <div class="flows-step-header position-relative">

                                <div class="flow-title">STEP ${i + 1}</div>
                                <div class="flow-icon ">${icons[i] || "⚙️"}</div>
                                <div class="flow-title flow-step-header">${p.process_name}</div>

                                <!-- TOP RIGHT ICON + COUNT -->
                                <div class="top-right-wrapper">
                                    <span class="extra-count badge bg-success">₹${p.cost !== null ? p.cost : 0}</span>
                                    <span class="extra-count badge bg-secondary d-flex"><i class="fa fa-clock"></i>${p.max_time !== null ? p.max_time : 0} mins</span>
                                </div>

                                <!-- BOTTOM RIGHT ICON + COUNT -->
                                <div class="bottom-right-wrapper">
                                    <span class="stock_gddown_list badge bg-primary" data-stock_details='${JSON.stringify(p.stock_details)}' data-part_id='${p.output_part}' data-process_id='${p.process_id}'><i class="fa fa-warehouse"></i></span>
                                </div>

                            </div>

                            <div class="accordion-body">
                                <div class="flow-materials">${materialsHTML}</div>
                            </div>
                        `;

                        prev_process_name = `<b class='text-primary'>${p.process_name}</b>`;

                        container.appendChild(step);

                        step.querySelector(".flow-step-header").onclick = () => {

                            const body = step.querySelector(".accordion-body");
                            const isOpen = body.classList.contains("open");

                            document.querySelectorAll(".accordion-body").forEach(b => {
                                b.classList.remove("open");
                                b.style.maxHeight = "0";
                            });

                            if (!isOpen) {
                                body.classList.add("open");
                                body.style.maxHeight = body.scrollHeight + "px";
                            }
                        };

                    });








                    var obj = JSON.parse(response);


                    console.log(response);




                    //    get_sales_order()
                }
                else {
                }
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

function get_bom_process_summary(part_id, component_cat) {

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

                $('#multi_process_list').empty()
                if (response.trim() != "0 result") {


                    $("#multi_process").modal("show")



                    var obj = JSON.parse(response);
                    var count = 0

                    obj.forEach(function (obj) {

                        count = count + 1;
                        $("#multi_process_list").append("<li data-part_id='" + obj.output_part + "' data-component_cat='" + obj.component_cat + "' data-process_id='" + obj.process_id + "' data-process_title='" + obj.process_title + "' data-is_default='" + obj.is_default + "' class='list-group-item'>" + component_cat + "(" + obj.process_title + ")" + (obj.is_default > 0 ? "<span class='badge bg-primary blink'>Default</span>" : "") + "</li>")



                    });
                    // $(".add_new_process_btnnnn").data({ "part_id": part_id, "component_cat": component_cat });
                }
                else {

                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function get_bom(part_id, component_cat) {
    $.ajax({
        url: "php/get_bom.php",
        type: "get",
        data: {

            part_id: part_id,
            component_cat: component_cat,
        },

        success: function (response) {

            $("#bom_material_table_body").empty();

            if (response.trim() === "error") {
                salert("Error", "Server Error", "error");
                return;
            }

            if (response.trim() === "0 result") {
                $("#bom_material_table_body").append("<tr><td>No BOM Material</td></tr>")

                return;
            }

            $("#bom_material_table").removeClass("d-none");

            var obj = JSON.parse(response);

            var materials = '';
            var count = 0;
            obj.forEach(function (pr) {
                count += 1;
                if (pr.process_availble != null) {
                    materials += `<tr data-part_id='${pr.part_id}'><td  class='table-success'>${pr.part_name}</td><td>${pr.qty}</td></tr>`
                } else {
                    materials += `<tr><td>${pr.part_name}</td><td>${pr.qty}</td></tr>`
                }
            });
            $("#m_count").text(count);
            $("#bom_material_table_body").append(`${materials}`);


        },

        error: function () {
            salert("Error", "Network issue", "error");
        }
    });
}

function get_process_summary_inputs(process_id) {

    $.ajax({
        url: "php/get_process_summary_inputs.php",
        type: "get",
        data: {

            process_id: process_id,
        },

        success: function (response) {

            $("#bom_required_material_table_body").empty();

            if (response.trim() === "error") {
                salert("Error", "Server Error", "error");
                return;
            }

            if (response.trim() === "0 result") {
                $("#bom_required_material_table_body").append("<tr><td>No BOM Material</td></tr>")

                return;
            }

            $("#bom_required_material_table").removeClass("d-none");

            var obj = JSON.parse(response);

            var materials = '';
            var total_min_time = 0;
            var total_max_time = 0;
            var total_cost = 0;
            var count = 0;

            obj.forEach(function (pr) {

                total_min_time += parseFloat(pr.min_time ?? 0);
                total_max_time += parseFloat(pr.max_time ?? 0);
                total_cost += parseFloat(pr.cost ?? 0);

                var input_dels = JSON.parse(pr.input_details || "[]");

                var input_info = `<ul class="list-group">`;
                input_dels.forEach(function (item) {
                    input_info += `
                                <li class="list-group-item d-flex justify-content-between p-1">
                                    ${item.input_part_name ?? ''}
                                    <p><span class='badge bg-secondary'>${item.input_qty ?? 0}</span></p>
                                </li>`;
                });
                input_info += `</ul>`;

                var godown_info = `
                                <div>
                                    <div class="d-flex justify-content-between mb-1">
                                        <strong>${pr.godown_name ?? '-'}</strong>
                                        <p><span class="badge bg-primary">₹${pr.cost ?? 0}</span></p>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <span class="badge bg-info">${pr.min_time ?? 0} Mins</span>
                                        <span class="badge bg-secondary">${pr.max_time ?? 0} Mins</span>
                                    </div>
                                    <p>${pr.dep_name ?? ''} ${pr.sec_name ? ' - ' + pr.sec_name : ''}</p>
                                </div>
                            `;

                count++;

                materials += `
                            <tr>
                                <td>${count}</td>
                                <td>${pr.output_part_name ?? ''}</td>
                                <td>${pr.production_qty ?? 0}</td>
                                <td>${pr.stock_qty ?? 0}</td>
                                <td>${input_info}</td>
                                <td>${godown_info}</td>
                            </tr>`;
            });

            // clear before append (important)
            $("#bom_required_material_table_body").html(materials);

            // total row
            $("#bom_required_material_table_body").append(`
                <tr class="fw-bold table-primary" style="bottom: 0; z-index: 5; position: sticky;">
                    <td colspan="2">Total</td>
                    <td colspan="2">Min: ${total_min_time}</td>
                    <td>Max: ${total_max_time}</td>
                    <td>₹ ${total_cost}</td>
                </tr>
            `);

        },

        error: function () {
            salert("Error", "Network issue", "error");
        }
    });
}

function get_process_summary_godown(process_id) {

    $.ajax({
        url: "php/get_process_summary_godown.php",
        type: "get",
        data: {

            process_id: process_id,
        },

        success: function (response) {

            console.log(response);
            

            if (response.trim() === "error") {
                salert("Error", "Server Error", "error");
                return;
            }

            $("#timing_dounut_chart").empty();
            $("#timing_dounut_chart_modal").empty();
            $("#cost_bar_chart").empty();
            $("#cost_bar_chart_modal").empty();

            if (response.trim() === "0 result") {
                $("#bom_required_material_table_body").append("<tr><td>No BOM Material</td></tr>");
                return;
            }

            $("#bom_required_material_table").removeClass("d-none");

            var obj = JSON.parse(response);

            let companyNames = [];
            let minTimes = [];
            let maxTimes = [];
            let costs = [];

            obj.forEach(item => {
                let name = item.godown_name || "N/A";

                companyNames.push(name);
                minTimes.push(parseFloat(item.total_min_time || 0));
                maxTimes.push(parseFloat(item.total_max_time || 0));
                costs.push(parseFloat(item.total_cost || 0));
            });

            // 🍩 DONUT CHART (Max Time per company)
            // ✅ calculate totals
            let totalMin = minTimes.reduce((a, b) => a + b, 0);
            let totalMax = maxTimes.reduce((a, b) => a + b, 0);

            $("#donut_center_text").html(`
                <div>Min: ${totalMin} mins</div>
                <div>Max: ${totalMax} mins</div>
            `);

            $("#donut_center_text_modal").html(`
                <div>Min: ${totalMin} mins</div>
                <div>Max: ${totalMax} mins</div>
            `);

            var donutOptions = {
                chart: {
                    type: 'donut',
                    height: 330
                },

                series: maxTimes,

                labels: companyNames.map(name =>
                    name.length > 20 ? name.substring(0, 20) + '...' : name
                ),

                legend: {
                    position: 'bottom'
                },

                dataLabels: {
                    enabled: false
                },

                tooltip: {
                    y: {
                        formatter: function (val, opts) {
                            let index = opts.seriesIndex;
                            let min = minTimes[index];
                            let max = maxTimes[index];

                            return `Min: ${min} mins | Max: ${max} mins`;
                        }
                    }
                },

                // 🔥 STATIC CENTER CONTENT
                plotOptions: {
                    pie: {
                        donut: {
                            labels: {
                                show: false
                            }
                        }
                    }
                },

                title: {
                    text: "Max Time by Company",
                    align: "center"
                }
            };
            
            var donutChart = new ApexCharts(
                document.querySelector("#timing_dounut_chart"),
                donutOptions
            );
            donutChart.render();

            var donutOptions1 = {
                chart: {
                    type: 'donut',
                    // height: 330
                },

                series: maxTimes,

                labels: companyNames.map(name =>
                    name.length > 20 ? name.substring(0, 20) + '...' : name
                ),

                legend: {
                    position: 'bottom'
                },

                dataLabels: {
                    enabled: false
                },

                tooltip: {
                    y: {
                        formatter: function (val, opts) {
                            let index = opts.seriesIndex;
                            let min = minTimes[index];
                            let max = maxTimes[index];

                            return `Min: ${min} mins | Max: ${max} mins`;
                        }
                    }
                },

                // 🔥 STATIC CENTER CONTENT
                plotOptions: {
                    pie: {
                        donut: {
                            labels: {
                                show: false
                            }
                        }
                    }
                },

                title: {
                    text: "Max Time by Company",
                    align: "center"
                }
            };


            var donutChartModal = new ApexCharts(
                document.querySelector("#timing_dounut_chart_modal"),
                donutOptions1
            );
            donutChartModal.render();

            var barChart = new ApexCharts(
                document.querySelector("#cost_bar_chart"),
                barOptions
            );
            barChart.render();

            // 📊 BAR CHART (Cost comparison)
            var barOptions = {
                chart: {
                    type: 'bar',
                    height: 320,
                    background: '#f8f9fa' // 🎨 light background
                },

                colors: ['#008FFB', '#168612', '#FEB019', '#FF4560', '#775DD0', '#3F51B5'],

                series: [{
                    name: "Cost",
                    data: costs
                }],

                xaxis: {
                    categories: companyNames.map(name =>
                        name.length > 15 ? name.substring(0, 15) + '...' : name
                    ),
                    labels: {
                        rotate: -30,
                        style: {
                            fontSize: '11px'
                        }
                    }
                },

                plotOptions: {
                    bar: {
                        borderRadius: 5,
                        columnWidth: '50%',
                        distributed: true,
                        dataLabels: {
                            position: 'center' // 🔥 inside bar
                        }
                    }
                },

                plotOptions: {
                    bar: {
                        horizontal: true,
                        borderRadius: 5,
                        distributed: true
                    }
                },

                dataLabels: {
                    enabled: true,
                    formatter: val => "₹" + val,
                    style: {
                        fontSize: '11px',
                        colors: ['#000000']
                    }
                },

                tooltip: {
                    y: {
                        formatter: val => "₹" + val
                    }
                },

                title: {
                    text: "Cost by Company",
                    align: "center"
                }
            };

            var barOptions1 = {
                chart: {
                    type: 'bar',
                    // height: 320,
                    background: '#f8f9fa' // 🎨 light background
                },

                colors: ['#008FFB', '#168612', '#FEB019', '#FF4560', '#775DD0', '#3F51B5'],

                series: [{
                    name: "Cost",
                    data: costs
                }],

                xaxis: {
                    categories: companyNames.map(name =>
                        name.length > 15 ? name.substring(0, 15) + '...' : name
                    ),
                    labels: {
                        rotate: -30,
                        style: {
                            fontSize: '11px'
                        }
                    }
                },

                plotOptions: {
                    bar: {
                        borderRadius: 5,
                        columnWidth: '50%',
                        distributed: true,
                        dataLabels: {
                            position: 'center' // 🔥 inside bar
                        }
                    }
                },

                plotOptions: {
                    bar: {
                        horizontal: true,
                        borderRadius: 5,
                        distributed: true
                    }
                },

                dataLabels: {
                    enabled: true,
                    formatter: val => "₹" + val,
                    style: {
                        fontSize: '11px',
                        colors: ['#000000']
                    }
                },

                tooltip: {
                    y: {
                        formatter: val => "₹" + val
                    }
                },

                title: {
                    text: "Cost by Company",
                    align: "center"
                }
            };


            var barChartModal = new ApexCharts(
                document.querySelector("#cost_bar_chart_modal"),
                barOptions1
            );
            barChartModal.render();

        },

        error: function () {
            salert("Error", "Network issue", "error");
        }
    });
}

function get_bom_list(part) {
    console.log(part);

    $.ajax({
        url: "php/get_bom_list.php",
        type: "get",
        data: { part_id: part },

        success: function (response) {

            $("#bom_list_table_body").empty();

            if (response.trim() === "error") {
                salert("Error", "Server Error", "error");
                return;
            }

            if (response.trim() === "0 result") {
                $("#bom_list_table").removeClass("d-none");
                $("#bom_list_table_body").append(
                    "<li class='list-group-item text-muted'>No BOM List</li>"
                );
                $("#collapseOne").collapse("show");
                return;
            }

            var list = JSON.parse(response);

            $("#bom_list_table").removeClass("d-none");

            list.forEach(item => {
                const html = `
                    <li class="list-group-item d-flex justify-content-between align-items-center"
                        ${item.process !== null ?
                        `data-part_id="${item.part_id}" data-process="1" data-component_cat="${item.component_cat}"`
                        : ""}>

                        <span>
                            ${item.component_cat}
                            ${item.process !== null
                        ? `<span class="status-dot bg-success"></span>`
                        : ``}
                        </span>

                    </li>`;
                $("#bom_list_table_body").append(html);
                if (item.process !== null && list.length == 1) {

                    $("#bom_list_table_body").find("li").trigger("click")

                }

            });

            // if (process_id) {
            //     get_process_graph(part_id, '', process_id);
            //     get_process_summary(process_id);
            // }

            $("#collapseOne").collapse("show");
            $(".accordion-button").removeClass("collapsed");
        },

        error: function () {
            salert("Error", "Network issue", "error");
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