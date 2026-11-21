
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
let allBomData = [];

let productionData = [];
let productionCalendar = null;

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


  $("#summary_search").on("keyup", function () {
    var value = $(this).val().toLowerCase();

    $("#all_bom_table tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  $("#search_order").on("keyup", function () {
    let value = $(this).val().toLowerCase().trim();

    $("#sale_order_details_container .order-card").each(function () {

      let text = $(this).text().toLowerCase();

      $(this).find("input").each(function () {
        text += " " + $(this).val().toString().toLowerCase();
      });

      $(this).toggle(text.includes(value));
    });
  });

  check_login();

  get_sale_order_plan();
  get_duedate_wise_summary();

  $("#unamed").text(localStorage.getItem("ls_uname"))

  $("#sale_order_details_container").on("click", ".sale_span", function () {

    var span = $(this);
    var oid = $(this).data("oid");
    var required_qty = $(this).data("required_qty");
    var entered_qty = $(this).data("entered_qty");

    var card = $(this).closest(".order-card");
    var selected_qty_input = card.find(".selected_qty").val();

    var text = $(this).text().trim();

    card.find(".selected_qty").addClass("change_qty_style");
    setTimeout(() => {
      card.find(".selected_qty").removeClass("change_qty_style");
    }, 600);
    console.log(oid, required_qty, selected_qty_input);

    if ($(this).hasClass("selected_order")) {
      $(this).removeClass("selected_order");
      card.find(".selected_qty").val(parseInt(selected_qty_input) - parseInt(entered_qty));
      $(this).removeData("entered_qty").data("entered_qty", required_qty);
    }
    else {
      $(this).addClass("selected_order");
      $("#enter_qty").val(required_qty).data("req_qty", required_qty);
      $("#sale_qty_modalLabel").text("Sale Order: " + text);
      $(".entered_qty_modal_btn").data({ "span": span, "card": card });
      $("#sale_qty_modal").modal("show");
      // card.find(".selected_qty").val(parseInt(selected_qty_input) + parseInt(required_qty));
    }
  });

  $("#enter_qty").on("focusout", function () {
    var req_qty = $(this).data("req_qty");
    var enter_val = $(this).val() || 0;

    if (req_qty < enter_val) {
      $(this).val(req_qty);
    }
    else if (enter_val < 1) {
      $(this).val(1);
    }
  })

  $(".entered_qty_modal_btn").on("click", function () {
    var span = $(this).data("span");
    var enter_qty = $("#enter_qty").val();

    var card = $(this).data("card");
    var selected_qty_input = card.find(".selected_qty").val();

    span.removeData("entered_qty").data("entered_qty", enter_qty);
    card.find(".selected_qty").val(parseInt(selected_qty_input) + parseInt(enter_qty));
    $("#sale_qty_modal").modal("hide");
    card.find(".selected_qty").addClass("change_qty_style");
    setTimeout(() => {
      card.find(".selected_qty").removeClass("change_qty_style");
    }, 600);
  })

  $("#sale_order_details_container").on("click", ".add_demand_btn", function () {

    var card = $(this).closest(".order-card");
    var selected_orders = card.find(".sale_span.selected_order");
    var plan_name = card.find(".plan_name").val().trim();
    var plan_date = card.find(".plan_date").val() || '';
    var selected_qty = card.find(".selected_qty").val();
    var process_id = $(this).data("process_id");
    var assign_id = [];

    selected_orders.each(function () {

      var entered_qty = $(this).data("entered_qty");
      var ids = $(this).data("ass_ids").toString().split(",");

      ids.forEach(function (id, i) {
        if (i < entered_qty) {
          assign_id.push(parseInt(id, 10));
        }
      });
    });

    console.log(assign_id);

    console.log("P " + plan_name, "s " + selected_qty, "pi " + process_id, "a " + assign_id.length);


    if (plan_name && selected_qty && process_id && assign_id.length > 0 && plan_date != '') {
      $(this).prop("disabled", true);
      create_demand(plan_name, selected_qty, process_id, JSON.stringify(assign_id), plan_date);
    } else {
      salert("Warning", "Please fill all required fields and select at least one order.", "warning");
    }
  });

  $('#openCalendarBtn').on('click', function () {

    get_date_wise_plan_summary();

  });

  $('#calenderModal').on('shown.bs.modal', function () {

    get_date_wise_plan_summary();

  });



});





function create_demand(plan_name, selected_qty, process_id, assign_id, plan_date) {

  console.log(plan_name, selected_qty, process_id, assign_id, plan_date);

  $.ajax({
    url: "php/create_demand.php",
    type: "post", //send it through post method
    data: {
      process_id: process_id,
      created_by: current_user_id,
      plan_name: plan_name,
      production_qty: selected_qty,
      assign_id: assign_id,
      due_date: plan_date
    },
    success: function (response) {
      console.log(response);


      var response = JSON.parse(response);

      if (response.success === true) {
        salert("Success", "Demand created successfully.", "success");
        setTimeout(() => {
          window.location.reload();
        }, 500);

      } else {
        $("#add_demand_btn").prop("disabled", false);

        salert("Warning", response.error, "warning");
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function get_sale_order_plan() {

  $.ajax({
    url: "php/get_sale_order_plan.php",
    type: "get", //send it through get method
    data: {


    },
    success: function (response) {
      console.log(response);



      if (response.trim() != "error") {
        $('#sale_order_details_container').empty();
        if (response.trim() != "0 result") {
          var obj = JSON.parse(response);

          obj.forEach(function (obj) {

            var order_info = JSON.parse(obj.order_info);
            var sale_order_nos = ``;

            order_info.forEach(function (order) {

              var assign_details = order.assign_details;
              var ass_id = [];

              assign_details.forEach(function (ass) {
                ass_id.push(ass.assign_id);
              });

              sale_order_nos += `<span class="badge  text-dark border sale_span selected_order" data-oid="${order.oid}" data-ass_ids="${ass_id.join(',')}" data-required_qty="${order.required_qty}" data-entered_qty="${order.required_qty}">#${order.order_no}</span>`;
            });

            $('#sale_order_details_container').append(`
              <div class="card shadow-sm border-0 rounded-4 order-card mb-2">

                        <div class="card-body p-2">

                            <!-- Sale Order -->
                            <div class="mb-1">
                                <small class="text-muted fw-semibold">Sale Order Nos:</small>
                                <div class="mt-1 d-flex flex-wrap gap-2">
                                    ${sale_order_nos}
                                </div>
                            </div>

                            <hr class="my-1">

                            <!-- Product Details -->
                            <div>
                                <small class="text-muted fw-semibold d-block mb-1">
                                    Product Details
                                </small>

                                <div class="d-flex flex-wrap gap-2 mb-1">
                                    <span class="badge bg-primary">${obj.product}</span>
                                    <span class="badge bg-secondary">${obj.model_name}</span>
                                    <span class="badge bg-success">${obj.type_name}</span>
                                </div>

                                <div class="product-description">
                                    ${obj.sub_type}
                                </div>
                            </div>

                        </div>

                        <div class="card-footer bg-white border-0 p-2">
                          <div class="input-group mb-2">
                              <span class="input-group-text bg-light border-0">
                                  Qty
                              </span>

                              <input type="text"
                                  class="form-control form-control-sm border-0 shadow-none"
                                  disabled
                                  value="Total Qty: ${obj.total_required_qty}">

                              <input type="number"
                                  class="form-control form-control-sm border-0 shadow-none selected_qty"
                                  readonly
                                  value="${obj.total_required_qty}">
                          </div>

                          <div class="row g-2 align-items-center">
                              <div class="col-4">
                                  <input type="date" class="form-control rounded-3 plan_date" placeholder="" >
                              </div>

                              <div class="col-4">
                                  <input type="text"
                                      class="form-control form-control-sm shadow-none plan_name"
                                      placeholder="Enter Plan Name">
                              </div>

                              <div class="col-4">
                                  <button
                                      class="btn btn-sm btn-primary w-100 add_demand_btn"
                                      data-process_id="${obj.process_id}">
                                      Submit <i class="fa-solid fa-arrow-right-to-bracket ms-1"></i>
                                  </button>
                              </div>
                          </div>
                      </div>
                      

                    </div>
              `)
          });

        }
        else {
          $('#sale_order_details_container').html('<div class="alert alert-info" role="alert">No Sale Orders Found</div>');
        }

      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function get_date_wise_plan_summary() {

  $.ajax({
    url: "php/get_date_wise_plan_summary.php",
    type: "GET",
    dataType: "json",

    success: function (response) {

      if (response === "error" || response === "0 result") {
        productionData = [];
      } else {
        productionData = response;
      }

      // Initialize calendar if not already initialized
      if (!productionCalendar) {
        initializeProductionCalendar();
      } else {

        // Refresh calendar events
        productionCalendar.removeAllEvents();

        productionCalendar.addEventSource(
          getCalendarEvents()
        );
      }

    },

    error: function (xhr) {
      console.error("Production calendar error:", xhr.responseText);
    }
  });
}

function getCalendarEvents() {

  return productionData.map(item => ({
    title: `${item.total_production_request_count} `,
    start: item.due_date,
    allDay: true,
    extendedProps: {
      production: item
    }
  }));

}

function initializeProductionCalendar() {

  const calendarEl = document.getElementById('calendar');

  productionCalendar = new FullCalendar.Calendar(calendarEl, {

    initialView: 'dayGridMonth',
    height: 'auto',

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    },

    events: getCalendarEvents(),

    dateClick: function (info) {

      $('.selected-production-date').removeClass(
        'selected-production-date'
      );

      $(info.dayEl).addClass('selected-production-date');

      const selectedData = productionData.find(item =>
        item.due_date === info.dateStr
      );

      displayProductionDetails(selectedData, info.dateStr);

      // Scroll to production details
      // scrollToProductionDetails();

    },

    eventClick: function (info) {

      info.jsEvent.preventDefault();

      const selectedData = info.event.extendedProps.production;

      $('.selected-production-date').removeClass(
        'selected-production-date'
      );

      const dayEl = document.querySelector(
        `#calendar .fc-daygrid-day[data-date="${selectedData.due_date}"]`
      );

      if (dayEl) {
        dayEl.classList.add('selected-production-date');
      }

      displayProductionDetails(
        selectedData,
        selectedData.due_date
      );

      // Scroll to production details
      // scrollToProductionDetails();

    }

  });

  productionCalendar.render();
}

function displayProductionDetails(data, selectedDate) {

  const detailsContainer = $("#productionDetails");
  const countContainer = $("#selectedDateCount");
  const dateContainer = $("#selectedDateText");

  // Format selected date
  const formattedDate = new Date(
    selectedDate + "T00:00:00"
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  dateContainer.text(formattedDate);

  // No production plans for selected date
  if (!data) {

    countContainer.text("0 Requests");

    detailsContainer.html(`
            <div class="text-center text-muted py-4">
                <i class="fa-regular fa-calendar-xmark fa-2x mb-2"></i>
                <p class="mb-0">No production plans for this date.</p>
            </div>
        `);

    return;
  }

  countContainer.text(
    `${data.total_production_request_count} Requests`
  );

  // Parse plan details
  let plans = [];

  try {
    plans = typeof data.plan_details === "string"
      ? JSON.parse(data.plan_details)
      : data.plan_details;

    if (!Array.isArray(plans)) {
      plans = [];
    }

  } catch (error) {
    console.error("Invalid plan_details JSON:", error);
    plans = [];
  }

  if (!plans.length) {
    detailsContainer.html(`
            <div class="text-center text-muted py-3">
                No production plan details available.
            </div>
        `);
    return;
  }

  // Escape database values before inserting into HTML
  const escapeHTML = (value) => {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
  };

  let html = "";

  plans.forEach((plan, index) => {

    const commitmentDate =
      !plan.commitment_date ||
        plan.commitment_date.startsWith("0000-00-00")
        ? "-"
        : plan.commitment_date;

    html += `
            <div class="production-plan-item">

                <div class="d-flex justify-content-between align-items-center gap-2 flex-wrap">

                    <div class="production-plan-title">
                        <i class="fa-solid fa-industry me-1"></i>
                        ${escapeHTML(plan.plan_name || "Production Plan")}
                    </div>

                    <span class="badge bg-success">
                        ${escapeHTML(plan.production_request_count ?? 0)} Requests
                    </span>

                </div>

                <div class="production-info-grid">

                    <div>
                        <span class="production-info-label">Order No</span>
                        <div class="production-info-value">
                            #${escapeHTML(plan.order_no ?? "-")}
                        </div>
                    </div>

                    <div>
                        <span class="production-info-label">Customer</span>
                        <div class="production-info-value">
                            ${escapeHTML(plan.cus_name || "-")}
                        </div>
                    </div>

                    <div>
                        <span class="production-info-label">Product</span>
                        <div class="production-info-value">
                            ${escapeHTML(plan.product || "-")}
                        </div>
                    </div>

                    <div>
                        <span class="production-info-label">Planned Qty</span>
                        <div class="production-info-value text-success">
                            ${escapeHTML(plan.production_request_count ?? 0)}
                        </div>
                    </div>

                    <div>
                        <span class="production-info-label">Required Qty</span>
                        <div class="production-info-value">
                            ${escapeHTML(plan.required_qty ?? 0)}
                        </div>
                    </div>

                    <div>
                        <span class="production-info-label">Chassis</span>
                        <div class="production-info-value">
                            ${escapeHTML(plan.chasis_choice || "-")}
                        </div>
                    </div>

                    <div>
                        <span class="production-info-label">Phone</span>
                        <div class="production-info-value">
                            ${escapeHTML(plan.cus_phone || "-")}
                        </div>
                    </div>

                    <div>
                        <span class="production-info-label">Commitment Date</span>
                        <div class="production-info-value">
                            ${escapeHTML(commitmentDate)}
                        </div>
                    </div>

                </div>

                ${plan.remark ? `
                    <div class="mt-2 pt-2 border-top">
                        <span class="production-info-label">Remark</span>
                        <div class="production-info-value">
                            ${escapeHTML(plan.remark)}
                        </div>
                    </div>
                ` : ""}

            </div>
        `;
  });

  detailsContainer.html(html);
}

function scrollToProductionDetails() {

  setTimeout(function () {

    const modalBody = $('#calenderModal .modal-body');
    const details = $('.production-details-card');

    modalBody.animate({
      scrollTop: modalBody.scrollTop() +
        details.offset().top -
        modalBody.offset().top - 15
    }, 400);

  }, 150);
}


function get_duedate_wise_summary() {

  $.ajax({
    url: "php/get_duedate_wise_summary.php",
    type: "get", //send it through get method
    data: {


    },
    success: function (response) {
      console.log(response);


      if (response.trim() != "error") {

        $('#planned_report_tbody').empty();

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0;

          obj.forEach(function (item) {

            count++;

            // Parse sale order details
            var orderDetails = [];

            try {
              orderDetails = JSON.parse(item.order_details);
            } catch (e) {
              console.error("Invalid order details:", e);
            }

            // Format order information
            var orderHTML = orderDetails.map(function (order) {

              return `
                    <div class="sale-order-item">

                        <div class="order-number">
                            <i class="fa-solid fa-file-invoice me-1"></i>
                            #${escapeHTML(order.order_no)}
                        </div>

                        <div class="order-customer">
                            ${escapeHTML(order.cus_name)}
                        </div>

                        <div class="order-phone">
                            <i class="fa-solid fa-phone me-1"></i>
                            ${escapeHTML(order.cus_phone)}
                        </div>

                        <div class="order-demand">
                            <span>Requested Qty</span>
                            <strong>${escapeHTML(order.required_qty)}</strong>
                        </div>

                    </div>
                `;

            }).join('');

            $('#planned_report_tbody').append(`

                <tr>

                    <!-- S.No -->
                    <td class="text-center text-muted">
                        ${count}
                    </td>

                    <!-- Plan ID -->
                    <td>
                        <div class="plan-id-badge">
                            <i class="fa-solid fa-clipboard-list me-1"></i>
                            ${escapeHTML(item.planner_id)}
                        </div>
                    </td>

                    <!-- Product Details -->
                    <td>
                        <div class="product-details-block">

                            <div class="product-name">
                                ${escapeHTML(item.product)}
                            </div>

                            <div class="product-model">
                                ${escapeHTML(item.model_name)}
                            </div>

                            <div class="product-meta">
                                <span>${escapeHTML(item.type_name)}</span>
                                <span>${escapeHTML(item.sub_type)}</span>
                            </div>

                        </div>
                    </td>

                    <!-- Sale Order Details -->
                    <td>
                        <div class="sale-orders-wrapper">
                            ${orderHTML || '<span class="text-muted">No orders</span>'}
                        </div>
                    </td>

                    <!-- Production Planned Date -->
                    <td>
                        <div class="planned-date-block">

                            <div class="planned-date">
                                <i class="fa-regular fa-calendar-check me-1"></i>
                                ${escapeHTML(item.production_plan_due_date)}
                            </div>

                            <span class="planned-count">
                                ${escapeHTML(item.production_request_count)} Requests
                            </span>

                        </div>
                    </td>

                    <!-- Max Required Date -->
                    <td>
                        <div class="required-date">
                            <i class="fa-regular fa-calendar-xmark me-1"></i>
                            ${escapeHTML(item.max_workorder_due_date)}
                        </div>
                    </td>

                    <!-- Work Order Qty -->
                    <td>
                        <div class="workorder-qty">
                        ${Number(item.work_order_qty).toLocaleString('en-IN', {
                              maximumFractionDigits: 3
                            })}/
                            ${Number(item.demand_qty).toLocaleString('en-IN', {
                              maximumFractionDigits: 3
                            })}
                            <small>Qty.</small>
                        </div>
                    </td>

                </tr>

            `);

          });

        } else {

          $('#planned_report_tbody').html(`
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    <i class="fa-solid fa-inbox fa-2x mb-2 d-block"></i>
                    No production plans found
                </td>
            </tr>
        `);

        }

      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function escapeHTML(value) {

  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[char]);

}

function formatDate(date) {

  if (!date || date === "0000-00-00") return "-";

  const parts = date.split('-');

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
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