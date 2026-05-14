
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var narration = urlParams.get('narration') || '';
var oid = urlParams.get('oid');
var customer_id = urlParams.get('cus_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var ass_id = [];
var spare_id = [];
var oid_arr = []

$(document).ready(function () {

  $("#loader-overlay").hide();

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
  get_godown_name();
  if (oid != null) {
    get_sales_product()
    get_sales_cus()
  }
  $("#unamed").text(localStorage.getItem("ls_uname"))

  $('#create_godown').on('shown.bs.modal', function () {
    get_godown();
  });

  $('#create_godown').on('hidden.bs.modal', function () {
    $('#godown_form')[0].reset();
    get_godown_name()
  });


  $('#add_godown').on('click', function () {
    $('#create_godown').modal('show');
  });

  $("#add_godown_btn").click(function () {

    if ($('#godown_form')[0].checkValidity()) {

      insert_godown();
    }



  });


  $('#godown_table').on('click', 'button', function () {
    var gid = $(this).val();
    swal({
      title: "Are you sure?",
      text: "Once deleted, you wil  l not be able to recover this Godown!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        delete_godown(gid);
      }
    });

  });


  $('#godown').change(function () {
    var des = $("#godown option:selected").data('des');
    $('#godown_des').val(des)

  });

  $("#sales_pro_table").on('click', 'input', function () {

    if ($(this).prop("checked")) {
      $("#selected_qty").val(parseInt($("#selected_qty").val()) + 1)
    }
    else {
      $("#selected_qty").val(parseInt($("#selected_qty").val()) - 1)
    }

  })


  $("#ok_btn").on('click', function () {


    $("#sptable").empty()
    $("#spaytable").empty()
    ass_id = []
    oid_arr = []
    var total_amount = 0
    var total_qty = 0
    $("#sales_pro_table > tr").each(function () {

      var count = 0

      var billing_amount = $(this).data("billing_amount")

      $(this).find("td").eq(4).find("input:checked").each(function () {
        count++;
        total_qty++;
        ass_id.push($(this).val());
        spare_id.push($(this).data("spare_id"));
      });

      if (count > 0) {
        console.log($(this).find("td").eq(1).find("ul").data("price"));
        var tamount = parseInt($(this).find("td").eq(1).find("ul").data("price")) * parseInt(count) || billing_amount
        total_amount = total_amount + tamount
        var len = $("#sptable tr").length + 1;
        $("#sptable").append("<tr>" + "<td>" + len + "</td>" + "<td>" + $(this).find("td").eq(1).html() + "</td>" + "<td>" + $(this).find("td").eq(2).html() + "</td>" + "<td>" + $(this).find("td").eq(3).html() + "</td>" + "<td>" + count + "</td>" + "<td colspan='2'>" + tamount + "</td>")
        oid_arr.push($(this).find("td").eq(2).html().trim())
        $("#sptable").find("tr:last").find("td").eq(1).append("<p class=\"text-bg-secondary rounded small\">Billing Amount/Machine - ₹" + billing_amount + "</p>")

      }


    })


    $("#sptable").append("<tr ><td colspan = ''>" + "Total" + "</td><td>" + total_qty + "</td><td colspan='2'>" + total_amount + "</td></tr>")
    if (ass_id.length > 0) {
      shw_toast("Success", "Machine Selected")

      console.log(oid_arr);

      oid_arr = [...new Set(oid_arr)].map(val => `'${val}'`).join(',');
      ass_id = [...new Set(ass_id)].map(val => `'${val}'`).join(',');
      console.log(oid_arr);
      get_jaysan_payment();

    }
    else
      shw_toast("Warning", "Kindly select Machine")

  })

  $("#same").on("click", function () {

    if ($(this).prop("checked")) {
      $("#consignee").val($("#buyer").val())
      $("#con_gst").val($("#buy_gst").val())
      $("#con_contact").val($("#buy_contact").val())
      $("#con_pan").val($("#buy_pan").val())
      $("#consignee").prop("disabled", true)
      $("#con_gst").prop("disabled", true)
      $("#con_contact").prop("disabled", true)

    }
    else {
      $("#consignee").val("")
      $("#con_gst").val("")
      $("#con_contact").val("")
      $("#con_pan").val("")
      $("#consignee").prop("disabled", false)
      $("#con_gst").prop("disabled", false)
      $("#con_contact").prop("disabled", false)

    }
  })


  $("#dcf_submit_btn").on("click", function () {
    if (ass_id.length > 0 && $("#consignee").val() != "" && $("#godown").val() != null) {
      $("#dcf_submit_btn").prop("disabled", true);
      $("#print_company").html($("#godown_des").val().replace(/\n/g, "<br>"));
      $("#print_consignee").html($("#consignee").val().replace(/,/g, ",<br>").replace(/\n/g, "<br>"));
      $("#print_buyer").html($("#buyer").val().replace(/,/g, ",<br>").replace(/\n/g, "<br>"));
      $("#print_con_gst").text($("#con_gst").val())
      $("#print_buy_gst").text($("#buy_gst").val())
      $("#print_con_contact").text($("#con_contact").val())
      $("#print_buy_contact").text($("#buy_contact").val())
      $("#print_transport").text($("#transport_mode").val())
      $("#print_transport_payment").text($("#transport_ref").val())
      $("#print_vno").text($("#transport_vno").val())
      $("#print_driver").text($("#transport_driver").val())
      $("#print_con_pan").text($("#con_pan").val())
      $("#print_buy_pan").text($("#buy_pan").val())



      $("#print_dated").text(getIndianDateTime())


      $("#dcf_print_by").text(current_user_name)
      $("#sptable > tr").each(function () {

      })
      $(".print_product").after($("#sptable").html())
      $(".print_payment").after($("#spaytable").html())
      console.log(($("#sptable").html())
      );

      console.log($("#print_company").html());


      insert_dcf()
    }


    else
      shw_toast("error", "Kindly select Required", "")
  })

  $("#print_btn").on("click", function () {




    print()

    // // Apply inline styles to ensure proper rendering
    // document.querySelectorAll("#dcf_print table, #dcf_print th, #dcf_print td").forEach(function(element) {
    //   element.style.border = "1px solid black";
    //   element.style.borderCollapse = "collapse";
    //   element.style.padding = "5px";
    //   element.style.textAlign = "center";
    // });

    // // Ensure colspan and rowspan are respected
    // document.querySelectorAll("#dcf_print [colspan], #dcf_print [rowspan]").forEach(function(element) {
    //   element.style.display = "table-cell";
    //   element.style.verticalAlign = "middle";
    // });



    //   // Ensure the element is properly selected
    // if ($("#dcf_print").length) {
    //   var options = {
    //     margin: 10,
    //     filename: 'invoice.pdf',
    //     image: { type: 'jpeg', quality: 0.98 },
    //     html2canvas: { 
    //         scale: 4,  // Higher scale for better quality
    //         useCORS: true,
    //         allowTaint: true,
    //         logging: true // Enable for debug info
    //     },
    //     jsPDF: { unit: 'mm', format: 'a5', orientation: 'portrait' }
    // };

    // html2pdf().set(options).from(document.getElementById("dcf_print")).save();






    // } else {
    //   console.error("Element #dcf_print not found!");
    // }

  })

  get_sale_statement()

  $("#add_extra").on("click", function () {

    var qno = $("#quotation_no").val();
    var amount = $("#amount").val();
    var remark = $("#remark").val();

    if (oid && qno && remark && amount && customer_id) {
      $(this).prop("disabled", true)
      insert_sale_order_spares_dcf(oid, qno, remark, amount, "null", customer_id);

    } else {
      console.log(oid, qno, remark, amount, dcf_no, customer_id);
      salert("Warning", "Fill All Feilds/Data Missing!, Try Later", "warning");
    }
  })

  $(".fa-pencil").on("click", function(){
    $("#buyer, #buy_gst, #buy_contact").prop("disabled", false);
  })

});




function insert_sale_order_spares_dcf(oid, qno, remark, amount, dcf_no, customer_id) {

  console.log(oid, qno, remark, amount, dcf_no, customer_id);


  $.ajax({
    url: "php/insert_sale_order_spares.php",
    type: "post", //send it through get method
    data: {
      oid: oid,
      qno: qno,
      remark: remark,
      amount: amount,
      dcf_no: dcf_no,
      customer_id: customer_id,


    },
    success: function (response) {

      //console.log

      if (response.toString().includes("ok")) {

        $("#quotation_no").val('');
        $("#amount").val("")
        $("#remark").val("")
        $("#close_modal_btn").trigger("click");
        shw_toast("Success", "Spares Updated", "success")
        window.location.reload();

      }





    },
    error: function (xhr) {
      //console.logxhr.responseText)
    }
  });




}

function print() {



  $('#dcf_print').printThis({




  });


}




function get_sale_statement() {

  $.ajax({
    url: "php/get_sale_statement.php",
    type: "get",
    data: { cus_id: 6481 },

    success: function (response) {

      if (response.trim() === "0 result" || response.trim() === "error") return;

      const outer = JSON.parse(response);
      const data = JSON.parse(outer[0].full_result);

      const payments = data.payments || [];
      const products = data.products || [];

      let paymentHtml = `
        <div class="statement-box payment-box">
          <div class="statement-title">💳 Payments</div>

          <div class="payment-timeline">
            ${payments.map(p => `
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <div class="small text-muted">${p.dated}</div>
                  ${p.utr_no ? `<div class="small">UTR: ${p.utr_no}</div>` : ""}
                  <div class="fw-bold text-success">₹${p.credit.toLocaleString()}</div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
        `;

      var p_count = 0;
      payments.forEach(function (p) {
        p_count++;
        $("#payment_tbody").append("<tr><td>" + p_count + "</td><td>" + p.credit + "</td><td>" + p.utr_no + "</td><td>" + p.order_no + "</td><td>" + p.dated + "</td></tr>");
      });


      var prod_count = 0;
      products.forEach(function (p) {
        prod_count++;
        var product_details = ''
        p.product_details.forEach(function (d) {
          product_details += `
              <li class="small">${d.product_name} - ${d.model_name} - ${d.type_name} - ${d.sub_type} - Order/no: ${d.order_no} - Price: ₹${d.price}</li>
            `;

        });
        $("#product_tbody").append("<tr><td>" + prod_count + "</td><td>" + product_details + "</td><td>" + p.dcf_id + "</td><td>" + p.dcf_date + "</td><td>" + p.total_product_price + "</td></tr>");
      });

      let productHtml = `
      <div class="statement-box product-box">
        <div class="statement-title">📦 Products</div>

        ${products.map(p => `
          <div class="invoice-card">
            <div class="invoice-header">
              <span>DCF #${p.dcf_id}</span>
              <span class="badge bg-dark">${p.dcf_date}</span>
            </div>

            ${p.product_details.map(d => `
              <div class="invoice-row">
                <div class="fw-semibold">${d.product_name}</div>
                <div class="small text-muted">
                  ${d.model_name} · ${d.type_name}
                </div>
                <div class="small fst-italic text-break">${d.sub_type}</div>

                <div class="price-row">
                  <span>Price</span>
                  <span>₹${d.price.toLocaleString()}</span>
                </div>
                <div class="price-row text-success">
                  <span>Billing</span>
                  <span>₹${d.billing_amount.toLocaleString()}</span>
                </div>
              </div>
            `).join("")}

            <div class="invoice-total">
              Total : ₹${p.total_product_price.toLocaleString()}
            </div>
          </div>
        `).join("")}
      </div>
      `;





      let summaryHtml = `
      <div class="statement-box summary-box">
        <div class="statement-title">📊 Summary</div>

        <div class="summary-row">
          <span>Total Product</span>
          <span>₹${data.total_product_amount.toLocaleString()}</span>
        </div>

        <div class="summary-row">
          <span>Total Spares</span>
          <span>₹${data.total_spares_amount.toLocaleString()}</span>
        </div>

        <div class="summary-row text-success">
          <span>Total Paid</span>
          <span>₹${data.total_paid_amount.toLocaleString()}</span>
        </div>

        <div class="balance-box">
          <div class="small text-muted">Remaining Balance</div>
          <div class="balance-amount">
            ₹${data.reamining_balance.toLocaleString()}
          </div>
        </div>
      </div>
      `;

      $("#product_price_tbody").html(`
      <tr>
        <td style="width:25%">${paymentHtml}</td>
        <td style="width:50%">${productHtml}</td>
        <td style="width:25%">${summaryHtml}</td>
      </tr>
      `);

    }
  });
}




function insert_sale_order_spares(oid, qno, remark, amount, dcf_no, customer_id) {


  $.ajax({
    url: "php/insert_sale_order_spares.php",
    type: "POST", //send it through get method
    data: {
      oid: oid,
      qno: qno,
      remark: remark,
      amount: amount,
      dcf_no: dcf_no,
      customer_id: customer_id

    },
    success: function (response) {
      $("#extraProductModal").modal("hide");
      console.log(response);

      if (response.trim() == "ok") {

        // $("#amount").val('');
        // $("#quotation_no").val('');
        // $(this).data("oid", '');
        // $(this).data("cus_id", '');
        // $("#remark").val('');


        // get_sales_product()
        // get_sales_cus()
        window.location.reload();
      }





    },
    error: function (xhr) {
      salert("Warning", xhr.responseText, "warning")
    }
  });




}



function insert_dcf() {


  $.ajax({
    url: "php/insert_dcf.php",
    type: "POST", //send it through get method
    data: {
      consignee: $('#consignee').val(),
      con_gst: $('#con_gst').val(),
      con_con: $('#con_contact').val(),
      trans_mode: $('#transport_mode').val(),
      trans_ref: $('#transport_ref').val(),
      dcf_by: current_user_id,
      ass_arr: ass_id,
      dcf_report: $("#dcf_print").html(),
      narration: narration,
      spares_arr: 0,

    },
    beforeSend: function () {

      // Show full-screen loader
      $("#loader-overlay").show();
    },
    success: function (response) {
      $("#loader-overlay").hide();
      console.log(response);

      if (response.trim() > 0) {
        $("#dcf_submit_btn").prop("disabled", true);
        // $("#dcf").find("*").prop("disabled", false);
        $("#print_btn").prop("disabled", false)
        shw_toast("success", "Dispatch Clearance Form Created", "")
        $("#dcf_no").text(response.trim());
        setTimeout(() => {
          // console.log($("#dcf_print").html());

          update_dcf($("#dcf_print").html(), response.trim())
        }, 100);
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}
function update_dcf(dcf_report, dcf_id) {


  $.ajax({
    url: "php/update_dcf.php",
    type: "POST", //send it through get method
    data: {
      dcf_report: dcf_report,
      dcf_id: dcf_id

    },
    beforeSend: function () {

      // Show full-screen loader
      $("#loader-overlay").show();
    },
    success: function (response) {
      $("#loader-overlay").hide();
      console.log(response);

      if (response.trim() == "ok") {
        $("#print_btn").trigger("click");
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}


function get_jaysan_payment() {


  $.ajax({
    url: "php/get_sales_payment.php",
    type: "get", //send it through get method
    data: {
      oid_arr: oid_arr

    },
    success: function (response) {
      console.log(response);


      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0
          var advance  = ''


          obj.forEach(function (obj) {
            count = count + 1;
            advance = (obj.pay_sts == 'advance') ? `<strong class="text-primary blink ">Advance Payment</strong>` : '';
            $('#spaytable').append("<tr><td>" + count + "</td><td>" + obj.order_no + "</td><td>" + obj.ref_no + "</td><td>" + obj.utr_no + "</td><td colspan=''>" + obj.date_f + " " +advance+ "</td><td  colspan=''>" + Number(obj.amount.replace(/₹|,/g, '')).toLocaleString('en-IN') + "</td><td>" + obj.sts + "</td></tr>")

          });

          get_bal_payment()
        }
        else {
          // $("#@id@") .append("<td colspan='4' scope='col'>No Data</td>");

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}



function get_bal_payment() {
  console.log(oid_arr);


  $.ajax({
    url: "php/get_bal_payment.php",
    type: "get", //send it through get method
    data: {
      oid_arr: oid_arr

    },
    success: function (response) {
      console.log(response);


      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;
            var tot_amt = $("#sptable tr:last").find("td").eq(2).html();

            var ic = "<i class='text-success fa-solid fa-thumbs-up'></i>"
            console.log(parseInt(obj.balance));

            if (parseInt(tot_amt) > parseInt(obj.balance)) {
              ic = "<i class='text-danger fa-solid fa-thumbs-down'></i>"
            }

            var formatter = new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              minimumFractionDigits: 2
            });

            var formattedBalance = formatter.format(obj.balance);
            $("#sptable tr:last").find("td").eq(2).html(formatter.format($("#sptable tr:last").find("td").eq(2).html()))
            $('#sptable').append("<tr class = 'text-bg-warning'><td colspan='5'> Available Amount " + ic + "</td><td colspan='2'>" + formattedBalance + "</td></tr>")

          });


        }
        else {
          // $("#@id@") .append("<td colspan='4' scope='col'>No Data</td>");

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}


function get_sales_cus() {


  $.ajax({
    url: "php/get_sales_cus.php",
    type: "get", //send it through get method
    data: {
      oid: oid

    },
    success: function (response) {


      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;
            $('#buyer').val(obj.cus_address)
            $('#buy_gst').val(obj.cus_gst)
            $('#buy_contact').val(obj.cus_phone)

          });


        }
        else {
          // $("#@id@") .append("<td colspan='0' scope='col'>No Data</td>");

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function get_sales_product() {


  $.ajax({
    url: "php/get_sales_product.php",
    type: "get", //send it through get method
    data: {
      oid: oid

    },
    success: function (response) {

      console.log(response);

      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;
            $('#sales_pro_table').append("<tr data-billing_amount='" + obj.billing_amount + "'><td>" + count + "</td><td>" + obj.product + "</td><td>" + obj.order_no + "</td><td>" + obj.delivered + "</td><td class=''>" + obj.rtd + "</td></tr>")

          });
          get_sale_order_spares()

        }
        else {
          // $("#@id@") .append("<td colspan='4' scope='col'>No Data</td>");
          get_sale_order_spares();
        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function get_sale_order_spares() {


  $.ajax({
    url: "php/get_sale_order_spares.php",
    type: "get", //send it through get method
    data: {
      oid: oid

    },
    success: function (response) {

      console.log(response);

      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = $("#sales_pro_table tr").length;


          obj.forEach(function (obj) {
            count = count + 1;
            $('#sales_pro_table').append("<tr data-billing_amount='" + obj.amount + "'><td>" + count + "</td><td> Qno: <b class='text-primary'>" + obj.qno +"</b> - " + obj.remark + "</td><td>" + obj.order_no + "</td><td>" + '' + "</td><td><input type='checkbox' data-spare_id='" + obj.spares_id + "'></input></td></tr>")

          });


        }
        else {
          // $("#@id@") .append("<td colspan='4' scope='col'>No Data</td>");

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function get_godown_name() {


  $.ajax({
    url: "php/get_godown_name.php",
    type: "get", //send it through get method
    data: {

    },
    success: function (response) {
      $('#godown').empty()
      $('#godown').append("<option disabled  selected>Choose Options...</option>")

      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;
            $('#godown').append("<option data-des = '" + obj.des + "' value = '" + obj.gid + "'>" + obj.godown_name + "</option>")

          });


        }
        else {
          // $("#@id@") .append("<td colspan='0' scope='col'>No Data</td>");

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function delete_godown(gid) {


  $.ajax({
    url: "php/delete_godown.php",
    type: "get", //send it through get method
    data: {
      gid: gid

    },
    success: function (response) {


      if (response.trim() == "ok") {

        get_godown();
        shw_toast("Godown Deleted", "Godown Deleted Successfully", "success");

      }

      else if (response.trim() == "error") {
        shw_toast("Error", "Error Deleting Godown", "error");

      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}




function get_godown() {


  $.ajax({
    url: "php/get_godown.php",
    type: "get", //send it through get method
    data: {

    },
    success: function (response) {

      $('#godown_table').empty()
      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;
            $('#godown_table').append("<tr><td>" + count + "</td><td>" + obj.godown_name + "</td><td>" + obj.place + "</td><td>" + obj.address + "</td><td>" + obj.gst + "</td><td><button type ='button' value='" + obj.gid + "' class='btn btn-outline-danger border-0'><i class='fa fa-trash'></i></button></td></tr>")

          });


        }
        else {
          // $("#@id@") .append("<td colspan='5' scope='col'>No Data</td>");

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}


function insert_godown() {


  $.ajax({
    url: "php/insert_godown.php",
    type: "get", //send it through get method
    data: {
      godown_name: $('#godown_name').val(),
      place: $('#place').val(),
      address: $('#address').val(),
      gst: $('#gst').val()

    },
    success: function (response) {


      if (response.trim() == "ok") {

        shw_toast("Godown Created", "Godown Created Successfully", "success");

        $('#godown_form')[0].reset();
        get_godown();
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


function getIndianDateTime() {
  let date = new Date();
  let indianOffset = 5.5 * 60 * 60 * 1000;
  let utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  let indianDate = new Date(utc + indianOffset);

  let day = indianDate.getDate().toString().padStart(2, '0');
  let month = (indianDate.getMonth() + 1).toString().padStart(2, '0');
  let year = indianDate.getFullYear();

  let hours = indianDate.getHours();
  let minutes = indianDate.getMinutes().toString().padStart(2, '0');
  let seconds = indianDate.getSeconds().toString().padStart(2, '0');

  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 0 to 12
  hours = hours.toString().padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
}