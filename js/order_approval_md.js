
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 
 var sales_oid = 0
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




     check_login();
    
//    $("#unamed").text(localStorage.getItem("ls_uname"))




$('#sale_order_no').change(function() {
  var order_no = $(this).val();
  get_order_details(order_no)   

});

 


   $('#approve_btn').on('click', function() {
update_sales_order_form("1")
   });
   

   $('#dis_approve_btn').on('click', function() {
    update_sales_order_form("2")
       });
 

});

function update_sales_order_form(approve_sts)
{
 

$.ajax({
  url: "php/update_sales_order_sts.php",
  type: "get", //send it through get method
  data: {
  approve_sts : approve_sts,
oid : sales_oid

  },
  success: function (response) {


if (response.trim() == "ok") {
location.reload();
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}




function get_order_details(order_no)
{
 

$.ajax({
  url: "php/get_sales_order_details.php",
  type: "get", //send it through get method
  data: {

  order_no : order_no

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


 
     
     $('#order_category').val(obj.order_category)
       $('#product').html(obj.product_name)
       $('#pmodel').html(obj.model_name)
       $('#ptype').html(obj.type_name)
      $('#cus_name').html(obj.cus_name)
      $('#cus_phone').html(obj.cus_phone)
      $('#order_type').html(obj.order_type)
      if(obj.oe_supply == "1")
      {
        $('#oe_supply').html("Yes")
      }
        else
        {
          $('#oe_supply').html("No")
        }

      $('#document_date').html(obj.dated.split(" ")[0])
      $('#required_qty').html(obj.required_qty)
      $('#color_choice_des').html(obj.color_choice_des)
      $('#chasis_choice_des').html(obj.chasis_choice_des)
      $('#any_other_spec').html(obj.any_other_spec)
      $('#loading_type').html(obj.loading_type)
      $('#delivery_address').html(obj.delivery_addr + "</br>" + obj.pincode)
      $('#advance_payment').html(obj.advance_payment)
      $('#total_payment').html(obj.total_payment)
   
      $('#order_no').html(obj.order_no)
      $('#emp_name').html(obj.emp_name)
$('#production_untill').html(obj.production_untill)
    
     
      const balancePayment = obj.total_payment - obj.advance_payment;
      const formattedPayment = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(balancePayment);
      $('#balance_payment').html(formattedPayment);
      $('#regular_clr_chk').html(obj.color_choice)
      $('#regular_chasis_chk').html(obj.chasis_choice)
    
     
      get_jaysan_model_subtype(obj.type_id)
       get_sales_order_sub_type(obj.oid)
sales_oid = obj.oid
 })

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


function get_sales_order_sub_type(oid)
{
 

$.ajax({
  url: "php/get_sales_order_subtype.php",
  type: "get", //send it through get method
  data: {

  oid : oid

  },
  success: function (response) {


   
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
   
     $('#sub_type_div input[type="checkbox"]').each(function() {
      if ($(this).val() === obj.msid) {
          $(this).prop('checked', true);
      }
  })
   $('#sub_type_div input[type="checkbox"]').prop('disabled', true);
 })
 
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


function get_sales_order_id()
{
 

$.ajax({
  url: "php/get_sales_order_id.php",
  type: "get", //send it through get method
  data: {
 
  order_category : "Requirement"

  },
  success: function (response) {
console.log(response);

$('#sale_order_no').empty()
$('#sale_order_no').append("<option value='' selected disabled>Choose Options...</option>")
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
     $('#sale_order_no').append("<option value = '"+obj.order_no+"'>"+obj.order_no+"</option>")

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




  
function get_jaysan_model_subtype(type_id)
{
 

$.ajax({
  url: "php/get_jaysan_model_subtype1.php",
  type: "get", //send it through get method
  data: {
  mtid :  type_id

  },
  success: function (response) {
console.log(response);
$('#sub_type_div').empty()

if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 
$('#sub_type_div input[type="checkbox"]').prop('disabled', false);

  obj.forEach(function (obj) {
$('#sub_type_div').append(" <div class='col'> <div class='d-flex justify-content-start'><div class='form-check'> <input class='form-check-input' type='checkbox' value='"+obj.msid+"'> <label class='form-check-label' > "+obj.subtype_name+" </label> </div> </div> </div>")

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
    get_sales_order_id()
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
      
    get_sales_order_id()
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