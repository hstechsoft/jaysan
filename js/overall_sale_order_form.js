
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var cus_id = 0
var sales_oid = 0
var sub_type_id = []
var model_id = []
var type_id = []
var subtype_name = []
var oid = ""
var cus_type_id = ''
var edit_sec = 0


$(document).ready(function () {



  let autocompleteTimer;
  $('#update_order_btn').hide()


  let now = new Date();
  // Convert to IST (UTC + 5:30)
  now.setMinutes(now.getMinutes() + 330); // Add 330 minutes (5 hours 30 minutes)
  // Format the date and time for 'datetime-local' input (YYYY-MM-DDTHH:mm)
  let formattedDateTime = now.toISOString().slice(0, 16);
  $("#dated").val(formattedDateTime);
  // disable all input inside product details card
  $('#product_details_card')
    .find('input, select, textarea, button')
    .prop('disabled', true);

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


  $("#add_new_product_modal").modal("show");
  check_login();

  $("#unamed").text(localStorage.getItem("ls_uname"))
  get_jaysan_final_product()
  $('#advance_payment').prop("disabled", true)
  $('#add_product_btn').on('click', function () {

    $("#add_new_product_modal").modal("show");
  });



  $('#product').change(function () {
    //$('#product').find(':selected').text()
    //$('#product').find(':selected').val()
  });



  $("#requirement_type").addClass("d-none")
  $("#color_choice_des").hide()
  $('#custom_color_chk').change(function () {
    if (this.checked) {
      $("#color_choice_des").show()
    }

  });

  $('#regular_clr_chk').change(function () {
    if (this.checked) {
      $("#color_choice_des").hide()
    }

  });


  $("#chasis_choice_des").hide()
  $('#custom_chasis_chk').change(function () {
    if (this.checked) {
      $("#chasis_choice_des").show()
    }

  });

  $('#regular_chasis_chk').change(function () {
    if (this.checked) {
      $("#chasis_choice_des").hide()
    }

  });

  $('#requirement_order').change(function () {
    if (this.checked) {
      $("#order_no").empty()
      $("#order_no").append(" <option value='0' selected>Choose Options...</option> <option value='vishnu'>10</option> <option value='murugan'>11</option> ")

      $("#requirement_type").removeClass("d-none")
    }

  });

  $("#order_category").on("change", function () {
    if ($(this).val() == 'Requirement') {
      $("#payment_details_card").addClass("d-none");
    } else {
      $("#payment_details_card").removeClass("d-none");
    }
  })

  $('#sale_order').change(function () {
    if (this.checked) {
      $("#requirement_type").addClass("d-none")
      $("#order_no").empty()
      $("#order_no").append(" <option value='0' selected>Choose Options...</option> <option value='vishnu'>121</option> <option value='murugan'>122</option> ")
    }

  });

  $('#product').change(function () {
    get_jaysan_final_productmodel()
  });
  $('#pmodel').change(function () {
    get_jaysan_final_producttype()
  });

  $('#ptype').change(function () {
    get_jaysan_model_subtype();
  });

  $('#cus_name').on('input', function () {
    if ($(this).val().trim() !== "") {
      $("label[for='cus_name']").fadeOut(300);
    } else {
      $("label[for='cus_name']").fadeIn(300);
    }
    //check the value not empty
    if ($('#cus_name').val() != "") {

      $('#cus_name').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          get_customer_autocomplete(request, response, "pname");
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {
          //console.logui.item.cus_id);

          cus_id = ui.item.cus_id;
          $('#cus_phone').val(ui.item.cus_phone)
          $('#delivery_address').val(ui.item.cus_addr)
          $('#pincode').val(ui.item.pincode)
          // cus_type_id = (ui.item.cus_type_id)
          // $("#cusTypeModal").modal("show")
          if (ui.item.cus_type_id === null) {
            $("#cus_type_update_btn").data("cus_id", ui.item.cus_id)
            $("#ptype").data("cus_type_id", ui.item.cus_type_id)
            $("#cusTypeModal").modal("show");
          }
          else {
            $("#cus_type_update_btn").data("cus_id", ui.item.cus_id)
            show_product_details_card();
            $("#customer_type").val(ui.item.sub_group_name)
            $("#ptype").data("cus_type_id", ui.item.cus_type_id)
          }
          if (cus_id !== '' || cus_id !== null || cus_id !== undefined) {
            get_sales_advance(cus_id);
          }
        },
        //display no result 
        response: function (event, ui) {
          // if (!ui.content.length) {
          //     var noResult = { value:"",label:"No results found" };
          //     ui.content.push(noResult);
          // }
        }
      });
    }

  });

  $('#cus_phone').on('input', function () {
    //check the value not empty
    if ($(this).val().trim() !== "") {
      $("label[for='cus_phone']").fadeOut(300);
    } else {
      $("label[for='cus_phone']").fadeIn(300);
    }
    if ($('#cus_phone').val() != "") {
      $('#cus_phone').autocomplete({

        source: function (request, response) {
          get_phone_autocomplete(request, response, "pname");
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          cus_id = ui.item.cus_id;
          $('#cus_name').val(ui.item.cus_name)
          $('#delivery_address').val(ui.item.cus_addr)
          $('#pincode').val(ui.item.pincode)

          if (ui.item.cus_type_id === null) {
            $("#cus_type_update_btn").data("cus_id", ui.item.cus_id)
            $("#ptype").data("cus_type_id", ui.item.cus_type_id)
            $("#cusTypeModal").modal("show");
          }
          else {
            $("#customer_type").val(ui.item.sub_group_name)
            show_product_details_card();
            $("#ptype").data("cus_type_id", ui.item.cus_type_id)
          }
          if (cus_id !== '' || cus_id !== null || cus_id !== undefined) {
            get_sales_advance(cus_id);
          }
        },
        //display no result 
        response: function (event, ui) {
          // if (!ui.content.length) {
          //     var noResult = { value:"",label:"No results found" };
          //     ui.content.push(noResult);
          // }
        }
      });
    }

  });




  $('#insert_order_btn').on('click', function () {

    $('#sub_type_div input[type="checkbox"]:checked').each(function () {
      sub_type_id.push($(this).val());
    });
    //console.logsub_type_id);




    {
      if ($("#sales_order_form1")[0].checkValidity())
        if ($('#sales_product tr').length > 0) {
          //console.log$('#order_category :selected').val());

          if ($('#order_category :selected').val() == "Sales") {
            if ($('#payment_table tr').length > 0) {
              insert_sales_order_form()
            }
            else
              shw_toast("Error", "Please add payment details", "error")

          }


          else
            insert_sales_order_form()
        }
        else
          shw_toast("Error", "Please select the subtype", "error")
      else
        shw_toast("Error", "Please fill all the fields", "error")
    }

  });


  $('#update_order_btn').on('click', function () {

    sub_type_id = []
    $('#sub_type_div input[type="checkbox"]:checked').each(function () {
      sub_type_id.push($(this).val());
    });
    //  {
    //   if($("#sales_order_form1")[0].checkValidity())
    //   update_sales_order_form()
    //  }


    {
      if ($("#sales_order_form1")[0].checkValidity())
        if ($('#sales_product tr').length > 0)
          update_sales_order_form()
        else
          shw_toast("Error", "Please select the subtype", "error")
      else
        shw_toast("Error", "Please fill all the fields", "error")
    }

  });

  $('#order_table, #mobile_order_card').on("click", "button", function () {
    //console.log$(this).hasClass('delete_btn'));
    var order_no = $(this).val();
    if ($(this).hasClass('download')) {
      get_order_details(order_no)

    }
    else if ($(this).hasClass('edit_btn')) {
      edit_sec = 1
      $("#add_sale_product_btn").data("oid", $(this).val())
      $("#add_quotation_btn").data("oid", $(this).val())
      $("#payment_add_btn").data("oid", $(this).val())
      get_sales_order_single($(this).val())
    }

    else if ($(this).hasClass('delete_btn')) {
      var btn_val = $(this).val()





      {
        swal({
          title: "Are you sure - delete? ",
          text: "You will not be recover this  again!",
          icon: "warning",
          buttons: [
            'No, cancel it!',
            'Yes, I am sure!'
          ],
          dangerMode: true,
        }).then(function (isConfirm) {
          if (isConfirm) {
            delete_sales_order(btn_val)

          }

        })
      }

    }
    else if ($(this).hasClass('pay_btn')) {
      oid = $(this).val()
      var cus_id = $(this).data("cus_id");
      $("#payment_add_btn_m").data("cus_id", cus_id);
      get_sales_advance_m($(this).data("cus_id"));
      setTimeout(function () {

        get_jaysan_sales_payment_m(oid)
      }, 1000);
      $('#sales_pay').modal('show')

    }




  })


  $('#req_table, #mobile_req_card').on("click", "button", function () {
    //console.log$(this).hasClass('delete_btn'));

    if ($(this).hasClass('edit_btn')) {
      edit_sec = 1


      $("#add_quotation_btn").data("oid", $(this).val())
      $("#add_sale_product_btn").data("oid", $(this).val())
      $("#payment_add_btn").data("oid", $(this).val())
      get_sales_order_single($(this).val())
    }

    else if ($(this).hasClass('delete_btn')) {
      var btn_val = $(this).val()





      {
        swal({
          title: "Are you sure - delete? ",
          text: "You will not be recover this  again!",
          icon: "warning",
          buttons: [
            'No, cancel it!',
            'Yes, I am sure!'
          ],
          dangerMode: true,
        }).then(function (isConfirm) {
          if (isConfirm) {
            delete_sales_order(btn_val)

          }

        })
      }

    }
    else if ($(this).hasClass('sale_btn')) {
      oid = $(this).val()
      get_req_order_single($(this).val())

    }




  })


  $('#app_order_table, #mobile_approved_order_card').on("click", "button", function () {
    var order_no = $(this).val();
    var cus_id = $(this).data("cus_id");
    if ($(this).hasClass('download')) {
      get_order_details(order_no)

    }
    else if ($(this).hasClass('dcf_btn')) {
      get_dispatch_count(order_no, function (count) {
        if (count > 0) {


          window.open("dispatch_clearance_form.html?phone_id=" + phone_id + "&oid=" + order_no + "&cus_id=" + cus_id, "_blank");

        }
        else
          shw_toast("Machine", "No Product ready to Dispatch", "")
      });


    }
    else if ($(this).hasClass('pay_btn')) {
      oid = $(this).val()
      var cus_id = $(this).data("cus_id");
      $('#sales_pay').modal('show')
      var cus_id = $(this).data("cus_id");
      $("#payment_add_btn_m").data("cus_id", cus_id);
      oid = $(this).val()
      get_sales_advance_m($(this).data("cus_id"));
      setTimeout(function () {

        get_jaysan_sales_payment_m(oid)
      }, 1000);
    }
  })





  $('#add_sale_product_btn').on('click', function () {

    var oid = $(this).data("oid");

    if (edit_sec == 0 && $('#product').val() != "" && $('#pmodel').val() != "" && $('#ptype').val() != "" && $('#qty').val() != "" && $('#billing_price').val() != "" && $('#machine_price').val() != "") {
      $("#payment_table").empty();
      $("#advance_payment_card").prop("disabled", false).css("pointer-events", "auto");
      $("#advance_payment_card td").css({ color: "green" });
      $("#total_amount").text(0);
      $("#total_balance_amount").text(0);
      clear_payment_field();
      $("#total_payment").data("paid_amt", 0);
      $("#extra_payment").val(0);
      var count = 0
      var sub_type = ""
      $('#sub_type_div input[type="checkbox"]:checked, #sub_type_div input[type="radio"]:checked').each(function () {
        count = count + 1;
        //console.log$(this).parent().text());

        sub_type = sub_type + $(this).parent().text().trim() + ","

      });

      sub_type = sub_type.slice(0, -1); // Remove the last comma
      //console.logsub_type);

      // var amt = parseFloat($("#machine_price").val() || 0) * parseFloat($("#qty").val() || 0)
      var qty = parseFloat($("#qty").val() || 0)
      var amount = parseFloat($("#machine_price").val() || 0)
      var total_amount = parseFloat($('#total_payment').val() || 0)

      var total_qty = parseFloat($('#required_qty').val() || 0);

      total_amount = total_amount + (parseFloat(qty * amount))
      total_qty = total_qty + parseFloat(qty)



      if (count >= 1) {

        var len = $('#sales_product tr').length + 1
        $('#sales_product').append(" <tr class='small'> <td>" + len + "</td> <td>" + $('#product :selected').text() + "</td> <td data-model_id='" + $('#pmodel').val() + "'>" + $('#pmodel :selected').text() + "</td> <td data-type_id='" + $('#ptype').val() + "'>" + $('#ptype :selected').text() + "</td> <td>" + sub_type + "</td> <td>" + $('#qty').val() + "</td><td>" + $('#machine_price').val() + "</td><td>" + $('#billing_price').val() + "</td> <td> <button type = 'button' class='btn btn-outline-danger border-0 btn-sm' id='fa-trash'><i class='fa fa-trash' aria-hidden='true'></i></button> </td> </tr")

        $('#product_details_mobile_view').append(`
                <div class="card mobile-product-card mb-3">
                  <div class="card-body p-1">

                    <!-- Top row -->
                    <div class="d-flex justify-content-between align-items-start">
                      <div>
                        <div class="fw-semibold text-dark">${$('#product :selected').text()}</div>

                        <div class="d-flex gap-2 mt-1">
                          <span class="badge bg-light text-dark border">
                            Model: ${$('#pmodel :selected').text()}
                          </span>
                          <span class="badge bg-light text-dark border">
                            Type: ${$('#ptype').val()}
                          </span>
                        </div>
                      </div>

                      <button
                        class="btn btn-sm btn-light text-danger delete-row rounded-circle" id='fa-trash'>
                        <i class="fa fa-trash"></i>
                      </button>
                    </div>

                    <!-- Sub scale -->
                    <div class="small text-muted mt-1 sub-type-text">
                      ${sub_type}
                    </div>

                    <!-- Amount -->
                    <div class="mt-1 p-1 rounded-3 bg-success bg-opacity-10 text-center">
                      <div class="small text-muted">Billing Amount</div>
                      <div class="fs-5 fw-bold text-success">
                        ₹ ${$('#billing_price').val()}
                      </div>
                    </div>

                    <!-- Qty & Price -->
                    <div class="row text-center mt-1 g-2">
                      <div class="col-6">
                        <div class="p-1 rounded-3 bg-light">
                          <div class="small text-muted">Qty</div>
                          <div class="fw-bold">${$('#qty').val()}</div>
                        </div>
                      </div>

                      <div class="col-6">
                        <div class="p-1 rounded-3 bg-light">
                          <div class="small text-muted">Price</div>
                          <div class="fw-bold text-primary">
                            ₹ ${$('#machine_price').val()}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
            `);
        //console.log"ok");
        //console.log$('#product :selected').text());

        // $('#sel_usr_in :selected').text()

        $('#product').val("")
        $('#pmodel').val("")
        $('#pmodel').attr('disabled', true)
        $('#ptype').val("")
        $('#ptype').attr('disabled', true)
        $('#qty').val("1")
        $('#product_sub_type_card').addClass('d-none')
        $('#sub_type_div').empty()
        $('#required_qty').val("")
        // var qty = 0
        // var amount = 0
        // var total_amount = 0
        // total_amount = parseFloat($("#total_payment").data("paid_amt") || 0) + amt;

        // var total_qty = 0
        // $('#sales_product').find('tr').each(function () {
        //   qty = parseFloat($(this).find("td").eq(5).html())
        //   amount = parseFloat($(this).find("td").eq(6).html())
        //   total_amount = total_amount + (parseFloat(qty * amount))
        //   total_qty = total_qty + parseFloat(qty)
        // });

        $('#required_qty').val(total_qty)
        $('#total_payment').val(total_amount)

        $("#billing_price").val("")
        $("#machine_price").val("")
        $("#credit_amount").text("0")
      }


      else
        shw_toast("Error", "Please select the subtype", "error")
    }

    else if (edit_sec == 1 && $('#product').val() != "" && $('#pmodel').val() != "" && $('#ptype').val() != "" && $('#qty').val() != "" && $('#billing_price').val() != "" && $('#machine_price').val() != "" && oid > 0) {
      var total_qty = parseFloat($('#required_qty').val() || 0);
      total_qty = total_qty + parseFloat($('#qty').val())
      var sub_type = ""
      $('#sub_type_div input[type="checkbox"]:checked, #sub_type_div input[type="radio"]:checked').each(function () {
        count = count + 1;
        //console.log$(this).parent().text());

        sub_type = sub_type + $(this).parent().text().trim() + ","

      });

      sub_type = sub_type.slice(0, -1);
      $("#update_order_btn").trigger("click")

      insert_sales_order_product(oid, $('#ptype').val(), $('#pmodel').val(), sub_type, $('#qty').val(), $('#machine_price').val(), $('#billing_price').val(), 'null')
    }

    else
      shw_toast("Error", "Please fill all mandatory Fields", "error")
  });

  $('#sales_product').on('blur', '.editable-qty, .editable-price', function () {
    var btn_val = $(this).html()
    //console.logbtn_val);
    var qty = 0
    var amount = 0
    var total_amount = 0
    var total_qty = 0
    $('#sales_product').find('tr').each(function () {
      qty = parseFloat($(this).find("td").eq(5).html())
      amount = parseFloat($(this).find("td").eq(6).html())
      total_amount = total_amount + (parseFloat(qty * amount))
      total_qty = total_qty + parseFloat(qty)
    });

    $('#required_qty').val(total_qty)
    $('#total_payment').val(total_amount)

    if ($('#price_word_div').hasClass('d-none') == false)
      $('#price_word_div').addClass('d-none')
  });


  $('#sales_product').on('input', '.editable-qty, .editable-price', function () {
    //console.log$(this).html());

    if ($(this).html().trim() !== "") {

      if ($('#price_word_div').hasClass('d-none'))
        $('#price_word_div').removeClass('d-none')
      $('#price_word').text(convertToRupeesWords($(this).html().trim()))


    }
  });

  $('#sales_product, #product_details_mobile_view').on("click", "button#fa-trash", function () {
    var opid = $(this).val()
    var oid = $(this).data("oid")
    //console.logopid, oid);

    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          if ($(this).attr('name') == "db_delete") {
            // delete_sales_product(opid)
            delete_sales_order_product(oid, opid)

          }
          else {
            var amt = parseFloat($(this).closest('tr').find('td').eq(6).text() || 0) * parseFloat($(this).closest('tr').find('td').eq(5).text() || 0);

            $("#payment_table").empty();
            $("#advance_payment_card").prop("disabled", false).css("pointer-events", "auto");
            $("#advance_payment_card td").css({ color: "green" });
            $("#total_amount").text(0);
            $("#total_balance_amount").text(0);
            clear_payment_field();
            $("#total_payment").data("paid_amt", 0);
            $("#extra_payment").val(0);

            $(this).closest('tr').remove();
            $('#sales_product tr').each(function (i) {
              //console.log$(this).find('td:first').html());
              $(this).find('td:first').html(i + 1);
            })
            var qty = 0;
            var amount = 0;
            var total_amount = 0;
            total_amount = parseFloat($("#total_payment").val() || 0) - amt;
            var total_qty = 0;
            $('#sales_product').find('tr').each(function () {
              qty = parseFloat($(this).find("td").eq(5).html())
              amount = parseFloat($(this).find("td").eq(6).html())
              // total_amount = total_amount + (parseFloat(qty * amount))
              total_qty = total_qty + parseFloat(qty)
            });

            $('#required_qty').val(total_qty)
            $('#total_payment').val(total_amount)
          }

        }
      });




  });

  $('#sales_product, #product_details_mobile_view').on("click", ".edit-row", function () {

    $("#update_sale_product_btn, #cancel_sale_product_btn").removeClass("d-none");
    $("#add_sale_product_btn").addClass("d-none");

    var thiss = $(this);

    var product_id = thiss.data("product_id");
    var model_id = thiss.data("model_id");
    var type_id = thiss.data("type_id");
    var price = thiss.data("price");
    var qty = thiss.data("qty");
    var sub_type = thiss.data("subtype");
    var billing_price = thiss.data("billing_price");
    var oid = thiss.data("oid");
    var opid = thiss.val();

    $("#update_sale_product_btn").data({ opid: opid, oid: oid });
    console.log(product_id, model_id, type_id, price, qty, sub_type, billing_price, oid, opid);

    $("#qty").val(qty);
    $('#product').val(product_id).trigger('change');

    setTimeout(() => {
      $('#pmodel').val(model_id).trigger('change');

      setTimeout(() => {
        $('#ptype').val(type_id).trigger('change');

        setTimeout(() => {

          const subArr = sub_type.split(',').map(s => s.trim());

          $('#sub_type_div input[type="checkbox"], #sub_type_div input[type="radio"]')
            .each(function () {
              if (subArr.includes($(this).parent().text().trim())) {
                $(this).prop('checked', true);
              }
            });

          $('#billing_price').val(billing_price);
          $('#machine_price').val(price);

        }, 300);

      }, 300);

    }, 300);

  });

  $("#update_sale_product_btn").on("click", function () {

    var opid = $(this).data("opid")
    var oid = $(this).data("oid")
    var sub_type = ""
    var count = 0
    $('#sub_type_div input[type="checkbox"]:checked, #sub_type_div input[type="radio"]:checked').each(function () {
      count = count + 1;
      //console.log$(this).parent().text());
      sub_type = sub_type + $(this).parent().text().trim() + ","
    });
    //console.logsub_type);

    sub_type = sub_type.slice(0, -1);

    if (count >= 1 && opid > 0 && oid > 0 && $('#product').val() != "" && $('#pmodel').val() != "" && $('#ptype').val() != "" && $('#qty').val() != "" && $('#billing_price').val() > 0 && $('#machine_price').val() > 0 && cus_id > 0) {
      update_sales_order_product(oid, opid, $('#ptype').val(), $('#pmodel').val(), sub_type, $('#qty').val(), $('#machine_price').val(), $('#billing_price').val(), cus_id);
      setTimeout(function () {
        $("#update_order_btn").trigger("click")
      }, 1000)
    }
    else {
      console.log(opid, oid, cus_id);

      salert("Warning", "Data missing try again", "warning");
    }
  })

  $("#cancel_sale_product_btn").on("click", function () {
    $("#product").val("").data("selected-product_id", "");
    $("#pmodel").val("").attr('disabled', true).data("selected-model_id", "");
    $("#ptype").val("").attr('disabled', true).data("selected-type_id", "");
    $("#qty").val("1");
    $("#billing_price").val(0);
    $("#machine_price").val(0);
    $('#product_sub_type_card').addClass('d-none')
    $('#sub_type_div').empty()

    $("#update_sale_product_btn, #cancel_sale_product_btn").addClass("d-none");
    $("#add_sale_product_btn").removeClass("d-none");
  })

  $('#payment_table').on("click", "button#fa-trash", function () {
    var btn_val = $(this).val()
    console.log(btn_val);

    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {

          {
            if (btn_val && $(this).data("advance_id")) {
              e_delete_sales_pay($(this).data("advance_id"), btn_val)
            }
            else if ($(this).data("payment_id") && btn_val) {
              na_delete_sales_pay($(this).data("payment_id"), btn_val)
            }
            else {
              $(this).closest('tr').remove();
              var total_amount = 0
              $('#payment_table').find('tr').each(function (i) {
                $(this).find('td:first').html(i + 1);

                total_amount = total_amount + Number($(this).find("td").eq(3).text());
              });

              $("#total_amount").text(0);
              $("#total_balance_amount").text(0);
              clear_payment_field();
              $('#total_amount').text(total_amount);
              $('#total_balance_amount').text(parseFloat($('#total_payment').val() || 0) - total_amount)
              $("#total_payment").data("paid_amt", parseFloat($('#total_payment').val() || 0) - total_amount)
            }
          }

        }
      });





  });


  $('#payment_table').on("click", "#fa_edit", function () {

    $("#payment_update_btn, #payment_cancel_btn").removeClass("d-none");
    $("#payment_add_btn").addClass("d-none");
    var row = $(this).closest("tr");

    var d = new Date(row.find("td").eq(5).text());
    var ddd = d.toISOString().slice(0, 16);
    //console.logd, ddd);
    $("#amount").val(row.find("td").eq(3).text()).data({ "payment_id": $(this).val(), "oid": $(this).data("oid") });
    $("#payment_date").val(ddd);
    $("#ref_no").val(row.find("td").eq(1).text());
    $("#utr_no").val(row.find("td").eq(2).text());




  });

  $("#payment_update_btn").on("click", function () {

    //console.log$("#amount").val(), $("#payment_date").val(), $("#ref_no").val(), $("#utr_no").val(), $("#amount").data("payment_id"));

    const amount = parseFloat($("#amount").val());
    const utr = $("#utr_no").val().trim();
    const paymentId = Number($("#amount").data("payment_id"));

    if (
      !amount || amount <= 0 ||
      !utr ||
      !paymentId || paymentId <= 0
    ) {
      salert("Warning", "Data missing, try later", "warning");
      return;

    }
    else {
      update_jaysan_payment1(amount, $("#payment_date").val(), $("#ref_no").val(), utr, paymentId, $("#amount").data("oid"));
    }
  })
  $("#payment_cancel_btn").on("click", function () {
    $("#amount").val("");
    $("#payment_date").val("");
    $("#ref_no").val("");
    $("#utr_no").val("");
    $("#payment_update_btn, #payment_cancel_btn").addClass("d-none");
    $("#payment_add_btn").removeClass("d-none");
  })

  var pt_p = 0;
  var pe_a = 0;

  $("#amount_m").on("change", function () {
    // $("#amount_m").data("advance_id", 'null');

    var t_payment = parseFloat($("#total_payment_m").val() || 0);
    var t_rem_payment = parseFloat($("#total_payment_m").data("paid_amt"));
    var amnt = parseFloat($(this).val() || 0);



    if (t_rem_payment > 0) {

      if (t_rem_payment > amnt) {

        pt_p = t_rem_payment - amnt;
        $("#extra_payment_m").val(0);
        $("#total_payment_m").data("paid_amt", pt_p);

      }
      else if (amnt > t_rem_payment) {
        pt_p = -1;
        pe_a = amnt - t_rem_payment;
        $("#extra_payment_m").val(pe_a);
        $("#total_payment_m").data("paid_amt", pt_p);

      }
      else if (amnt == t_rem_payment) {
        pt_p = -1;
        $("#extra_payment_m").val(0);
        $("#total_payment_m").data("paid_amt", pt_p);

      }

    }
    else if (t_rem_payment <= 0) {

      if (t_payment < amnt && t_rem_payment == 0) {
        pe_a = amnt - t_payment;
        pt_p = -1;
        $("#total_payment_m").data("paid_amt", pt_p);
        $("#extra_payment_m").val(pe_a);

      }
      else if (amnt < t_payment && t_rem_payment == 0) {
        pt_p = t_payment - amnt;
        $("#total_payment_m").data("paid_amt", pt_p);
        $("#extra_payment_m").val(0);


      }
      else if (amnt == t_payment && t_rem_payment == 0) {

        pt_p = -1;
        $("#total_payment_m").data("paid_amt", pt_p);
        $("#extra_payment_m").val(0);

      }
      else if (t_rem_payment < 0) {
        pe_a = amnt;
        $("#extra_payment_m").val(pe_a);

      }

    }

  })





  var t_p = 0;
  var e_a = 0;


  $("#amount").on("change", function () {
    $("#amount").data("advance_id", 'null');

    var t_payment = parseFloat($("#total_payment").val() || 0);
    var t_rem_payment = parseFloat($("#total_payment").data("paid_amt"));
    var amnt = parseFloat($(this).val() || 0);


    if (t_rem_payment > 0) {

      if (t_rem_payment > amnt) {

        t_p = t_rem_payment - amnt;
        $("#extra_payment").val(0);

      }
      else if (amnt > t_rem_payment) {
        t_p = -1;
        e_a = amnt - t_rem_payment;
        $("#extra_payment").val(e_a);

      }
      else if (amnt == t_rem_payment) {
        t_p = -1;
        $("#extra_payment").val(0);

      }

    }
    else if (t_rem_payment <= 0) {

      if (t_payment < amnt && t_rem_payment == 0) {
        e_a = amnt - t_payment;
        t_p = -1;
        $("#extra_payment").val(e_a);

      }
      else if (amnt < t_payment && t_rem_payment == 0) {
        t_p = t_payment - amnt;
        $("#extra_payment").val(0);


      }
      else if (amnt == t_payment && t_rem_payment == 0) {

        t_p = -1;
        $("#extra_payment").val(0);

      }
      else if (t_rem_payment < 0) {
        e_a = amnt;
        $("#extra_payment").val(e_a);

      }

    }

  })


  $('#payment_add_btn').on('click', function () {
    var oid = $(this).data("oid");
    var advance_id = $("#amount").data("advance_id");
    var payment_id = $("#amount").data("payment_id");
    $("#amount").prop("disabled", false);

    if ($('#amount').val() != "" && $('#payment_date').val() != "" && $('#ref_no').val() != "" && $('#utr_no').val() != "" && edit_sec == 0) {

      if (Number($('#total_balance_amount').text()) < Number($('#amount').val())) {
        var advance_deposite_id = 0;
        $('#payment_table').find('tr').each(function () {
          advance_deposite_id = $(this).find("td").eq(4).data("advance_id");
        });
        if (advance_deposite_id && advance_deposite_id > 0) {

          $("#total_amount").text(0);
          $("#total_balance_amount").text(0);
          clear_payment_field();
          salert("Error", "Remove/Delete the advance payment , Please add the Received amount first", "error");
          return;
        }
      }
      $("#total_payment").data("paid_amt", t_p);

      var len = $('#payment_table tr').length + 1
      $('#payment_table').append("<tr class='small'> <td>" + len + "</td> <td>" + $('#ref_no').val() + "</td> <td>" + $('#utr_no').val() + "</td> <td>" + $('#amount').val() + "</td> <td data-advance_id=" + $('#amount').data("advance_id") + ">" + $('#extra_payment').val() + "</td> <td>" + $('#payment_date').val() + "</td> <td><button class='btn btn-outline-danger btn-sm border-0' type='button' id='fa-trash'><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>")

      $('#ref_no').val("")
      $('#utr_no').val("")
      $('#amount').val("")
      $('#amount').data("advance_id", "")
      $('#payment_date').val("")
      $("#extra_payment").val("");
      var total_amount = 0
      $('#payment_table').find('tr').each(function () {
        total_amount = total_amount + Number($(this).find("td").eq(3).text())
      });
      $('#total_amount').text(total_amount)
      $('#total_balance_amount').text(parseFloat($('#total_payment').val() || 0) - total_amount)

      if (Number($('#total_balance_amount').text()) <= 0 && parseFloat($('#total_payment').val()) == parseFloat($("#total_amount").text())) {
        $("#advance_payment_card").prop("disabled", true).css("pointer-events", "none");
        $("#advance_payment_card td").css({ "opacity": "0.6", color: "red" });
      }
      else {
        $("#advance_payment_card").prop("disabled", false).css("pointer-events", "auto");
        $("#advance_payment_card td").css({ color: "green" });
      }

    }

    else if ($('#amount').val() != "" && $('#payment_date').val() != "" && $('#ref_no').val() != "" && $('#utr_no').val() != "" && edit_sec == 1 && Number(oid) > 0 && cus_id > 0) {
      console.log(payment_id, advance_id);

      if (advance_id !== undefined && advance_id !== 'null' && advance_id !== "" && payment_id !== undefined && payment_id !== 'null' && payment_id !== "") {
        insert_sale_payment_advance(payment_id, advance_id, $('#amount').val(), oid, cus_id);
      }
      else {
        update_sales_pay($('#amount').val(), $('#payment_date').val(), oid, $('#ref_no').val(), $('#utr_no').val(), cus_id, $('#extra_payment').val())

      }


    }
    else
      //console.log$('#amount').val(), $('#payment_date').val(), $('#ref_no').val(), $('#utr_no').val(), edit_sec, oid, cus_id, $('#extra_payment').val());

      shw_toast("Error", "Please fill all details ", "error")



  });

  $('#update_pay_btn').on('click', function () {
    update_sales_pay_date()
  });

  $('#payment_add_btn_m').on('click', function () {
    var oid = $(this).data("oid");
    var cus_id = $(this).data("cus_id");
    var advance_id = $("#amount_m").data("advance_id");
    var payment_id = $("#amount_m").data("payment_id");
    if (advance_id !== undefined && advance_id !== 'null' && advance_id !== "" && payment_id !== undefined && payment_id !== 'null' && payment_id !== "") {
      console.log(cus_id);
      alert()
      insert_sale_payment_advance(payment_id, advance_id, $('#amount_m').val(), oid, cus_id);
    }
    else {
      insert_sales_pay(cus_id)
    }
  });

  $('#payment_table_m').on("click", "button#fa-trash", function () {
    var oid = $(this).val()
    var payment_id = $(this).data("payment_id");
    var advance_id = $(this).data("advance_id");

    //console.logbtn_val);

    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {

          {
            if (payment_id) {
              na_delete_sales_pay_m(payment_id, oid)

            }
            else if (advance_id) {
              delete_sales_pay(advance_id, oid)
            }
          }

        }
      });





  });



  $('#billing_price').on('input', function () {

    $("#credit_amount").text(Number($("#billing_price").val()) - Number($("#machine_price").val()))
  });


  $('#machine_price').on('input', function () {
    if ($(this).val().trim() !== "") {
      if ($('#price_word_div').hasClass('d-none'))
        $('#price_word_div').removeClass('d-none')
      $('#price_word').text(convertToRupeesWords($(this).val()))


    } else {
      $('#price_word').text("")
      if ($('#price_word_div').hasClass('d-none') == false)
        $('#price_word_div').addClass('d-none')
    }
    $("#credit_amount").text(Number($("#billing_price").val()) - Number($("#machine_price").val()))
  });

  $('#machine_price').on('blur', function () {
    if ($('#price_word_div').hasClass('d-none') == false)
      $('#price_word_div').addClass('d-none')
  });



  $('#cus_group').on('input', function () {
    //check the value not empty
    $(this).removeData("cus_group_id");
    $("#cus_sub_group_tgl").addClass("d-none");


    if ($('#cus_group').val() != "") {
      $('#cus_group').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_customer_group_auto.php",
            type: "get", //send it through get method
            data: {

              group_name: $('#cus_group').val(),


            },
            dataType: "json",
            success: function (data) {

              //console.logdata);
              response($.map(data, function (item) {
                return {
                  label: item.group_name,
                  value: item.group_name,
                  id: item.group_id,
                  // part_name: item.part_name
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("cus_group_id", ui.item.id);
          //   $('#part_name_out').data("selected-part_id", ui.item.id);
          //   $('#part_name_out').val(ui.item.part_name)
          //  get_bom(ui.item.id)
          if (ui.item.id) {

            $("#cus_sub_group_tgl").removeClass("d-none");
            $("#cus_sub_group").val('');
          }
          else {
            $("#cus_sub_group_tgl").addClass("d-none");
          }


        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div>" + item.label + "</div>")
          .appendTo(ul);
      };
    }

  });

  $('#cus_sub_group').on('input', function () {
    //check the value not empty
    $(this).removeData("cus_sub_group_id");
    if ($('#cus_sub_group').val() != "") {
      $('#cus_sub_group').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_customer_subgroup_auto1.php",
            type: "get", //send it through get method
            data: {

              sub_group_name: $('#cus_sub_group').val(),
              group_id: $('#cus_group').data("cus_group_id")


            },
            dataType: "json",
            success: function (data) {

              //console.logdata);
              response($.map(data, function (item) {
                return {
                  label: item.sub_group_name,
                  value: item.sub_group_name,
                  id: item.sub_group_id,
                  // part_name: item.part_name
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("cus_sub_group_id", ui.item.id);
          //   $('#part_name_out').data("selected-part_id", ui.item.id);
          //   $('#part_name_out').val(ui.item.part_name)
          //  get_bom(ui.item.id)



        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div>" + item.label + "</div>")
          .appendTo(ul);
      };
    }

  });

  $("#cus_type_update_btn").on("click", function () {

    var cus_id = $(this).data("cus_id") || '';
    var cus_sub_group_id = $("#cus_sub_group").data("cus_sub_group_id") || '';

    if (!cus_id || !cus_sub_group_id) {
      salert("Warning", "select both the fields", "warning");
      return;
    }
    update_customer_type(cus_sub_group_id, cus_id);

  })

  $("#sub_type_div").on("change", ".sub_type_chk", function () {
    change_price()
  });

  // $("#sub_type_div").on("change", ".sub_type_chk", function () {

  //   const price = parseFloat($(this).data("price")) || 0;
  //   const isReduce = parseInt($(this).data("is_reduce"), 10) || 0;

  //   let billingAmount = parseFloat($("#billing_price").val()) || 0;
  //   let machineAmount = parseFloat($("#machine_price").val()) || 0;

  //   const isChecked = $(this).is(":checked");



  //   let delta;

  //   if (isReduce === 0) {
  //     delta = isChecked ? price : -price;
  //   } else {
  //     delta = isChecked ? -price : price;
  //   }

  //   billingAmount += delta;
  //   machineAmount += delta;

  //   $("#billing_price").val(billingAmount);
  //   $("#machine_price").val(machineAmount);

  //   //console.log
  //     "MSID:", $(this).val(),
  //     "PRICE:", $(this).data("price"),
  //     "REDUCE:", isReduce,
  //     "DELTA:", delta
  //   );
  // });

  $("#machine_price").on("input", function () {


    var min = parseFloat($(this).data("min"));
    var max = parseFloat($(this).data("max"));
    var enter_amount = parseFloat($(this).val());

    //console.logmin, max, enter_amount);

    if (enter_amount > max) {
      $("#spl_checkbox_hide").addClass("d-none")

      // $(this).css("color", "#ff0000ff")
      // salert("Warning", "Amount should not exceed the fix price", "warning");
      // $(this).val(max);
    }
    else if (enter_amount < min) {
      $("#spl_checkbox_hide").removeClass("d-none")
      $(this).css("color", "#ff0000ff")
      // salert("Warning", "Amount should not less than the fix price", "warning");
      // $(this).val(min);
    }
    else {
      $("#spl_checkbox_hide").addClass("d-none")
      $(this).css("color", "#000")

    }

  })


  $("#mrp_amount").on("change", function () {

    var mrp = $(this).data("max");




    if ($(this).is(":checked")) {
      $("#billing_price").val(mrp);
      // $("#machine_price").val(mrp);
    } else {
      change_price()
    }

    $("#credit_amount").text(Number($("#billing_price").val()) - Number($("#machine_price").val()));

  })

  $("#custype_btn").on("click", function (event) {
    event.preventDefault();
    // TODO: handle click here

    $("#cusTypeModal").modal("show");
  });

  $("#quotation_fields_check").on("change", function () {
    if ($(this).is(":checked")) {
      $("#spareModal").modal("show")
    }
    // else {
    //   $("#quotation_fields").addClass("d-none")
    //   $("#product_fields").removeClass("d-none")
    // }
  })

  $(".spare_close").click(function () {
    $("#quotation_fields_check").prop("checked", false)
    $("#update_quotation_btn").addClass("d-none");
    $("#add_quotation_btn").removeClass("d-none");
    $("#quotation_no").val("")
    $("#quotation_amount").val("")
    $("#quotation_remark").val("")
  })


  $("#add_quotation_btn").click(function () {

    var q_no = $("#quotation_no").val();
    var q_amt = $("#quotation_amount").val();
    var q_remark = $("#quotation_remark").val();
    var oid = $("#add_quotation_btn").data("oid");

    if (edit_sec == 0) {
      $("#payment_table").empty();
      $("#total_amount").text(0);
      $("#total_balance_amount").text(0);
      clear_payment_field();
    }
    $("#total_payment").data("paid_amt", 0);
    $("#extra_payment").val(0);


    if (!q_no || !q_amt) {
      salert("Warning", "Data missing, try again", "warning");
      return;
    }

    if (edit_sec == 1) {
      if (!oid) {

        salert("Warning", "Data missing, try again", "warning");
        return;
      }
      insert_sale_order_spares(oid, q_no, q_remark, q_amt, "null")
      return
    }

    var total = parseFloat($("#total_payment").val() || 0);

    total += parseFloat(q_amt);
    $("#total_payment").val(total);

    var count = $("#spare_tbody tr").length + 1;

    $("#spare_table").removeClass("d-none");
    $("#spare_tbody").append(`
          <tr class="small">
            <td>${count}</td>
            <td>${q_no}</td>
            <td>${q_amt}</td>
            <td>${q_remark || ""}</td>
            <td>
              <button class="btn btn-outline-danger border-0 btn-sm spare_dlt">
                <i class="fa fa-trash"></i>
              </button>
            </td>
          </tr>
        `);

    $("#quotation_fields_check").prop("checked", false);
    $("#quotation_no").val("")
    $("#quotation_amount").val("")
    $("#quotation_remark").val("")
    $("#spareModal").modal("hide")
  });


  $("#spare_tbody").on("click", ".spare_dlt", function () {

    var row = $(this).closest("tr");
    var total = parseFloat($("#total_payment").val() || 0);

    swal({
      title: "Warning",
      text: "Are you sure you want to delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(function (confirm) {
      if (confirm) {
        total = total - parseFloat(row.find('td').eq(2).text());
        $("#total_payment").val(total);
        $("#payment_table").empty();

        $("#total_amount").text(0);
        $("#total_balance_amount").text(0);
        clear_payment_field();
        $("#total_payment").data("paid_amt", 0);
        $("#extra_payment").val(0);
        row.remove();
        resetRowNumbers();
      }
    });
  });


  function resetRowNumbers() {
    $("#spare_tbody tr").each(function (i) {
      $(this).find("td:first").text(i + 1);
    });
    if ($("#spare_tbody tr").length == 0) {
      $("#spare_table").addClass("d-none");
    }
  }


  $("#advance_payment_tbody").on("dblclick", "tr", function () {

    $("#payment_cancel_btn").removeClass("d-none");

    $("#extra_payment").val(0);
    var utr_no = $(this).find("td").eq(1).text();
    var amt = $(this).find("td").eq(2).text();
    var ref_no = $(this).data("ref_no");
    var payment_date = $(this).data("payment_date");
    var advance_id = $(this).data("advance_id");
    var payment_id = $(this).data("payment_id");

    var total_balance_amt = $("#total_balance_amount").text();
    var amt_enter = 0;

    if (parseFloat(total_balance_amt) < parseFloat(amt) && parseFloat(total_balance_amt) > 0) {
      amt_enter = parseFloat(total_balance_amt);
    }
    else if (parseFloat(total_balance_amt) <= 0 && parseFloat(amt) > 0 && parseFloat($("#total_payment").val()) < parseFloat(amt)) {
      amt_enter = parseFloat($("#total_payment").val());
    }
    else {
      amt_enter = parseFloat(amt);
    }
    $("#amount").val(amt_enter).trigger("change").prop("disabled", true);
    $("#amount").data({ "advance_id": advance_id, "payment_id": payment_id });
    $("#payment_date").val(payment_date);
    $("#ref_no").val(ref_no);
    $("#utr_no").val(utr_no);

  })

  $("#advance_payment_tbody_m").on("dblclick", "tr", function () {

    $("#extra_payment_m").val(0);
    var utr_no = $(this).find("td").eq(1).text();
    var amt = $(this).find("td").eq(2).text();
    var ref_no = $(this).data("ref_no");
    var payment_date = $(this).data("payment_date");
    var advance_id = $(this).data("advance_id");
    var payment_id = $(this).data("payment_id");

    var total_balance_amt = $("#total_balance_amount_m").text();
    var amt_enter = 0;

    if (parseFloat(total_balance_amt) < parseFloat(amt) && parseFloat(total_balance_amt) > 0) {
      amt_enter = parseFloat(total_balance_amt);
    }
    else if (parseFloat(total_balance_amt) <= 0 && parseFloat(amt) > 0 && parseFloat($("#total_payment_m").val()) < parseFloat(amt)) {
      amt_enter = parseFloat($("#total_payment_m").val());
    }
    else {
      amt_enter = parseFloat(amt);
    }
    $("#amount_m").val(amt_enter).trigger("change").prop("disabled", true);
    $("#amount_m").data({ "advance_id": advance_id, "payment_id": payment_id });
    $("#payment_date_m").val(payment_date);
    $("#ref_no_m").val(ref_no);
    $("#utr_no_m").val(utr_no);

  })

  $("#spare_tbody").on("click", "#trash_spare", function () {

    var spares_id = $(this).val();
    var oid = $(this).closest('tr').data("oid");
    swal({
      title: "Warning",
      text: "Are you sure you want to delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(function (confirm) {
      if (confirm) {
        delete_sale_order_spares(spares_id, oid);
      }
    })

  })

  $("#spare_tbody").on("click", "#edit_spare", function () {

    $("#spareModal").modal("show");
    $("#update_quotation_btn").removeClass("d-none");
    $("#add_quotation_btn").addClass("d-none");

    var row = $(this).closest("tr");
    var spares_id = $(this).val();
    var oid = row.data("oid");
    var dcf_no = row.data("dcf_no");

    var qno = row.find("td").eq(1).text();
    var amount = row.find("td").eq(2).text() || 0;
    var remark = row.find("td").eq(3).text() || '';

    $("#quotation_no").val(qno).data({ "oid": oid, "spares_id": spares_id, "dcf_no": dcf_no });
    $("#quotation_amount").val(amount);
    $("#quotation_remark").val(remark);

  })

  $("#update_quotation_btn").click(function () {

    var qno = $("#quotation_no").val();
    var amount = $("#quotation_amount").val();
    var remark = $("#quotation_remark").val();
    var oid = $("#quotation_no").data("oid");
    var spares_id = $("#quotation_no").data("spares_id");
    var dcf_no = $("#quotation_no").data("dcf_no");

    if (!qno || !amount || !spares_id || !oid) {
      salert("Warning", "Data missing, try again", "warning");
      return;
    }
    update_sale_order_spares(oid, qno, remark, amount, dcf_no, spares_id)

  })



  $("#order_table, #app_order_table, #req_table").on("click", ".togglePrice", function () {

    var pricesummary = $(this).closest("td").find("ul.priceList").attr("id")
    var pricedetails = $(this).closest("td").find("ul.mainPriceList").attr("id")

    if ($(this).is(":checked")) {
      $("#" + pricesummary).removeClass("d-none");
      $("#" + pricedetails).addClass("d-none");
    }
    else {
      $("#" + pricesummary).addClass("d-none");
      $("#" + pricedetails).removeClass("d-none");
    }
  });


  $(" #mobile_order_card, #mobile_approved_order_card, #mobile_req_card").on("click", ".mtogglePrice", function () {

    var m_pricesummary = $(this).closest("span").find("ul.mpriceList").attr("id");
    var m_pricedetails = $(this).closest("span").find("ul.mmainPriceList").attr("id");

    if ($(this).is(":checked")) {
      $("#" + m_pricesummary).removeClass("d-none");
      $("#" + m_pricedetails).addClass("d-none");
    }
    else {
      $("#" + m_pricesummary).addClass("d-none");
      $("#" + m_pricedetails).removeClass("d-none");
    }
  });

});





function clear_payment_field() {
  $("#amount, #utr_no, #payment_date, #ref_no").val("");
  $("#amount").data("advance_id", "null");
  $("#extra_payment").val(0);
  $("#total_payment").data("paid_amt", 0);
}





function update_sale_order_spares(oid, qno, remark, amount, dcf_no, spares_id) {

  //console.logoid, qno, remark, amount, dcf_no, spares_id);


  $.ajax({
    url: "php/update_sale_order_spares.php",
    type: "post", //send it through get method
    data: {
      oid: oid,
      qno: qno,
      remark: remark,
      amount: amount,
      dcf_no: dcf_no,
      spares_id: spares_id,
      customer_id: cus_id

    },
    success: function (response) {

      //console.log

      if (response.toString().includes("ok")) {

        $("#update_quotation_btn").addClass("d-none");
        $("#add_quotation_btn").removeClass("d-none");
        $("#quotation_fields_check").prop("checked", false);
        $("#quotation_no").val('').data({ "oid": 0, "spares_id": 0, "dcf_no": 0 });
        $("#quotation_amount").val("")
        $("#quotation_remark").val("")
        $("#spareModal").modal("hide")
        shw_toast("Success", "Spares Updated", "success")
        get_sales_order_single(oid);

      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function delete_sale_order_spares(spares_id, oid) {

  //console.logspares_id, oid);


  $.ajax({
    url: "php/delete_sale_order_spares.php",
    type: "post", //send it through get method
    data: {
      spares_id: spares_id,


    },
    success: function (response) {

      //console.log

      if (response.toString().includes("ok")) {

        shw_toast("Success", "Spares deleted", "success")
        // $("#total_payment").val(0);
        get_sales_order_single(oid);

      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function insert_sale_order_spares(oid, qno, remark, amount, dcf_no) {

  //console.logoid, qno, remark, amount, dcf_no);


  $.ajax({
    url: "php/insert_sale_order_spares.php",
    type: "post", //send it through get method
    data: {
      oid: oid,
      qno: qno,
      remark: remark,
      amount: amount,
      dcf_no: dcf_no,
      customer_id: cus_id


    },
    success: function (response) {

      //console.log

      if (response.toString().includes("ok")) {

        $("#quotation_fields_check").prop("checked", false);
        $("#quotation_no").val('');
        $("#quotation_amount").val("")
        $("#quotation_remark").val("")
        $("#spareModal").modal("hide");
        $("#spareModal").modal("hide");
        shw_toast("Success", "Spares Updated", "success")
        get_sales_order_single(oid);

      }





    },
    error: function (xhr) {
      //console.logxhr.responseText)
    }
  });




}

function insert_sales_order_product(oid, type_id, model_id, sub_type, required_qty, price, billing_amount, opid) {

  //console.logoid, type_id, model_id, sub_type, required_qty, price, billing_amount, opid);


  $.ajax({
    url: "php/insert_sales_order_product.php",
    type: "post", //send it through get method
    data: {
      oid: oid,
      type_id: type_id,
      model_id: model_id,
      sub_type: sub_type,
      required_qty: required_qty,
      price: price,
      billing_amount: billing_amount,
      opid: opid,
      customer_id: cus_id


    },
    success: function (response) {

      //console.log

      if (response.toString().includes("ok")) {

        $('#product').val("")
        $('#pmodel').val("")
        $('#pmodel').attr('disabled', true)
        $('#ptype').val("")
        $('#ptype').attr('disabled', true)
        $('#qty').val("1")
        $('#product_sub_type_card').addClass('d-none')
        $('#sub_type_div').empty()
        $('#required_qty').val("")
        $("#billing_price").val("")
        $("#machine_price").val("")
        $("#credit_amount").text("0")
        shw_toast("Success", "Product Updated", "success")
        get_sales_order_single(oid);

      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function update_sales_order_product(oid, opid, type_id, model_id, sub_type, required_qty, price, billing_amount, cus_id) {

  //console.logoid, opid, type_id, model_id, sub_type, required_qty, price, billing_amount, cus_id);


  $.ajax({
    url: "php/update_sales_order_product.php",
    type: "post", //send it through get method
    data: {
      oid: oid,
      type_id: type_id,
      model_id: model_id,
      sub_type: sub_type,
      required_qty: required_qty,
      price: price,
      billing_amount: billing_amount,
      opid: opid,
      customer_id: cus_id


    },
    success: function (response) {

      //console.log

      if (response.toString().includes("ok")) {

        $("#update_sale_product_btn, #cancel_sale_product_btn").addClass("d-none");
        $("#add_sale_product_btn").removeClass("d-none");
        $('#product').val("")
        $('#pmodel').val("")
        $('#pmodel').attr('disabled', true)
        $('#ptype').val("")
        $('#ptype').attr('disabled', true)
        $('#qty').val("1")
        $('#product_sub_type_card').addClass('d-none')
        $('#sub_type_div').empty()
        $('#required_qty').val("")
        $("#billing_price").val("")
        $("#machine_price").val("")
        $("#credit_amount").text("0")
        shw_toast("Success", "Product Updated", "success")
        get_sales_advance(cus_id);
        get_jaysan_sales_product(oid);


      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}


function get_sales_advance(cus_id) {




  $.ajax({
    url: "php/get_sales_advance.php",
    type: "get", //send it through get method
    data: {
      cus_id: cus_id

    },
    success: function (response) {

      //console.log

      if (response.trim() != "error") {
        $("#advance_payment_tbody").empty();
        if (response.trim() != "0 result") {
          $("#advance_payment_card").removeClass("d-none");
          var obj = JSON.parse(response);
          var count = 0

          obj.forEach(function (obj) {
            count += 1;

            $("#advance_payment_tbody").append(`<tr data-advance_id='${obj.advance_id}' data-cus_id='${cus_id}' data-payment_id='${obj.payment_id}' data-ref_no='${obj.ref_no}' data-payment_date='${obj.payment_date}' style='font-size: 10px'><td>${count}</td><td>${obj.utr_no}</td><td>${obj.balance_amount}</td></tr>`)
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
function get_sales_advance_m(cus_id) {




  $.ajax({
    url: "php/get_sales_advance.php",
    type: "get", //send it through get method
    data: {
      cus_id: cus_id

    },
    success: function (response) {

      //console.log

      if (response.trim() != "error") {
        $(" #advance_payment_tbody_m").empty();
        if (response.trim() != "0 result") {
          $(" #advance_payment_card_m").removeClass("d-none");
          var obj = JSON.parse(response);
          var count = 0

          obj.forEach(function (obj) {
            count += 1;


            $("#advance_payment_tbody_m").append(`<tr data-advance_id='${obj.advance_id}' data-payment_id='${obj.payment_id}' data-ref_no='${obj.ref_no}' data-payment_date='${obj.payment_date}' style='font-size: 10px'><td>${count}</td><td>${obj.utr_no}</td><td>${obj.balance_amount}</td></tr>`)
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




function show_product_details_card() {


  $('#product_details_card')
    .find('input, select, textarea, button')
    .prop('disabled', false);
}

function update_customer_type(cus_sub_group_id, cus_id) {


  //console.logcus_sub_group_id, cus_id);


  $.ajax({
    url: "php/update_customer_type.php",
    type: "post", //send it through get method
    data: {
      cus_type_id: cus_sub_group_id,
      cus_id: cus_id,


    },
    success: function (response) {

      //console.log

      if (response.toString().includes("ok")) {
        $("#customer_type").val($("#cus_sub_group").val());
        $("#cus_sub_group").data("cus_sub_group_id", '');
        $("#cus_sub_group").val('');
        $("#cus_group").val('');
        $("#cusTypeModal").modal("hide");



        $("#ptype").data("cus_type_id", cus_sub_group_id);

        show_product_details_card();


        shw_toast("Success", "Customer Type Updated", "success")

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

      //console.log

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

function e_delete_sales_pay(advance_id, oid) {

  //console.logpayment_id, oid);


  $.ajax({
    url: "php/delete_sale_payment_advance.php",
    type: "post", //send it through get method
    data: {
      advance_id: advance_id,


    },
    success: function (response) {

      console.log(response)


      if (response.toString().includes("ok")) {

        shw_toast("Success", "Payment Deleted ", "success")
        get_sales_advance(cus_id)
        get_jaysan_sales_product(oid)

      }





    },
    error: function (xhr) {
      //console.logxhr.responseText);
      salert("Warning", xhr.responseText, "warning");
    }
  });




}

function na_delete_sales_pay(payment_id, oid) {

  console.log(payment_id, oid);


  $.ajax({
    url: "php/delete_sales_pay.php",
    type: "get", //send it through get method
    data: {
      payment_id: payment_id,


    },
    success: function (response) {

      console.log(response)


      if (response.toString().includes("ok")) {
        console.log("f");

        shw_toast("Success", "Payment Deleted ", "success")
        get_sales_advance(cus_id)
        get_jaysan_sales_payment(oid)

      }





    },
    error: function (xhr) {
      //console.logxhr.responseText);
      salert("Warning", xhr.responseText, "warning");
    }
  });




}

function delete_sales_pay(advance_id, oid) {




  $.ajax({
    url: "php/delete_sale_payment_advance.php",
    type: "post", //send it through get method
    data: {
      advance_id: advance_id,


    },
    success: function (response) {

      console.log(response)

      if (response.toString().includes("ok")) {

        shw_toast("Success", "Payment Deleted ", "success")
        get_sales_advance_m(cus_id)

        get_jaysan_sales_payment_m(oid)


      }





    },
    error: function (xhr) {
      salert("Warning", xhr.responseText, "warning");
    }
  });




}

function na_delete_sales_pay_m(payment_id, oid) {

  //console.logpayment_id, oid);


  $.ajax({
    url: "php/delete_sales_pay.php",
    type: "get", //send it through get method
    data: {
      payment_id: payment_id,


    },
    success: function (response) {

      console.log(response)


      if (response.includes("ok")) {

        shw_toast("Success", "Payment Deleted ", "success")
        get_sales_advance_m(cus_id)

        get_jaysan_sales_payment_m(oid)

      }





    },
    error: function (xhr) {
      //console.logxhr.responseText);
      salert("Warning", xhr.responseText, "warning");
    }
  });




}


function insert_sales_pay(cus_id) {

  $.ajax({
    url: "php/insert_sales_payment.php",
    type: "post", //send it through get method
    data: {
      oid: oid,
      ref_no: $('#ref_no_m').val(),
      utr_no: $('#utr_no_m').val(),
      amount: $('#amount_m').val(),
      payment_date: $('#payment_date_m').val(),
      advance_deposite: $("#extra_payment_m").val() ?? 0,
      customer_id: cus_id,

    },
    success: function (response) {

      //console.log

      if (response.toString().includes("ok")) {

        $('#ref_no_m').val("")
        $('#utr_no_m').val("")
        $('#amount_m').val(0)
        $('#payment_date_m').val("")
        $("#extra_payment_m").val(0)
        shw_toast("Success", "Payment Added", "success")
        get_sales_advance_m(cus_id)
        get_jaysan_sales_payment_m(oid)



      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}


function insert_sale_payment_advance(payment_id, advance_id, amount, oid, cus_id) {

  console.log(payment_id, advance_id, amount, oid, cus_id);

  $.ajax({
    url: "php/insert_sale_payment_advance.php",
    type: "post", //send it through get method
    data: {
      payment_id: payment_id,
      amount: amount,
      oid: oid,
      cus_id: cus_id,
      advance_ref_id: advance_id,
      emp_id: current_user_id

    },
    success: function (response) {

      //console.log

      if (response.toString().includes("ok")) {

        $("#payment_cancel_btn").addClass("d-none");
        $("#payment_add_btn").removeClass("d-none");
        shw_toast("Success", "Payment Added", "success")
        $('#ref_no, #ref_no_m').val("")
        $('#utr_no, #utr_no_m').val("")
        $('#amount, #amount_m').val(0)
        $('#amount, #amount_m').data({ "advance_id": "", "payment_id": "" })
        $('#payment_date, #payment_date_m').val("")
        $("#extra_payment, #extra_payment_m").val(0);
        // get_sales_advance_m(cus_id)
        // get_jaysan_sales_payment_m(oid)
        // get_sales_order_single(oid)


      }





    },
    error: function (xhr) {
      salert("Warning", xhr.responseText, "warning");
    }
  });




}

function update_sales_pay(amount, payment_date, oid, ref_no, utr_no, customer_id, advance_deposite) {
  $.ajax({
    url: "php/insert_sales_payment.php",
    type: "post", //send it through get method
    data: {
      oid: oid,
      ref_no: ref_no,
      utr_no: utr_no,
      amount: amount,
      payment_date: payment_date,
      advance_deposite: advance_deposite ?? 0,
      customer_id: customer_id,

    },
    success: function (response) {

      //console.log

      if (response.toString().includes("ok")) {

        shw_toast("Success", "Payment Added", "success")
        $('#ref_no').val("")
        $('#utr_no').val("")
        $('#amount').val("")
        $('#amount').data("advance_id", "")
        $('#payment_date').val("")
        $("#extra_payment").val("");
        get_sales_order_single(oid)
        get_jaysan_sales_payment_m(oid)

        get_sales_advance_m(cus_id)



      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function update_jaysan_payment1(amount, payment_date, ref_no, utr_no, payment_id, oid) {
  $.ajax({
    url: "php/update_jaysan_payment1.php",
    type: "post", //send it through get method
    data: {
      ref_no: ref_no,
      utr_no: utr_no,
      amount: amount,
      pay_date: payment_date,
      payment_id: payment_id,

    },
    success: function (response) {

      console.log(response)

      if (response.toString().includes("ok")) {

        $("#payment_update_btn, #payment_cancel_btn").addClass("d-none");
        $("#payment_add_btn").removeClass("d-none");
        shw_toast("Success", "Payment Added", "success")

        $('#ref_no').val("")
        $('#utr_no').val("")
        $('#amount').val("")
        $('#amount').data({ "advance_id": "", payment_id: "" })
        $('#payment_date').val("")
        $("#extra_payment").val("");
        get_sales_order_single(oid)


      }





    },
    error: function (xhr) {
      salert("Warning", xhr.responseText, "warning");
    }
  });




}


function update_sales_pay_date() {




  $.ajax({
    url: "php/update_sales_pay_date.php",
    type: "get", //send it through get method
    data: {
      oid: oid,
      pay_date: $('#nex_payment_date_m').val(),


    },
    success: function (response) {

      //console.log

      if (response.toString().includes("ok")) {

        shw_toast("Success", "Payment Date Updated", "success")
        get_jaysan_sales_payment_m(oid)

      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
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
      //console.log


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
            //console.log$('#payment_details_tr').html());


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
      //console.log


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




function get_jaysan_model_subtype() {

  console.log($('#ptype').val(), $('#ptype').data("cus_type_id"));


  $.ajax({
    url: "php/get_jaysan_model_subtype_sale.php",
    type: "get", //send it through get method
    data: {
      mtid: $('#ptype').val(),
      subgroup_id: $('#ptype').data("cus_type_id") || '0'


    },
    success: function (response) {
      //console.log

      $('#sub_type_div').empty()
      $('#product_sub_type_card').removeClass('d-none')
      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);

          //    price: item.sub_price_final,
          // is_reduce: item.is_reduce
          var app_html = ""
          var app_nhtml = ""
          obj.forEach(function (obj) {
            var price_details = JSON.parse(obj.price_details) || [];




            $("#mrp_amount").data("max", obj.mrp);

            $("#billing_price").data("max", obj.max_price);
            $("#billing_price").data("min", obj.min_price);

            if (obj.sec_name === null) {
              price_details.forEach(function (item) {
                // //console.logitem);
                {
                  app_nhtml = app_nhtml + "  <div class='form-check small'> <input data-is_reduce='" + item.is_reduce + "' data-price='" + item.price + "' data-discount='" + item.discount + "' class='form-check-input sub_type_chk' " + (item.is_default == 1 ? "checked" : "") + " type='checkbox' value='" + item.msid + "' id='chk_" + item.msid + "'> <label class='form-check-label' for='chk_" + item.msid + "'> " + item.subtype_name + "  " + (Number(item.discount) > 0 ? "<span style = 'font-size: 10px' class='text-danger  small'>" + item.discount + " /- Offer</span>" : "") + "</label> </div> "
                }
              });
              app_html = app_html + "<div class='col'><fieldset class='boxborder bg-light'><legend>Additional Features</legend>" + app_nhtml + "</fieldset></div>"
            }
            else {

              var chk = ""
              price_details.forEach(function (item) {

                // chk = chk + "<div class='form-check'> <input class='form-check-input sub_type_chk' " + (item.is_default == 1 ? "checked" : "")  + " type='checkbox'  name='"+obj.sec_name+"' value='" + item.msid + "' id='chk_"+item.msid+"'> <label class='form-check-label' for='chk_"+item.msid+"'> " + item.subtype_name + " </label> </div> "
                chk = chk + "<div class='mb-1'> <label class='form-label d-block mb-1'><div class='small form-check form-check-inline'> <input data-is_reduce='" + item.is_reduce + "' data-price='" + item.price + "' data-discount='" + item.discount + "' class='form-check-input sub_type_chk' id='chk_" + item.msid + "' type='radio' name='" + obj.sec_name + "'   value='" + item.msid + "' " + (item.is_default == 1 ? "checked" : "") + "> <label class='form-check-label' for='chk_" + item.msid + "'> " + item.subtype_name + "</label> </div> " + (Number(item.discount) > 0 ? "<span style = 'font-size: 10px' class='text-danger  small'>" + item.discount + " /- Offer</span>" : "") + "</label> </div>"
                // chk = chk + "<div class='col'> <div class='form-check'> <input class='form-check-input sub_type_chk' type='checkbox' name='"+item.sec_name+"' value='" + item.msid + "' " + (item.is_default == 1 ? "checked" : "") + "> <label class='form-check-label' for='option2'> " + item.subtype_name + " </label> </div> </div>"
              });

              app_html = app_html + "<div class='col'><fieldset class='boxborder'><legend>" + obj.sec_name + "</legend>" + chk + "</fieldset></div>"
            }




          });
          $('#sub_type_div input[type="checkbox"]').prop('disabled', false);
          $('#sub_type_div').append(app_html);


          $('#qty').focus()
          //  //get_subcus_price();
          change_price();
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

function change_price() {
  let min_price = parseFloat($("#billing_price").data("min")) || 0;
  let max_price = parseFloat($("#billing_price").data("max")) || 0;
  $(".sub_type_chk").each(function (index, el) {

    if ($(this).is(":checked")) {
      if ($(this).data("is_reduce") == 0) {
        min_price = min_price + parseFloat($(this).data("price")) - parseFloat($(this).data("discount"));
        max_price = max_price + parseFloat($(this).data("price")) - parseFloat($(this).data("discount"));
      }
      else {
        min_price = min_price - parseFloat($(this).data("price")) - parseFloat($(this).data("discount"));
        max_price = max_price - parseFloat($(this).data("price")) - parseFloat($(this).data("discount"));
      }

    }

  });
  $("#billing_price").val(max_price);
  $("#machine_price").val(max_price);

  $("#machine_price").data("max", max_price);
  $("#machine_price").data("min", min_price);

  $("#spl_checkbox_hide").addClass("d-none")
  $(this).css("color", "#000")
}

function get_subcus_price() {

  //console.log$('#ptype').val(), $('#ptype').data("cus_type_id"));


  $.ajax({
    url: "php/get_subcus_price.php",
    type: "get", //send it through get method
    data: {
      mtid: $('#ptype').val(),
      subgroup_id: $('#ptype').data("cus_type_id")

    },
    success: function (response) {
      //console.log

      if (response.trim() != "error") {

        if (response.trim() !== "0 result") {

          const obj = JSON.parse(response);


          const model_subtypes = obj.model_subtypes || [];
          const subgroup_type_price = obj.subgroup_type_price || [];


          if (subgroup_type_price.length > 0) {
            $("#billing_price").val(subgroup_type_price[0].max_price);
            $("#mrp_amount").val(subgroup_type_price[0].mrp).data("max", subgroup_type_price[0].max_price);
            $("#machine_price").val(subgroup_type_price[0].max_price);
            $("#machine_price").data("max", subgroup_type_price[0].max_price);
            $("#machine_price").data("min", subgroup_type_price[0].min_price);
          }


          model_subtypes.forEach(function (item) {

            $("#sub_type_div input.sub_type_chk").each(function () {

              const $chk = $(this);

              if (Number(item.msid) === Number($chk.val())) {
                var discountPercent = ((item.discount / item.sub_price) * 100);
                discountPercent = isNaN(discountPercent) ? 0 : Number(discountPercent.toFixed(1));
                $chk.data({
                  price: item.sub_price_final,
                  is_reduce: item.is_reduce
                });
              }

            });

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

function delete_sales_order_product(oid, opid) {



  $.ajax({
    url: "php/delete_sales_order_product.php",
    type: "post", //send it through get method
    data: {
      oid: oid,
      opid: opid,
      customer_id: cus_id
    },
    success: function (response) {
      //console.log

      if (response.trim() != "error") {

        if (response.toString().includes("ok")) {
          shw_toast("Success", "Product Deleted", "success")
          // $("#total_payment").val(0);
          get_sales_order_single(oid)
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
      //console.logxhr.responseText);
      if ("need_one_product" == xhr.responseText.trim()) {
        salert("Error", "Atleast one product is required in the order", "error");
      }
    }
  });



}
// function delete_sales_product(opid) {



//   $.ajax({
//     url: "php/delete_sales_product.php",
//     type: "get", //send it through get method
//     data: {
//       opid: opid
//     },
//     success: function (response) {
//       //console.log

//       if (response.trim() != "error") {

//         if (response.toString().includes("ok")) {
//           shw_toast("Success", "Product Deleted", "success")
//           get_jaysan_sales_product(sales_oid)
//         }
//         else {
//         }

//       }

//       else {
//         salert("Error", "User ", "error");
//       }



//     },
//     error: function (xhr) {
//       //Do Something to handle error
//     }
//   });



// }


function delete_sales_order(oid) {



  $.ajax({
    url: "php/delete_sales_order.php",
    type: "get", //send it through get method
    data: {
      oid: oid
    },
    success: function (response) {
      //console.log

      if (response.trim() != "error") {

        if (response.toString().includes("ok")) {


          location.reload()
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

function get_sales_order(approve_sts) {


  $.ajax({

    url: "php/get_sales_report_emp.php",
    type: "get", //send it through get method
    data: {
      emp_id: '',
      approve_sts: approve_sts,
      order_cat: "Sales"
    },
    success: function (response) {
      //console.log


      $('#order_table').empty()
      $('#mobile_order_card').empty()
      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0

          obj.sort(function (a, b) {
            return parseInt(b.oid) - parseInt(a.oid);
          });
          obj.forEach(function (obj) {
            var bd = ""
            count = count + 1;



            var advance_deposite_details = JSON.parse(obj.advance_deposite_details) || [];

            var total = parseFloat(obj.debit) || 0;
            var paid = parseFloat(obj.credit) || 0;


            var balance = total - paid;
            var percent = (paid / total) * 100;
            percent = Math.min(Math.max(percent, 0), 100);

            var received_details = JSON.parse(obj.received_details) || [];

            var f_total_product_price = parseFloat(obj.total_product_price || 0) + parseFloat(obj.total_spares_amount || 0)
            var f_paid = 0
            received_details.forEach(function (rev) {
              paid += parseFloat(rev.amount)
            })

            var advance_given = 0
            advance_deposite_details.forEach(function (advance) {
              advance_given += parseFloat(advance.advance_given) || 0;
            })

            var advance_taken_details = JSON.parse(obj.advance_taken_details) || [];

            var total_advance_taken = 0;
            advance_taken_details.forEach(function (advance_taken) {
              total_advance_taken += parseFloat(advance_taken.advance_taken || 0)
            })

            var price = `
                        <div class="form-check form-switch">
                          <input class="form-check-input togglePrice  float-end" type="checkbox" id="togglePrice">
                        </div>
                        <ul class="list-group d-none priceList" id="priceList${obj.order_no}">
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between gap-2">
                                    <p class="my-auto small">Total Product Price:</p>
                                    <p class="small fw-bold my-auto">${obj.total_product_price || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Total Spare Price:</p>
                                    <p class="small fw-bold my-auto">${obj.total_spares_amount || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Total Advance Taken:</p>
                                    <p class="small fw-bold my-auto">${total_advance_taken}</p>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Total Advance Given:</p>
                                    <p class="small fw-bold my-auto">${advance_given || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item bg-success text-white">
                                <div class="d-flex justify-content-between  gap-2 ">
                                    <p class="my-auto small">Total:</p>
                                    <p class="small fw-bold my-auto">${obj.credit || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item  bg-warning">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Balance:</p>
                                    <p class="small fw-bold my-auto">${balance}</p>
                                </div>
                            </li>
                        </ul>
                        <ul class="list-group mainPriceList" id="mainPriceList${obj.order_no}">
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between">
                                    <p class="my-auto small">Total</p>
                                    <p class="small fw-bold my-auto">${f_total_product_price}</p>
                                </div>
                            </li>

                            <li class="list-group-item">
                                <div class="d-flex justify-content-between">
                                    <p class="small my-auto">Paid</p>
                                    <p class="small fw-bold my-auto">${obj.total_received_payment || 0}</p>
                                </div>
                            </li>

                            <li class="list-group-item">
                                <div class="d-flex justify-content-between">
                                    <p class="small my-auto">Balance</p>
                                    <p class="small text-bg-warning fw-bold my-auto">${balance}</p>
                                </div>
                            </li>

                            <li class="list-group-item">
                                <div class="progress bg-danger">
                                    <div class="progress-bar progress-bar-striped progress-bar-animated"
                                        role="progressbar"
                                        style="width:${percent}%;"
                                        aria-valuenow="${percent}"
                                        aria-valuemin="0"
                                        aria-valuemax="">
                                        ${Math.round(percent)}%
                                    </div>
                                </div>
                            </li>
                        </ul>
                        `;

            var mprice = `
                        <div class="form-check form-switch">
                          <input class="form-check-input mtogglePrice  float-end" type="checkbox" id="mtogglePrice">
                        </div>
                        <ul class="list-group d-none mpriceList" id="mpriceList${obj.order_no}">
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between gap-2">
                                    <p class="my-auto small">Total Product Price:</p>
                                    <p class="small fw-bold my-auto">${obj.total_product_price || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Total Spare Price:</p>
                                    <p class="small fw-bold my-auto">${obj.total_spares_amount || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Total Advance Taken:</p>
                                    <p class="small fw-bold my-auto">${total_advance_taken}</p>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Total Advance Given:</p>
                                    <p class="small fw-bold my-auto">${advance_given || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item bg-success text-white">
                                <div class="d-flex justify-content-between  gap-2 ">
                                    <p class="my-auto small">Total:</p>
                                    <p class="small fw-bold my-auto">${obj.credit || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item  bg-warning">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Balance:</p>
                                    <p class="small fw-bold my-auto">${balance}</p>
                                </div>
                            </li>
                        </ul>
                        <ul class="list-group mmainPriceList" id="mmainPriceList${obj.order_no}">
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between">
                                    <p class="my-auto small">Total</p>
                                    <p class="small fw-bold my-auto">${f_total_product_price}</p>
                                </div>
                            </li>

                            <li class="list-group-item">
                                <div class="d-flex justify-content-between">
                                    <p class="small my-auto">Paid</p>
                                    <p class="small fw-bold my-auto">${obj.total_received_payment || 0}</p>
                                </div>
                            </li>

                            <li class="list-group-item">
                                <div class="d-flex justify-content-between">
                                    <p class="small my-auto">Balance</p>
                                    <p class="small text-bg-warning fw-bold my-auto">${balance}</p>
                                </div>
                            </li>

                            <li class="list-group-item">
                                <div class="progress bg-danger">
                                    <div class="progress-bar progress-bar-striped progress-bar-animated"
                                        role="progressbar"
                                        style="width:${percent}%;"
                                        aria-valuenow="${percent}"
                                        aria-valuemin="0"
                                        aria-valuemax="">
                                        ${Math.round(percent)}%
                                    </div>
                                </div>
                            </li>
                        </ul>
                        `;

            if (obj.pay_sts == "na" || obj.pay_sts === null) {
              bd = "disabled"
            }
            //console.logobj.pay_sts);
            
            $('#order_table').append("<tr class = ''><td>" + count + "</td><td class = 'small' style='max-width: 50px;'>" + obj.order_no + "</td>><td class = 'small' style='max-width: 100px;'>" + obj.dated + "</td> <td class = 'small'>" + obj.emp + "</td><td class = 'small ' style='max-width: 250px;'>" + price + "</td> <td class = 'small ' style='max-width: 100px;'>" + obj.cus + "</td><td style='max-width: 250px;'><div>" + obj.pro + "</div></td> <td style='max-width: 50px;'><button type ='button' value='" + obj.oid + "' class='btn btn-outline-primary edit_btn border-0' id='fa-edit'><i class='fa-solid fa-edit'></i></button></td><td style='max-width: 50px;'><button type ='button' value='" + obj.oid + "' class='delete_btn btn btn-outline-danger border-0' id='fa-trash'><i class='fa-solid fa-trash-can'></i></button></td><td><button  type = 'button'  value='" + obj.oid + "' data-cus_id='" + obj.customer_id + "' class='pay_btn btn btn-success btn-sm border-0'>Pay</td><td style='max-width: 50px;'><button  " + bd + " type ='button' value='" + obj.oid + "' class='btn btn-outline-primary download border-0' id='fa-download'><i class='fa-solid fa-download'></i></button></td></tr>")


            $("#mobile_order_card").append(`
                  <div class="card mb-2 shadow-sm border-0 rounded-3" data-oid="${obj.oid}">
                      <div class="card-body p-2">

                          <!-- Header -->
                          <div class="d-flex justify-content-between align-items-center mb-1">
                              <span class="small fw-semibold">${count}) Order.no: ${obj.order_no}</span>
                              <span class="badge bg-light text-dark small">${obj.dated}</span>
                          </div>

                          <!-- Info -->
                          <div class="small text-muted mb-1">
                              <i class="fa-solid fa-user me-1"></i> ${obj.emp}
                          </div>

                          <div class="small mb-1">
                              <span class="text-muted">Customer:</span>
                              <span class="fw-semibold">${obj.cus}</span>
                          </div>

                          <div class="small mb-1 price">
                              <span class="text-muted">Payment:</span>
                              <span class="fw-semibold">${mprice}</span>
                          </div>

                          <div class="small text-muted mb-2"> ${obj.pro}
                          </div>

                          <hr class="my-2">

                          <!-- Actions -->
                          <div class="d-flex justify-content-between gap-1">
                              <button type="button"
                                  value="${obj.oid}"
                                  class="btn btn-outline-primary btn-sm edit_btn border-0 flex-fill" id='fa-edit'>
                                  <i class="fa-solid fa-edit"></i>
                              </button>

                              <button type="button"
                                  value="${obj.oid}"
                                  class="btn btn-outline-danger btn-sm delete_btn border-0 flex-fill" id='fa-trash'>
                                  <i class="fa-solid fa-trash-can"></i>
                              </button>

                              <button type="button"
                                  value="${obj.oid}"  data-cus_id="${obj.customer_id}"
                                  class="btn btn-success btn-sm pay_btn border-0 flex-fill">
                                  Pay
                              </button>

                              <button type="button"
                                  ${bd}
                                  value="${obj.oid}"
                                  class="btn btn-outline-primary btn-sm download border-0 flex-fill" id='fa-download'>
                                  <i class="fa-solid fa-download"></i>
                              </button>
                          </div>

                      </div>
                  </div>
              `);


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
  // $.ajax({

  //   url: "php/get_sale_order_report.php",
  //   type: "get", //send it through get method
  //   data: {
  //     customer_id: "",
  //     order_no: "",
  //     assign_type: "",
  //     product_id: "",
  //     type_id: "",
  //     model_id: "",
  //     sub_type: "",
  //     emp_id: current_user_id,
  //     unassigned_qty: "",
  //     godown: "",
  //     production_date: "",
  //     sale_order_date: "",
  //     order_category: "",
  //     remain_dcf: '',
  //     payment: "",
  //   },
  //   success: function (response) {
  //     //console.log


  //     $('#order_table').empty()
  //     $("#mobile_order_card").empty()
  //     if (response.trim() != "error") {

  //       if (response.trim() != "0 result") {

  //         var obj = JSON.parse(response);
  //         var count = 0


  //         obj.forEach(function (obj) {
  //           count = count + 1;

  //           var pro = '';
  //           let accId = `acc-${obj.order_no}`;
  //           let headingId = `heading-${obj.order_no}`;
  //           let collapseId = `collapse-${obj.order_no}`;
  //           var product = JSON.parse(obj.product);
  //           var received_details = JSON.parse(obj.received_details) || [];
  //           var advance_deposite_details = JSON.parse(obj.advance_deposite_details) || [];

  //           var total = parseFloat(obj.debit) || 0;
  //           var paid = parseFloat(obj.credit) || 0;

  //           var percent = (paid / total) * 100;
  //           percent = Math.min(Math.max(percent, 0), 100);


  //           var advance_given = 0
  //           advance_deposite_details.forEach(function(advance){
  //             advance_given += parseFloat(advance.advance_given) || 0;
  //           })
  //           var price = `
  //                       <div class="form-check form-switch">
  //                         <input class="form-check-input togglePrice  float-end" type="checkbox" id="togglePrice">
  //                       </div>
  //                       <ul class="list-group d-none priceList" id="priceList${obj.order_no}">
  //                           <li class="list-group-item">
  //                               <div class="d-flex justify-content-between">
  //                                   <p class="my-auto small">Total Product Price</p>
  //                                   <p class="small fw-bold my-auto">${obj.total_product_price || 0}</p>
  //                               </div>
  //                           </li>
  //                           <li class="list-group-item">
  //                               <div class="d-flex justify-content-between">
  //                                   <p class="my-auto small">Total Spare Price</p>
  //                                   <p class="small fw-bold my-auto">${obj.total_spares_amount || 0}</p>
  //                               </div>
  //                           </li>
  //                           <li class="list-group-item">
  //                               <div class="d-flex justify-content-between">
  //                                   <p class="my-auto small">Total Advance Taken</p>
  //                                   <p class="small fw-bold my-auto">${obj.total_advance_taken || 0}</p>
  //                               </div>
  //                           </li>
  //                           <li class="list-group-item">
  //                               <div class="d-flex justify-content-between  gap-2">
  //                                   <p class="my-auto small">Total Advance Given:</p>
  //                                   <p class="small fw-bold my-auto">${advance_given || 0}</p>
  //                               </div>
  //                           </li>
  //                           <li class="list-group-item bg-success text-white">
  //                               <div class="d-flex justify-content-between ">
  //                                   <p class="my-auto small">Total</p>
  //                                   <p class="small fw-bold my-auto">${obj.credit || 0}</p>
  //                               </div>
  //                           </li>
  //                           <li class="list-group-item  bg-warning">
  //                               <div class="d-flex justify-content-between">
  //                                   <p class="my-auto small">Balance</p>
  //                                   <p class="small fw-bold my-auto">${obj.bal || 0}</p>
  //                               </div>
  //                           </li>
  //                       </ul>
  //                       <ul class="list-group mainPriceList" id="mainPriceList${obj.order_no}">
  //                           <li class="list-group-item">
  //                               <div class="d-flex justify-content-between">
  //                                   <p class="my-auto small">Total</p>
  //                                   <p class="small fw-bold my-auto">${obj.debit}</p>
  //                               </div>
  //                           </li>

  //                           <li class="list-group-item">
  //                               <div class="d-flex justify-content-between">
  //                                   <p class="small my-auto">Paid</p>
  //                                   <p class="small fw-bold my-auto">${obj.credit}</p>
  //                               </div>
  //                           </li>

  //                           <li class="list-group-item">
  //                               <div class="d-flex justify-content-between">
  //                                   <p class="small my-auto">Balance</p>
  //                                   <p class="small text-bg-warning fw-bold my-auto">${obj.bal}</p>
  //                               </div>
  //                           </li>

  //                           <li class="list-group-item">
  //                               <div class="progress bg-danger">
  //                                   <div class="progress-bar progress-bar-striped progress-bar-animated"
  //                                       role="progressbar"
  //                                       style="width:${percent}%;"
  //                                       aria-valuenow="${percent}"
  //                                       aria-valuemin="0"
  //                                       aria-valuemax="">
  //                                       ${Math.round(percent)}%
  //                                   </div>
  //                               </div>
  //                           </li>
  //                       </ul>
  //                       `;



  //           product.forEach(function (item, index) {

  //             accId += `-${index}`;
  //             headingId += `-${index}`;
  //             collapseId += `-${index}`;

  //             var ass_details = '';

  //             var ass_info = item.assign_info;
  //             var dcf = item.dcf_details;

  //             let blink = "";

  //             if (item.remain_dcf > 0) {
  //               blink = `<span class="badge bg-danger text-white blink-badge">${item.remain_dcf}</span>`;
  //             }
  //             // else if (dcf == null && item.remain_dcf > 0) {
  //             //   blink = `<span class="badge bg-danger text-white blink-badge">${item.remain_dcf}</span>`;
  //             // }

  //             let dcf_ratio = parseFloat(item.required_qty) - parseFloat(item.remain_dcf)
  //             let dcf_details = `
  //                 <div class="accordion" id="${accId}">
  //                   <div class="accordion-item">
  //                     <h2 class="accordion-header" id="${headingId}" >
  //                       <button class="accordion-button collapsed py-1 px-2  ali  gn-items-center" id="accordion_head_btn" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">

  //                         <span class="fw-bold pe-4" style="font-size: 11px">DCF Details</span><span class="pe-4" style="font-size: 11px">dcf - ${dcf_ratio}/${item.required_qty}</span>
  //                         ${blink} 

  //                       </button>
  //                     </h2>
  //                     <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headingId}" data-bs-parent="#${accId}">
  //                       <div class="accordion-body py-2 px-2">
  //                   `;

  //             if (dcf != null) {
  //               dcf.forEach(function (d) {
  //                 dcf_details += `
  //                   <div class="card-header bg-light text-dark fw-bold py-1 px-2 dcf-row" data-dcf="${d.dcf_id}">
  //                     <strong>${d.dcf_id}</strong> • ${d.dc_sts} • ${d.dcf_count}
  //                   </div>`;
  //               });
  //             }

  //             else {
  //               dcf_details += `
  //                 <div class="card-header bg-light text-dark fw-bold py-1 px-2">
  //                   No data
  //                 </div>`;
  //             }

  //             dcf_details += `</div></div></div></div>`;



  //             if (item.unassigned_qty == 0) {
  //               ass_info.forEach(function (ass) {

  //                 var godown_details = '';

  //                 ass.assign_details.forEach(function (g) {

  //                   if (ass.assign_type == "Production") {

  //                     godown_details = `<div class="card-body py-1 small text-center text-dark"><p>${g.production_date} - <b>${g.production_date_count}</i></p></div>`;
  //                     return;
  //                   }
  //                   else if (ass.assign_type == "Finshed") {

  //                     godown_details = `<div class="card-body py-1 small text-center text-dark"><p>${g.godown_name} - <b>${g.finished_godown_count}</i></p></div>`;
  //                     return;
  //                   }


  //                   // godown_details += `<p>${g.godown_name ?? ''} - ${g.finished_godown_count}</p>`;
  //                 });



  //                 ass_details += `
  //                   <div class="card border mb-2">
  //                       <div class="card-header py-1 bg-white text-center text-dark small fw-bold">
  //                           ${ass.assign_type} 
  //                           <span class="badge bg-primary ms-1">${ass.assigntype_total_count}</span>
  //                       </div>

  //                           ${godown_details}

  //                   </div>`;
  //               });

  //             }
  //             else {
  //               ass_details = `
  //                 <div class="card bg-danger text-white border-0 p-2 small">
  //                     <div class="d-flex justify-content-between align-items-center">
  //                         <span>Unassigned</span>
  //                         <span class="badge bg-light text-danger blink-badge">
  //                             ${item.unassigned_qty}
  //                         </span>
  //                     </div>
  //                 </div>`
  //             }


  //             pro += `
  //               <div class="card shadow-sm border-0 mb-2">

  //                   <div class="card-header bg-light py-2 px-3">
  //                       <div class="row text-center text-dark small fw-semibold">
  //                           <div class="col">${item.product}</div>
  //                           <div class="col">${item.model_name}</div>
  //                           <div class="col">${item.type_name}</div>
  //                           <div class="col">${item.required_qty}</div>
  //                       </div>
  //                       <div class="text-muted small mt-1">${item.sub_type}</div>
  //                   </div>
  //                      ${dcf_details}



  //                   <div class="card-body py-2 px-3">
  //                       ${ass_details}
  //                   </div>

  //               </div>`;

  //           });


  //           var bd = ""
  //           var total_aprv_payment = 0;
  //           received_details.forEach(function (rev) {

  //             if (rev.sts == "approved") {
  //               total_aprv_payment += parseFloat(rev.amount || 0);
  //             }

  //           });

  //           if ((total_aprv_payment + parseFloat(obj.total_advance_taken || 0)) < 50000) {
  //             bd = "disabled";
  //           }




  //           $("#payment_add_btn_m").data("cus_id", obj.customer_id);
  //           $('#order_table').append("<tr class = ''><td>" + count + "</td><td class = 'small' style='max-width: 50px;'>" + obj.order_no + "</td><td class = 'small' style='max-width: 100px;'>" + obj.sale_order_date + "</td> <td class = 'small'>" + obj.emp_name + "</td><td class = 'small ' style='max-width: 250px;'>" + price + "</td> <td class = 'small ' style='max-width: 100px;'>" + obj.cus_name + "-" + obj.cus_phone + "</td><td style='max-width: 250px;'><div>" + pro + "</div></td><td style='max-width: 50px;'><button type ='button' value='" + obj.oid + "' class='btn btn-outline-primary edit_btn border-0' id='fa-edit'><i class='fa-solid fa-edit'></i></button></td><td style='max-width: 50px;'><button type ='button' value='" + obj.oid + "' class='delete_btn btn btn-outline-danger border-0' id='fa-trash'><i class='fa-solid fa-trash-can'></i></button></td><td><button  type = 'button'  value='" + obj.oid + "' data-cus_id='" + obj.customer_id + "' class='pay_btn btn btn-success btn-sm border-0'>Pay</td><td style='max-width: 50px;'><button  " + bd + " type ='button' value='" + obj.oid + "' class='btn btn-outline-primary download border-0' id='fa-download'><i class='fa-solid fa-download'></i></button></td></tr>");

  //           $("#mobile_order_card").append(`
  //                 <div class="card mb-2 shadow-sm border-0 rounded-3" data-oid="${obj.oid}">
  //                     <div class="card-body p-2">

  //                         <!-- Header -->
  //                         <div class="d-flex justify-content-between align-items-center mb-1">
  //                             <span class="fw-semibold">${count}) · ${obj.order_no}</span>
  //                             <span class="badge bg-light text-dark small">${obj.sale_order_date}</span>
  //                         </div>

  //                         <!-- Info -->
  //                         <div class="small text-muted mb-1">
  //                             <i class="fa-solid fa-user me-1"></i> ${obj.emp_name}
  //                         </div>

  //                         <div class="small mb-1">
  //                             <span class="text-muted">Customer:</span>
  //                             <span class="fw-semibold">${obj.cus_name} - ${obj.cus_phone}</span>
  //                         </div>

  //                         <div class="small mb-1">
  //                             <span class="text-muted">Payment:</span>
  //                             <span class="fw-semibold">${price}</span>
  //                         </div>

  //                         <div class="small text-muted mb-2">
  //                             <i class="fa-solid fa-box me-1"></i> ${pro}
  //                         </div>

  //                         <hr class="my-2">

  //                         <!-- Actions -->
  //                         <div class="d-flex justify-content-between gap-1">
  //                             <button type="button"
  //                                 value="${obj.oid}"
  //                                 class="btn btn-outline-primary btn-sm edit_btn border-0 flex-fill" id='fa-edit'>
  //                                 <i class="fa-solid fa-edit"></i>
  //                             </button>

  //                             <button type="button"
  //                                 value="${obj.oid}"
  //                                 class="btn btn-outline-danger btn-sm delete_btn border-0 flex-fill" id='fa-trash'>
  //                                 <i class="fa-solid fa-trash-can"></i>
  //                             </button>

  //                             <button type="button"
  //                                 value="${obj.oid}"
  //                                 class="btn btn-success btn-sm pay_btn border-0 flex-fill">
  //                                 Pay
  //                             </button>

  //                             <button type="button"
  //                                 ${bd}
  //                                 value="${obj.oid}"
  //                                 class="btn btn-outline-primary btn-sm download border-0 flex-fill" id='fa-download'>
  //                                 <i class="fa-solid fa-download"></i>
  //                             </button>
  //                         </div>

  //                     </div>
  //                 </div>
  //             `);

  //         });

  //         // obj.forEach(function (obj) {
  //         //   var bd = ""
  //         //   count = count + 1;
  //         //   if (obj.pay_sts == "na")
  //         //     bd = "disabled"

  //         //   //console.logobj.pay_sts);


  //         //   $('#order_table').append("<tr class = ''><td>" + count + "</td><td class = 'small' style='max-width: 50px;'>" + obj.order_no + "</td>><td class = 'small' style='max-width: 100px;'>" + obj.dated + "</td> <td class = 'small'>" + obj.emp + "</td><td class = 'small ' style='max-width: 250px;'>" + obj.pay_details + "</td> <td class = 'small ' style='max-width: 100px;'>" + obj.cus + "</td><td style='max-width: 250px;'><div>" + obj.pro + "</div></td> <td style='max-width: 50px;'><button type ='button' value='" + obj.oid + "' class='btn btn-outline-primary edit_btn border-0' id='fa-edit'><i class='fa-solid fa-edit'></i></button></td><td style='max-width: 50px;'><button type ='button' value='" + obj.oid + "' class='delete_btn btn btn-outline-danger border-0' id='fa-trash'><i class='fa-solid fa-trash-can'></i></button></td><td><button  type = 'button'  value='" + obj.oid + "' class='pay_btn btn btn-success btn-sm border-0'>Pay</td><td style='max-width: 50px;'><button  " + bd + " type ='button' value='" + obj.oid + "' class='btn btn-outline-primary download border-0' id='fa-download'><i class='fa-solid fa-download'></i></button></td></tr>")

  //         //   $("#mobile_order_card").append(`
  //         //         <div class="card mb-2 shadow-sm border-0 rounded-3" data-oid="${obj.oid}">
  //         //             <div class="card-body p-2">

  //         //                 <!-- Header -->
  //         //                 <div class="d-flex justify-content-between align-items-center mb-1">
  //         //                     <span class="fw-semibold">${count}) · ${obj.order_no}</span>
  //         //                     <span class="badge bg-light text-dark small">${obj.dated}</span>
  //         //                 </div>

  //         //                 <!-- Info -->
  //         //                 <div class="small text-muted mb-1">
  //         //                     <i class="fa-solid fa-user me-1"></i> ${obj.emp}
  //         //                 </div>

  //         //                 <div class="small mb-1">
  //         //                     <span class="text-muted">Customer:</span>
  //         //                     <span class="fw-semibold">${obj.cus}</span>
  //         //                 </div>

  //         //                 <div class="small mb-1">
  //         //                     <span class="text-muted">Payment:</span>
  //         //                     <span class="fw-semibold">${obj.pay_details}</span>
  //         //                 </div>

  //         //                 <div class="small text-muted mb-2">
  //         //                     <i class="fa-solid fa-box me-1"></i> ${obj.pro}
  //         //                 </div>

  //         //                 <hr class="my-2">

  //         //                 <!-- Actions -->
  //         //                 <div class="d-flex justify-content-between gap-1">
  //         //                     <button type="button"
  //         //                         value="${obj.oid}"
  //         //                         class="btn btn-outline-primary btn-sm edit_btn border-0 flex-fill" id='fa-edit'>
  //         //                         <i class="fa-solid fa-edit"></i>
  //         //                     </button>

  //         //                     <button type="button"
  //         //                         value="${obj.oid}"
  //         //                         class="btn btn-outline-danger btn-sm delete_btn border-0 flex-fill" id='fa-trash'>
  //         //                         <i class="fa-solid fa-trash-can"></i>
  //         //                     </button>

  //         //                     <button type="button"
  //         //                         value="${obj.oid}"
  //         //                         class="btn btn-success btn-sm pay_btn border-0 flex-fill">
  //         //                         Pay
  //         //                     </button>

  //         //                     <button type="button"
  //         //                         ${bd}
  //         //                         value="${obj.oid}"
  //         //                         class="btn btn-outline-primary btn-sm download border-0 flex-fill" id='fa-download'>
  //         //                         <i class="fa-solid fa-download"></i>
  //         //                     </button>
  //         //                 </div>

  //         //             </div>
  //         //         </div>
  //         //     `);
  //         // });


  //       }
  //       else {
  //         // $("#@id@") .append("<td colspan='0' scope='col'>No Data</td>");

  //       }
  //     }





  //   },
  //   error: function (xhr) {
  //     //Do Something to handle error
  //   }
  // });




}



function get_sales_order_approval(approve_sts) {


  $.ajax({
    url: "php/get_sales_report_emp.php",
    type: "get", //send it through get method
    data: {
      emp_id: '',
      approve_sts: approve_sts,
      order_cat: "Sales"
    },
    success: function (response) {
      //console.log


      $('#app_order_table').empty()
      $("#mobile_approved_order_card").empty()
      if (response.trim() != "error") {



        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0

          obj.sort(function (a, b) {
            return parseInt(b.oid) - parseInt(a.oid);
          });

          obj.forEach(function (obj) {
            count = count + 1;
            //  $('#app_order_table').append("<tr><td>"+count+"</td><td>"+obj.order_no+"</td><td>"+obj.order_category+"</td><td>"+obj.product+"</td><td>"+obj.customer+"</td><td>"+obj.required_qty+"</td><td><button type ='button' value='"+obj.oid+"' class=' download_btn btn btn-outline-primary border-0'><i class='fa-solid fa-download'></i></button></td><td><button  type ='button' value='"+obj.oid+"' class='pay_btn btn btn-success btn-sm border-0'>Pay</td></tr>")


            var advance_deposite_details = JSON.parse(obj.advance_deposite_details) || [];

            var total = parseFloat(obj.debit) || 0;
            var paid = parseFloat(obj.credit) || 0;


            var balance = total - paid;
            var percent = (paid / total) * 100;
            percent = Math.min(Math.max(percent, 0), 100);

            var received_details = JSON.parse(obj.received_details) || [];

            var f_total_product_price = parseFloat(obj.total_product_price || 0) + parseFloat(obj.total_spares_amount || 0)
            var f_paid = 0
            received_details.forEach(function (rev) {
              paid += parseFloat(rev.amount)
            })

            var advance_given = 0
            advance_deposite_details.forEach(function (advance) {
              advance_given += parseFloat(advance.advance_given) || 0;
            })

            var advance_taken_details = JSON.parse(obj.advance_taken_details) || [];

            var total_advance_taken = 0;
            advance_taken_details.forEach(function (advance_taken) {
              total_advance_taken += parseFloat(advance_taken.advance_taken || 0)
            })
            var price = `
                        <div class="form-check form-switch">
                          <input class="form-check-input togglePrice  float-end" type="checkbox" id="togglePrice">
                        </div>
                        <ul class="list-group d-none priceList" id="priceList${obj.order_no}">
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between gap-2">
                                    <p class="my-auto small">Total Product Price:</p>
                                    <p class="small fw-bold my-auto">${obj.total_product_price || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Total Spare Price:</p>
                                    <p class="small fw-bold my-auto">${obj.total_spares_amount || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Total Advance Taken:</p>
                                    <p class="small fw-bold my-auto">${total_advance_taken}</p>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Total Advance Given:</p>
                                    <p class="small fw-bold my-auto">${advance_given || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item bg-success text-white">
                                <div class="d-flex justify-content-between  gap-2 ">
                                    <p class="my-auto small">Total:</p>
                                    <p class="small fw-bold my-auto">${obj.credit || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item  bg-warning">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Balance:</p>
                                    <p class="small fw-bold my-auto">${balance}</p>
                                </div>
                            </li>
                        </ul>
                        <ul class="list-group mainPriceList" id="mainPriceList${obj.order_no}">
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between">
                                    <p class="my-auto small">Total</p>
                                    <p class="small fw-bold my-auto">${f_total_product_price}</p>
                                </div>
                            </li>

                            <li class="list-group-item">
                                <div class="d-flex justify-content-between">
                                    <p class="small my-auto">Paid</p>
                                    <p class="small fw-bold my-auto">${obj.total_received_payment || 0}</p>
                                </div>
                            </li>

                            <li class="list-group-item">
                                <div class="d-flex justify-content-between">
                                    <p class="small my-auto">Balance</p>
                                    <p class="small text-bg-warning fw-bold my-auto">${balance}</p>
                                </div>
                            </li>

                            <li class="list-group-item">
                                <div class="progress bg-danger">
                                    <div class="progress-bar progress-bar-striped progress-bar-animated"
                                        role="progressbar"
                                        style="width:${percent}%;"
                                        aria-valuenow="${percent}"
                                        aria-valuemin="0"
                                        aria-valuemax="">
                                        ${Math.round(percent)}%
                                    </div>
                                </div>
                            </li>
                        </ul>
                        `;

            var mprice = `
                        <div class="form-check form-switch">
                          <input class="form-check-input mtogglePrice  float-end" type="checkbox" id="mtogglePrice">
                        </div>
                        <ul class="list-group d-none mpriceList" id="mpriceList${obj.order_no}">
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between gap-2">
                                    <p class="my-auto small">Total Product Price:</p>
                                    <p class="small fw-bold my-auto">${obj.total_product_price || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Total Spare Price:</p>
                                    <p class="small fw-bold my-auto">${obj.total_spares_amount || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Total Advance Taken:</p>
                                    <p class="small fw-bold my-auto">${total_advance_taken}</p>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Total Advance Given:</p>
                                    <p class="small fw-bold my-auto">${advance_given || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item bg-success text-white">
                                <div class="d-flex justify-content-between  gap-2 ">
                                    <p class="my-auto small">Total:</p>
                                    <p class="small fw-bold my-auto">${obj.credit || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item  bg-warning">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Balance:</p>
                                    <p class="small fw-bold my-auto">${balance}</p>
                                </div>
                            </li>
                        </ul>
                        <ul class="list-group mmainPriceList" id="mmainPriceList${obj.order_no}">
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between">
                                    <p class="my-auto small">Total</p>
                                    <p class="small fw-bold my-auto">${f_total_product_price}</p>
                                </div>
                            </li>

                            <li class="list-group-item">
                                <div class="d-flex justify-content-between">
                                    <p class="small my-auto">Paid</p>
                                    <p class="small fw-bold my-auto">${obj.total_received_payment || 0}</p>
                                </div>
                            </li>

                            <li class="list-group-item">
                                <div class="d-flex justify-content-between">
                                    <p class="small my-auto">Balance</p>
                                    <p class="small text-bg-warning fw-bold my-auto">${balance}</p>
                                </div>
                            </li>

                            <li class="list-group-item">
                                <div class="progress bg-danger">
                                    <div class="progress-bar progress-bar-striped progress-bar-animated"
                                        role="progressbar"
                                        style="width:${percent}%;"
                                        aria-valuenow="${percent}"
                                        aria-valuemin="0"
                                        aria-valuemax="">
                                        ${Math.round(percent)}%
                                    </div>
                                </div>
                            </li>
                        </ul>
                        `;


            let proText = obj.pro.toLowerCase();
            console.log(proText);

            let ddu = "d-none";

            let match = proText.match(/\d{4}-\d{2}-\d{2}/);

            let productionDate = null;

            if (match) {
              productionDate = new Date(match[0]);
              productionDate.setHours(0, 0, 0, 0);
            }

            let today = new Date();
            today.setHours(0, 0, 0, 0);


            if (proText.includes("production")) {

              if (productionDate && productionDate <= today) {
                ddu = "";
              } else {
                ddu = "d-none";
              }

            }

            else if (proText.includes("unassigned") || proText.includes("waiting")) {
              ddu = "d-none";
            }

            else if (proText.includes("finshed") || proText.includes("delivered")) {
              ddu = "";
            }


            $('#app_order_table').append("<tr class = ''><td>" + count + "</td><td class = 'small' style='max-width: 50px;'>" + obj.order_no + "</td>><td class = 'small' style='max-width: 100px;'>" + obj.dated + "</td> <td class = 'small'>" + obj.emp + "</td><td class = 'small ' style='max-width: 250px;'>" + price + "</td> <td class = 'small ' style='max-width: 100px;'>" + obj.cus + "</td><td style='max-width: 250px;'><div>" + obj.pro + "</div></td> <td style='max-width: 50px;'><button type ='button' value='" + obj.oid + "' class='btn btn-outline-primary download border-0' id='fa-download'><i class='fa-solid fa-download'></i></button></td><td style='max-width: 50px;'><button type ='button' data-cus_id='" + obj.customer_id + "' value='" + obj.oid + "' class='dcf_btn btn btn-outline-primary border-0 " + ddu + "'><i class='fa-regular fa-file'></i></button></td><td><button  type = 'button'  value='" + obj.oid + "'  data-cus_id='" + obj.customer_id + "'  class='pay_btn btn btn-success btn-sm border-0'>Pay</td></tr>")

            $("#mobile_approved_order_card").append(`
              <div class="card mb-2 shadow-sm border-0 rounded-3" data-oid="${obj.oid}">
                  <div class="card-body p-2">

                      <!-- Header -->
                      <div class="d-flex justify-content-between align-items-center mb-1">
                          <span class="fw-semibold">${count}) · ${obj.order_no}</span>
                          <span class="badge bg-success-subtle text-success small">
                              ${obj.dated}
                          </span>
                      </div>

                      <!-- Details -->
                      <div class="small text-muted mb-1">
                          <i class="fa-solid fa-user me-1"></i> ${obj.emp}
                      </div>

                      <div class="small mb-1">
                          <span class="text-muted">Customer:</span>
                          <span class="fw-semibold">${obj.cus}</span>
                      </div>

                      <div class="small mb-1">
                          <span class="text-muted">Payment:</span>
                          <span class="fw-semibold">${mprice}</span>
                      </div>

                      <div class="small text-muted mb-2">
                          <i class="fa-solid fa-box me-1"></i> ${obj.pro}
                      </div>

                      <hr class="my-2">

                      <!-- Actions -->
                      <div class="d-flex justify-content-between gap-1">

                          <button type="button"
                              value="${obj.oid}"
                              class="btn btn-outline-primary btn-sm download border-0 flex-fill">
                              <i class="fa-solid fa-download"></i>
                          </button>

                          <button type="button"
                              value="${obj.oid}" data-cus_id="${obj.customer_id}" 
                              class="btn btn-outline-primary btn-sm dcf_btn border-0 flex-fill ${ddu}">
                              <i class="fa-regular fa-file"></i>
                          </button>

                          <button type="button"
                              value="${obj.oid}"  data-cus_id="${obj.customer_id}" 
                              class="btn btn-success btn-sm pay_btn border-0 flex-fill">
                              Pay
                          </button>

                      </div>

                  </div>
              </div>
          `);
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

function get_req_order(approve_sts) {

  $.ajax({

    url: "php/get_sales_report_emp.php",
    type: "get", //send it through get method
    data: {
      emp_id: '',
      approve_sts: approve_sts,
      order_cat: "Requirement"
    },
    success: function (response) {
      //console.log


      $('#req_table').empty()
      $("#mobile_req_card").empty()
      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0

          obj.sort(function (a, b) {
            return parseInt(b.oid) - parseInt(a.oid);
          });

          obj.forEach(function (obj) {
            count = count + 1;
            //  $('#order_table').append("<tr><td>"+count+"</td><td>"+obj.order_no+"</td><td>"+obj.order_category+"</td><td>"+obj.product+"</td><td>"+obj.customer+"</td><td>"+obj.so_date+"</td><td><button type = 'button' value='"+obj.oid+"'  class='edit_btn btn btn-outline-primary border-0'><i class='fa-solid fa-edit'></i> </button></td><td><button  type = 'button' value='"+obj.oid+"' class='delete_btn btn btn-outline-danger border-0'><i class='fa-solid fa-trash-can'></i></button></td><td><button  type = 'button'  value='"+obj.oid+"' class='pay_btn btn btn-success btn-sm border-0'>Pay</td></tr>")

            var advance_deposite_details = JSON.parse(obj.advance_deposite_details) || [];

            var total = parseFloat(obj.debit) || 0;
            var paid = parseFloat(obj.credit) || 0;


            var balance = total - paid;
            var percent = (paid / total) * 100;
            percent = Math.min(Math.max(percent, 0), 100);

            var received_details = JSON.parse(obj.received_details) || [];

            var f_total_product_price = parseFloat(obj.total_product_price || 0) + parseFloat(obj.total_spares_amount || 0)
            var f_paid = 0
            received_details.forEach(function (rev) {
              paid += parseFloat(rev.amount)
            })

            var advance_given = 0
            advance_deposite_details.forEach(function (advance) {
              advance_given += parseFloat(advance.advance_given) || 0;
            })

            var advance_taken_details = JSON.parse(obj.advance_taken_details) || [];

            var total_advance_taken = 0;
            advance_taken_details.forEach(function (advance_taken) {
              total_advance_taken += parseFloat(advance_taken.advance_taken || 0)
            })
            var price = `
                        <div class="form-check form-switch">
                          <input class="form-check-input togglePrice  float-end" type="checkbox" id="togglePrice">
                        </div>
                        <ul class="list-group d-none priceList" id="priceList${obj.order_no}">
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between gap-2">
                                    <p class="my-auto small">Total Product Price:</p>
                                    <p class="small fw-bold my-auto">${obj.total_product_price || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Total Spare Price:</p>
                                    <p class="small fw-bold my-auto">${obj.total_spares_amount || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Total Advance Taken:</p>
                                    <p class="small fw-bold my-auto">${total_advance_taken}</p>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Total Advance Given:</p>
                                    <p class="small fw-bold my-auto">${advance_given || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item bg-success text-white">
                                <div class="d-flex justify-content-between  gap-2 ">
                                    <p class="my-auto small">Total:</p>
                                    <p class="small fw-bold my-auto">${obj.credit || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item  bg-warning">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Balance:</p>
                                    <p class="small fw-bold my-auto">${balance}</p>
                                </div>
                            </li>
                        </ul>
                        <ul class="list-group mainPriceList" id="mainPriceList${obj.order_no}">
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between">
                                    <p class="my-auto small">Total</p>
                                    <p class="small fw-bold my-auto">${f_total_product_price}</p>
                                </div>
                            </li>

                            <li class="list-group-item">
                                <div class="d-flex justify-content-between">
                                    <p class="small my-auto">Paid</p>
                                    <p class="small fw-bold my-auto">${obj.total_received_payment || 0}</p>
                                </div>
                            </li>

                            <li class="list-group-item">
                                <div class="d-flex justify-content-between">
                                    <p class="small my-auto">Balance</p>
                                    <p class="small text-bg-warning fw-bold my-auto">${balance}</p>
                                </div>
                            </li>

                            <li class="list-group-item">
                                <div class="progress bg-danger">
                                    <div class="progress-bar progress-bar-striped progress-bar-animated"
                                        role="progressbar"
                                        style="width:${percent}%;"
                                        aria-valuenow="${percent}"
                                        aria-valuemin="0"
                                        aria-valuemax="">
                                        ${Math.round(percent)}%
                                    </div>
                                </div>
                            </li>
                        </ul>
                        `;

            var mprice = `
                        <div class="form-check form-switch">
                          <input class="form-check-input mtogglePrice  float-end" type="checkbox" id="mtogglePrice">
                        </div>
                        <ul class="list-group d-none mpriceList" id="mpriceList${obj.order_no}">
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between gap-2">
                                    <p class="my-auto small">Total Product Price:</p>
                                    <p class="small fw-bold my-auto">${obj.total_product_price || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Total Spare Price:</p>
                                    <p class="small fw-bold my-auto">${obj.total_spares_amount || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Total Advance Taken:</p>
                                    <p class="small fw-bold my-auto">${total_advance_taken}</p>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Total Advance Given:</p>
                                    <p class="small fw-bold my-auto">${advance_given || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item bg-success text-white">
                                <div class="d-flex justify-content-between  gap-2 ">
                                    <p class="my-auto small">Total:</p>
                                    <p class="small fw-bold my-auto">${obj.credit || 0}</p>
                                </div>
                            </li>
                            <li class="list-group-item  bg-warning">
                                <div class="d-flex justify-content-between  gap-2">
                                    <p class="my-auto small">Balance:</p>
                                    <p class="small fw-bold my-auto">${balance}</p>
                                </div>
                            </li>
                        </ul>
                        <ul class="list-group mmainPriceList" id="mmainPriceList${obj.order_no}">
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between">
                                    <p class="my-auto small">Total</p>
                                    <p class="small fw-bold my-auto">${f_total_product_price}</p>
                                </div>
                            </li>

                            <li class="list-group-item">
                                <div class="d-flex justify-content-between">
                                    <p class="small my-auto">Paid</p>
                                    <p class="small fw-bold my-auto">${obj.total_received_payment || 0}</p>
                                </div>
                            </li>

                            <li class="list-group-item">
                                <div class="d-flex justify-content-between">
                                    <p class="small my-auto">Balance</p>
                                    <p class="small text-bg-warning fw-bold my-auto">${balance}</p>
                                </div>
                            </li>

                            <li class="list-group-item">
                                <div class="progress bg-danger">
                                    <div class="progress-bar progress-bar-striped progress-bar-animated"
                                        role="progressbar"
                                        style="width:${percent}%;"
                                        aria-valuenow="${percent}"
                                        aria-valuemin="0"
                                        aria-valuemax="">
                                        ${Math.round(percent)}%
                                    </div>
                                </div>
                            </li>
                        </ul>
                        `;


            $("#payment_add_btn_m").data("cus_id", obj.customer_id);
            $('#req_table').append("<tr class = ''><td>" + count + "</td><td class = 'small' style='max-width: 50px;'>" + obj.order_no + "</td>><td class = 'small' style='max-width: 100px;'>" + obj.dated + "</td> <td class = 'small'>" + obj.emp + "</td><td class = 'small ' style='max-width: 250px;'>" + price + "</td> <td class = 'small ' style='max-width: 100px;'>" + obj.cus + "</td><td style='max-width: 250px;'><div>" + obj.pro + "</div></td> <td style='max-width: 50px;'><button type ='button' value='" + obj.oid + "' class='btn btn-outline-primary edit_btn border-0' id='fa-edit'><i class='fa-solid fa-edit'></i></button></td><td style='max-width: 50px;'><button type ='button' value='" + obj.oid + "' class='delete_btn btn btn-outline-danger border-0' id='fa-trash'><i class='fa-solid fa-trash-can'></i></button></td><td><button  type = 'button'  value='" + obj.oid + "' class='sale_btn btn btn-success btn-sm border-0'><i class='fa-solid fa-diamond-turn-right'></i></td></tr>")

            $("#mobile_req_card").append(`
                <div class="card mb-2 shadow-sm border-0 rounded-3" data-oid="${obj.oid}">
                    <div class="card-body p-2">

                        <!-- Header -->
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <span class="fw-semibold">#${count} · ${obj.order_no}</span>
                            <span class="badge bg-warning-subtle text-warning small">
                                ${obj.dated}
                            </span>
                        </div>

                        <!-- Meta -->
                        <div class="small text-muted mb-1">
                            <i class="fa-solid fa-user me-1"></i> ${obj.emp}
                        </div>

                        <div class="small mb-1">
                            <span class="text-muted">Customer:</span>
                            <span class="fw-semibold">${obj.cus}</span>
                        </div>

                        <div class="small mb-1">
                            <span class="text-muted">Payment:</span>
                            <span class="fw-semibold">${mprice}</span>
                        </div>

                        <div class="small text-muted mb-2">
                            <i class="fa-solid fa-box me-1"></i> ${obj.pro}
                        </div>

                        <hr class="my-2">

                        <!-- Actions -->
                        <div class="d-flex justify-content-between gap-1">

                            <button type="button"
                                value="${obj.oid}"
                                class="btn btn-outline-primary btn-sm edit_btn border-0 flex-fill">
                                <i class="fa-solid fa-edit"></i>
                            </button>

                            <button type="button"
                                value="${obj.oid}"
                                class="btn btn-outline-danger btn-sm delete_btn border-0 flex-fill">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>

                            <button type="button"
                                value="${obj.oid}"
                                class="btn btn-success btn-sm sale_btn border-0 flex-fill">
                                <i class="fa-solid fa-diamond-turn-right"></i>
                            </button>

                        </div>

                    </div>
                </div>
            `);
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

function get_sales_order_single(oid) {
  $.ajax({
    url: "php/get_sales_order_single.php",
    type: "get", //send it through get method
    data: {

      oid: oid

    },
    success: function (response) {
      console.log(response)


      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0

          $('#order_category').focus()
          obj.forEach(function (obj) {
            count = count + 1;

            //  $('#pmodel').removeAttr('selected')
            //  $('#pmodel').append("<option selected value = '"+obj.product_id+"'>"+obj.model_name+"</option>")
            //  $('#pmodel').attr('disabled',true)

            //  $('#ptype').removeAttr('selected')
            //  $('#ptype').append("<option selected value = '"+obj.type_id+"'>"+obj.type_name+"</option>")
            //  $('#ptype').attr('disabled',true)



            $('#order_category').val(obj.order_category)
            $('#order_category').attr('disabled', true)

            //  $('#product').val(obj.pid)
            //  $('#pmodel').val(obj.product_id)

            $('#cus_name')
              .val(obj.cus_name)
              .trigger("input")
              .autocomplete("search", obj.cus_name);

            setTimeout(() => {
              const menu = $('#cus_name').autocomplete("widget");
              const firstItem = menu.find(".ui-menu-item").first();

              if (firstItem.length) {
                firstItem.trigger("click");
              }
            }, 500);
            $('#cus_phone').val(obj.cus_phone)
            $('#order_type').val(obj.order_type)
            $('#oe_supply').val(obj.oe_supply)
            $('#commitment_date').val(obj.commitment_date)
            $('#nex_payment_date').val(obj.nex_payment_date)
            $('#required_qty').val(obj.required_qty)
            $('#color_choice_des').val(obj.color_choice_des)
            $('#chasis_choice_des').val(obj.chasis_choice_des)
            $('#any_other_spec').val(obj.any_other_spec)
            $('#loading_type').val(obj.loading_type)
            $('#delivery_address').val(obj.delivery_addr)
            $('#advance_payment').val(obj.advance_payment)
            // $('#total_payment').val(obj.total_payment)
            $('#pincode').val(obj.pincode)

            $('#production_untill').val(obj.production_untill)
            $('#insert_order_btn').hide()
            $('#update_order_btn').show()
            cus_id = obj.customer_id


            $('#balance_payment').val(obj.total_payment - obj.advance_payment)
            if (obj.color_choice == "Regular")
              $('#regular_clr_chk').prop('checked', true).trigger('change');
            else
              $('#custom_color_chk').prop('checked', true).trigger('change');

            if (obj.chasis_choice == "Regular")
              $('#regular_chasis_chk').prop('checked', true).trigger('change');
            else
              $('#custom_chasis_chk').prop('checked', true).trigger('change');
            sales_oid = obj.oid
          })

          show_product_details_card()

          get_sales_advance(cus_id)
          get_jaysan_sales_product(oid)
          // get_jaysan_sales_payment(oid)
          // get_sale_order_spares(oid)

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

function get_req_order_single(oid) {


  $.ajax({
    url: "php/get_sales_order_single.php",
    type: "get", //send it through get method
    data: {

      oid: oid

    },
    success: function (response) {
      //console.log


      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0

          $('#order_category').focus()
          obj.forEach(function (obj) {
            count = count + 1;

            //  $('#pmodel').removeAttr('selected')
            //  $('#pmodel').append("<option selected value = '"+obj.product_id+"'>"+obj.model_name+"</option>")
            //  $('#pmodel').attr('disabled',true)

            //  $('#ptype').removeAttr('selected')
            //  $('#ptype').append("<option selected value = '"+obj.type_id+"'>"+obj.type_name+"</option>")
            //  $('#ptype').attr('disabled',true)



            $('#order_category').val("Sales")
            $('#order_category').attr('disabled', true)

            //  $('#product').val(obj.pid)
            //  $('#pmodel').val(obj.product_id)

            $('#cus_name')
              .val(obj.cus_name)
              .trigger("input")
              .autocomplete("search", obj.cus_name);

            setTimeout(() => {
              const menu = $('#cus_name').autocomplete("widget");
              const firstItem = menu.find(".ui-menu-item").first();

              if (firstItem.length) {
                firstItem.trigger("click");
              }
            }, 300);
            $('#cus_phone').val(obj.cus_phone)
            $('#order_type').val(obj.order_type)
            $('#oe_supply').val(obj.oe_supply)
            $('#commitment_date').val(obj.commitment_date)
            $('#nex_payment_date').val(obj.nex_payment_date)
            $('#required_qty').val(obj.required_qty)
            $('#color_choice_des').val(obj.color_choice_des)
            $('#chasis_choice_des').val(obj.chasis_choice_des)
            $('#any_other_spec').val(obj.any_other_spec)
            $('#loading_type').val(obj.loading_type)
            $('#delivery_address').val(obj.delivery_addr)
            $('#advance_payment').val(obj.advance_payment)
            // $('#total_payment').val(obj.total_payment)
            $('#pincode').val(obj.pincode)

            $('#production_untill').val(obj.production_untill)
            $('#insert_order_btn').show()
            $('#update_order_btn').hide()
            cus_id = obj.customer_id


            $('#balance_payment').val(obj.total_payment - obj.advance_payment)
            if (obj.color_choice == "Regular")
              $('#regular_clr_chk').prop('checked', true).trigger('change');
            else
              $('#custom_color_chk').prop('checked', true).trigger('change');

            if (obj.chasis_choice == "Regular")
              $('#regular_chasis_chk').prop('checked', true).trigger('change');
            else
              $('#custom_chasis_chk').prop('checked', true).trigger('change');
            sales_oid = obj.oid
          })

          show_product_details_card()
          get_sales_advance(cus_id)
          get_jaysan_sales_product(oid)
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


function get_jaysan_sales_payment(oid) {

  $.ajax({
    url: "php/get_sale_order_payment_details.php",
    type: "get", //send it through get method
    data: {

      oid: oid

    },
    success: function (response) {
      //console.log

      $('#payment_table').empty()
      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0
          var total_amount = 0


          obj.forEach(function (obj) {

            var received_details = obj.received_details ? JSON.parse(obj.received_details) : [];
            received_details.forEach(function (payment) {
              count = count + 1;
              $('#payment_table').append("<tr class='small'> <td>" + count + "</td> <td  contenteditable=\"true\">" + payment.ref_no + "</td><td contenteditable=\"true\">" + payment.utr_no + "</td> <td>" + payment.amount + "</td> <td>" + 0 + "</td><td>" + payment.formatted_datetime + "</td> <td><button class='btn btn-outline-warning btn-sm border-0 fa_edit' type='button' value='" + payment.payment_id + "' data-oid='" + obj.oid + "' id='fa_edit'><i class='fa fa-edit' aria-hidden='true'></i></button><button class='btn btn-outline-danger btn-sm border-0' type='button' value='" + obj.oid + "' data-payment_id='" + payment.payment_id + "' id='fa-trash'><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>")
              total_amount += Number(payment.amount)
            });

            var advance_taken_details = obj.advance_taken_details ? JSON.parse(obj.advance_taken_details) : [];
            advance_taken_details.forEach(function (advance) {
              count = count + 1;
              $('#payment_table').append("<tr class='small'> <td>" + count + "</td> <td  contenteditable=\"true\">" + advance.ref_no + "</td><td contenteditable=\"true\">" + advance.utr_no + "</td> <td>" + advance.advance_taken + "</td> <td>" + 0 + "</td><td>" + advance.payment_date + "</td> <td class=''><button class='btn btn-outline-danger btn-sm border-0' type='button' value='" + obj.oid + "' data-advance_id='" + advance.advance_id + "' id='fa-trash'><i class='fa fa-trash' aria-hidden='true'></i></button></td> </td> </tr>")
              total_amount += Number(advance.advance_taken)
            });

            // count = count + 1;
            // $('#payment_table').append("<tr class='small'> <td>" + count + "</td> <td  contenteditable=\"true\">" + obj.ref_no + "</td><td contenteditable=\"true\">" + obj.utr_no + "</td> <td>" + obj.amount + "</td> <td>" + 0 + "</td><td>" + obj.formatted_datetime + "</td> <td><button class='btn btn-outline-danger btn-sm border-0' type='button' value='" + obj.payment_id + "' data-oid='" + obj.oid + "' id='fa-trash'><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>")
            // total_amount += Number(obj.amount)

            // $('#sub_type_div input[type="checkbox"]').prop('disabled', true);
            // $('#total_amount').text(obj.debit)
            // $('#')
            $('#total_balance_amount').text(obj.bal);
            $('#total_amount').text(obj.total_received_payment)


          })
          if (Number($('#total_amount').text()) < Number($("#total_payment").val())) {
            $("#total_payment").data("paid_amt", Number($("#total_payment").val()) - Number($('#total_amount').text()))
          }
          else {
            $("#total_payment").data("paid_amt", -1)
          }

          if ($("#total_balance_amount").text() <= 0) {
            $("#advance_payment_card").prop("disabled", true).css("pointer-events", "none");
            $("#advance_payment_card td").css({ "opacity": "0.6", color: "red" });
          }
          else {
            $("#advance_payment_card").prop("disabled", false).css("pointer-events", "auto");
            $("#advance_payment_card td").css({ color: "green" });
          }


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

function get_jaysan_sales_payment_m(oid) {


  $.ajax({
    // url: "php/get_sales_payment_m.php",
    url: "php/get_sale_order_payment_details.php",
    type: "get", //send it through get method
    data: {

      oid: oid

    },
    success: function (response) {
      //console.log

      $('#payment_table_m').empty()
      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0

          var total_amount = 0
          var sts = ""
          obj.forEach(function (obj) {

            $("#payment_add_btn_m").data("oid", obj.oid);
            var received_details = obj.received_details ? JSON.parse(obj.received_details) : [];
            received_details.forEach(function (payment) {
              if (payment.sts == "approved") {
                sts = "<i class='fa-solid fa-thumbs-up'></i>"
              }
              else
                sts = "<i class='fa-solid fa-hourglass-half'></i>"

              count = count + 1;
              $('#payment_table_m').append("<tr class='small'> <td>" + count + "</td> <td  contenteditable=\"true\" style='width: 10%'>" + payment.ref_no + "</td> <td  contenteditable=\"true\">" + payment.utr_no + "</td> <td>" + payment.amount + "</td> <td>" + payment.formatted_datetime + "</td><td>" + sts + "</td><td><button value  = '" + obj.oid + "' data-payment_id='" + payment.payment_id + "' class='btn btn-outline-danger btn-sm border-0' type='button' id='fa-trash'><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>")
              total_amount = total_amount + Number(payment.amount)
            });

            var advance_taken_details = obj.advance_taken_details ? JSON.parse(obj.advance_taken_details) : [];
            advance_taken_details.forEach(function (advance) {
              count = count + 1;
              $('#payment_table_m').append("<tr class='small'> <td>" + count + "</td> <td  contenteditable=\"true\">" + advance.ref_no + "</td><td contenteditable=\"true\">" + advance.utr_no + "</td> <td>" + advance.advance_taken + "</td> <td>" + advance.payment_date + "</td> <td></td><td class=''><button value  = '" + obj.oid + "' data-advance_id='" + advance.advance_id + "' class='btn btn-outline-danger btn-sm border-0' type='button' id='fa-trash'><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>")
              total_amount += Number(advance.advance_taken)
            });

            $("#total_payment_m").val(parseFloat(obj.total_product_price || 0) + parseFloat(obj.total_spares_amount || 0));
            $('#total_balance_amount_m').text(obj.bal);
            $('#total_amount_m').text(obj.total_received_payment)

            // $('#sub_type_div input[type="checkbox"]').prop('disabled', true);
            // $('#total_amount_m').text(total_amount)
            // var d = Number($("#total_payment_m").val()) - total_amount;
            // if (d <= 0) {
            //   $("#total_payment_m").data("paid_am st", -1)
            // }
            // else {
            //   $("#total_payment_m").data("paid_amt", d)
            // }
            if (Number($('#total_amount_m').text()) < Number($("#total_payment_m").val())) {
              $("#total_payment_m").data("paid_amt", Number($("#total_payment_m").val()) - Number($('#total_amount').text()))
            }
            else {
              $("#total_payment_m").data("paid_amt", -1)
            }

            if ($("#total_balance_amount_m").text() <= 0) {
              $("#advance_payment_card_m").prop("disabled", true).css("pointer-events", "none");
              $("#advance_payment_card_m td").css({ "opacity": "0.6", color: "red" });
            }
            else {
              $("#advance_payment_card_m").prop("disabled", false).css("pointer-events", "auto");
              $("#advance_payment_card td").css({ color: "green" });
            }

            $('#nex_payment_date_m').val(obj.next_payment_date)
          })

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



function get_sale_order_spares(oid) {

  $.ajax({
    url: "php/get_sale_order_spares.php",
    type: "get", //send it through get method
    data: {

      oid: oid

    },
    success: function (response) {
      //console.log

      $('#spare_tbody').empty()
      if (response.trim() != "error") {

        if (response.trim() != "0 result") {
          $("#spare_table").removeClass("d-none");

          var obj = JSON.parse(response);
          var count = 0
          var total_amount = Number($("#total_payment").val() || 0)


          obj.forEach(function (obj) {
            count = count + 1;
            total_amount += Number(obj.amount);

            $('#spare_tbody').append(" <tr class='small' data-spares_id=" + obj.spares_id + " data-oid=" + obj.oid + " data-dcf_no=" + obj.dcf_no + "> <td>" + count + "</td> <td>" + obj.qno + "</td> <td>" + obj.amount + "</td> <td>" + obj.remark + "</td><td><button value  = '" + obj.spares_id + "' class='btn btn-outline-danger btn-sm border-0' type='button' id='trash_spare'><i class='fa fa-trash'></i></button><button value  = '" + obj.spares_id + "' class='btn btn-outline-warning btn-sm border-0' type='button' id='edit_spare'><i class='fa fa-edit'></i></button></td></tr")

            // $('#sub_type_div input[type="checkbox"]').prop('disabled', true);
          })

          $("#total_payment").val(total_amount);

          get_jaysan_sales_payment(oid)

        }
        else {
          // $("#@id@") .append("<td colspan='0' scope='col'>No Data</td>");
          get_jaysan_sales_payment(oid)

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });


}

function get_jaysan_sales_product(oid) {
  //console.logoid);

  $.ajax({
    url: "php/get_sales_product1.php",
    type: "get", //send it through get method
    data: {

      oid: oid

    },
    success: function (response) {
      //console.log

      $('#sales_product').empty()
      $('#product_details_mobile_view').empty()
      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0
          var total_amount = 0


          obj.forEach(function (obj) {
            count = count + 1;
            total_amount += (Number(obj.price) * Number(obj.required_qty));
            $('#sales_product').append(" <tr class='small'> <td>" + count + "</td> <td data-product_id='" + obj.product_id + "'>" + obj.produt + "</td> <td data-model_id='" + obj.model_id + "'>" + obj.model_name + "</td> <td data-type_id='" + obj.type_id + "'>" + obj.type_name + "</td> <td>" + obj.sub_type + "</td> <td contenteditable='true'  class='editable-qty'>" + obj.required_qty + "</td> <td contenteditable='true' class='editable-price'>" + obj.price + "</td>   <td contenteditable='true' class='editable-price'>" + obj.billing_amount + "</td> <td><button  value ='" + obj.opid + "' data-oid='" + obj.oid + "' class='edit-row btn btn-sm border-0 btn-outline-primary' data-product_id=" + obj.product_id + " data-model_id=" + obj.model_id + " data-type_id=" + obj.type_id + " data-price=" + obj.price + " data-qty=" + obj.required_qty + " data-subtype='" + obj.sub_type + "' data-billing_price=" + obj.billing_amount + "> <i class='fa fa-edit'></i></button> <button name='db_delete' value ='" + obj.opid + "' data-oid='" + obj.oid + "' type = 'button' class='btn btn-outline-danger border-0 btn-sm' id='fa-trash'><i class='fa fa-trash' aria-hidden='true'></i></button> </td> </tr>")

            // $('#sub_type_div input[type="checkbox"]').prop('disabled', true);

            $('#product_details_mobile_view').append(`
                <div class="card mobile-product-card mb-3" data-opid="${obj.opid}">
                  <div class="card-body p-1">

                    <!-- Top row -->
                    <div class="d-flex justify-content-between align-items-start">
                      <div>
                        <div class="fw-semibold text-dark">${obj.produt}</div>

                        <div class="d-flex gap-2 mt-1">
                          <span class="badge bg-light text-dark border">
                            Model: ${obj.model_name}
                          </span>
                          <span class="badge bg-light text-dark border">
                            Type: ${obj.type_name}
                          </span>
                        </div>
                      </div>

                      <button
                        class="btn btn-sm btn-light text-danger delete-row rounded-circle"
                        data-oid="${obj.oid}"
                        value="${obj.opid}" name='db_delete' id='fa-trash'>
                        <i class="fa fa-trash"></i>
                      </button>
                      <button value ='${obj.opid}' data-oid="${obj.oid}" 
                        class="edit-row btn btn-sm btn-light"
                        data-product_id="${obj.product_id}"
                        data-model_id="${obj.model_id}"
                        data-type_id="${obj.type_id}"
                        data-price="${obj.price}"
                        data-qty="${obj.required_qty}"
                        data-subtype="${obj.sub_type}"
                        data-billing_price="${obj.billing_amount}">
                        <i class="fa fa-edit"></i>
                      </button>
                    </div>

                    <!-- Sub scale -->
                    <div class="small text-muted mt-1 sub-type-text">
                      ${obj.sub_type}
                    </div>

                    <!-- Amount -->
                    <div class="mt-1 p-1 rounded-3 bg-success bg-opacity-10 text-center">
                      <div class="small text-muted">Billing Amount</div>
                      <div class="fs-5 fw-bold text-success">
                        ₹ ${obj.billing_amount}
                      </div>
                    </div>

                    <!-- Qty & Price -->
                    <div class="row text-center mt-1 g-2">
                      <div class="col-6">
                        <div class="p-1 rounded-3 bg-light">
                          <div class="small text-muted">Qty</div>
                          <div class="fw-bold">${obj.required_qty}</div>
                        </div>
                      </div>

                      <div class="col-6">
                        <div class="p-1 rounded-3 bg-light">
                          <div class="small text-muted">Price</div>
                          <div class="fw-bold text-primary">
                            ₹ ${obj.price}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
            `);

          })

          $("#total_payment").val(total_amount);
          get_sale_order_spares(oid)
        }
        else {
          // $("#@id@") .append("<td colspan='0' scope='col'>No Data</td>");
          get_sale_order_spares(oid)

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });


}


function get_sales_order_sub_type(oid) {


  $.ajax({
    url: "php/get_sales_order_subtype.php",
    type: "get", //send it through get method
    data: {

      oid: oid

    },
    success: function (response) {
      //console.log


      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;

            $('#sub_type_div input[type="checkbox"]').each(function () {
              if ($(this).val() === obj.msid) {
                $(this).prop('checked', true);
              }
            })
            // $('#sub_type_div input[type="checkbox"]').prop('disabled', true);
          })

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

function insert_sales_order_form() {

  $('#insert_order_btn').attr('disabled', true)

  // $('#sales_product').find('tr').each(function() {
  //   model_id.push($(this).find('td:eq(2)').attr('data-model_id'))
  //   type_id.push($(this).find('td:eq(3)').attr('data-type_id'))
  //   subtype_name.push($(this).find('td:eq(4)').text())
  // });
  var productDetails = [];
  $('#sales_product').find('tr').each(function () {
    var model = $(this).find('td:eq(2)').attr('data-model_id');
    var type = $(this).find('td:eq(3)').attr('data-type_id');
    var subtype = $(this).find('td:eq(4)').text();
    var qty = $(this).find('td:eq(5)').text();
    var price = $(this).find('td:eq(6)').text();
    var billing_amount = $(this).find('td:eq(7)').text();
    productDetails.push({ model: model, type: type, subtype: subtype, qty: qty, price: price, billing_amount: billing_amount });
  });

  var sparesDetails = [];
  if ($("#spare_tbody tr").length > 0) {

    $("#spare_tbody").find("tr").each(function () {
      var qno = $(this).find("td").eq(1).text() || '';
      var remark = $(this).find("td").eq(3).text() || "";
      var amount = $(this).find("td").eq(2).text() || 0;
      sparesDetails.push({ qno: qno, remark: remark, amount: amount });
    })

  }

  var paymentDetails = [];
  $('#payment_table').find('tr').each(function () {
    if ($(this).find('td:eq(4)').data("advance_id") === null) {
      var ref_no = $(this).find('td:eq(1)').text();
      var utr_no = $(this).find('td:eq(2)').text();
      var amount = $(this).find('td:eq(3)').text();
      var payment_date = $(this).find('td:eq(5)').text();
      paymentDetails.push({ ref_no: ref_no, amount: amount, payment_date: payment_date, utr_no: utr_no });
    }


  });

  var paymentadvanceDetails = [];
  $('#payment_table').find('tr').each(function () {
    if ($(this).find('td:eq(4)').data("advance_id") !== null) {
      var amount = $(this).find('td:eq(3)').text();
      var advance_id = $(this).find('td:eq(4)').data("advance_id");
      paymentadvanceDetails.push({ amount: amount, advance_id: advance_id });
    }
    // if ($(this).find('td:eq(4)').data("advance_id") === null) {
    //   var amount = $(this).find('td:eq(4)').text();
    //   var advance_id = $(this).find('td:eq(4)').data("advance_id");
    //   paymentadvanceDetails.push({ amount: amount, advance_id: advance_id });
    // }

  });

  console.log(paymentDetails);
  console.log(paymentadvanceDetails);
  console.log(sparesDetails);
  var chasis_choice = "Custom"
  var color_choice = "Custom"
  var production_untill = $('#production_untill').length > 0 ? $('#production_untill').val() : '';

  if ($('#regular_chasis_chk').is(":checked"))
    chasis_choice = "Regular"


  if ($('#regular_clr_chk').is(":checked"))
    color_choice = "Regular"


  $.ajax({
    url: "php/insert_sales_order_form.php",
    type: "get", //send it through get method
    data: {
      paymentDetails: paymentDetails,
      productDetails: productDetails,
      paymentadvanceDetails: paymentadvanceDetails,
      sparesDetails: sparesDetails,
      order_category: $('#order_category :selected').val(),
      product_id: $('#pmodel :selected').val(),
      customer_name: $('#cus_name').val(),
      customer_phone: $('#cus_phone').val(),
      customer_id: cus_id,
      order_type: $('#order_type :selected').val(),
      oe_supply: $('#oe_supply :selected').val(),
      commitment_date: $('#commitment_date').val(),
      required_qty: $('#required_qty').val(),
      color_choice: color_choice,
      color_choice_des: $('#color_choice_des').val(),
      chasis_choice: chasis_choice,
      chasis_choice_des: $('#chasis_choice_des').val(),
      any_other_spec: $('#any_other_spec').val(),
      loading_type: $('#loading_type').val(),
      delivery_addr: $('#delivery_address').val(),
      advance_payment: $('#advance_payment').val(),
      total_payment: $('#total_payment').val(),

      pincode: $('#pincode').val(),
      emp_id: current_user_id,
      production_untill: production_untill,
      sub_type_id: sub_type_id,
      type_id: $('#ptype').val(),
      nex_payment_date: $('#nex_payment_date').val(),

    },
    success: function (response) {

      console.log(response);

      if (response.toString().includes("ok")) {

        location.reload();

      }





    },
    error: function (xhr) {
      //Do Something to handle error
      //console.logxhr.responseText);
      $('#insert_order_btn').attr('disabled', false)
      salert("Warning", xhr.responseText, "warning");
    }
  });




}

function update_sales_order_form() {
  $('#update_order_btn').attr('disabled', true)
  var productDetails = [];
  var req_qty = 0;
  $('#sales_product').find('tr').each(function () {

    req_qty += parseFloat($(this).find('td:eq(5)').text());

    var model = $(this).find('td:eq(2)').attr('data-model_id');
    var type = $(this).find('td:eq(3)').attr('data-type_id');
    var subtype = $(this).find('td:eq(4)').text();
    var qty = $(this).find('td:eq(5)').text();
    var price = $(this).find('td:eq(6)').text();
    var billing_amount = $(this).find('td:eq(7)').text();
    productDetails.push({ model: model, type: type, subtype: subtype, qty: qty, price: price, billing_amount: billing_amount });

  });

  var paymentDetails = [];
  $('#payment_table').find('tr').each(function () {
    if ($(this).find('td:eq(4)').data("advance_id") === null) {
      var ref_no = $(this).find('td:eq(1)').text();
      var utr_no = $(this).find('td:eq(2)').text();
      var amount = $(this).find('td:eq(3)').text();
      var payment_date = $(this).find('td:eq(5)').text();
      paymentDetails.push({ ref_no: ref_no, amount: amount, payment_date: payment_date, utr_no: utr_no });
    }


  });

  var paymentadvanceDetails = [];
  $('#payment_table').find('tr').each(function () {
    if ($(this).find('td:eq(4)').data("advance_id") !== null) {
      var amount = $("#total_payment").val();
      var advance_id = $(this).find('td:eq(4)').data("advance_id");
      paymentadvanceDetails.push({ amount: amount, advance_id: advance_id });
    }
    if ($(this).find('td:eq(4)').data("advance_id") === null) {
      var amount = $(this).find('td:eq(4)').text();
      var advance_id = $(this).find('td:eq(4)').data("advance_id");
      paymentadvanceDetails.push({ amount: amount, advance_id: advance_id });
    }

  });

  var chasis_choice = "Custom"
  var color_choice = "Custom"


  var production_untill = $('#production_untill').length > 0 ? $('#production_untill').val() : '';


  if ($('#regular_chasis_chk').is(":checked"))
    chasis_choice = "Regular"


  if ($('#regular_clr_chk').is(":checked"))
    color_choice = "Regular"


  $.ajax({
    url: "php/update_sales_order_form.php",
    type: "get", //send it through get method
    data: {
      paymentDetails: paymentDetails,
      productDetails: productDetails,
      paymentadvanceDetails: paymentadvanceDetails,
      order_category: $('#order_category :selected').val(),
      product_id: $('#pmodel :selected').val(),
      customer_name: $('#cus_name').val(),
      customer_phone: $('#cus_phone').val(),
      customer_id: cus_id,
      order_type: $('#order_type :selected').val(),
      oe_supply: $('#oe_supply :selected').val(),
      commitment_date: $('#commitment_date').val(),
      required_qty: req_qty,
      color_choice: color_choice,
      color_choice_des: $('#color_choice_des').val(),
      chasis_choice: chasis_choice,
      chasis_choice_des: $('#chasis_choice_des').val(),
      any_other_spec: $('#any_other_spec').val(),
      loading_type: $('#loading_type').val(),
      delivery_addr: $('#delivery_address').val(),
      advance_payment: $('#advance_payment').val(),
      total_payment: $('#total_payment').val(),
      pincode: $('#pincode').val(),
      emp_id: current_user_id,
      sales_oid: sales_oid,
      production_untill: production_untill,
      sub_type_id: sub_type_id,
      type_id: $('#ptype').val(),
      nex_payment_date: $('#nex_payment_date').val(),

    },
    success: function (response) {

      //console.log

      if (response.toString().includes("ok")) {

        location.reload();

      }





    },
    error: function (xhr) {
      //Do Something to handle error

      $('#update_order_btn').attr('disabled', false)
      salert("Warning", xhr.responseText, "warning");
    }
  });




}






function get_customer_autocomplete(request, response) {
  var cusname = $('#cus_name').val() + '%';
  var customer = [];
  var object = {};
  $.ajax({
    url: "php/get_customer_autocomplete.php",
    type: "get", //send it through get method
    data: {
      cus_name: cusname,


    },
    success: function (data) {



      if (data.trim() != "0 result") {
        var obj = JSON.parse(data);




        obj.forEach(function (obj) {

          object = {

            label: obj.cus_name + " - " + obj.cus_phone,
            cus_id: obj.cus_id,
            cus_addr: obj.cus_address,
            value: obj.cus_name,
            cus_name: obj.cus_name,
            cus_phone: obj.cus_phone,
            cus_type_id: obj.cus_type_id,
            sub_group_name: obj.sub_group_name,
            pincode: obj.pincode


          };
          customer.push(object);


        });

        response(customer);
      }

      // else {
      //   customer = [];
      //   var object = {

      //     value:"No data",
      //     cus_id : "",
      //     cus_addr : ""

      // };
      //  customer.push(object);


      // }



    },
    error: function (xhr) {
      //Do Something to handle error

      customer = [];
      var object = {

        value: "No data",
        cus_id: "",
        cus_addr: ""

      };
      customer.push(object);

    }
  });


  // //console.logcustomer)


  // return customer;

}

function get_phone_autocomplete(request, response) {

  var cus_phone = $('#cus_phone').val() + '%';
  var customer = [];
  var object = {};
  $.ajax({
    url: "php/get_phone_autocomplete.php",
    type: "get", //send it through get method
    data: {
      cus_phone: cus_phone,


    },
    success: function (data) {


      if (data.trim() != "0 result") {
        var obj = JSON.parse(data);




        obj.forEach(function (obj) {

          object = {

            label: +  obj.cus_phone + " - " + obj.cus_name,
            cus_id: obj.cus_id,
            cus_addr: obj.cus_address,
            value: obj.cus_phone,
            cus_name: obj.cus_name,
            cus_phone: obj.cus_phone,
            cus_type_id: obj.cus_type_id,
            sub_group_name: obj.sub_group_name,
            pincode: obj.pincode,



          };
          customer.push(object);


        });

        response(customer);
      }

      // else {
      //   customer = [];
      //   var object = {

      //     value:"No data",
      //     cus_id : "",
      //     cus_addr : ""

      // };
      //  customer.push(object);


      // }



    },
    error: function (xhr) {
      //Do Something to handle error

      customer = [];
      var object = {

        value: "No data",
        cus_id: "",
        cus_addr: ""

      };
      customer.push(object);

    }
  });


  //console.logcustomer)


  return customer;

}

function get_jaysan_final_productmodel() {

  //console.log$('#product').val());

  $.ajax({
    url: "php/get_jaysan_final_productmodel.php",
    type: "get", //send it through get method
    data: {
      product_id: $('#product').val()


    },
    success: function (response) {
      $('#pmodel').removeAttr('disabled')
      $('#pmodel').empty()
      $('#pmodel').append("<option value='' selected disabled>Choose Options...</option>")
      //console.log

      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;
            $('#pmodel').append("<option value = '" + obj.model_id + "'>" + obj.model_name + "</option>")

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

function get_jaysan_final_producttype() {

  $.ajax({
    url: "php/get_jaysan_final_producttype.php",
    type: "get", //send it through get method
    data: {
      model_id: $('#pmodel').val()


    },
    success: function (response) {
      $('#ptype').removeAttr('disabled')
      $('#ptype').empty()
      $('#ptype').append("<option value='' selected disabled>Choose Options...</option>")
      //console.log

      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;
            $('#ptype').append("<option value = '" + obj.mtid + "'>" + obj.type_name + "</option>")

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


function get_jaysan_final_product() {


  $.ajax({
    url: "php/get_jaysan_final_product.php",
    type: "get", //send it through get method
    data: {

    },
    success: function (response) {

      $('#product').empty()
      $('#product').append("<option value='' selected disabled>Choose Options...</option>")
      if (response.trim() != "error") {
        //console.log

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;
            $('#product').append("<option  value = '" + obj.product_id + "'>" + obj.product_name + "</option>")

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




function convertToRupeesWords(num) {
  if (num === 0) return "Zero Rupees Only";

  var ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  var teens = ["Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  var tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  var suffixes = ["", "Thousand", "Lakh", "Crore"];

  function convertChunk(n) {
    let str = "";
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 11 && n <= 19) {
      str += teens[n - 11] + " ";
    } else {
      str += tens[Math.floor(n / 10)] + " ";
      str += ones[n % 10] + " ";
    }
    return str.trim();
  }

  let str = "";
  let crore = Math.floor(num / 10000000);
  num %= 10000000;
  let lakh = Math.floor(num / 100000);
  num %= 100000;
  let thousand = Math.floor(num / 1000);
  num %= 1000;
  let hundred = Math.floor(num / 100);
  num %= 100;

  if (crore) str += convertChunk(crore) + " Crore ";
  if (lakh) str += convertChunk(lakh) + " Lakh ";
  if (thousand) str += convertChunk(thousand) + " Thousand ";
  if (hundred) str += convertChunk(hundred) + " Hundred ";
  if (num > 0) str += convertChunk(num) + " ";

  return "₹ " + str.trim();
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
    get_sales_order(0)
    get_sales_order_approval(1)
    get_req_order(0)
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


        //console.log


        obj.forEach(function (obj) {
          current_user_id = obj.emp_id;
          current_user_name = obj.emp_name;
        });

        get_sales_order(0)
        get_sales_order_approval(1)
        get_req_order(0)
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

  //console.logmins)

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