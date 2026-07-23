
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");

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



  check_login();

  $("#unamed").text(localStorage.getItem("ls_uname"))





  $("#payment_table").on("click", "button", function (event) {
    var btn_val = $(this).val()
    var pay_sts = "approved"
    if ($(this).hasClass("decline"))
      pay_sts = "decline"
    {
      swal({
        title: "Are you sure - Approve? ",
        text: "You will not be recover this  again!",
        icon: "warning",
        buttons: [
          'No, cancel it!',
          'Yes, I am sure!'
        ],
        dangerMode: true,
      }).then(function (isConfirm) {
        if (isConfirm) {
          //  update_jaysan_payment(btn_val)

        }

      })
    }
  });


  $("#payment_list").on("click", "button", function (event) {
    var btn_val = $(this).val()
    var oid = $(this).data("oid")

     if ($(this).hasClass("download")) {
      return;
    }

    var pay_sts = "approved"
    if ($(this).hasClass("decline"))
      pay_sts = "decline"

    var pay_date = $(this).closest("tr").find("td").eq(0).find('input').val()
    var utr_no = $(this).closest("table").find('.utr_no').val()
    console.log(utr_no);
    if (utr_no != '' && utr_no != 'null') {
      swal({
        title: "Are you sure -" + pay_sts + " ?",
        text: "You will not be able to recover this again!",
        icon: "warning",
        buttons: [
          'No, cancel it!',
          'Yes, I am sure!'
        ],
        dangerMode: true,
      }).then(function (isConfirm) {
        if (isConfirm) {
          $(this).attr('disabled', true);

          $.ajax({
            url: "php/check_utr_no.php",
            type: "get", //send it through get method
            data: {

              utr_no: utr_no,
              oid: oid,
              payment_id: btn_val
            },
            success: function (response) {
              console.log(response);


              if (response.trim() != "error") {



                if (response.trim() == "ok" || response.trim() == "0 result") {

                  update_jaysan_payment(btn_val, pay_date, pay_sts, utr_no);

                }
                else
                  salert("Entry ", "Entry Already Available", "warning")

              }





            },
            error: function (xhr) {
              //Do Something to handle error
            }
          });

        }
      });
    }
    else {
      salert("UTR No", "Kindly Enter UTR No", "warning")
    }


  });
  // let pressTimer;
  // $("#payment_list").on("mousedown touchstart","table", function(event) {

  //   let $this = $(this);
  //   pressTimer = setTimeout(function () {
  //       $("table").removeClass("selected_list1"); // Remove selection from other cards
  //       $this.addClass("selected_list1"); // Select this card
  //   }, 800); // Long press duration (800ms)
  // }).on("mouseup mouseleave touchend", "table", function () {
  //   clearTimeout(pressTimer);
  // });

  $("#payment_list").on("click", ".download", function (event) {
    var order_no = $(this).val();
    if ($(this).hasClass("download")) {
      get_order_details1(order_no)
    }
  })

});



function get_order_details1(ass_id) {


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

          // get_assign_sts(ass_id)

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


function get_jaysan_payment() {


  $.ajax({
    url: "php/get_jaysan_payment.php",
    type: "get", //send it through get method
    data: {


    },
    success: function (response) {
      console.log(response);

      $('#payment_table').empty()
      $('#payment_list').empty()
      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;
            const formattedPayment = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(obj.amount);

            $('#payment_table').append("  <tr class='small'><td>" + count + "</td><td>" + obj.cus_name + "</td><td>" + obj.emp_name + "</td><td>" + obj.order_no + "</td><td>" + obj.date_f + "</td><td>" + obj.ref_no + "</td><td contenteditable=\"true\">" + obj.utr_no + "</td><td> " + formattedPayment + "</td><td><button class='btn btn-success btn-sm' value='" + obj.payment_id + "'>" + 'ok' + "</button></td> </tr>")
            var utr_no = ''
            if (obj.utr_no != null)
              utr_no = obj.utr_no



            $('#payment_list').append(" <li class=' list-group-item m-0 p-0' style='overflow-x: hidden'> <table class='table table-bordered table-sm m-0 p-0'> <tbody style=''> <tr  class='small text-bg-light'> <td class = 'small'> <span class='me-2'><i class='fa fa-user' aria-hidden='true'></i></span>" + obj.cus_name + "</td> <td colspan='2' class='text-center small'> <span><i class='fa fa-phone me-2' aria-hidden='true'></i></span> " + obj.cus_phone + "</td> </tr> <tr> <td style='max-width: 120px;'class='small'><span><i class='fa fa-id-badge me-2' aria-hidden='true'></i></span>" + obj.emp_name + "</td> <td class='small' style='max-width: 120px;'>" + obj.order_no + "</td> <td class='small text-center'> " + obj.date_f + "</td> </tr> <tr> <td class='small text-bg-warning'> " + formattedPayment + "</td> <td class='small'> <span class='text-decoration-underline'> Ref :</span>" + obj.ref_no + " </td><td><button type ='button' value='" + obj.oid + "' class='btn btn-secondary btn-sm download border-0'><i class='fa fa-eye'></i></button></td> </tr><tr class='small'> <td colspan='3'> <div class='form-floating small'> <input value = '" + utr_no + "' type='text' class='form-control rounded-3 utr_no'  placeholder='' > <label for='utr_no_txt'>UTR No </label> </div> </td> </tr> <tr><td colspan='2' class='text-center'><input type='datetime-local' class='form-control form-control-sm' value = '" + obj.payment_date + "' placeholder='Date' ></td><td class = 'd-flex align-content-center justify-content-center'><button data-oid='" + obj.oid + "' value='" + obj.payment_id + "' class='p-1 btn btn-danger btn-sm decline'>Decline</button><button data-oid='" + obj.oid + "' value='" + obj.payment_id + "' class='p-1 btn btn-primary btn-sm'>Approve</button></td></tr> </tbody> </table> </li>")
          });


        }
        else {
          $("#payment_table").append("<tr class = 'small'><td colspan='10' scope='col'>No Data</td></tr>");
          $("#payment_list").append("<tr class = 'small'><td colspan='10' scope='col'>No Data</td></tr>");

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}


function update_jaysan_payment(btn_val, pay_date, pay_sts, utr_no) {


  $.ajax({
    url: "php/update_jaysan_payment.php",
    type: "get", //send it through get method
    data: {
      emp_id: current_user_id,
      payment_id: btn_val,
      pay_date: pay_date,
      pay_sts: pay_sts,
      utr_no: utr_no


    },
    success: function (response) {
      console.log(response);


      if (response.trim() != "error") {

        if (response.trim() == "ok") {



          get_jaysan_payment();


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






function check_login() {

  if (localStorage.getItem("logemail") == null && phone_id == null) {
    window.location.replace("login.html");
  }
  else if (localStorage.getItem("logemail") == null && phone_id != null) {
    get_current_userid_byphoneid();
    $('#menu_bar').hide()
  }

  else {

    get_jaysan_payment();
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


        get_jaysan_payment();
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