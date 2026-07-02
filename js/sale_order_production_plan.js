
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

  $("#unamed").text(localStorage.getItem("ls_uname"))

  $("#sale_order_details_container").on("click", ".sale_span", function () {
    var oid = $(this).data("oid");
    var required_qty = $(this).data("required_qty");

    var card = $(this).closest(".order-card");
    var selected_qty_input = card.find(".selected_qty").val();

    card.find(".selected_qty").addClass("change_qty_style");
    setTimeout(() => {
      card.find(".selected_qty").removeClass("change_qty_style");
    }, 600);
    console.log(oid, required_qty, selected_qty_input);

    if ($(this).hasClass("selected_order")) {
      $(this).removeClass("selected_order");
      card.find(".selected_qty").val(parseInt(selected_qty_input) - parseInt(required_qty));
    }
    else {
      $(this).addClass("selected_order");
      card.find(".selected_qty").val(parseInt(selected_qty_input) + parseInt(required_qty));
    }
  });

  $("#sale_order_details_container").on("click", ".add_demand_btn", function () {

    var card = $(this).closest(".order-card");
    var selected_orders = card.find(".sale_span.selected_order");
    var plan_name = card.find(".plan_name").val().trim();
    var selected_qty = card.find(".selected_qty").val();
    var process_id = $(this).data("process_id");
    var assign_id = [];

    selected_orders.each(function () {

      var ids = $(this).data("ass_ids").toString().split(",");

      ids.forEach(function (id) {
        assign_id.push(parseInt(id, 10));
      });

    });

    if (plan_name && selected_qty && process_id && assign_id.length > 0) {
      create_demand(plan_name, selected_qty, process_id, JSON.stringify(assign_id));
    } else {
      salert("Warning", "Please fill all required fields and select at least one order.", "warning");
    }
  });

});





function create_demand(plan_name, selected_qty, process_id, assign_id) {

  console.log(plan_name, selected_qty, process_id, assign_id);

  $.ajax({
    url: "php/create_demand.php",
    type: "post", //send it through post method
    data: {
      process_id: process_id,
      created_by: current_user_id,
      plan_name: plan_name,
      production_qty: selected_qty,
      assign_id: assign_id
    },
    success: function (response) {
      console.log(response);


      var response = JSON.parse(response);

      if (response.success === true) {
        alert("Success", "Demand created successfully.", "success");

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

              sale_order_nos += `<span class="badge  text-dark border sale_span selected_order" data-oid="${order.oid}" data-ass_ids="${ass_id.join(',')}" data-required_qty="${order.required_qty}">#${order.order_no}</span>`;
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
                              <div class="col-8">
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