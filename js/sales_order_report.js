
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var sub_type_box_value = '';
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




  // filter section //

  $('#emp_auto').on('input', function () {
    //check the value not empty
    if ($('#emp_auto').val() != "") {
      $('#emp_auto').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_employee_auto.php",
            type: "get", //send it through get method
            data: {

              emp_name: request.term


            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.emp_name,
                  value: item.emp_name,
                  cus_id: item.emp_id,
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

          $(this).data("emp_id", ui.item.cus_id);
          //   $('#part_name_out').data("selected-part_id", ui.item.id);
          //   $('#part_name_out').val(ui.item.part_name)
          //  get_bom(ui.item.id)
          $("#cust_phone_auto").val(ui.item.phone);
          console.log($("#cust_auto").data("selected-cus_id"));



        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div style='font-size:12px;'><strong>" + item.label + "</strong></div>")
          .appendTo(ul);
      };
    }

  });

  $('#cust_auto').on('input', function () {
    //check the value not empty
    if ($('#cust_auto').val() != "") {
      $('#cust_auto').autocomplete({
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
          $("#cust_phone_auto").val(ui.item.phone);
          // console.log($("#cust_auto").data("selected-cus_id"));



        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div style='font-size:12px;'><strong>" + item.label + "</strong> - " + item.phone + "</div>")
          .appendTo(ul);
      };
    }

  });

  $('#cust_phone_auto').on('input', function () {
    //check the value not empty
    let cus_no = $(this).val().trim();
    cus_no = "%" + cus_no + "%";
    if (cus_no != "") {

      $('#cust_phone_auto').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_phone_autocomplete.php",
            type: "get", //send it through get method
            data: {

              cus_phone: cus_no


            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.cus_name,
                  value: item.cus_phone,
                  cus_id: item.cus_id,
                  // phone: item.cus_phone,
                  // part_name: item.part_name
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $("#cust_auto").data("cus_id", ui.item.cus_id);
          //   $('#part_name_out').data("selected-part_id", ui.item.id);
          //   $('#part_name_out').val(ui.item.part_name)
          //  get_bom(ui.item.id)
          $("#cust_auto").val(ui.item.label);
          console.log(ui.item.cus_id);



        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div style='font-size:12px; width:270px;'><strong>" + item.label + "</strong> - " + item.value + "</div>")
          .appendTo(ul);
      };
    }

  });

  assign_product_get_product_list();
  get_production_sts();

  $("#product_name_select").on("change", function (event) {
    event.preventDefault();
    $("#model_select").val("null");
    $("#sub_type_box").val("");
    $("#type_select").val("null");
    $("#sub_type_select").val("");
    assign_product_get_model_list($(this).val());

  });


  $("#model_select").on("change", function (event) {
    event.preventDefault();

    $("#type_select").val("null");
    $("#sub_type_box").val("");
    $("#sub_type_select").val("");

    assign_product_get_type_list($(this).val());

  });

  $("#type_select").on("change", function (event) {
    event.preventDefault();

    $("#sub_type_select").val("");
    $("#sub_type_box").val("");
    $('#sub_type_select').data("type_id", $(this).val());

  });

  $('#sub_type_select').on('input', function () {
    //check the value not empty

    if ($('#sub_type_select').val() != "" && $('#sub_type_select').data("type_id")) {
      $('#sub_type_select').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_subtype_auto.php",
            type: "get", //send it through get method
            data: {

              subtype_name: $('#sub_type_select').val(),
              mtid: $('#sub_type_select').data("type_id")

            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.subtype_name,
                  value: item.subtype_name,
                  cus_id: item.msid,
                  // phone: item.cus_phone,
                  // part_name: item.part_name
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("msid", ui.item.cus_id);
          //   $('#part_name_out').data("selected-part_id", ui.item.id);
          //   $('#part_name_out').val(ui.item.part_name)
          //  get_bom(ui.item.id)



        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div style='font-size:12px;'><strong>" + item.label + "</strong></div>")
          .appendTo(ul);
      };
    }
    else {
      salert("Warning", "Model Id or sub_type Missing", "warning");
    }

  });


  $("#sub_type_add_btn").on("click", function () {

    if ($("#sub_type_select").val() != null) {

      if ($("#sub_type_box").val() == "") {
        sub_type_box_value = $("#sub_type_select").val();
      }
      else {
        sub_type_box_value = sub_type_box_value + "," + $("#sub_type_select").val();
      }

      $("#sub_type_box").val(sub_type_box_value);
      $("#sub_type_select").val("")

    }
    else {
      salert("Warning", "Select sub type first", "warning")
    }
  })

  $("#filter_btn").on("click", function () {

    var emp = $("#emp_auto").val() || "";
    var cust = $("#cust_auto").data("cus_id") || "";
    var order_no = $("#order_no").val() || "";
    var product_name = $("#product_name_select").val() || "";
    var model = $("#model_select").val() || "";
    var type = $("#type_select").val() || "";
    var sub_type_box = $("#sub_type_box").val() || "";
    var statuss = $("#status").val() || "";
    var unassigned_qty = $("#unassigned_qty").val() || "";
    var payment = $("#payment").val() || "";
    var order_category = $("#sales_cate :checked") ? "Sales" : "Requirement" || '';
    var godown = $("#godown").val() || "";
    var remaining_dcf = $("#remaining_dcf").val() || "";



    var sale_date = "";
    if ($("#sale_s_date").val() != "" && $("#sale_e_date").val() != "") {
      sale_date = "'"+$("#sale_s_date").val()+"'" + " and " + "'"+$("#sale_e_date").val()+"'";
    }

    var production_date = "";
    if ($("#production_s_date").val() != "" && $("#production_e_date").val() != "") {
      production_date = "'"+$("#production_s_date").val()+"'" || + " and " + "'"+$("#production_e_date").val()+"'";
    }

    console.log($("#cust_auto").data("cus_id"));
    console.log(production_date);

    if (emp === "" && cust === "" && order_category === "" && godown === "" && e_date === "" && order_no === "" && unassigned_qty === "" && payment === "" && sale_date === "" && production_date === "" && remaining_dcf === "" && (product_name === "" || product_name === null) && (model === "" || model === null) && (type === "" || type === null) && sub_type_box === "" && (statuss === "" || statuss === null)) {
      salert("Warning", "At least one field is required", "warning");
      return;
    }

    // alert("Filter applied");
    get_sale_order_report(
      emp, cust, order_no, statuss, product_name, type, model, sub_type_box, unassigned_qty, payment, sale_date, godown, production_date, remaining_dcf, order_category
    )
    sub_type_box_value = ""
  });



  // filter section end //



  check_login();

  get_godown_name();
  $("#unamed").text(localStorage.getItem("ls_uname"))



  $('#order_table').on("click", "button", function () {
    var order_no = $(this).val();
    if ($(this).hasClass('download')) {
      get_order_details(order_no)
      console.log(order_no);
    }
    else if ($(this).hasClass('dcf_btn')) {
      var emp_id_dcf = $(this).data("emp_id")

      get_dispatch_count(order_no, function (count) {
        if (count > 0) {
          if (current_user_id == emp_id_dcf)
            window.open("dispatch_clearance_form.html?phone_id=" + phone_id + "&oid=" + order_no, "_blank");
          else {
            var narration = prompt("Enter Reason for DCF Creation:");

            // Optional: handle if user cancels the prompt
            if (narration !== null) {
              // Encode the narration to make it URL-safe
              narration = encodeURIComponent(narration);

              // Open the new window with narration included
              window.open(
                "dispatch_clearance_form.html?phone_id=" + phone_id +
                "&oid=" + order_no +
                "&narration=" + narration,
                "_blank"
              );
            }
          }

        }
        else
          shw_toast("Machine", "No Product ready to Dispatch", "")
      });


    }


  });

  $("#clear_btn").on("click", function () {
    window.location.reload();
  })

  $(document).on("click", ".dcf-row strong", function () {
    let id = $(this).closest(".dcf-row").data("dcf");
    window.location.href = "dcf_report_all.html?dcf_id_para=" + id;
  });


});






function get_production_sts() {


  $.ajax({
    url: "php/get_production_sts.php",
    type: "get", //send it through get method
    data: {
      // key : value

    },
    success: function (response) {
      console.log(response);


      if (response.trim() != "error") {

        if (response.trim() != "0 result") {
          $("#status").empty();

          var obj = JSON.parse(response);
          var count = 0

          $("#status").append(`<option value="null" selected disabled>Status...</option>`)

          obj.forEach(function (obj) {
            count = count + 1;
            // append logic here

            $("#status").append("<option value=\"" + obj.assign_type + "\">" + obj.assign_type + "</option>")
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

function assign_product_get_product_list() {


  $.ajax({
    url: "php/assign_product_get_product_list.php",
    type: "get", //send it through get method
    data: {
      // key : value

    },
    success: function (response) {
      console.log(response);


      if (response.trim() != "error") {

        if (response.trim() != "0 result") {
          $("#product_name_select").empty();

          var obj = JSON.parse(response);
          var count = 0

          $("#product_name_select").append(`<option value="null" selected disabled>Product...</option>`)

          obj.forEach(function (obj) {
            count = count + 1;
            // append logic here

            $("#product_name_select").append("<option value=\"" + obj.product_id + "\">" + obj.pname + "</option>")
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

function assign_product_get_model_list(product_id) {


  $.ajax({
    url: "php/assign_product_get_model_list.php",
    type: "get", //send it through get method
    data: {
      product_id: product_id

    },
    success: function (response) {
      console.log(response);


      if (response.trim() != "error") {

        if (response.trim() != "0 result") {
          $("#model_select").empty();

          var obj = JSON.parse(response);
          var count = 0

          $("#model_select").append(`<option value="null" selected disabled>Model...</option>`)

          obj.forEach(function (obj) {
            count = count + 1;
            // append logic here

            $("#model_select").append("<option value=\"" + obj.model_id + "\">" + obj.model_name + "</option>")
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

function assign_product_get_type_list(model_id) {


  $.ajax({
    url: "php/assign_product_get_type_list.php",
    type: "get", //send it through get method
    data: {
      pid: model_id

    },
    success: function (response) {
      console.log(response);


      if (response.trim() != "error") {

        if (response.trim() != "0 result") {
          $("#type_select").empty();

          var obj = JSON.parse(response);
          var count = 0

          $("#type_select").append(`<option value="null" selected disabled>Type...</option>`)


          obj.forEach(function (obj) {
            count = count + 1;
            // append logic here

            $("#type_select").append("<option value=\"" + obj.type_id + "\">" + obj.type_name + "</option>")
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




function get_godown_name() {


  $.ajax({
    url: "php/get_godown_name.php",
    type: "get", //send it through get method
    data: {

    },
    success: function (response) {
      $('#godown').empty()
      $('#godown').append("<option disabled  selected>Choose Godown...</option>")

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

function get_dispatch_count(oid, callback) {


  $.ajax({
    url: "php/get_dispatch_count.php",
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
            count = obj.count

          });
          callback(count);

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



function print() {



  $('#order_form').printThis({




  });


}


function get_order_details(ass_id) {


  $.ajax({
    url: "php/get_sales_order_details_approved.php",
    type: "get", //send it through get method
    data: {

      order_id: ass_id

    },
    success: function (response) {
      console.log(response);


      if (response.trim() != "error") {

        if (response.trim() != "0 result") {
          if ($('#order_form_div').hasClass("d-none"))
            $('#order_form_div').removeClass("d-none")
          if ($('#dispatch_form_div').hasClass("d-none") == false)
            $('#dispatch_form_div').addClass("d-none")
          var obj = JSON.parse(response);
          var count = 0
          $('html, body').animate({
            scrollTop: $('#order_form').offset().top
          }, 500);


          obj.forEach(function (obj) {
            count = count + 1;




            $('#order_category_tbl').text(obj.order_category + " Order")

            $('#cus_name_tbl').html(obj.cus_name)
            $('#cus_phone_tbl').html(obj.cus_phone)
            $('#order_type_tbl').html(obj.order_type)

            if (obj.oe_supply == "1") {
              $('#oe_supply_tbl').html("Yes")
            }
            else {
              $('#oe_supply_tbl').html("No")
            }
            var nex_pay_date = " nil"
            if (obj.nex_payment_date == '0000-00-00 00:00:00')
              nex_pay_date = " nil "
            else
              nex_pay_date = obj.nex_payment_date

            $('#nex_payment_date_tbl').html(nex_pay_date)
            $('#desigi_tbl').html(obj.emp_role)
            $('#commitment_date_tbl').html(obj.commitment_date)
            $('#document_date_tbl').html(obj.dated)
            $('#required_qty_tbl').html(obj.required_qty)
            $('#color_choice_des_tbl').html(obj.color_choice_des)
            $('#chasis_choice_des_tbl').html(obj.chasis_choice_des)
            $('#any_other_spec_tbl').html(obj.any_other_spec)
            $('#loading_type_tbl').html(obj.loading_type)
            $('#delivery_address_tbl').html(obj.delivery_addr + "</br>" + obj.pincode)
            const paid_amount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(obj.paid);

            $('#advance_payment_tbl').html(paid_amount)
            const total_amount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(obj.total_payment);
            $('#total_payment_tbl').html(total_amount)

            $('#order_no_tbl').html(obj.order_no)
            $('#emp_name_tbl').html(obj.emp_name)

            $('#production_untill_tbl').html(obj.production_untill)


            const balancePayment = obj.total_payment - obj.paid;
            const bal_percent = (balancePayment / obj.total_payment) * 100;
            const bal_amount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(balancePayment);
            $('#balance_payment_tbl').html(bal_amount + " (" + bal_percent.toFixed(2) + "%)");
            $('#regular_clr_chk_tbl').html(obj.color_choice)
            $('#regular_chasis_chk_tbl').html(obj.chasis_choice)
            if (obj.payment_details != null) {
              $('.pay').remove();


              $('#payment_details_tr').after(obj.payment_details)

            }
            $('.product').remove();

            $('#app_product_details').after(obj.product_details)
            console.log($('#payment_details_tr').html());


          })

          get_assign_sts(ass_id)

          //  html2canvas(document.querySelector("#order_form")).then(canvas => {
          //   let imgData = canvas.toDataURL("image/png");
          //   let { jsPDF } = window.jspdf;
          //   let pdf = new jsPDF();

          //   // Set page size based on the canvas size
          //   let imgWidth = 190;
          //   let imgHeight = (canvas.height * imgWidth) / canvas.width;
          //   let pageHeight = imgHeight + 20; // Adding some space at the bottom
          //   pdf.internal.pageSize.height = pageHeight;

          //   // Add the image to the PDF
          //   pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

          //   // Save the PDF
          //   pdf.save("document.pdf");
          // });

          print()

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




function get_assign_sts(order_id) {


  $.ajax({
    url: "php/get_pro_assign_sts.php",
    type: "get", //send it through get method
    data: {

      order_id: order_id

    },
    success: function (response) {
      console.log(response);


      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0
          $('.product_sts').remove();


          obj.forEach(function (obj) {
            count = count + 1;






            $('#product_status_tr').after(obj.product)
              ;
          })



          //  html2canvas(document.querySelector("#order_form")).then(canvas => {
          //   let imgData = canvas.toDataURL("image/png");
          //   let { jsPDF } = window.jspdf;
          //   let pdf = new jsPDF();

          //   // Set page size based on the canvas size
          //   let imgWidth = 190;
          //   let imgHeight = (canvas.height * imgWidth) / canvas.width;
          //   let pageHeight = imgHeight + 20; // Adding some space at the bottom
          //   pdf.internal.pageSize.height = pageHeight;

          //   // Add the image to the PDF
          //   pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

          //   // Save the PDF
          //   pdf.save("document.pdf");
          // });

          //  print()

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



function get_sale_order_report(emp, cust, order_no, statuss, product_name, type, model, sub_type_box, unassigned_qty, payment, sale_date, godown, production_date, remaining_dcf, order_category) {

  console.log("emp:" + emp, "cust:" + cust, "order_no:" + order_no, "statuss:" + statuss, "product_name:" + product_name, "type:" + type, "model:" + model, "sub_type_box:" + sub_type_box, "unassigned_qty:" + unassigned_qty, "payment:" + payment, "sale_date:" + sale_date, "godown:" + godown, "production_date:" + production_date, "remaining_dcf:" + remaining_dcf, "order_category:" + order_category);


  $.ajax({
    url: "php/get_sale_order_report.php",
    type: "get", //send it through get method
    data: {
      customer_id: cust || "",
      order_no: order_no || "",
      assign_type: statuss || "",
      product_id: product_name || "",
      type_id: type || "",
      model_id: model || "",
      sub_type: sub_type_box || "",
      emp_id: emp || "",
      unassigned_qty: unassigned_qty || "",
      godown: godown || "",
      production_date: production_date || "",
      sale_order_date: sale_date || "",
      order_category: order_category || "",
      remain_dcf: remaining_dcf || "",
      payment: payment || "",
    },
    success: function (response) {
      console.log(response);


      if (response.trim() != "error") {

        $('#order_table').empty()
        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0

          obj.forEach(function (obj) {
            count = count + 1;

            var pro = '';
            let accId = `acc-${obj.order_no}`;
            let headingId = `heading-${obj.order_no}`;
            let collapseId = `collapse-${obj.order_no}`;
            var product = JSON.parse(obj.product);


            product.forEach(function (item, index) {

              accId += `-${index}`;
              headingId += `-${index}`;
              collapseId += `-${index}`;

              var ass_details = '';

              var ass_info = item.assign_info;
              var dcf = item.dcf_details;

              let blink = "";

              if (item.remain_dcf > 0) {
                blink = `<span class="badge bg-danger text-white blink-badge">${item.remain_dcf}</span>`;
              }
              // else if (dcf == null && item.remain_dcf > 0) {
              //   blink = `<span class="badge bg-danger text-white blink-badge">${item.remain_dcf}</span>`;
              // }

              let dcf_ratio = parseFloat(item.required_qty) - parseFloat(item.remain_dcf)
              let dcf_details = `
                  <div class="accordion" id="${accId}">
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="${headingId}" >
                        <button class="accordion-button collapsed py-1 px-2  ali  gn-items-center" id="accordion_head_btn" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">

                          <span class="fw-bold pe-4" style="font-size: 11px">DCF Details</span><span class="pe-4" style="font-size: 11px">dcf - ${dcf_ratio}/${item.required_qty}</span>
                          ${blink} 

                        </button>
                      </h2>
                      <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headingId}" data-bs-parent="#${accId}">
                        <div class="accordion-body py-2 px-2">
                    `;

              if (dcf != null) {
                dcf.forEach(function (d) {
                  dcf_details += `
                    <div class="card-header bg-light text-dark fw-bold py-1 px-2 dcf-row" data-dcf="${d.dcf_id}">
                      <strong>${d.dcf_id}</strong> • ${d.dc_sts} • ${d.dcf_count}
                    </div>`;
                });
              }

              else {
                dcf_details += `
                  <div class="card-header bg-light text-dark fw-bold py-1 px-2">
                    No data
                  </div>`;
              }

              dcf_details += `</div></div></div></div>`;



              if (item.unassigned_qty == 0) {
                ass_info.forEach(function (ass) {

                  var godown_details = '';

                  ass.assign_details.forEach(function (g) {

                    if (ass.assign_type == "Production") {

                      godown_details = `<div class="card-body py-1 small text-center text-dark"><p>${g.production_date} - <b>${g.production_date_count}</i></p></div>`;
                      return;
                    }
                    else if (ass.assign_type == "Finshed") {

                      godown_details = `<div class="card-body py-1 small text-center text-dark"><p>${g.godown_name} - <b>${g.finished_godown_count}</i></p></div>`;
                      return;
                    }


                    // godown_details += `<p>${g.godown_name ?? ''} - ${g.finished_godown_count}</p>`;
                  });



                  ass_details += `
                    <div class="card border mb-2">
                        <div class="card-header py-1 bg-white text-center text-dark small fw-bold">
                            ${ass.assign_type} 
                            <span class="badge bg-primary ms-1">${ass.assigntype_total_count}</span>
                        </div>
                        
                            ${godown_details}
                        
                    </div>`;
                });

              }
              else {
                ass_details = `
                  <div class="card bg-danger text-white border-0 p-2 small">
                      <div class="d-flex justify-content-between align-items-center">
                          <span>Unassigned</span>
                          <span class="badge bg-light text-danger blink-badge">
                              ${item.unassigned_qty}
                          </span>
                      </div>
                  </div>`
              }


              pro += `
                <div class="card shadow-sm border-0 mb-2">

                    <div class="card-header bg-light py-2 px-3">
                        <div class="row text-center text-dark small fw-semibold">
                            <div class="col">${item.product}</div>
                            <div class="col">${item.model_name}</div>
                            <div class="col">${item.type_name}</div>
                            <div class="col">${item.required_qty}</div>
                        </div>
                        <div class="text-muted small mt-1">${item.sub_type}</div>
                    </div>
                       ${dcf_details}
                  


                    <div class="card-body py-2 px-3">
                        ${ass_details}
                    </div>

                </div>`;

            });





            $('#order_table').append("<tr class = ''><td>" + count + "</td><td class = 'small' style='max-width: 50px;'>" + obj.order_no + "</td><td class = 'small' style='max-width: 100px;'>" + obj.sale_order_date + "</td> <td class = 'small'>" + obj.emp_name + "</td><td class = 'small ' style='max-width: 250px;'>" + obj.pay_details + "</td> <td class = 'small ' style='max-width: 100px;'>" + obj.cus_name + "-" + obj.cus_phone + "</td><td style='max-width: 250px;'><div>" + pro + "</div></td> <td style='max-width: 50px;'><button type ='button' value='" + obj.oid + "' class='btn btn-outline-primary download border-0'><i class='fa-solid fa-download pe-2'></i></button><button data-emp_id = '" + obj.emp_id + "' type ='button' value='" + obj.oid + "' class='dcf_btn btn btn-outline-primary border-0'><i class='fa-regular fa-file'></i></button></td></tr>")

          });


        }
        else {
          $('#order_table').append("<tr><td colspan='8' class='text-center text-danger'>No sale order available</td></tr>")

        }
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
    get_sale_order_report()
    // get_sales_order_approval(1)
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

        get_sale_order_report()
        //  get_sales_order_approval(1)
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