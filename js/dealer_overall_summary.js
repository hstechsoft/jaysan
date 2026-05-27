
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


    $("#dealer_summary_filter").on("keyup", function () {
        var value = $(this).val().toLowerCase();

        $("#delar_overall_table tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    check_login();

    $("#unamed").text(localStorage.getItem("ls_uname"))


    get_all_bom();


    $("#delar_overall_table").on("click", ".summary_btn", function () {

        let index = $(this).data("index");
        let item = allBomData[index];

        let sales = item.sales_statement || {};
        let products = sales.products || [];
        let spares = sales.spares || [];
        let payments = sales.payments || [];
        let payments_ledger = [];
        let sale_order = [];
        let credit_note = [];
        let product_price = [];

        let accordionId = `summaryAccordion_${index}`;

        let html = `
                <div class="container-fluid small">

                    <!-- HEADER -->
                    <div class="d-flex justify-content-between align-items-start border-bottom pb-2 mb-3">

                        <div>
                            <h6 class="mb-1 fw-bold text-dark">
                                ${item.customer_name}
                            </h6>

                            <div class="text-muted small">
                                📞 ${item.customer_phone}
                            </div>
                        </div>

                        <div class="text-end">

                            <div class="small">
                                <b>Total Paid :</b>
                                <span class="text-success">
                                    ₹ ${Number(sales.total_paid_amount || 0).toLocaleString('en-IN')}
                                </span>
                            </div>

                            <div class="small">
                                <b>Balance :</b>
                                <span class="text-danger">
                                    ₹ ${Number(sales.remaining_balance || 0).toLocaleString('en-IN')}
                                </span>
                            </div>

                        </div>

                    </div>

                    <!-- ACCORDION -->
                    <div class="accordion accordion-flush" id="${accordionId}">
                `;

        // =========================================================
        // PRODUCTS
        // =========================================================

        html += `
                <div class="accordion-item border rounded mb-2 overflow-hidden shadow-sm">

                    <h2 class="accordion-header">

                        <button class="accordion-button py-2 fw-bold text-primary"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#products_${index}"
                                aria-expanded="true">

                            <i class="bi bi-box-seam me-2"></i>
                            Products

                        </button>

                    </h2>

                    <div id="products_${index}"
                        class="accordion-collapse collapse "
                        data-bs-parent="#${accordionId}">

                        <div class="accordion-body p-2">
                `;

        if (products.length > 0) {

            products.forEach(p => {

                let details = p.product_details || [];
                let rowHtml = "";

                details.forEach((d, i) => {

                    rowHtml += `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${d.order_no || "-"}</td>
                                <td>${d.sub_type || "N/A"}</td>
                                <td>${d.required_qty || 0}</td>
                                <td>${d.dcf || 0}</td>
                                <td>${d.invoice || 0}</td>
                                <td>₹${Number(d.price || 0).toLocaleString('en-IN')}</td>
                                <td>₹${Number(d.total_price || 0).toLocaleString('en-IN')}</td>
                            </tr>
                            `;
                });

                html += `
                        <div class="card border-0 shadow-sm mb-3">

                            <div class="card-body p-2">

                                <!-- PRODUCT HEADER -->
                                <div class="d-flex justify-content-between align-items-center bg-light rounded p-2 mb-2">

                                    <div>

                                        <div class="fw-bold text-primary">
                                            ${p.product_name} (${p.type_name})
                                        </div>

                                        <small class="text-muted">
                                            Model : ${p.model_name}
                                        </small>

                                    </div>

                                    <div class="text-end">

                                        <div class="small">
                                            Qty :
                                            <b>${p.total_required_qty}</b>
                                        </div>

                                        <div class="fw-bold text-success">
                                            ₹ ${Number(p.total_product_price).toLocaleString('en-IN')}
                                        </div>

                                    </div>

                                </div>

                                <!-- TABLE -->
                                <div class="table-responsive">

                                    <table class="table table-sm table-bordered align-middle mb-0">

                                        <thead class="table-light">

                                            <tr>
                                                <th>#</th>
                                                <th>Order</th>
                                                <th>Sub Type</th>
                                                <th>Qty</th>
                                                <th>DCF</th>
                                                <th>Invoice</th>
                                                <th>Price</th>
                                                <th>Total</th>
                                            </tr>

                                        </thead>

                                        <tbody>
                                            ${rowHtml}
                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        </div>
                        `;
            });

        } else {

            html += `
                <div class="text-muted text-center py-2">
                    No product data
                </div>
                `;
        }

        html += `</div></div></div>`;

        // =========================================================
        // SPARES
        // =========================================================

        html += `
                <div class="accordion-item border rounded mb-2 overflow-hidden shadow-sm">

                    <h2 class="accordion-header">

                        <button class="accordion-button collapsed py-2 fw-bold text-success"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#spares_${index}"
                                aria-expanded="false">

                            <i class="bi bi-tools me-2"></i>
                            Spares

                        </button>

                    </h2>

                    <div id="spares_${index}"
                        class="accordion-collapse collapse"
                        data-bs-parent="#${accordionId}">

                        <div class="accordion-body p-2">

                            <div class="table-responsive">

                                <table class="table table-sm table-bordered align-middle mb-0">

                                    <thead class="table-light">

                                        <tr>
                                            <th>#</th>
                                            <th>Details</th>
                                            <th>Order/No</th>
                                            <th>DCF</th>
                                            <th>Invoice</th>
                                            <th>Amount</th>
                                        </tr>

                                    </thead>

                                    <tbody>
            `;

        if (spares && spares.length > 0) {

            let count = 0;

            spares.forEach((s) => {

                let details = s.spares_details || [];

                details.forEach(function (sd) {

                    count++;

                    html += `
                        <tr>
                            <td>${count}</td>
                            <td>${sd.details || "-"}</td>
                            <td>${s.order_no || "-"}</td>
                            <td>${s.dcf || "-"}</td>
                            <td>${s.invoice || "-"}</td>
                            <td>₹ ${Number(s.amount || 0).toLocaleString('en-IN')}</td>
                        </tr>
                        `;
                });

            });

        } else {

            html += `
                <tr>
                    <td colspan="4" class="text-center text-muted">
                        No spares data
                    </td>
                </tr>
                `;
        }

        html += `</tbody></table></div></div></div></div>`;

        


        // =========================================================
        // PRODUCT PRICE
        // =========================================================

        html += `
            <div class="accordion-item border rounded mb-2 overflow-hidden shadow-sm">

                <h2 class="accordion-header">

                    <button class="accordion-button collapsed py-2 fw-bold text-danger"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#product_price${index}"
                            aria-expanded="false">

                        <i class="fa-solid fa-circle-dollar-to-slot me-2"></i> 
                        Product Price

                    </button>

                </h2>

                <div id="product_price${index}"
                    class="accordion-collapse collapse"
                    data-bs-parent="#${accordionId}">

                    <div class="accordion-body p-2">
            `;

        // if (product_price && product_price.length > 0) {

            html += `
                <div class="table-responsive">

                    <table class="table table-sm table-bordered align-middle mb-0">

                        <thead class="table-light text-nowrap">

                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>Model</th>
                                <th>Type</th>
                                <th>Sub-types</th>
                                <th>Machine Price</th>
                                <th>Billing Price</th>
                            </tr>

                        </thead>

                        <tbody>
                `;

            product_price.forEach((price, i) => {

                html += `
                        <tr>

                            <td>${i + 1}</td>

                            <td>
                                <div class="fw-semibold">
                                    ${price.product || "-"}
                                </div>
                            </td>

                            <td>
                                <div class="fw-semibold">
                                    ${price.model || "-"}
                                </div>
                            </td>

                            <td class="text-nowrap">
                                ${price.type || "N/A"}
                            </td>

                            <td class="text-nowrap">
                                ${price.sub_type || "-"}
                            </td>

                            <td class="text-nowrap">
                                ${price.machine_price || "-"}
                            </td>

                            <td class="text-nowrap">
                                ${price.billing_price || "-"}
                            </td>

                        </tr>
                        `;
            });

            html += `</tbody></table></div>`;

        // } else {

        //     html += `
        //         <div class="text-muted text-center py-2">
        //             No Sale Order
        //         </div>
        //         `;
        // }

        html += `</div></div></div>`;


        // =========================================================
        // PAYMENTS
        // =========================================================

        html += `
            <div class="accordion-item border rounded mb-2 overflow-hidden shadow-sm">

                <h2 class="accordion-header">

                    <button class="accordion-button collapsed py-2 fw-bold text-warning"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#payments_${index}"
                            aria-expanded="false">

                        <i class="bi bi-credit-card me-2"></i>
                        Payments

                    </button>

                </h2>

                <div id="payments_${index}"
                    class="accordion-collapse collapse"
                    data-bs-parent="#${accordionId}">

                    <div class="accordion-body p-2">
            `;

        if (payments.length > 0) {

            html += `
                <div class="table-responsive">

                    <table class="table table-sm table-bordered align-middle mb-0">

                        <thead class="table-light">

                            <tr>
                                <th>#</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>UTR</th>
                                <th>Payment Mode</th>
                                <th>Sale Order No</th>
                            </tr>

                        </thead>

                        <tbody>
                `;

            payments.forEach((pay, i) => {

                html += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>₹ ${Number(pay.credit || 0).toLocaleString('en-IN')}</td>
                        <td>${pay.dated || "N/A"}</td>
                        <td>${pay.utr_no || "N/A"}</td>
                        <td>${pay.mode || "N/A"}</td>
                        <td>${pay.sale_order_no || "N/A"}</td>
                    </tr>
                    `;
            });

            html += `</tbody></table></div>`;

        } else {

            html += `<div class="text-muted text-center py-2">No payment records</div>`;
        }

        html += `</div></div></div>`;


        // =========================================================
        // PAYMENTS LEDGER
        // =========================================================

        html += `
            <div class="accordion-item border rounded mb-2 overflow-hidden shadow-sm">

                <h2 class="accordion-header">

                    <button class="accordion-button collapsed py-2 fw-bold text-secondary"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#payments_ledger_${index}"
                            aria-expanded="false">

                        <i class="fa fa-bank me-2"></i>
                        Payments Ledger

                    </button>

                </h2>

                <div id="payments_ledger_${index}"
                    class="accordion-collapse collapse"
                    data-bs-parent="#${accordionId}">

                    <div class="accordion-body p-2">
            `;

        // if (payments_ledger && payments_ledger.length > 0) {

            html += `
                <div class="table-responsive">

                    <table class="table table-sm table-bordered align-middle mb-0">

                        <thead class="table-light text-nowrap">

                            <tr>
                                <th>#</th>
                                <th>From Bank</th>
                                <th>To Bank</th>
                                <th>Date</th>
                                <th>UTR</th>
                                <th class="text-success">Credit</th>
                                <th class="text-danger">Debit</th>
                            </tr>

                        </thead>

                        <tbody>
                `;

            payments_ledger.forEach((ledger, i) => {

                html += `
                        <tr>

                            <td>${i + 1}</td>

                            <td>
                                <div class="fw-semibold">
                                    ${ledger.fbanck || "-"}
                                </div>
                            </td>

                            <td>
                                <div class="fw-semibold">
                                    ${ledger.tbank || "-"}
                                </div>
                            </td>

                            <td class="text-nowrap">
                                ${ledger.date || "N/A"}
                            </td>

                            <td class="text-nowrap">
                                ${ledger.utr_no || "-"}
                            </td>

                            <td class="text-success fw-bold">
                                ₹ ${Number(ledger.credit || 0).toLocaleString('en-IN')}
                            </td>

                            <td class="text-danger fw-bold">
                                ₹ ${Number(ledger.debit || 0).toLocaleString('en-IN')}
                            </td>

                        </tr>
                        `;
            });

            html += `</tbody></table></div>`;

        // } else {

        //     html += `
        //         <div class="text-muted text-center py-2">
        //             No payment ledger records
        //         </div>
        //         `;
        // }

        html += `</div></div></div>`;


        // =========================================================
        // SALE ORDER DETAILS
        // =========================================================

        html += `
            <div class="accordion-item border rounded mb-2 overflow-hidden shadow-sm">

                <h2 class="accordion-header">

                    <button class="accordion-button collapsed py-2 fw-bold text-info"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#sale_order_details${index}"
                            aria-expanded="false">

                        <i class="fa-brands fa-shopify"></i>
                        Sale Order Details

                    </button>

                </h2>

                <div id="sale_order_details${index}"
                    class="accordion-collapse collapse"
                    data-bs-parent="#${accordionId}">

                    <div class="accordion-body p-2">
            `;

        // if (sale_order && sale_order.length > 0) {

            html += `
                <div class="table-responsive">

                    <table class="table table-sm table-bordered align-middle mb-0">

                        <thead class="table-light text-nowrap">

                            <tr>
                                <th>#</th>
                                <th>Sale Order No</th>
                                <th>Employee</th>
                                <th>Date</th>
                                <th>DCF</th>
                            </tr>

                        </thead>

                        <tbody>
                `;

            sale_order.forEach((so, i) => {

                html += `
                        <tr>

                            <td>${i + 1}</td>

                            <td>
                                <div class="fw-semibold">
                                    ${so.sale_order_no || "-"}
                                </div>
                            </td>

                            <td>
                                <div class="fw-semibold">
                                    ${so.emp_name || "-"}
                                </div>
                            </td>

                            <td class="text-nowrap">
                                ${so.date || "N/A"}
                            </td>

                            <td class="text-nowrap">
                                ${so.dcf || "-"}
                            </td>

                        </tr>
                        `;
            });

            html += `</tbody></table></div>`;

        // } else {

        //     html += `
        //         <div class="text-muted text-center py-2">
        //             No Sale Order
        //         </div>
        //         `;
        // }

        html += `</div></div></div>`;




        // =========================================================
        // CREDIT NOTE
        // =========================================================

        html += `
            <div class="accordion-item border rounded mb-2 overflow-hidden shadow-sm">

                <h2 class="accordion-header">

                    <button class="accordion-button collapsed py-2 fw-bold text-dark"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#credit_note${index}"
                            aria-expanded="false">

                        <i class="fa-solid fa-colon-sign"></i>
                        Credit Note

                    </button>

                </h2>

                <div id="credit_note${index}"
                    class="accordion-collapse collapse"
                    data-bs-parent="#${accordionId}">

                    <div class="accordion-body p-2">
            `;

        // if (credit_note && credit_note.length > 0) {

            html += `
                <div class="table-responsive">

                    <table class="table table-sm table-bordered align-middle mb-0">

                        <thead class="table-light text-nowrap">

                            <tr>
                                <th>#</th>
                                <th>Sale Order No</th>
                                <th>Employee</th>
                                <th>Date</th>
                                <th>CN Value</th>
                                <th>CN Approved By</th>
                                <th>CN Status</th>
                            </tr>

                        </thead>

                        <tbody>
                `;

            credit_note.forEach((so, i) => {

                html += `
                        <tr>

                            <td>${i + 1}</td>

                            <td>
                                <div class="fw-semibold">
                                    ${so.sale_order_no || "-"}
                                </div>
                            </td>

                            <td>
                                <div class="fw-semibold">
                                    ${so.emp_name || "-"}
                                </div>
                            </td>

                            <td class="text-nowrap">
                                ${so.date || "N/A"}
                            </td>

                            <td class="text-nowrap">
                                ${so.credit_note_value || "-"}
                            </td>

                            <td class="text-nowrap">
                                ${so.credit_note_approved_by || "-"}
                            </td>

                            <td class="text-nowrap">
                                ${so.credit_note_status || "-"}
                            </td>

                        </tr>
                        `;
            });

            html += `</tbody></table></div>`;

        // } else {

        //     html += `
        //         <div class="text-muted text-center py-2">
        //             No Sale Order
        //         </div>
        //         `;
        // }

        html += `</div></div></div>`;

        // =========================================================
        // PAYMENT SUMMARY
        // =========================================================

        html += `
            <div class="card border-0 shadow-sm mt-3">

                <div class="card-body p-3">

                    <div class="fw-bold text-dark border-bottom pb-2 mb-2">
                        Payment Summary
                    </div>

                    <div class="d-flex justify-content-between small py-1">
                        <span>Product Total</span>
                        <span>₹ ${Number(sales.total_product_amount || 0).toLocaleString('en-IN')}</span>
                    </div>

                    <div class="d-flex justify-content-between small py-1">
                        <span>Spares Total</span>
                        <span>₹ ${Number(sales.total_spares_amount || 0).toLocaleString('en-IN')}</span>
                    </div>

                    <div class="d-flex justify-content-between small py-1">
                        <span>Paid</span>
                        <span class="text-success">
                            ₹ ${Number(sales.total_paid_amount || 0).toLocaleString('en-IN')}
                        </span>
                    </div>

                    <div class="d-flex justify-content-between fw-bold border-top pt-2 mt-2">
                        <span>Remaining</span>
                        <span class="text-danger">
                            ₹ ${Number(sales.remaining_balance || 0).toLocaleString('en-IN')}
                        </span>
                    </div>

                </div>

            </div>

        </div>
        `;

        $("#summary_content").html(html);
        $("#summary_modal").modal("show");

    });


});





function get_all_bom() {

    $.ajax({
        url: "php/get_sales_statement.php",
        type: "get",
        data: {
            customer_id: 0,
        },
        success: function (response) {

            if (response.trim() != 'error') {
                $("#delar_overall_table").empty();
                if (response.trim() != '0 result') {

                    let data = JSON.parse(response);

                    allBomData = data;

                    $("#delar_overall_table").empty();

                    data.forEach((item, index) => {

                        let rowIndex = index + 1;

                        $("#delar_overall_table").append(`

                                                <tr class="small">

                                                    <td class="fw-bold text-center">
                                                        ${rowIndex}
                                                    </td>

                                                    <td>

                                                        <div class="fw-semibold text-dark text-capitalize">
                                                            ${item.customer_name || '-'}
                                                        </div>

                                                    </td>

                                                    <td class="text-nowrap">
                                                        ${item.customer_phone || '-'}
                                                    </td>

                                                    <td class="text-end fw-semibold">
                                                        ₹  ${Number(item.sales_statement.total_product_amount || 0).toLocaleString('en-IN')}
                                                    </td>

                                                    <td class="text-end fw-semibold">
                                                        ₹ ${Number(item.sales_statement.total_spares_amount || 0).toLocaleString('en-IN')}
                                                    </td>

                                                    <td class="text-end text-success fw-bold">
                                                        ₹${Number(item.sales_statement.total_paid_amount || 0).toLocaleString('en-IN')}
                                                    </td>

                                                    <td class="text-end">

                                                        ${item.sales_statement.remaining_balance > 0

                                ? `<span class="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">
                                                                ₹ ${Number(item.sales_statement.remaining_balance).toLocaleString('en-IN')}
                                                        </span>`

                                : `<span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                                                                Cleared
                                                        </span>`
                            }

                                                    </td>

                                                    <td class="text-center">

                                                        <button type="button"
                                                                class="btn btn-sm btn-outline-primary rounded summary_btn"
                                                                data-index="${index}"
                                                                title="View Summary">

                                                            <i class="fa fa-eye"></i>

                                                        </button>

                                                    </td>

                                                </tr>

                                                `);

                    });

                } else {

                    $("#delar_overall_table").html(`<tr><td colspan="8" class="text-center text-danger py-4"><i class="fa fa-database me-2"></i>No Data Found</td></tr>`);

                }
            }
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