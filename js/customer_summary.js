
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

  check_login();

  $("#unamed").text(localStorage.getItem("ls_uname"))




  get_all_bom(1);

  $("#excle_btn").click(function () {

    let table = document.querySelector("table");
    let html = table.outerHTML;

    let url = 'data:application/vnd.ms-excel,' + encodeURIComponent(html);

    let link = document.createElement("a");
    link.href = url;
    link.download = "BOM_Report.xls";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  });


  $("#all_bom_table").on("click", ".summary_btn", function () {

    let index = $(this).data("index");
    let item = allBomData[index];

    let sales = item.sales_statement || {};
    let products = sales.products || [];
    let spares = sales.spares || [];   // safe even if null
    let payments = sales.payments || [];

    let html = `
  <div class="container-fluid small">

    <!-- HEADER -->
    <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
      <div>
        <h6 class="mb-1 fw-bold">${item.customer_name}</h6>
        <div class="text-muted">📞 ${item.customer_phone}</div>
      </div>
      <div class="text-end">
        <div><b>Total Paid:</b> ₹${sales.total_paid_amount || 0}</div>
        <div class="text-danger"><b>Balance:</b> ₹${sales.remaining_balance || 0}</div>
      </div>
    </div>

    <!-- PRODUCTS -->
    <div class="mb-2">
      <div class="fw-bold text-primary border-bottom mb-1">Products</div>
  `;

    if (products.length > 0) {
      products.forEach(p => {

        let details = p.product_details || "";
        let rowHtml = "";

        details.forEach((d, index) => {
          rowHtml += `
        <tr>
          <td>${index + 1}</td>
          <td>${d.order_no || "-"}</td>
          <td>${d.sub_type || "N/A"}</td>
          <td>${d.required_qty || 0}</td>
          <td>₹${d.price || 0}</td>
          <td>₹${d.total_price || 0}</td>
        </tr>
      `;
        });

        html += `
      <div class="mb-3">

        <!-- PRODUCT HEADER -->
        <div class="d-flex justify-content-between align-items-center bg-light p-2 rounded border mb-1">
          <div>
            <div class="fw-bold text-primary">
              ${p.product_name} (${p.type_name})
            </div>
            <div class="small text-muted">
              Model: ${p.model_name}
            </div>
          </div>
          <div class="text-end">
            <div class="small">Qty: <b>${p.total_required_qty}</b></div>
            <div class="fw-bold text-success">₹${p.total_product_price}</div>
          </div>
        </div>

        <!-- DETAILS TABLE -->
        <div class="table-responsive">
          <table class="table table-sm table-bordered mb-0">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>Order</th>
                <th>Sub Type</th>
                <th>Qty</th>
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
    `;
      });
    } else {
      html += `<div class="text-muted">No product data</div>`;
    }

    // SPARES
    html += `
    </div>
    <div class="mb-2">
      <div class="fw-bold text-success border-bottom mb-1">Spares</div>
      <div class="table-responsive mb-2">
        <table class="table table-sm table-bordered">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Details</th>
              <th>Order/No</th>
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
            <td>₹${s.amount || 0}</td>
          </tr>
        `;
        });

      });

      html += `</tbody></table></div>`;
    } else {
      html += `<tr><td colspan="4" class="text-muted text-center">No spares data</td></tr></tbody></table></div>`;
    }

    // PAYMENTS
    html += `
    </div>
    <div class="mb-2">
      <div class="fw-bold text-warning border-bottom mb-1">Payments</div>
  `;

    if (payments.length > 0) {

      html += `
      <div class="table-responsive mb-2">
        <table class="table table-sm table-bordered">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Amount</th>
              <th>Date</th>
              <th>UTR</th>
            </tr>
          </thead>
          <tbody>
    `;

      payments.forEach((pay, i) => {
        html += `
        <tr>
          <td>${i + 1}</td>
          <td>₹${pay.credit || 0}</td>
          <td>${pay.dated || "N/A"}</td>
          <td>${pay.utr_no || "N/A"}</td>
        </tr>
      `;
      });

      html += `</tbody></table></div>`;

    } else {
      html += `<div class="text-muted">No payment records</div>`;
    }

    // PAYMENT SUMMARY
    html += `
    </div>
    <div class="mb-2">

      <div class="fw-bold text-dark border-bottom mb-2">Payment Summary</div>

      <div class="bg-light rounded p-2">

        <div class="d-flex justify-content-between small py-1">
          <span>Product Total</span>
          <span>₹${sales.total_product_amount || 0}</span>
        </div>

        <div class="d-flex justify-content-between small py-1">
          <span>Spares Total</span>
          <span>₹${sales.total_spares_amount || 0}</span>
        </div>

        <div class="d-flex justify-content-between small py-1">
          <span>Paid</span>
          <span class="text-success">₹${sales.total_paid_amount || 0}</span>
        </div>

        <div class="d-flex justify-content-between fw-bold border-top pt-2 mt-1">
          <span>Remaining</span>
          <span class="text-danger">₹${sales.remaining_balance || 0}</span>
        </div>

      </div>

    </div>
    `;
    $("#summary_content").html(html);
    $("#summary_modal").modal("show");
  });


  $("#download_pdf").on("click", function () {

    let element = document.getElementById("summary_content");


    let customerName = $("#summary_content h6").text() || "summary";


    customerName = customerName.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    let opt = {
      margin: 0.5,
      filename: customerName + "_summary.pdf",
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true
      },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };


    setTimeout(() => {
      html2pdf().set(opt).from(element).save();
    }, 300);
  });


  $("#all_bom_table").on("focusout", "td[contenteditable]", function () {

    let enter_amount = $.trim($(this).text());
    let remaining = Number($(this).data("remaining"));
    let cus_id = $(this).data("cus_id");

    let enteredValue = Number(enter_amount);

    
    if (enter_amount === "" || isNaN(enteredValue) || enteredValue < 0) {
        salert("Warning", "Enter a valid amount", "warning");
        return;
    }

    let amount = remaining;

    if (enteredValue > 0) {
        amount = remaining - enteredValue;
    }

    
    if (amount >= 0 && cus_id) {
        insert_temp_spares(amount, cus_id);
    } else {
        salert("Warning", "Invalid calculation or customer ID missing", "warning");
    }

});


  $("#summary_filter").on("change", function () {
    if ($(this).is(":checked")) {
      get_all_bom();
    } else {
      get_all_bom(1);
    }
  })
});




function get_all_bom(red) {

  $.ajax({
    url: "php/get_sales_statement.php",
    type: "get",
    data: {
      customer_id: 0,
    },
    success: function (response) {

      let data = JSON.parse(response);
      allBomData = data;
      $("#all_bom_table").empty();

      if (red > 0) {
        var count = 0
        data.forEach((item, index) => {

          if (item.sales_statement.remaining_balance > 0) {
            count += 1;
            $("#all_bom_table").append(`
          <tr>
            <td>${count}</td>
            <td>${item.customer_name}</td>
            <td>${item.customer_phone}</td>
            <td>${item.sales_statement.total_product_amount}</td>
            <td>${item.sales_statement.total_spares_amount}</td>
            <td>${item.sales_statement.total_paid_amount}</td>
            <td class="color_jay">${item.sales_statement.remaining_balance > 0 ? item.sales_statement.remaining_balance : '-'}</td>
            <td 
              data-cus_id="${item.customer_id}" 
              data-remaining="${item.sales_statement.remaining_balance}" 
              ${item.sales_statement.remaining_balance <= 0 ? 'contenteditable="false" class="bg-light text-muted"' : 'contenteditable="true"'}>
            </td>
            <td>
              <button type="button"   class="btn btn-outline-primary summary_btn"  data-index="${index}">  <i class="fa fa-eye"></i></button>
            </td>
          </tr>
        `);

          }


        });
      } else {
        data.forEach((item, index) => {

          $("#all_bom_table").append(`
          <tr>
            <td>${index + 1}</td>
            <td>${item.customer_name}</td>
            <td>${item.customer_phone}</td>
            <td>${item.sales_statement.total_product_amount}</td>
            <td>${item.sales_statement.total_spares_amount}</td>
            <td>${item.sales_statement.total_paid_amount}</td>
            <td class="color_jay">${item.sales_statement.remaining_balance > 0 ? item.sales_statement.remaining_balance : '-'}</td>
            <td 
              data-cus_id="${item.customer_id}" 
              data-remaining="${item.sales_statement.remaining_balance}" 
              ${item.sales_statement.remaining_balance <= 0 ? 'contenteditable="false" class="bg-light text-muted"' : 'contenteditable="true"'}>
            </td>
            <td>
              <button type="button"   class="btn btn-outline-primary summary_btn"  disabled data-index="${index}">  <i class="fa fa-eye"></i></button>
            </td>
          </tr>
        `);




        });
      }

    },
    error: function (xhr) {
      console.log(xhr);
    }
  });

}

function insert_temp_spares(amount, cus_id) {
  console.log(amount, cus_id);

  $.ajax({
    url: "php/insert_temp_spares.php",
    type: "post", //send it through get method
    data: {

      customer_id: cus_id,
      amount: amount,
    },
    success: function (response) {
      console.log(response);



      if (response.trim() == "ok") {
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