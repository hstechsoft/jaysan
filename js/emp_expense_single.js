
var cus_id = '0';
var urlParams = new URLSearchParams(window.location.search);

var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var phone_id = urlParams.get('phone_id');

var work_id = urlParams.get('work_id');
let button_type = 0;
let isSelectionMode = false;
let selectedItems = [];
let longPressTimer = null;

if (work_id == null)
  work_id = 0
$(document).ready(function () {

  check_login();

  get_expense_summary_single();
  get_exp_cat_all()
  $("#unamed").text(localStorage.getItem("ls_uname"))

  $('#pay_date').val(get_today_date());

  $('#sel_all_chk').change(function () {
    if (this.checked) {

      $("#exp_table tr").each(function () {

        var this_row = $(this);
        this_row.find('td:eq(5) input:checkbox')[0].checked = true
      });
    }

    else {
      $("#exp_table tr").each(function () {

        var this_row = $(this);
        this_row.find('td:eq(5) input:checkbox')[0].checked = false
      });
    }

  });

  $("#unapprove_view_btn").click(function () {
    button_type = 1;
    $("#exp_date").val("");
    $("#exp_category").val("");
    $("#exp_description").val("");
    $("#exp_amount").val("");
    get_expense_approve_sts("no");

  });


  $("#decline_view_btn").click(function () {
    button_type = 2;
    $("#exp_date").val("");
    $("#exp_category").val("");
    $("#exp_description").val("");
    $("#exp_amount").val("");
    get_expense_approve_sts("decline");

  });


  $("#exp_add_btn").click(function () {
    if ($('#emp_exp_form')[0].checkValidity())

      insert_expense()
  });


  $('#emp_exp_form').submit(function (e) {

    e.preventDefault()
    e.stopPropagation()
    $("#exp_des_txt").val("")
    $("#exp_cat").val("")
    $("#exp_amt_txt").val("")
    $('#pay_date').val(get_today_date());


  });

  $("#exp_delete_btn").click(function () {
    $("#exp_table tr").each(function () {

      var this_row = $(this);
      if (this_row.find('td:eq(5) input:checkbox')[0].checked)
        this_row.remove()






    });
    var count = 0
    $('#exp_table tr').each(function () {
      count = count + 1
      var this_row = $(this);

      (this_row.find('td:eq(0)').html(count))

    });

    var total = 0
    $('#exp_table tr').each(function () {
      total = total + parseFloat($(this).find("td").eq(4).html())
    });
    console.log(total)
    $("#total_exp_txt").html("Toatl - &#x20B9 " + total)

    $("#sel_all_chk").prop('checked', false);


  });


  $("#exp_date").on("input", function () {

    let exp_date = $(this).val();
    exp_date = exp_date.replace("T", " ");
    get_expenses_single(exp_date);

  })


  $("#add_expense").click(function () {


    var date = $("#exp_date").val();
    var category = $("#exp_category").val();
    var description = $("#exp_description").val();
    var amount = $("#exp_amount").val();

    if (category == null || date == "" || amount == "") {
      salert("Warning", "Data missing", "warning");
      return;
    }


    insert_emp_expense(date, category, description, amount)

    // $("#exp_date").val("");
    $("#exp_category").val("");
    $("#exp_description").val("");
    $("#exp_amount").val("");

  });



  console.log(isSelectionMode);


  $("#exp_table").on("mousedown touchstart", "ul", function () {
    const $item = $(this);
    if (!isSelectionMode) {
      longPressTimer = setTimeout(() => {

        toggleSelection($item);
        isSelectionMode = true;

        $("#bulk_delete_btn").removeClass("d-none");
        $("#bulk_delete_cancel_btn").removeClass("d-none");

      }, 2000);  // 2-second long press
    }
  });

  $("#exp_table").on("mouseup mouseleave touchend touchmove", "ul", function () {
    clearTimeout(longPressTimer);  // Prevent long press trigger
  });


  $("#exp_table").on("click", "ul", function () {
    if (isSelectionMode) {
      toggleSelection($(this));
    }
  });

  function toggleSelection($item) {
    const expId = $item.data("exp_id");

    $("#bulk_delete_btn").data("exp_data", $("#exp_date").val())

    if ($item.hasClass("selected")) {
      $item.removeClass("selected");
      selectedItems = selectedItems.filter(id => id !== expId);
    } else {
      $item.addClass("selected");
      selectedItems.push(expId);
    }

    if (selectedItems.length === 0) {
      isSelectionMode = false;
      $("#bulk_delete_btn").addClass("d-none");
      $("#bulk_delete_btn").data("exp_data", "");
      $("#bulk_delete_cancel_btn").addClass("d-none");
    }
  }


  $("#bulk_delete_cancel_btn").on("click", function () {

    $("#exp_table ul.selected").each(function () {
      $(this).removeClass("selected");
    });


    selectedItems = [];
    isSelectionMode = false;

    $("#bulk_delete_btn").data("exp_data", "");
    $("#bulk_delete_btn").addClass("d-none");
    $("#bulk_delete_cancel_btn").addClass("d-none");
    console.log("Bulk delete canceled");
  });



  $("#bulk_delete_btn").on("click", function () {
    let date = $(this).data("exp_data");
    if (selectedItems.length !== 0) {

      swal({
        title: "Alert",
        text: "Are you sure you want to delete?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(function (willDelete) {

        if (willDelete) {
          delete_expenses(selectedItems, date);
        }
        else {
          $("#exp_table ul.selected").each(function () {
            $(this).removeClass("selected");
          });


          selectedItems = [];
          isSelectionMode = false;

          $("#bulk_delete_btn").data("exp_data", "");
          $("#bulk_delete_btn").addClass("d-none");
          $("#bulk_delete_cancel_btn").addClass("d-none");
        }

      });
      // delete_expenses(selectedItems, $(this).data("exp_data"));
      console.log($(this));

      $("#bulk_delete_btn").data("exp_data", "");
      $(this).addClass("d-none");
      $("#bulk_delete_cancel_btn").addClass("d-none");

      $("#update_expense").addClass("d-none")
      $("#add_expense").removeClass("d-none")

      $("#exp_category").val("");
      $("#exp_description").val("");
      $("#exp_amount").val("");


    };
  })





  $("#exp_table").on("click", ".list-group", function () {

    if (isSelectionMode) {
      return;
    }

    console.log($(this).data("exp_date"));


    $("#exp_category").val($(this).data("exp_cat"));
    $("#exp_date").val($(this).data("exp_date"));
    $("#exp_amount").val($(this).data("exp_amount"));
    $("#exp_description").val($(this).data("exp_des"));
    $("#update_expense").data("exp_id", $(this).data("exp_id"));

    $("#add_expense").addClass("d-none")
    $("#update_expense").removeClass("d-none")

  })




  $("#update_expense").on("click", function () {

    var date = $("#exp_date").val();
    var category = $("#exp_category").val();
    var description = $("#exp_description").val();
    var amount = $("#exp_amount").val();
    var exp_id_data = $(this).data("exp_id");

    console.log(date, category, description, amount, exp_id_data);


    if (category == null || date == "" || amount == "" || exp_id_data == null) {
      salert("Warning", "Data missing", "warning");
      return;
    }


    update_expenses({
      exp_des: description,
      exp_cat: category,
      exp_amount: amount,
      exp_date: date,
      exp_emp_id: current_user_id,
      exp_id: exp_id_data,
    })

    $("#exp_category").val("");
    $("#exp_description").val("");
    $("#exp_amount").val("");

    $("#add_expense").removeClass("d-none")
    $("#update_expense").addClass("d-none")

  })


});
//


function get_expense_summary_single() {
  $.ajax({
    url: "php/get_expense_summary_single.php",
    type: "get", //send it through get method
    data: {
      emp_id: current_user_id,


    },
    success: function (response) {


      if (response.trim() != "error") {
        $("#unapproved_count").html("")
        $("#declined_count").html("")

        // count = 0;
        var obj = JSON.parse(response);


        console.log(response);
        obj.forEach(function (obj) {
          $("#unapproved_count").html("<bold>₹" + obj.unapproved + "</bold>")
          $("#declined_count").html("<bold>₹" + obj.decline + "</strong>")
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



function get_expenses_single(exp_date) {

  console.log(exp_date);


  $.ajax({
    url: "php/get_expenses_single.php",
    type: "get", //send it through get method
    data: {

      exp_date: exp_date,
      emp_id: current_user_id,

    },
    success: function (response) {
      console.log(response)
      if (response.trim() != "error") {

        $("#exp_table").empty();

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);




          obj.forEach(function (item) {

            let ms = Number(item.exp_date);
            let formattedDate = formatDateYYYYMMDD(ms);

            $("#exp_table").append(`<ul class="list-group text-center my-2" data-exp_id='${item.exp_id}' data-exp_cat='${item.exp_cat}' data-exp_des='${item.exp_des}' data-exp_date='${formattedDate}' data-exp_amount='${item.exp_amount}'>
                        
                        <div class="card expense-card p-1">
                        <div class="d-flex justify-content-between align-items-center p-0">
                            <div class="expense-name p-1 m-0">${item.exp_cat}</div>
                            <div class="expense-date p-1 m-0">${formattedDate}</div>
                            <div class="expense-amount p-1 m-0">₹ ${item.exp_amount}</div>
                        </div>
                        <hr class="p-1 m-0">
                            <p class="expense-des mb-0">${item.exp_des}</p>
                    </div>

                        </ul>`);
                        

          });
          get_expense_summary_single()

        }

      }






    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function insert_emp_expense(date, category, description, amount) {

  let exp_date = date;

  $.ajax({
    url: "php/insert_emp_expenses.php",
    type: "get", //send it through get method
    data: {
      exp_des: description,
      exp_cat: category,
      exp_amount: parseFloat(amount),
      exp_date: date,
      exp_emp_id: current_user_id,
      exp_work_id: work_id




    },
    success: function (response) {
      console.log(response)
      if (response.trim() == "ok") {

        {
          // swal({
          //   title: "Added",
          //   text: "Expenses added Successfully!",
          //   icon: "success",
          //   showConfirmButton: true,
          //   dangerMode: false,
          // }).then(function () {
          //   location.reload()

          // })

          get_expenses_single(exp_date);

        }

      }






    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function update_expenses(data) {

  let exp_date = data.exp_date;

  $.ajax({
    url: "php/update_expenses.php",
    type: "get", //send it through get method
    data: data,
    success: function (response) {
      console.log(response)
      if (response.trim() == "ok") {

        {
          // swal({
          //   title: "Added",
          //   text: "Expenses added Successfully!",
          //   icon: "success",
          //   showConfirmButton: true,
          //   dangerMode: false,
          // }).then(function () {
          //   location.reload()

          // })

          if (response.trim() == "ok") {
            if (button_type == 0) {
              get_expenses_single(exp_date)
            }
            else if (button_type == 1) {
              get_expense_approve_sts("no")
            }
            else {
              get_expense_approve_sts("decline")
            }
          }

        }

      }






    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}

function delete_expenses(exp_id_arr, date) {

  let exp_date = date;
  console.log(date);


  $.ajax({
    url: "php/delete_expenses.php",
    type: "post", //send it through get method
    data: {
      exp_id_arr: exp_id_arr,
    },
    success: function (response) {
      console.log(response)
      if (response.trim() == "ok") {

        if (button_type == 0) {
          get_expenses_single(exp_date);

          selectedItems = [];
          isSelectionMode = false;

        }
        else if (button_type == 1) {
          get_expense_approve_sts("no")
        }
        else {
          get_expense_approve_sts("decline")
        }

      }






    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}


function get_expense_approve_sts(data) {
  console.log(data);

  $.ajax({
    url: "php/get_expense_approve_sts.php",
    type: "get", //send it through get method
    data: {
      exp_emp_id: current_user_id,
      exp_approve: data


    },
    success: function (response) {


      if (response.trim() != "error") {
        $("#exp_table").find("ul").empty();
        $("#exp_head").text("Expenditure Table - " + data);

        if (response.trim() != "0 result") {

          var obj = JSON.parse(response);


          console.log(response);
          obj.forEach(function (obj) {

            let ms = Number(obj.exp_date);
            let formattedDate = formatDateYYYYMMDD(ms);

            $("#exp_table").append(`<ul class="list-group text-center my-2" data-exp_id='${obj.exp_id}' data-exp_cat='${obj.exp_cat}' data-exp_des='${obj.exp_des}' data-exp_date='${formattedDate}' data-exp_amount='${obj.exp_amount}'>
                        
                        <div class="card expense-card p-1">
                        <div class="d-flex justify-content-between align-items-center p-0">
                            <div class="expense-name p-1 m-0">${obj.exp_cat}</div>
                            <div class="expense-date p-1 m-0">${formattedDate}</div>
                            <div class="expense-amount p-1 m-0">₹ ${obj.exp_amount}</div>
                        </div>
                        <hr class="p-1 m-0">
                            <p class="expense-des mb-0">${obj.exp_des}</p>
                    </div>

                        </ul>`);
          });

        }
        // count = 0;


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





function formatDateYYYYMMDD(ms) {
  let d = new Date(ms);


  let year = d.getFullYear();
  let month = (d.getMonth() + 1).toString().padStart(2, "0");
  let day = d.getDate().toString().padStart(2, "0");
  // console.log(d, year, month, day);
  return `${year}-${month}-${day}`;
}








function get_exp_cat_all() {
  $.ajax({
    url: "php/get_exp_cat_all.php",
    type: "get", //send it through get method
    data: {



    },
    success: function (response) {
      console.log(response)

      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
          var obj = JSON.parse(response);



          obj.forEach(function (obj) {


            $("#exp_category").append(" <option>" + obj.exp_cat + "</option>");

          });
        }








      }


    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });

}

function insert_expense() {
  console.log($('#exp_table tr').length)
  // table_count = table_count + 1;
  $("#exp_table").append(" <tr><td>" + (parseInt($('#exp_table tr').length) + 1) + "</td><td>" + $("#pay_date").val() + "</td><td>" + $("#exp_cat").val() + "</td><td>" + $("#exp_des_txt").val() + "</td><td>" + $("#exp_amt_txt").val() + "</td><td><input class='form-check-input' type='checkbox'></td> </tr>")

  var total = 0
  $('#exp_table tr').each(function () {
    total = total + parseFloat($(this).find("td").eq(4).html())
  });
  console.log(total)
  $("#total_exp_txt").html("Toatl - &#x20B9 " + total)
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
    get_expense_summary_single()
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



        obj.forEach(function (obj) {
          current_user_id = obj.emp_id;
          current_user_name = obj.emp_name;
        });
        get_expense_summary_single()

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

  if (month < 10)
    month = "0" + month;
  if (day < 10)
    day = "0" + day;
  if (hour < 10)
    hour = "0" + hour;

  if (mins < 10)
    mins = "0" + mins;

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


