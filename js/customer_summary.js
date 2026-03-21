
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


 

  get_all_bom()

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
    let spares = sales.spares || [];

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
          <div class="text-danger"><b>Balance:</b> ₹${sales.reamining_balance || 0}</div>
        </div>
      </div>

      <!-- PRODUCTS -->
      <div class="mb-2">
        <div class="fw-bold text-primary border-bottom mb-1">Products</div>
  `;




    if (products.length > 0) {
      products.forEach(p => {

        let details = p.product_details || [];

        html += `<div class="border rounded p-2 mb-2 bg-light">`;

        details.forEach(d => {
          html += `
          <div class="d-flex justify-content-between">
            <div>
              <b>${d.product_name || "-"}</b>
              <div class="text-muted">
                Model: ${d.model_name || "-"} | Order: ${d.order_no || "-"}
              </div>
              <div class="text-muted">
                Type: ${d.type_name || "N/A"} | Subtype: ${d.sub_type || "N/A"}
              </div>
            </div>
          </div>
        `;
        });

        html += `
        <div class="d-flex justify-content-between">
        <div class="fw-bold text-dark mt-1">
          DCF: ${p.dcf_id ?? "N/A"} | ${p.dcf_date ?? "N/A"}
        </div>
        <div class="text-end fw-bold">₹${p.total_product_price || 0}</div>
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
  `;

    if (spares.length > 0) {
      spares.forEach(s => {

        html += `<div class="border rounded p-2 mb-2 bg-light">`;

        let details = s.spares_details || [];

        details.forEach(d => {
          html += `<div>${d.details || "-"}</div>`;
        });

        html += `
        <div class="d-flex justify-content-between">
        <div class="fw-bold text-dark mt-1">
          DCF: ${s.dcf_id ?? "N/A"} | ${s.dcf_date ?? "N/A"}
        </div>
        <div class="text-end fw-bold">₹${s.amount || 0}</div>
        </div>
      </div>
      `;
      });
    } else {
      html += `<div class="text-muted">No spares data</div>`;
    }


    //  PAYMENTS LIST
    let payments = sales.payments || [];

    html += `
      </div>
      <div class="mb-2">
        <div class="fw-bold text-warning border-bottom mb-1">Payments</div>
      `;

    if (payments.length > 0) {

      html += `<div class="border rounded p-2 bg-light">`;

      payments.forEach((pay, i) => {
        html += `
      <div class="d-flex justify-content-between border-bottom py-1">
        <div>
          <div><b>#${i + 1}</b> ₹${pay.credit || 0}</div>
          <div class="text-muted small">
            📅 ${pay.dated || "N/A"}
          </div>
        </div>
        <div class="text-end small">
          UTR: ${pay.utr_no || "N/A"}
        </div>
      </div>
    `;
      });

      html += `</div>`;

    } else {
      html += `<div class="text-muted">No payment records</div>`;
    }


    // PAYMENT DETAILS
    html += `
    </div>
    <div class="mb-2">
      <div class="fw-bold text-dark border-bottom mb-1">Payment Summary</div>
      <div class="d-flex justify-content-between">
        <span>Product Total</span>
        <span>₹${sales.total_product_amount || 0}</span>
      </div>
      <div class="d-flex justify-content-between">
        <span>Spares Total</span>
        <span>₹${sales.total_spares_amount || 0}</span>
      </div>
      <div class="d-flex justify-content-between">
        <span>Paid</span>
        <span class="text-success">₹${sales.total_paid_amount || 0}</span>
      </div>
      <div class="d-flex justify-content-between fw-bold border-top mt-1 pt-1">
        <span>Remaining</span>
        <span class="text-danger">₹${sales.reamining_balance || 0}</span>
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
});




function get_all_bom() {

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

      data.forEach((item, index) => {

        $("#all_bom_table").append(`
          <tr>
            <td>${index + 1}</td>
            <td>${item.customer_name}</td>
            <td>${item.customer_phone}</td>
            <td>${item.sales_statement.total_product_amount}</td>
            <td>${item.sales_statement.total_spares_amount}</td>
            <td>${item.sales_statement.total_paid_amount}</td>
            <td>${item.sales_statement.reamining_balance}</td>
            <td></td>
            <td></td>
            <td>
              <button type="button"   class="btn btn-outline-primary summary_btn"  data-index="${index}">  <i class="fa fa-eye"></i></button>
            </td>
          </tr>
        `);


      });

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