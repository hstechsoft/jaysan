
var role = localStorage.getItem("ls_emp_role")
var cun = localStorage.getItem("ls_uname")
 var phone_id = localStorage.getItem("app_phone_id")
// var phone_id = "cbbfc05f5d5a3abe";
var start = ''

// console.log(role)
// CLICK TO EXPAND SIDEBAR





$(document).ready(function () {

  if (phone_id && phone_id !== "null") {

    console.log("Phone ID1:", phone_id);
    get_app_menu(phone_id);


  } else {

    // Start button UX
    $("#start_btn")
      .text("You don't have access")
      .removeClass("btn-primary")
      .addClass("btn-danger fw-bold");
  }





  $("#menu_bar").load('menu.html',
    function () {

      const sidebarState = localStorage.getItem("sidebar_state");

      if (sidebarState == "1") {
        $("#normal_view").removeClass("d-none");
        $(".page-wrapper").css("margin-left", "var(--sidebar-collapsed-w)");
        $("#fa-bars i").removeClass("fa-bars").addClass("fa-times");
      } else {
        $("#normal_view").addClass("d-none");
        $(".page-wrapper").css("margin-left", "0px");
        $("#fa-bars i").removeClass("fa-times").addClass("fa-bars");
      }

      $("#fa_bars, #close_sidebar").on("click", function () {
        $("#normal_view").toggleClass("d-none");

        if (!$("#normal_view").hasClass("d-none")) {

          localStorage.setItem("sidebar_state", "1");
          $(".page-wrapper").css("margin-left", "var(--sidebar-collapsed-w)");
          $("#fa-bars i").removeClass("fa-bars").addClass("fa-times");
        }
        else {
          localStorage.setItem("sidebar_state", "0");
          $(".page-wrapper").css("margin-left", "0px");
          $("#fa-bars i").removeClass("fa-times").addClass("fa-bars");
        }
      });
      $('#topbar_logout_btn').on('click', function () {
        //salert("Logout","are you sure" , "warning")
        // localStorage.clear();
        // location.reload()


        swal({
          title: "Are you sure? ",
          text: "You will logout",
          icon: "warning",
          buttons: [
            'No, cancel it!',
            'Yes, I am sure!'
          ],
          dangerMode: true,
        }).then(function (isConfirm) {
          if (isConfirm) {
            localStorage.clear();
            location.reload()
          } else {
            swal("Cancelled", "", "error");
          }
        })
      });
      console.log(role, cun);

      $("#role_name_txt, #role_name_txtt ").text(role)
      $("#uname, #unamee").text(cun)
      var lo = (window.location.pathname.split("/").pop());
      var web_addr = "#" + (lo.substring(0, lo.indexOf(".")))

      const menu_array = get_role().split(',');
      menu_array.forEach(function (obj) {
        var menu_id = "#" + obj
        $(menu_id).removeClass("visually-hidden")
        // console.log($(menu_id).find("a").hasClass('dropdown-item'))
        if ($(menu_id).find("a").hasClass('dropdown-item')) {
          $(menu_id).parent().parent().find("a").eq(0).parent().removeClass("visually-hidden")
          $(menu_id).parent().parent().parent().parent().find("a").eq(0).parent().removeClass("visually-hidden")
        }

        if ($(menu_id).is(".submenu-item, .dropdown-item")) {
          $(menu_id).closest(".flyout, #collape_exchange, .submenu, .sub-flyout")
            .prev(".menu-item, .submenu-item")
            .removeClass("visually-hidden");

          $(menu_id).closest(".menu-wrapper")
            .children(".menu-item")
            .removeClass("visually-hidden");
        }
      });

      if ($(web_addr).find("a").hasClass('nav-link')) {
        $(web_addr).find("a").toggleClass('active')
      }
      else if ($(web_addr).find("a").hasClass('dropdown-item')) {
        $(web_addr).find("a").eq(0).toggleClass('text-primary')
        $(web_addr).parent().parent().find("a").eq(0).toggleClass('text-primary')
        $(web_addr).parent().parent().parent().parent().find("a").eq(0).toggleClass('active')
      }

      function hideEmptyMenus() {

        
        $(".flyout, #collape_exchange, .submenu, .sub-flyout").each(function () {
          if ($(this).find("a:not(.visually-hidden)").length === 0) {
            $(this).addClass("visually-hidden");
          }
        });

        
        $(".sub-wrapper").each(function () {
          if ($(this).find("a:not(.visually-hidden)").length === 0) {
            $(this).addClass("visually-hidden");
          }
        });

        $(".menu-wrapper").each(function () {

          const visibleLinks = $(this)
            .find("a:not(.visually-hidden)");

          if (visibleLinks.length === 0) {
            $(this).addClass("visually-hidden");
          }
        });
      }


      hideEmptyMenus();


    }
  );

  $("#footer").load("footer.html");

  $("#mobile_menu a").each(function () {
    if (this.href === window.location.href) {
      $(this).addClass("active fw-semibold");
    }
  });
  $("#mobile_menu").on("click", "a", function () {
    bootstrap.Offcanvas.getInstance(
      document.getElementById("mobileOffcanvas")
    )?.hide();
  });

  $("#start_btn").on("click", function () {
    if (window.APP_START_URL) {
      window.location.href = window.APP_START_URL;
    }
  });




});
//





function get_app_menu(phone_id) {


  $.ajax({
    url: "php/get_app_menu1.php",
    type: "GET",
    data: { phone_id: phone_id, },
    dataType: "json",
    success: function (response) {

      if (!Array.isArray(response) || response.length === 0) {
        console.warn("No menu data");
        return;
      }

      $("#mobile_menu").empty();
    // $("#mobile_menu").append(`<li class="list-group-item">no menu</li>`);
      let startUrl = "";
     

      response.forEach(item => {

        if (item.iswebview === "true") {

          let url = item.menu_name1 + ".html?phone_id=" + phone_id;

          // if (item.menu_id === "1") {
          //   startUrl = url;
          // }

          $("#mobile_menu").append(`<li class="list-group-item"><a href="${url}" class="d-block text-decoration-none"><span class='pe-2'>${item.menu_icon_web}</span>${item.menu_name}</a></li>`);
        }
      });

      // window.APP_START_URL = startUrl;

    },
    error: function (xhr, status, error) {
      console.error("Menu load failed:", error);
    }
  });
}


function get_role() {
  var menu = ""
  $.ajax({
    url: "php/get_role.php",
    async: false,
    type: "get", //send it through get method
    data: {

      role: role
    },
    success: function (response) {


      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
          var obj = JSON.parse(response);

          var count = 0;

          obj.forEach(function (obj) {

            menu = obj.menu
          });
        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });


  return menu
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




