
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

  // Current Location

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        console.log("Latitude:", position.coords.latitude);
        console.log("Longitude:", position.coords.longitude);
        console.log("Accuracy:", position.coords.accuracy + " meters");
        get_godown_locations(position.coords.latitude, position.coords.longitude)
      },
      function (error) {
        console.log(error.message);
      }
    );
  } else {
    console.log("Geolocation is not supported.");
  }

  $("#summary_search").on("keyup", function () {
    var value = $(this).val().toLowerCase();

    $("#all_bom_table tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  check_login();
  get_demand_work_report('all', 'all', '', '', '');

  $("#unamed").text(localStorage.getItem("ls_uname"))


  $('#godown').on('input', function () {
    $(this).data("godown_id", '');
    $('#department').val('').data('dept_id', '');
    $('#section').val('').data("sec_id", '');
    //check the value not empty
    if ($('#godown').val() != "") {
      $('#godown').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_creditors_auto.php",
            type: "get", //send it through get method
            data: {
              term: request.term,


            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.creditor_name,
                  value: item.creditor_name,
                  id: item.creditor_id,
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("godown_id", ui.item.id);


        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
          .appendTo(ul);
      };
    }

  });

  $('#department').on('input', function () {
    console.log($("#stock_godown").data("godown_id"));

    $(this).data("dept_id", '');
    $('#section').val('').data("sec_id", '');

    //check the value not empty
    if ($('#department').val() != "") {

      $('#department').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_departments_auto.php",
            type: "get", //send it through get method
            data: {
              term: request.term,
              godown_id: $("#godown").data("godown_id"),

            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.dep_name,
                  value: item.dep_name,
                  id: item.dep_id,
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("dept_id", ui.item.id);


        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
          .appendTo(ul);
      };
    }

  });

  $('#section').on('input', function () {


    $(this).data("sec_id", '');
    //check the value not emptyFF
    if ($('#section').val() != "") {
      $('#section').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_sections_auto.php",
            type: "get", //send it through get method
            data: {
              term: request.term,
              dep_id: $("#department").data("dept_id"),

            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.sec_name,
                  value: item.sec_name,
                  id: item.dep_sec_id,
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("sec_id", ui.item.id);


        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.label + "</strong> - " + item.id + "</div>")
          .appendTo(ul);
      };
    }

  });

  $('#part').on('input', function () {
    //check the value not empty
    $(this).removeData("part_id");


    if ($('#part').val() != "") {
      $('#part').autocomplete({
        //get data from database return as array of object which contain label,value
        source: function (request, response) {
          $.ajax({
            url: "php/get_part_name_auto_wel.php",
            type: "get", //send it through get method
            data: {
              term: "name",
              part: request.term,
              godwon_id: $("#godown_filter").data("godown_id"),
              department_id: $("#department_filter").data("dept_id"),
              section_id: $("#section_filter").data("sec_id"),
            },
            dataType: "json",
            success: function (data) {
              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.part_name + "-" + item.part_no,
                  value: item.part_name,
                  id: item.part_id,
                  part_no: item.part_no
                };
              }));
            }
          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {
          $(this).data("part_id", ui.item.id);
        },
      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.value + "</strong> - " + item.part_no + "</div>")
          .appendTo(ul);
      };
    }
  });

  $("#godown, #department, #section, #part").on("focusout", function () {
    var godown_id = $("#godown").data("godown_id") || '';
    var dep_id = $("#department").data("dept_id") || '';
    var dep_sec_id = $("#section").data("sec_id") || '';
    var process_id = "all";
    var final_part_id = $("#part").data("part_id") || 'all';

    get_demand_work_report(final_part_id, process_id, godown_id, dep_id, dep_sec_id);

  });

  $("#planed_work_order_tbody").on("focusout", "input[type='number']", function () {
    var remaining_qty = $(this).closest("tr").find("td:eq(5)").text();
    var entered_qty = $(this).val();
    if (parseFloat(entered_qty) > parseFloat(remaining_qty)) {
      $(this).val(remaining_qty);
    }
    else if (parseFloat(entered_qty) <= 0 || isNaN(parseFloat(entered_qty))) {
      $(this).val(1);
    }
  });

  $("#planed_work_order_tbody").on("click", "button", function () {

    var process_id = $(this).val();
    var godown_id = $(this).closest("tr").find("input[type='radio']:checked").val();
    var dep_id = $(this).closest("tr").find("input[type='radio']:checked").data("dep_id");
    var dep_sec_id = $(this).closest("tr").find("input[type='radio']:checked").data("sec_id");
    var emp_id = current_user_id;
    var qty = $(this).closest("tr").find("td:eq(6)").find("input[type='number']").val();

    console.log(process_id, godown_id, dep_id, dep_sec_id, qty);

    if (!godown_id) {
      salert("Warning", "Please select atleast one godown.", "warning");
      return;
    }

    if (!qty || parseFloat(qty) <= 0) {
      salert("Warning", "Please enter a valid quantity.", "warning");
      return;
    }

    if (!process_id) {
      salert("Warning", "Process ID is missing.", "warning");
      return;
    }

    stock_demand_reservation(process_id, godown_id, dep_id, dep_sec_id, emp_id, qty);

  });

});





function stock_demand_reservation(process_id, godown_id, dep_id, dep_sec_id, emp_id, qty) {
  console.log(process_id, godown_id, dep_id, dep_sec_id, emp_id, qty);

  $.ajax({
    url: "php/stock_demand_reservation.php",
    type: "get", //send it through get method
    data: {

      work_process_id: process_id,
      work_order_qty: qty,
      godown: godown_id,
      dep: dep_id,
      sec: dep_sec_id,
      emp_id: emp_id,
    },
    success: function (response) {
      console.log(response);

      var response = JSON.parse(response);

      if (response.success === true) {
        
        get_demand_work_report($("#part").data("part_id") || 'all', "all", $("#godown").data("godown_id") || '', $("#department").data("dept_id") || '', $("#section").data("sec_id") || '');
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function get_demand_work_report(final_part_id, process_id, godown_id, dep_id, dep_sec_id) {
  console.log(final_part_id, process_id, godown_id, dep_id, dep_sec_id);

  $.ajax({
    url: "php/get_demand_work_report.php",
    type: "post", //send it through get method
    data: {

      final_part_id: final_part_id,
      process_id: process_id,
      godown_id: godown_id,
      dep_id: dep_id,
      dep_sec_id: dep_sec_id,

    },
    success: function (response) {
      console.log(response);



      if (response.trim() != "error") {
        $('#planed_work_order_tbody').empty();
        if (response.trim() != "0 results") {
          var obj = JSON.parse(response);
          var count = 0;
          var godown_list = ``;

          obj.forEach(function (obj) {
            count++;

            var godown_list = "";

            var godowns = obj.all_godown_details != null ? JSON.parse(obj.all_godown_details) : (godown_list = ` <button class="btn btn-sm btn-danger"onclick="window.open('https://jaysan.cloud/welding_process.html', '_blank')">Select Godown </button>`, []);

            godowns.forEach(function (godown) {
              godown_list += `
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="gdown_${obj.final_part}_${obj.process_name}" id="godown_${godown.godown_id}_${count}" value="${godown.godown_id}" data-dep_id="${godown.dep_id}" data-sec_id="${godown.sec_id}">
                                <label class="form-check-label" for="godown_${godown.godown_id}_${count}">
                                    ${godown.godown_name}
                                    ${godown.department ? `[${godown.department}]` : ''}
                                    ${godown.section ? `[${godown.section}]` : ''}
                                </label>
                            </div>`;
            });

            $('#planed_work_order_tbody').append(`
                <tr>
                    <td>${count}</td>
                    <td>${obj.final_part}</td>
                    <td>${obj.process_name}</td>
                    <td>${parseInt(obj.total_demand_qty)}</td>
                    <td>${parseInt(obj.total_assigned_qty)}</td>
                    <td>${parseInt(obj.total_remaining_qty)}</td>
                    <td> <input type="number" class="form-control form-control-sm enter_qty" value="${parseInt(obj.total_remaining_qty)}" placeholder="Enter Qty"></td>
                    <td>${godown_list}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" value="${obj.process_id}">Submit</button>
                    </td>
                </tr>
            `);
          });

        }
        else {
          $('#planed_work_order_tbody').append('<tr><td colspan="9" class="text-center">No Parts available</td></tr>');
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