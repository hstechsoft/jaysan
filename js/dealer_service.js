
var dname = localStorage.getItem("dname")
var did = localStorage.getItem("did")

var object
// console.log(role)
$(document).ready(function () {

  $('#dealer_name').val(dname);
  $('#dealer_name').data("dealer_id", did);

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


  $("#service_search").on("keyup", function () {
    var value = $(this).val().toLowerCase();

    $("#service_history_table tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  check_login();
  get_jaysan_final_product();
  get_service_review(0);

  $("#unamed").text(localStorage.getItem("ls_uname"))

  // Dealer Auto Complete
  $('#dealer_name').on('input', function () {
    //check the value not empty
    $(this).removeData("dealer_id");

    if ($('#dealer_name').val() != "") {
      $('#dealer_name').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_dealer_auto_complete.php",
            type: "get", //send it through get method
            data: {

              dealer_name: $('#dealer_name').val(),


            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.dname,
                  value: item.dname,
                  id: item.did,
                  // part_name: item.part_name
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("dealer_id", ui.item.id);
          //   $('#part_name_out').data("selected-part_id", ui.item.id);
          //   $('#part_name_out').val(ui.item.part_name)
          //  get_bom(ui.item.id)
          get_service_review(ui.item.id);


        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div>" + item.label + "</div>")
          .appendTo(ul);
      };
    }

  });

  $('#dealer_name').on("focusout", function () {

    if ($(this).data("dealer_id") === undefined) {
      $(this).val('');
      get_service_review(0);
    }
  })

  // Customer Auto Complete
  $('#customer_name').on('input', function () {
    //check the value not empty
    $(this).removeData("customer_id");
    $("#customer_number, #customer_address").val('');

    if ($('#customer_name').val() != "") {
      $('#customer_name').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_customer_autocomplete.php",
            type: "get", //send it through get method
            data: {

              cus_name: $('#customer_name').val() + '%',

            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.cus_name,
                  value: item.cus_name,
                  id: item.cus_id,
                  cus_phone: item.cus_phone,
                  addr: item.cus_address,
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("customer_id", ui.item.id);
          $("#customer_number").val(ui.item.cus_phone);
          $("#customer_address").val(ui.item.addr);
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

  $('#customer_number').on('input', function () {

    $("#customer_name").removeData("customer_id");
    $("#customer_address").val('');
    //check the value not empty
    if ($('#customer_number').val() != "") {
      $('#customer_number').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_phone_autocomplete.php",
            type: "get", //send it through get method
            data: {

              cus_phone: $('#customer_number').val() + '%',

            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.cus_phone,
                  value: item.cus_phone,
                  id: item.cus_id,
                  cus_name: item.cus_name,
                  addr: item.cus_address,
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $("#customer_name").data("customer_id", ui.item.id).val(ui.item.cus_name);
          $("#customer_address").val(ui.item.addr);
          //   $(this).data("selected-part_id", ui.item.id);
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

  // Problem
  $('#problem').on('input', function () {
    //check the value not empty
    if ($('#problem').val() != "") {
      $('#problem').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_machine_problem_autocomplete.php",
            type: "get", //send it through get method
            data: {

              problem: $("#problem").val(),


            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.machine_problem,
                  value: item.machine_problem,
                  // id: item.part_id,
                  // part_name: item.part_name
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          //   $(this).data("selected-part_id", ui.item.id);
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

  // Service Date
  let now = new Date();

  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

  $("#service_date").val(
    now.toISOString().slice(0, 16)
  );

  // Employee
  $('#employee1').on('input', function () {

    //check the value not empty
    $('#employee1').data("emp_id", '');
    if ($(this).val() != "") {
      $(this).autocomplete({
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



        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div style='font-size:12px;'><strong>" + item.label + "</strong></div>")
          .appendTo(ul);
      };
    }

  });


  $("#add_problem_btn").on("click", function () {

    var problem = $("#problem").val();
    if (problem != '') {
      $("#problem_table_body").append(`<tr><td>${problem}</td><td><button class='btn btn-sm btn-danger'><i class='fa fa-trash'></i></button></td></tr>`);

      $('#problem').val('');

    }
    else {
      salert("Warning", "Enter The Problem.", "warning");
    }

  });

  $("#problem_table_body").on("click", "td button", function () {

    let row = $(this).closest("tr");

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this Problem?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel"
    }).then((result) => {

      if (result.isConfirmed) {
        row.remove();

        Swal.fire({
          title: "Deleted!",
          text: "The Problem has been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
      }

    });

  });
  $("#add_employee_btn").on("click", function () {

    var employee = $('#employee1').val().trim();

    if (employee !== '') {
      $("#employee_table_body").append(`
            <tr>
                <td>${employee}</td>
                <td>
                    <button class='btn btn-sm btn-danger'>
                        <i class='fa fa-trash'></i>
                    </button>
                </td>
            </tr>
        `);

      $('#employee1').val(''); // Clear field
    } else {
      salert("Warning", "Enter The Employee.", "warning");
    }

  });

  $("#employee_table_body").on("click", "td button", function () {

    let row = $(this).closest("tr");

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this Employee?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel"
    }).then((result) => {

      if (result.isConfirmed) {
        row.remove();

        Swal.fire({
          title: "Deleted!",
          text: "The row Employee been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
      }

    });

  });

  $("#add_service_details_btn").on("click", function () {

    var dealer_name = $("#dealer_name").val();
    var did = $("#dealer_name").data("dealer_id");

    var cus_name = $("#customer_name").val();
    var cus_phone = $("#customer_number").val();
    var cus_place = $("#place").val();
    var cus_addr = $("#customer_address").val();
    var chasis_no = $("#chasis_no").val();
    var implement = $("#implement").val();
    var review_date = $("#service_date").val();

    var service_person_name = '';
    var machine_problem = '';

    var rating_service = $('#rating_service').rateit('value') || 0;
    var rating_dealer = $('#rating_dealer').rateit('value') || 0;

    var solution = $("#solution").val();

    if ($("#employee_table_body tr").length > 0) {

      $("#employee_table_body tr").each(function () {
        service_person_name +=
          (service_person_name ? ", " : "") +
          $(this).find("td").eq(0).text().trim();
      });

    } else {
      salert("Warning", "At least one Service Person needed.", "warning");
      return;
    }

    if ($("#problem_table_body tr").length > 0) {

      $("#problem_table_body tr").each(function () {
        machine_problem +=
          (machine_problem ? ", " : "") +
          $(this).find("td").eq(0).text().trim();
      });

    } else {
      salert("Warning", "Problem needed.", "warning");
      return;
    }

    console.log(
      dealer_name, did, cus_name, cus_phone,
      cus_addr, cus_place, chasis_no, implement,
      service_person_name, machine_problem,
      rating_dealer, rating_service, solution, review_date
    );

    if (!did || !cus_name || !cus_phone || !cus_place ||
      !chasis_no || !implement || !service_person_name ||
      !machine_problem || !review_date) {

      salert("Warning", "Fill all required fields.", "warning");
      return;
    }

    insert_review(
      dealer_name, did, cus_name, cus_phone, cus_addr, cus_place, chasis_no, implement, service_person_name, machine_problem, rating_dealer, rating_service, solution, review_date
    );
  });

  $("#rating_service").bind('rated', function (event, value) {


    $("#service_rno").text(value)
  });



  $("#rating_dealer").bind('rated', function (event, value) {


    $("#dealer_rno").text(value)
  });

});




// Insert
function insert_review(dealer_name, did, cus_name, cus_phone, cus_addr, cus_place, chasis_no, implement, service_person_name, machine_problem, rating_dealer, rating_service, solution, review_date) {

  $.ajax({
    url: "php/insert_review.php",
    type: "get", //send it through get method
    data: {

      dealer_name: dealer_name,
      did: did,
      cus_name: cus_name,
      cus_phone: cus_phone,
      cus_addr: cus_addr,
      cus_place: cus_place,
      chasis_no: chasis_no,
      implement: implement,
      service_person_name: service_person_name,
      machine_problem: machine_problem,
      rating_dealer: rating_dealer,
      rating_service: rating_service,
      solution: solution,
      review_date: review_date


    },
    success: function (response) {
      console.log(response);


      if (response.trim() == "ok") {
        //console.log
        window.location.reload();
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });

}

function get_service_review(did) {
  console.log(did);

  $.ajax({
    url: "php/get_today_review.php",
    type: "get", //send it through get method
    data: {
      did: did

    },
    success: function (response) {

      console.log(response);
      if (response.trim() != "error") {
        $('#service_history_table').empty();
        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);

          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;
            $('#service_history_table').append("<tr><td>" + count + "</td><td>" + obj.cus_name + "</td><td>" + obj.cus_place + "</td><td>" + obj.service_person_name + "</td><td>" + obj.chasis_no + "</td><td>" + obj.implement + "</td><td>" + obj.machine_problem + "</td><td>" + obj.solution + "</td><td>" + obj.ddate + "</td></tr>")

          });


        }
        else {
          $("#service_history_table").append("<td colspan='10' class='text-center text-danger' scope='col'>No Data</td>");

        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

// Implement
function get_jaysan_final_product() {


  $.ajax({
    url: "php/get_jaysan_final_product.php",
    type: "get", //send it through get method
    data: {

    },
    success: function (response) {

      $('#implement').empty()
      $('#implement').append("<option value='' selected disabled>Choose Options...</option>")
      if (response.trim() != "error") {
        //console.log

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {
            count = count + 1;
            $('#implement').append("<option  value = '" + obj.product_name + "'>" + obj.product_name + "</option>")

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