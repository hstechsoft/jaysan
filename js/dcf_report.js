
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 
 var dcf_id1 = 0;
$(document).ready(function(){
 
  
  $("#menu_bar").load('menu.html',
    function() { 
      var lo = (window.location.pathname.split("/").pop());
      var web_addr = "#"+ (lo.substring(0, lo.indexOf(".")))
 
    
     if($(web_addr).find("a").hasClass('nav-link'))
     {
      $(web_addr).find("a").toggleClass('active')
     }
     else if($(web_addr).find("a").hasClass('dropdown-item'))
{
$(web_addr).parent().parent().find("a").eq(0).toggleClass('active')
}
      
     
    }
 );

console.log(getIndianDateTime());


    check_login();
    
  $("#unamed").text(localStorage.getItem("ls_uname"))


get_dcf()


$('#dcf_list').on('click', 'button', function() {
  get_dcf_details($(this).val())
})


$('#print_button').on('click', function() {
  print() 

});

$('#approve_button').on('click', function() {
  submit_dcf_invoice()

});

});
function submit_dcf_invoice()
{
 
  $("#print_invoice_by").html(current_user_name + " ("+getIndianDateTime()+")")
  $("#print_invoice_no").html($('#invoice_no').val())
    $("#print_driver").html($('#transport_driver').val())
    $("#print_vno").html($('#transport_vno').val())


$.ajax({
  url: "php/update_dcf_invoice.php",
  type: "post", //send it through get method
  data: {
  dcf_invoice_by : current_user_id,
dcf_id : dcf_id1,
dcf_report : $('#dcf_report').html(),
dcf_invoice_no : $('#invoice_no').val(),
transport_driver : $('#transport_driver').val(),
transport_vno : $('#transport_vno').val(),

  },
  success: function (response) {


if (response.trim() == "ok") {

get_dcf()
shw_toast("Success", "DCF Approved", "success") 
$('#invoice_no').val("")
$('#transport_driver').val("")
$('#transport_vno').val("")

}
else if (response.trim() == "0 result")
{


}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}








function get_dcf_details(dcf_id)
{
 

$.ajax({
  url: "php/get_dcf_details.php",
  type: "get", //send it through get method
  data: {
  dcf_id : dcf_id

  },
  success: function (response) {

console.log(response);

if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
$('#dcf_report').html(obj.dcf_report)
dcf_id1 = obj.dcf_id
  });

 
}
else{
// $("#@id@") .append("<td colspan='0' scope='col'>No Data</td>");

}
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}


function get_dcf()
{
 

$.ajax({
  url: "php/get_dcf_report.php",
  type: "get", //send it through get method
  data: {
sts : "invoice",

  },
  success: function (response) {

console.log(response);
$('#dcf_list').empty();
$('#dcf_report').empty();
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
$('#dcf_list').append("<tr><td>"+count+"</td><td>"+obj.dcf_id+"</td><td>"+obj.dated+"</td><td>"+obj.emp_name+"</td><td>"+obj.consignee+"</td><td>"+obj.sts+"</td><td> <button class='btn btn-sm btn-primary' value='"+obj.dcf_id+"'>View</button></td></tr>")

  });
    

 
}
else{
// $("#@id@") .append("<td colspan='5' scope='col'>No Data</td>");

}
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}


  

function print()
{



  $('#dcf_report').printThis({
   
   
   
  
});


}



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
function getIndianDateTime() {
    let date = new Date();
    let indianOffset = 5.5 * 60 * 60 * 1000;
    let utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    let indianDate = new Date(utc + indianOffset);

    let day = indianDate.getDate().toString().padStart(2, '0');
    let month = (indianDate.getMonth() + 1).toString().padStart(2, '0');
    let year = indianDate.getFullYear();

    let hours = indianDate.getHours();
    let minutes = indianDate.getMinutes().toString().padStart(2, '0');
    let seconds = indianDate.getSeconds().toString().padStart(2, '0');

    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12
    hours = hours.toString().padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
}




