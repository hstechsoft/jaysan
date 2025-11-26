
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





  get_part_spec();

  check_login();

  $("#unamed").text(localStorage.getItem("ls_uname"))

  $('#part_photo_preview').click(function () {

    if (part_id != 0 && part_image_addr == "")
      $("#part_photo_up").trigger("click");


  });

  $('#preview').on('click', function () {
    console.log($('#field_type').val());

    if ($('#field_type').val() != 0) {
      if ($('#field_type').val() == "text") {
        if ($('#flabel').val() != "") {
          show_preview()
        }
        else {
          shw_toast("Custom Field", "Kindly Enter Correct Details", " ")
        }
      }
      if ($('#field_type').val() == "dropdown") {
        if (($('#flabel').val() != "") && $('#fvalue').val() != "") {


          show_preview()
        }
        else {
          shw_toast("Custom Field", "Kindly Enter Correct Details", " ")
        }
      }
    }
    else {
      shw_toast("Custom Field", "Kindly choose custom field", " ")
    }
  });

  $('#add_field').on('click', function () {
    insert_custom_field_master()
  });


  $("#parts_spec").on("dblclick", ".col", function () {

    $("#add_field").addClass("d-none");
    $("#update_field").removeClass("d-none");

    let fid = $(this).data("fid")
    let inputType = $(this).find("input").attr("type") || "dropdown";
    let label = $(this).find("span").first().text();
    let value = "";
    if (inputType == "text") {
      value = $(this).find("input").val();
    }

    if (inputType == "dropdown") {
      value = $(this).find("option")
        .map(function () { return $(this).val(); }).get().filter(v => v && v !== "null").join(", ");
    }


    $("#field_type").val(inputType);
    $("#field_type").data("fid", fid);
    $("#flabel").val(label);
    $("#fvalue").val(value);
  });

  $("#update_field").on("click", function () {

    if ($("#field_type").val() == "Dropdown" && $("#fvalue").val() == "") {
      salert("Warning", "Fill values", "warning");
    }
    if ($("#field_type").val() === null && $("#flabel").val() == "" && $("#field_type").data("fid")) {
      salert("Warning", "Data missing", "warning");
    }
    else {
      update_custom_field_master()
    }

  })


});


function get_part_spec() {


  $.ajax({
    url: "php/get_std_spec.php",
    type: "get", //send it through get method
    data: {


    },
    success: function (response) {
      $("#parts_spec").empty()
      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
          console.log(response);

          var obj = JSON.parse(response);
          obj.forEach(function (obj) {
            if (obj.ftype == "text") {
              $("#parts_spec").append("<div class='col mb-2' data-fid=" + obj.fid + "> <div class='input-group input-group-sm '> <label class='input-group-text' for='" + obj.flabel + "'><span>" + obj.flabel + "</span> </label> <input id='preview_field' type='text' class='form-control' > </div></div>")
            }
            if (obj.ftype == "dropdown") {

              {
                var fvalue = obj.fvalue.split(',');
                var dropdown_option = "<option value='null' selected>Choose Options...</option>"
                fvalue.forEach(function (item) {

                  dropdown_option = dropdown_option + "<option value='" + item + "'>" + item + "</option>"

                });

                $("#parts_spec").append("<div class='col mb-2'  data-fid=" + obj.fid + "> <div class='input-group input-group-sm'> <div class='input-group-prepend '> <span class='input-group-text ' id='basic-addon1'> " + obj.flabel + " </span> </div> <select class='custom-select form-control' id='preview_field'> " + dropdown_option + "  </select> </div></div>")
              }
            }
          });
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








function insert_custom_field_master() {


  $.ajax({
    url: "php/insert_std_field_master.php",
    type: "get", //send it through get method
    data: {
      flabel: $('#flabel').val(),
      fvalue: $('#fvalue').val(),
      ftype: $('#field_type :selected').val(),
      std: 1,


    },
    success: function (response) {

      console.log(response);

      if (response.trim() == "ok") {

        location.reload()

      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}


function update_custom_field_master() {


  $.ajax({
    url: "php/update_custom_field_master.php",
    type: "get", //send it through get method
    data: {
      flabel: $('#flabel').val(),
      fvalue: $('#fvalue').val(),
      ftype: $('#field_type :selected').val(),
      std: 1,
      fid: $('#field_type').data("fid"),


    },
    success: function (response) {

      console.log(response);

      if (response.trim() == "ok") {

        // alert()

        // $("#add_field").removeClass("d-none");
        // $("#update_field").addClass("d-none");
        location.reload()

      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}







function show_preview() {
  $("#preview_body").empty()
  if ($('#field_type').val() == "text") {
    $("#preview_body").append(" <div class='input-group input-group-sm '> <label class='input-group-text' for='preview_field'><span>" + $('#flabel').val() + "</span> </label> <input id='preview_field' type='text' class='form-control' > </div>")
  }
  if ($('#field_type').val() == "dropdown") {
    var fvalue = $("#fvalue").val().split(',');
    var dropdown_option = "<option value='0' selected>Choose Options...</option>"
    fvalue.forEach(function (item) {

      dropdown_option = dropdown_option + "<option value='" + item + "'>" + item + "</option>"

    });

    $("#preview_body").append(" <div class='input-group input-group-sm'> <div class='input-group-prepend '> <span class='input-group-text ' id='basic-addon1'> " + $('#flabel').val() + " </span> </div> <select class='custom-select form-control' id='preview_field'> " + dropdown_option + "  </select> </div>")
  }
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