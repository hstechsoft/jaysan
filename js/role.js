
var cus_id = '0';
$(document).ready(function () {

  check_login();
  get_role_type();
  get_all_role();
  get_app_menu_all();
  get_app_menu_master();

  $("#unamed").text(localStorage.getItem("ls_uname"))




  $("#role_name_select").on("change", function () {

    let selectedOption = $(this).find("option:selected");

    $("#role_name").val(selectedOption.val());
    $("#web_res_text").val(selectedOption.data("res"))

    let menu = selectedOption.data("menu");

    if (typeof menu === "string") {
      menu = new Set(menu.split(","));
    }

    get_role_type(menu)


    $("#role_submit_btn").addClass("d-none");
    $("#role_edit_btn").removeClass("d-none");
  });


  $("#role_submit_btn").on("click", function () {
    var role = $("#role_name").val();
    var res = $("#web_res_text").val();
    var menu = "";
    $("#view_role input").each(function () {

      if ($(this).is(":checked")) {

        if (menu == "") {
          menu = $(this).val();
        }
        else {
          menu = menu + "," + $(this).val();
        }

      }

    })

    if (role == "" || menu == "") {
      salert("Warning", "Data missing", "warning");
      return;
    }
    console.log(role, menu, res);

    insert_role(role, menu, res)
  });

  $("#role_edit_btn").click(function () {

    var role = $("#role_name").val();
    var res = $("#web_res_text").val();
    var menu = "";
    $("#view_role input").each(function () {

      if ($(this).is(":checked")) {

        if (menu == "") {
          menu = $(this).val();
        }
        else {
          menu = menu + "," + $(this).val();
        }

      }

    })
    if (role == "" || menu == "") {
      salert("Warning", "Data missing", "warning");
      return;
    }
    console.log(role, menu, res);
    update_role(role, menu, res);

  });



  $('#role_name').on('input', function () {
    //check the value not empty
    if ($('#role_name').val() != "") {
      $('#role_name').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_empmenu_auto.php",
            type: "get", //send it through get method
            data: {

              role: $('#role_name').val(),

            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.role,
                  value: item.role,
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
          $("#role_name_select").val(ui.item.value).trigger("change")


        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.label + "</strong></div>")
          .appendTo(ul);
      };
    }

  });


  $("#view_all_roles").on("click", ".fa-eye", function () {
    $(this).addClass("d-none");
    $("#view_all_roles").find(".fa-home").removeClass("d-none");
    $("#view_web_role").removeClass("d-none");
    $("#view_role").addClass("d-none");

  })
  $("#view_all_roles").on("click", ".fa-home", function () {
    $(this).addClass("d-none");
    $("#view_all_roles").find(".fa-eye").removeClass("d-none");
    $("#view_web_role").addClass("d-none");
    $("#view_role").removeClass("d-none");

  })




    $("#view_all_role_name").on("click", ".fa-eye", function () {
    $(this).addClass("d-none");
    $("#view_all_role_name").find(".fa-home").removeClass("d-none");
    $("#view_all_app_roles").removeClass("d-none");
    $("#view_app_role").addClass("d-none");

  })
  $("#view_all_role_name").on("click", ".fa-home", function () {
    $(this).addClass("d-none");
    $("#view_all_role_name").find(".fa-eye").removeClass("d-none");
    $("#view_all_app_roles").addClass("d-none");
    $("#view_app_role").removeClass("d-none");

  })


  $("#app_role_name_select").on("change", function () {

    let AppselectedOption = $(this).find("option:selected");

    $("#app_role_name").val(AppselectedOption.val());
    $("#app_res_text").val(AppselectedOption.data("res") || "")

    let menu = AppselectedOption.data("menu");

    if (typeof menu === "string") {
      menu = new Set(menu.split(","));
    }

    get_app_menu_master(menu)


    $("#app_role_submit_btn").addClass("d-none");
    $("#app_role_edit_btn").removeClass("d-none");
  });


  $('#app_role_name').on('input', function () {
    //check the value not empty
    if ($('#app_role_name').val() != "") {
      $('#app_role_name').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_appmenu_auto.php",
            type: "get", //send it through get method
            data: {

              role: $('#app_role_name').val(),

            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.role,
                  value: item.role,
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
          $("#app_role_name_select").val(ui.item.value).trigger("change")


        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div><strong>" + item.label + "</strong></div>")
          .appendTo(ul);
      };
    }

  });

  
  $("#app_role_submit_btn").on("click", function () {
    var role = $("#app_role_name").val();
    // var res = $("#web_res_text").val();
    var menu = "";
    $("#view_app_role input").each(function () {

      if ($(this).is(":checked")) {

        if (menu == "") {
          menu = $(this).val();
        }
        else {
          menu = menu + "," + $(this).val();
        }

      }

    })

    if (role == "" || menu == "") {
      salert("Warning", "Data missing", "warning");
      return;
    }
    console.log(role, menu);

    insert_app_menu(role, menu)
  });

  $("#app_role_edit_btn").click(function () {

    var role = $("#app_role_name_select").val();
    // var res = $("#web_res_text").val();
    var menu = "";
    $("#view_app_role input").each(function () {

      if ($(this).is(":checked")) {

        if (menu == "") {
          menu = $(this).val();
        }
        else {
          menu = menu + "," + $(this).val();
        }

      }

    })
    if (role == "" || menu == "") {
      salert("Warning", "Data missing", "warning");
      return;
    }
    console.log(role, menu);
    update_app_menu(role, menu);

  });

});
//


function insert_app_menu(role, menu) {


  $.ajax({
    url: "php/insert_app_menu.php",
    type: "get", //send it through get method
    data: {
      role: role,
      menu: menu,
    },
    success: function (response) {

      console.log(response)
      if (response.trim() == "ok") {
        location.reload()


      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}


function update_app_menu(role, menu) {


  $.ajax({
    url: "php/update_app_menu.php",
    type: "get", //send it through get method
    data: {
      role: role,
      menu: menu,
    },
    success: function (response) {

      console.log(response)
      if (response.trim() == "ok") {
        location.reload()


      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}



function get_app_menu_all() {


  $.ajax({
    url: "php/get_app_menu_all.php",
    type: "get", //send it through get method
    data: {

    },
    success: function (response) {


      if (response.trim() != "error") {

        if (response.trim() != "0 result") {

          $('#app_menu_all_table').empty()

          // $("#app_role_name_select").append("<option value ='null' selected>Choose Role...</option>")

          var obj = JSON.parse(response);
          var count = 0


          obj.forEach(function (obj) {

            
            $("#app_role_name_select").append(" <option data-menu='" + obj.menu_name + "' data-res='" + obj.res + "' value='" + obj.role + "'>" + obj.role + "</option>")

            // count = count + 1;
            // $('#app_menu_all_table').append("<tr><td>" + count + "</td><td  style='max-width: 100px;'>" + obj.role + "</td><td  style='max-width: 150px;'>" + obj.menu_name + "</td><td>" + "<button  type='button' class='btn  btn-lg text-danger' ><i class='fa-solid fa-pen-to-square'></i></button>" + "</td></tr>")

          });

console.log($('#app_menu_all_table').html());

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

// function get_app_menu_master() {


//   $.ajax({
//     url: "php/get_app_menu_master.php",
//     type: "get", //send it through get method
//     data: {

//     },
//     success: function (response) {


//       if (response.trim() != "error") {

//         if (response.trim() != "0 result") {
//           $("#app_menu_dropdown").append("<option value ='0' selected>Choose Menu...</option>")
//           var obj = JSON.parse(response);
//           var count = 0


//           obj.forEach(function (obj) {
//             count = count + 1;
//             $('#app_menu_dropdown').append("<option>" + obj.menu_name + "</option>")

//           });


//         }
//         else {
//           // $("#@id@") .append("<td colspan='0' scope='col'>No Data</td>");

//         }
//       }





//     },
//     error: function (xhr) {
//       //Do Something to handle error
//     }
//   });




// }
function get_role_type(menu) {

  $.ajax({
    url: "php/get_role_type.php",
    type: "get", //send it through get method
    data: {


    },
    success: function (response) {

      console.log(response)
      $("#view_role").empty();
      if (response.trim() != "error") {

        if (response.trim() != "0 result") {
          var obj = JSON.parse(response);



          obj.forEach(function (obj) {


            if (menu && menu.has(obj.menu_name)) {

              $("#view_role").append(`<div class="col-4"><div class="form-check"><input class="form-check-input" checked type="checkbox" id="${obj.menu_name}" value="${obj.menu_name}"><label class="form-check-label word-break" for="${obj.menu_name}">${obj.menu_name}</label>
                </div></div>`);

            } else {

              $("#view_role").append(`<div class="col-4"><div class="form-check"><input class="form-check-input" type="checkbox" id="${obj.menu_name}" value="${obj.menu_name}"><label class="form-check-label word-break" for="${obj.menu_name}">${obj.menu_name}</label></div>
                </div>`);


            }


          });
          console.log($("#view_role").html());


        }
        else {

          // $("#menu_dropdown").append("<option value ='0' selected>No menu...</option>");
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
function get_app_menu_master(menu) {

  $.ajax({
    url: "php/get_app_menu_master.php",
    type: "get", //send it through get method
    data: {


    },
    success: function (response) {

      console.log(response)
      $("#view_app_role").empty();
      if (response.trim() != "error") {

        if (response.trim() != "0 result") {


          var obj = JSON.parse(response);



          obj.forEach(function (obj) {


            if (menu && menu.has(obj.menu_name)) {

              $("#view_app_role").append(`<div class="col-4"><div class="form-check"><input class="form-check-input" checked type="checkbox" id="${obj.menu_name}" value="${obj.menu_name}"><label class="form-check-label word-break" for="${obj.menu_name}">${obj.menu_name}</label>
                </div></div>`);

            } else {

              $("#view_app_role").append(`<div class="col-4"><div class="form-check"><input class="form-check-input" type="checkbox" id="${obj.menu_name}" value="${obj.menu_name}"><label class="form-check-label word-break" for="${obj.menu_name}">${obj.menu_name}</label></div>
                </div>`);

            }


          });
          console.log($("#view_app_role").html());


        }
        else {

          // $("#menu_dropdown").append("<option value ='0' selected>No menu...</option>");
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


function update_role(role, menu, res) {


  $.ajax({
    url: "php/update_role.php",
    async: false,
    type: "get", //send it through get method
    data: {



      role: role,
      menu: menu,
      res: res,

    },
    success: function (response) {

      console.log(response);

      window.location.reload();


    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });

}


function insert_role(role, menu, res) {


  $.ajax({
    url: "php/insert_role.php",
    async: false,
    type: "get", //send it through get method
    data: {



      role: role,
      menu: menu,
      res: res,


    },
    success: function (response) {

      console.log(response);

      window.location.reload();


    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });

}





function get_all_role() {

  $.ajax({
    url: "php/get_all_role.php",
    type: "get", //send it through get method
    data: {


    },
    success: function (response) {
      console.log(response)

      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
          var obj = JSON.parse(response);

          var count = 0;

          // $("#role_name_select").append("<option value ='null' selected>Choose Role...</option>")


          obj.forEach(function (obj) {

            $("#role_name_select").append(" <option data-menu='" + obj.menu + "' data-res='" + obj.res + "' value='" + obj.role + "'>" + obj.role + "</option>")



            // count = count + 1;
            // $("#menu_all_table").append("<tr><td>" + count + "</td><td  style='max-width: 100px;'>" + obj.role + "</td><td  style='max-width: 150px;'>" + obj.menu + "</td><td  style='max-width: 150px;'>" + obj.res + "</td><td>" + "<button  type='button' class='btn  btn-lg text-danger' ><i class='fa-solid fa-pen-to-square'></i></button>" + "</td>  </tr> ")
          });
        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}





function check_login() {

  if (localStorage.getItem("logemail") == null) {
    window.location.replace("login.html");
  }
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