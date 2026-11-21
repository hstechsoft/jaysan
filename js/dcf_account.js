
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

    get_dcf_report_accounting('', '', '');

    $("#unamed").text(localStorage.getItem("ls_uname"))

    $('#customer').on('input', function () {
        //check the value not empty
        if ($('#customer').val() != "") {
            $('#customer').data("cus_id", '');
            $('#customer').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/assign_product_customer_autocomplete.php",
                        type: "get", //send it through get method
                        data: {

                            term: request.term


                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.cus_name,
                                    value: item.cus_name,
                                    cus_id: item.cus_id,
                                    phone: item.cus_phone,
                                    // part_name: item.part_name
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("cus_id", ui.item.cus_id);
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)
                    //  get_bom(ui.item.id)


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div style='font-size:12px;'><strong>" + item.label + "</strong> - " + item.phone + "</div>")
                    .appendTo(ul);
            };
        }

    });

    $('#customer_name_id').on('input', function () {
        //check the value not empty
        if ($('#customer_name_id').val() != "") {
            $('#customer_name_id').data("cus_id", '');
            $('#customer_name_id').autocomplete({
                //get data from databse return as array of object which contain label,value

                source: function (request, response) {
                    $.ajax({
                        url: "php/assign_product_customer_autocomplete.php",
                        type: "get", //send it through get method
                        data: {

                            term: request.term


                        },
                        dataType: "json",
                        success: function (data) {

                            console.log(data);
                            response($.map(data, function (item) {
                                return {
                                    label: item.cus_name,
                                    value: item.cus_name,
                                    cus_id: item.cus_id,
                                    phone: item.cus_phone,
                                    // part_name: item.part_name
                                };
                            }));

                        }

                    });
                },
                minLength: 2,
                cacheLength: 0,
                select: function (event, ui) {

                    $(this).data("cus_id", ui.item.cus_id);
                    //   $('#part_name_out').data("selected-part_id", ui.item.id);
                    //   $('#part_name_out').val(ui.item.part_name)
                    //  get_bom(ui.item.id)


                },

            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div style='font-size:12px;'><strong>" + item.label + "</strong> - " + item.phone + "</div>")
                    .appendTo(ul);
            };
        }

    });


    $("#dcf_report_tbody").on("click", ".view_btn", function () {
        var dcf_id = $(this).val();

        get_dcf_report_accounting_details(dcf_id);

    });

    $("#dcf_report_tbody").on("click", ".cancel_btn", function () {
        var dcf_id = $(this).val();

        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to cancel this sale order!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel it!"
        }).then((result) => {
            if (result.isConfirmed) {
                cancal_dcf_accounting(dcf_id);
            }
        });

    });

    $("#save_dcf_details").on("click", function () {

        var dcf_id = $(this).val();
        var invoice_no = $(this).data("invoice");
        var dated = $(this).data("date");

        var products = [];

        $("#sale_order_details_card > .card").each(function () {

            var card = $(this);

            var product_details = card.find(".product-details-text");

            var product_id = product_details.data("product_id");
            var product_qty = product_details.data("product_qty");

            var distribution = [];

            card.find(".price_distribution_tbody tr").each(function () {

                var row = $(this);

                var billing_input = row.find(".billing_amount");
                var price_input = row.find(".order_price");

                var cus_id = billing_input.data("customer");

                var billing_amount = billing_input.val();
                var order_price = price_input.val();

                distribution.push({
                    cus_id: cus_id,
                    amount: order_price,
                    billing_amount: billing_amount
                });

            });

            products.push({
                product_id: product_id,
                qty: product_qty,
                distribution: distribution
            });

        });

        var data = {
            dcf_id: dcf_id,
            invoice_no: invoice_no,
            dated: dated,
            products: products
        };

        console.log(data);
        // insert_dcf_accounting(dcf_id, invoice_no, dated, products);

    });

    $("#dcf_status").on("change", function () {
        report();
    })

    $("#sale_order_on").on("input", function () {
        report();
    })

    $("#customer").on("input, focusout", function () {
        report();
    })

    $("#sale_order_details_card").on("click", ".price_distribution_tbody .add_customer", function () {
        $("#customer_addModal").modal("show");
    });

    $("#sale_order_details_card").on("click", ".price_distribution_tbody .delete_customer", function () {
        var row = $(this).closest("tr");

        Swal.fire({
            title: 'Are you sure?',
            text: "You are about to delete this customer row.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                if ($("#sale_order_details_card .price_distribution_tbody tr").length > 1) {
                    row.remove();
                }
            }
        });
    });


});

function report() {
    var customer = $("#customer").data("cus_id") || '';
    var order_on = $("#sale_order_no").val() || '';
    var dcf_sts = $("#dcf_status").val() || '';

    get_dcf_report_accounting(customer, dcf_sts, order_on);
}

function get_dcf_report_accounting_details(dcf_id) {
    console.log(dcf_id);

    $.ajax({
        url: "php/get_dcf_report_accounting_details.php",
        type: "get", //send it through get method
        data: {

            dcf_id: dcf_id,
        },
        success: function (response) {
            console.log(response);




            if (response.trim() !== 'error') {

                $("#sale_order_details_card").empty();
                $("#save_dcf_details").val('').removeData("invoice").removeData("date").removeData("delivery_from");

                if (response.trim() !== '0 result') {

                    var obj = JSON.parse(response);

                    var dcf = obj[0];

                    $("#save_dcf_details").val(dcf.dcf_id).data("invoice", dcf.invoice_no).data("date", dcf.dcf_date).data("delivery_from", dcf.delivery_from);

                    $("#sale_order_detailsModalLabel").text(
                        `DCF No: ${dcf.dcf_id}`
                    );

                    $("#dcf_customer_name").text(
                        `Customer: ${dcf.cus_name}`
                    );

                    var parent_chain = [];

                    try {
                        parent_chain = JSON.parse(dcf.parent_chain || '[]');
                    } catch (e) {
                        console.error("Invalid parent chain JSON", e);
                    }

                    var sale_orders = [];

                    try {
                        sale_orders = JSON.parse(dcf.sale_order || '[]');
                    } catch (e) {
                        console.error("Invalid sale order JSON", e);
                    }

                    // HTML escape helper
                    function escapeHtml(value) {
                        return String(value ?? '').replace(/[&<>"']/g, function (char) {
                            return {
                                '&': '&amp;',
                                '<': '&lt;',
                                '>': '&gt;',
                                '"': '&quot;',
                                "'": '&#039;'
                            }[char];
                        });
                    }

                    let html = '';

                    sale_orders.forEach(function (order, index) {

                        // Sale order card
                        html += `
                            <div class="card border shadow-sm mb-3">

                                <div class="card-header bg-light py-2">
                                    <div class="d-flex justify-content-between align-items-center">

                                        <div>
                                            <span class="fw-bold text-primary">
                                                Sale Order #${escapeHtml(order.order_no)}
                                            </span>
                                        </div>

                                        <span class="badge bg-secondary">
                                            Order ${index + 1}
                                        </span>

                                    </div>
                                </div>

                                <div class="card-body  p-3">

                                    <!-- Product Details -->
                                    <div class="mb-3 p-2 rounded bg-light">
                                        <div class="small fw-bold text-secondary mb-1">
                                            PRODUCT DETAILS
                                        </div>

                                        <div class="small product-details-text" data-product_id = "${order.opid}" data-product_qty = "${order.required_qty}">${order.product}</div>

                                        <div class="small d-flex justify-content-between">
                                            <span class="small text-muted">
                                                Delivery From: ${order.delivery_from_name || '-'}
                                            </span>

                                            <strong class="small text-success">
                                                Invoice: ${dcf.invoice_no || '-'}
                                            </strong>
                                        </div>
                                    </div>

                                    <!-- Billing Details Table -->
                                    <div class="table-responsive">

                                        <table class="table table-sm table-bordered align-middle mb-0">

                                            <thead class="table-light">
                                                <tr>
                                                    <th style="width:45%">Customer Name</th>
                                                    <th style="width:27%">Billing Amount</th>
                                                    <th style="width:28%">Price</th>
                                                    <th style="width:10%">Action</th>
                                                </tr>
                                            </thead>

                                            <tbody class='price_distribution_tbody'>

                                                <!-- Main Customer -->
                                                <tr>
                                                    <td>
                                                        <div class="fw-semibold">
                                                            ${escapeHtml(dcf.cus_name)}
                                                        </div>
                                                        <small class="text-muted">Main Customer</small>
                                                    </td>

                                                    <td data-cus_id="${dcf.customer_id}">
                                                        <input type="number"
                                                            class="form-control form-control-sm billing_amount"
                                                            data-order="${index}"
                                                             data-customer="${dcf.customer_id}"
                                                            value="${escapeHtml(order.billing_amount)}">
                                                    </td>

                                                    <td>
                                                        <input type="number"
                                                            class="form-control form-control-sm order_price"
                                                            data-order="${index}"
                                                            data-customer="main"
                                                            value="${escapeHtml(order.price)}">
                                                    </td>

                                                    <td><button type="button" class="btn btn-sm btn-primary add_customer">+</button></td>
                                                </tr>
                        `;

                        // Parent Customers
                        parent_chain.forEach(function (parent, parentIndex) {

                            html += `
                                <tr>

                                    <td>
                                        <div class="fw-semibold">
                                            <i class="bi bi-diagram-2 text-primary me-1"></i>
                                            ${escapeHtml(parent.cus_name)}
                                        </div>

                                        <small class="text-muted">
                                            Parent Level ${escapeHtml(parent.level)}
                                        </small>
                                    </td>

                                    <td data-cus_id="${parent.parent_cus_id}">
                                        <input type="number"
                                            class="form-control form-control-sm billing_amount"
                                            data-order="${index}"
                                            data-customer="${escapeHtml(parent.parent_cus_id)}"
                                            data-level="${escapeHtml(parent.level)}"
                                            placeholder="Billing amount">
                                    </td>

                                    <td>
                                        <input type="number"
                                            class="form-control form-control-sm order_price"
                                            data-order="${index}"
                                            data-customer="${escapeHtml(parent.parent_cus_id)}"
                                            data-level="${escapeHtml(parent.level)}"
                                            placeholder="Price">
                                    </td>

                                    <td><button type="button" class="btn btn-sm btn-danger delete_customer"><i class="bi bi-trash"></i></button></td>

                                </tr>
                            `;

                        });

                        html += `
                                            </tbody>
                                        </table>

                                    </div>

                                </div>
                            </div>
                        `;

                    });

                    $("#sale_order_details_card").html(html);

                } else {

                    $("#sale_order_detailsModalLabel").text("DCF Details");
                    $("#dcf_customer_name").text("");

                    $("#sale_order_details_card").html(`
                        <div class="text-center text-muted py-5">
                            <i class="bi bi-inbox fs-2 d-block mb-2"></i>
                            No data found
                        </div>
                    `);

                }

                $("#sale_order_detailsModal").modal("show");

            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function get_dcf_report_accounting(customer, dcf_sts, order_no) {
    console.log(customer, dcf_sts, order_no);

    $.ajax({
        url: "php/get_dcf_report_accounting.php",
        type: "get", //send it through get method
        data: {

            customer: customer,
            dcf_sts: dcf_sts,
            order_no: order_no,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() !== 'error') {
                $("#dcf_report_tbody").empty();
                if (response.trim() !== '0 result') {

                    var obj = JSON.parse(response);


                    let count = 0;

                    obj.forEach(function (item) {

                        count++;

                        let sale_order = '';

                        let sale_order_details = [];

                        try {
                            sale_order_details = JSON.parse(item.sale_order || '[]');
                        } catch (error) {
                            console.error("Invalid sale order JSON:", error);
                        }

                        sale_order_details.forEach(function (order) {

                            sale_order += `
                                <div class="dcf-sale-order">

                                    <div class="d-flex justify-content-between align-items-center gap-2">

                                        <span class="small text-muted">
                                            <i class="bi bi-receipt me-1"></i>
                                            Sale Order #${order.order_no}
                                        </span>

                                        <span class="fw-semibold text-primary">
                                            ${order.cus_name || ''}
                                        </span>

                                    </div>

                                    <div class="dcf-product">
                                        ${order.product || ''}
                                    </div>

                                </div>
                            `;
                        });

                        $("#dcf_report_tbody").append(`

                            <tr>

                                <td class="text-center text-muted">
                                    ${count}
                                </td>

                                <td>
                                    <div class="fw-bold text-dark">
                                        # ${item.dcf_id}
                                    </div>

                                    <span class="badge bg-primary ">
                                        ${item.sts}
                                    </span>
                                </td>

                                <td>
                                    <div class="dcf-order-list">
                                        ${sale_order || '<span class="text-muted small">No orders</span>'}
                                    </div>
                                </td>

                                <td>
                                    <div class="dcf-consignee">
                                        ${item.consignee || '-'}
                                    </div>
                                </td>

                                <td>
                                    <div class="dcf-from">
                                        ${item.delivery_from_name || '-'}
                                    </div>
                                </td>

                                <td>
                                    <div class="fw-semibold">
                                        ${item.emp_name || '-'}
                                    </div>

                                    <small class="text-muted">
                                        <i class="bi bi-calendar3 me-1"></i>
                                        ${item.dated || '-'}
                                    </small>
                                </td>

                                <td class="text-center text-nowrap">

                                    <button type="button"
                                        class="btn btn-sm btn-outline-primary view_btn"
                                        value="${item.dcf_id}"
                                        title="View DCF">
                                        <i class="bi bi-eye"></i>
                                    </button>

                                    <button type="button"
                                        class="btn btn-sm btn-outline-danger cancel_btn"
                                        value="${item.dcf_id}"
                                        title="Cancel DCF">
                                        <i class="bi bi-x-circle"></i>
                                    </button>

                                </td>

                            </tr>

                        `);

                    });


                }
                else {
                    $("#dcf_report_tbody").append(`<tr><td colspan="6" class="text-center">No data found</td></tr>`);
                }
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function insert_dcf_accounting(dcf_id, invoice_no, dated, products) {

    $.ajax({
        url: "php/insert_dcf_accounting.php",
        type: "get", //send it through get method
        data: {

            sts: "done",
            dcf_id: dcf_id,
            invoice_no: invoice_no,
            dated: dated,
            products: products,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == 'ok') {

                location.reload();
            }





        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });




}

function cancal_dcf_accounting(dcf_id) {

    $.ajax({
        url: "php/cancal_dcf_accounting.php",
        type: "post", //send it through get method
        data: {

            sts: "cancelled",
            dcf_id: dcf_id,
        },
        success: function (response) {
            console.log(response);



            if (response.trim() == 'ok') {

                location.reload();
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