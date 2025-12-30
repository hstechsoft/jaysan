
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 
 
$(document).ready(function(){

 


//   $("#menu_bar").load('menu.html',
//     function() { 
//       var lo = (window.location.pathname.split("/").pop());
//       var web_addr = "#"+ (lo.substring(0, lo.indexOf(".")))
 
    
//      if($(web_addr).find("a").hasClass('nav-link'))
//      {
//       $(web_addr).find("a").toggleClass('active')
//      }
//      else if($(web_addr).find("a").hasClass('dropdown-item'))
// {
// $(web_addr).parent().parent().find("a").eq(0).toggleClass('active')
// }
      
     
//     }
//  );




    // check_login();
    
//    $("#unamed").text(localStorage.getItem("ls_uname"))

$("#job_card_list").sortable({
    items: "tr", // Make <tr> sortable
    cursor: "move", // Change the cursor while dragging
    placeholder: "ui-state-highlight", // Highlight placeholder
    update: function (event, ui) {
        // This will trigger after sorting is completed
       
    }
});     
const pdfUrl = "demo.pdf";

$("#pdfFrame").attr("src", pdfUrl); // Set the PDF source
$("#pdfViewer").show(); 
$('#order_no').change(function() {
    $(".order").removeClass("d-none")
});

$('#add_nesting').on('click', function()
{
    $("#modify_nesting").show()
});
$("#nesting_table").on("click","tr td button", function(event) {
 
if($(this).closest("td").index() == 7)
{
    $("#modify_nesting").show()
}


});

    // Your code here for the click event
    $(".order").addClass("d-none")

$("#modify_nesting").hide()
$("#requirement_type").addClass("d-none")
      $("#custom_color").hide()
   $('#custom_color_chk').change(function() {
    if(this.checked) {
        $("#custom_color").show()
    }
   
   });

   $('#regular_clr_chk').change(function() {
    if(this.checked) {
        $("#custom_color").hide()
    }
   
   });


   $("#custom_chasis").hide()
   $('#custom_chasis_chk').change(function() {
    if(this.checked) {
        $("#custom_chasis").show()
    }
   
   });

   $('#regular_chasis_chk').change(function() {
    if(this.checked) {
        $("#custom_chasis").hide()
    }
   
   });

   $('#requirement_order').change(function() {
    if(this.checked) {
        $("#order_no").empty()
        $("#order_no").append(" <option value='0' selected>Choose Options...</option> <option value='vishnu'>10</option> <option value='murugan'>11</option> ")

        $("#requirement_type").removeClass("d-none")
    }
   
   });


   
   $('#sale_order').change(function() {
    if(this.checked) {
        $("#requirement_type").addClass("d-none")
        $("#order_no").empty()
        $("#order_no").append(" <option value='0' selected>Choose Options...</option> <option value='vishnu'>121</option> <option value='murugan'>122</option> ")
    }
   
   });




});










  

   



function check_login()
{
 
if (localStorage.getItem("logemail") == null && phone_id == null )  {
 window.location.replace("login.html");
}
else if (localStorage.getItem("logemail") == null && phone_id != null )
 {
get_current_userid_byphoneid();
$('#menu_bar').hide()
 }

 else
 {
     
 }
}


function get_current_userid_byphoneid()
   {
     $.ajax({
       url: "php/get_current_employee_id_byphoneid.php",
       type: "get", //send it through get method
       data: {
         phone_id:phone_id,
        
      
      },
       success: function (response) {
      
      
      if (response.trim() != "error") {
       var obj = JSON.parse(response);
      

      console.log(response);
      
      
       obj.forEach(function (obj) {
         current_user_id = obj.emp_id;
         current_user_name =  obj.emp_name;
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

  
   function shw_toast(title,des,theme)
   {
   
     
         $('.toast-title').text(title);
         $('.toast-description').text(des);
   var toast = new bootstrap.Toast($('#myToast'));
   toast.show();
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