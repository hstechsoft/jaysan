
var role = localStorage.getItem("ls_emp_role")
var cun = localStorage.getItem("ls_uname")


// console.log(role)

$(document).ready(function(){
  
  
  $("#menu_bar").load('menu.html',
    function() { 
      $('#topbar_logout_btn').on('click', function()
{
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
  }).then(function(isConfirm) {
    if (isConfirm) {
      localStorage.clear();
      location.reload()
    } else {
      swal("Cancelled", "", "error");
    }
  })
});
      $("#role_name_txt").text(role)
      $("#unamed").text(cun)
      var lo = (window.location.pathname.split("/").pop());
      var web_addr = "#"+ (lo.substring(0, lo.indexOf(".")))

      const menu_array = get_role().split(',');
      menu_array.forEach(function (obj) {
       var menu_id = "#" + obj
       $(menu_id).removeClass("visually-hidden")
// console.log($(menu_id).find("a").hasClass('dropdown-item'))
       if($(menu_id).find("a").hasClass('dropdown-item'))
{
$(menu_id).parent().parent().find("a").eq(0).parent().removeClass("visually-hidden")
$(menu_id).parent().parent().parent().parent().find("a").eq(0).parent().removeClass("visually-hidden")
}
                 });
    
     if($(web_addr).find("a").hasClass('nav-link'))
     {
      $(web_addr).find("a").toggleClass('active')
     }
     else if($(web_addr).find("a").hasClass('dropdown-item'))
{
  $(web_addr).find("a").eq(0).toggleClass('text-primary')
  $(web_addr).parent().parent().find("a").eq(0).toggleClass('text-primary')
  $(web_addr).parent().parent().parent().parent().find("a").eq(0).toggleClass('active')
}
      
     
    }
 );
  
  

  
   

   });
   //

  





  
   function get_role(){
   var menu = ""
    $.ajax({
      url: "php/get_role.php",
      async : false,
      type: "get", //send it through get method
      data: {
      
     role:role
     },
      success: function (response) {

       
     if (response.trim() != "error") {
      if(response.trim() != "0 result")
{
      var obj = JSON.parse(response);
     
var count =0;
     
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


  
   

   function get_millis(t)
   {
    
    var dt = new Date(t);
    return dt.getTime();
   }



   function get_cur_millis()
   {
    var dt = new Date();
    return dt.getTime();
   }


   function get_today_date(){
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    var hour = date.getHours();
    var mins = date.getMinutes();
  
console.log(mins)

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
 
    var today = year + "-" + month + "-" + day +"T"+ hour + ":"+ mins; 
    return today;
   }

   function get_today_start_millis(){
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
 
    var today = year + "-" + month + "-" + day +"T00:00"; 

    return get_millis(today)
     
   }


   function get_today_end_millis(){
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
 
    var today = year + "-" + month + "-" + day +"T23:59"; 

    return get_millis(today)
     
   }

   function salert(title, text, icon) {
  

    swal({
        title: title,
        text: text,
        icon: icon,
    });
}



function millis_to_date( millis)
{
  var d = new Date(millis); // Parameter should be long value

  
return d.toLocaleString('en-GB');

}




