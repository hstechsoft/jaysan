
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


  $("#dealer_search").on("keyup", function () {
    var value = $(this).val().toLowerCase();

    $("#dealer_list li").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  check_login();
  get_customer_dealer_autocomplete();
  get_all_customer_group_percentage();

  $("#unamed").text(localStorage.getItem("ls_uname"))


  $("#member_salary").on("focusout", function () {
    var salary = $("#member_salary").val();
    var number_cal = $("#tarket_cal_number").val();
    var tarket_amount = 0;


    if (salary && number_cal) {
      tarket_amount = Number(salary) * 12 * Number(number_cal);
    }

    $("#tarket_amount").val(tarket_amount).trigger("focusout");
  })

  $("#tarket_cal_number").on("focusout", function () {
    var salary = $("#member_salary").val();
    var number_cal = $("#tarket_cal_number").val();
    var tarket_amount = 0;

    if (salary && number_cal) {
      tarket_amount = Number(salary) * 12 * Number(number_cal);
    }

    $("#tarket_amount").val(tarket_amount).trigger("focusout");
  })

  $("#tarket_amount").on("focusout", function () {
    var tarket_amount = $("#tarket_amount").val();
    var quarter = 0;

    if (tarket_amount > 0) {
      quarter = Number(tarket_amount) / 4;

      $("#tarket_amount_one, #tarket_amount_two, #tarket_amount_three, #tarket_amount_four").val(quarter);
    }
  })

  $("#tarket_amount_one").on("focusout", function () {
    var tarket_amount = $("#tarket_amount").val();
    var individual_quarter = $("#tarket_amount_one").val();

    if (tarket_amount > 0) {
      quarter_calculation(tarket_amount, individual_quarter, 1);
    }
  })

  $("#tarket_amount_two").on("focusout", function () {
    var tarket_amount = $("#tarket_amount").val();
    var individual_quarter = $("#tarket_amount_two").val();

    if (tarket_amount > 0) {
      quarter_calculation(tarket_amount, individual_quarter, 2);
    }
  })

  $("#tarket_amount_three").on("focusout", function () {
    var tarket_amount = $("#tarket_amount").val();
    var individual_quarter = $("#tarket_amount_three").val();

    if (tarket_amount > 0) {
      quarter_calculation(tarket_amount, individual_quarter, 3);
    }
  })



});



function quarter_calculation(tarket_amount, individual_quarter, id) {

  var tarket_amount = tarket_amount;
  var individual_quarter = individual_quarter;
  var quarter = 0;
  var id = id;


  console.log(tarket_amount, individual_quarter, id);

  switch (id) {

    case (1):
      if (tarket_amount > 0 && individual_quarter > 0) {
        quarter = (Number(tarket_amount) - Number(individual_quarter)) / 3;
      }
      $("#tarket_amount_two, #tarket_amount_three, #tarket_amount_four").val(quarter);
      break;

    case (2):
      var one = $("#tarket_amount_one").val();
      if (tarket_amount > 0 && individual_quarter > 0) {
        quarter = (Number(tarket_amount) - (Number(individual_quarter) + Number(one))) / 2;
      }
      $("#tarket_amount_three, #tarket_amount_four").val(quarter);
      break;

    case (3):
      var one = $("#tarket_amount_one").val();
      var two = $("#tarket_amount_two").val();
      if (tarket_amount > 0 && individual_quarter > 0) {
        quarter = Number(tarket_amount) - (Number(individual_quarter) + Number(one) + Number(two));
      }
      $("#tarket_amount_four").val(quarter);
      break;

    default:
      salert("Warning", "Something Wrong!", "warning")


  }
}

function get_customer_dealer_autocomplete() {
  $.ajax({
    url: "php/get_all_customerName.php",
    type: "get", //send it through get method
    data: {

      term: '',
    },
    success: function (response) {
      console.log(response);



      if (response.trim() != "error") {
        if (response.trim() != "0result") {

          var obj = JSON.parse(response);

          obj.forEach(function (obj) {
            $("#dealer_list").append(`<li class="list-group-item p-1"><input class="form-check-input float-end" type="checkbox" value="${obj.cus_id}" id="dealer_id_${obj.cus_id}" ><label class="form-check-label" for="dealer_id_${obj.cus_id}">${obj.cus_name}</label></li>`)
          })
        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function get_all_customer_group_percentage() {
  $.ajax({
    url: "php/get_all_customer_group.php",
    type: "get", //send it through get method
    data: {

    },
    success: function (response) {
      console.log(response);



      if (response.trim() != "error") {
        $("#customer_type").empty();
        if (response.trim() != "0result") {

          $("#customer_type").append(`<option selected disabled value="">Choose...</option>`);

          var obj = JSON.parse(response);

          obj.forEach(function (obj) {
            $("#customer_type").append(`<option value=${obj.group_id}>${obj.group_name}</option>`)
          })
        }
        else {
          $("#customer_type").append(`<option selected disabled value='' class='text-danger'>No Data Found</option>`)
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