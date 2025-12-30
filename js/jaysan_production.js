
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

get_assign_order()


$('#sale_order_no').change(function() {
  var order_no = $(this).val();
  get_order_details(order_no)   

});

$('#order_list').on('click', 'button', function() {
    var order_no = $(this).val();
    console.log(order_no);
    
    get_order_details(order_no)   
});

$("#print_btn").click(function () {
  html2canvas(document.querySelector("#order_form")).then(canvas => {
      let imgData = canvas.toDataURL("image/png");
      let { jsPDF } = window.jspdf;
      let pdf = new jsPDF();

      // Set page size based on the canvas size
      let imgWidth = 190;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      let pageHeight = imgHeight + 20; // Adding some space at the bottom
      pdf.internal.pageSize.height = pageHeight;

      // Add the image to the PDF
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

      // Save the PDF
      pdf.save("document.pdf");
  });
});


});









function get_order_details(ass_id)
{
 

$.ajax({
  url: "php/get_sales_order_details.php",
  type: "get", //send it through get method
  data: {

  ass_id : ass_id

  },
  success: function (response) {
console.log(response);

   
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 
$('html, body').animate({
  scrollTop: $('#qty_table1').offset().top
}, 500);


  obj.forEach(function (obj) {
     count = count +1;


 
     
     $('#order_category').text(obj.order_category + " Order")
       $('#product').html(obj.product)
       $('#pmodel').html(obj.model)
       $('#ptype').html(obj.type)
      $('#cus_name').html(obj.cus_name)
      $('#cus_phone').html(obj.cus_phone)
      $('#order_type').html(obj.order_type)
      $('#sub_type').html(obj.sub_type)
      if(obj.oe_supply == "1")
      {
        $('#oe_supply').html("Yes")
      }
        else
        {
          $('#oe_supply').html("No")
        }

      $('#document_date').html(obj.dated)
      $('#required_qty').html(obj.required_qty)
      $('#color_choice_des').html(obj.color_choice_des)
      $('#chasis_choice_des').html(obj.chasis_choice_des)
      $('#any_other_spec').html(obj.any_other_spec)
      $('#loading_type').html(obj.loading_type)
      $('#delivery_address').html(obj.delivery_addr + "</br>" + obj.pincode)
      const paid_amount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(obj.paid);
    
      $('#advance_payment').html(paid_amount)
      const total_amount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(obj.total_payment);
      $('#total_payment').html(total_amount)
   
      $('#order_no').html(obj.order_no)
      $('#emp_name').html(obj.emp_name)
$('#production_untill').html(obj.production_untill)
    
     
      const balancePayment = obj.total_payment - obj.paid;
      const bal_percent = (balancePayment / obj.total_payment) * 100;
      const bal_amount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(balancePayment);
      $('#balance_payment').html(bal_amount + " (" + bal_percent.toFixed(2) + "%)");
      $('#regular_clr_chk').html(obj.color_choice)
      $('#regular_chasis_chk').html(obj.chasis_choice)
      if(obj.payment_details != null)
      {
        $('.pay').remove();


        $('#payment_details_tr').after(obj.payment_details)
        
        console.log( $('#payment_details_tr').html());
      }
      
     
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





function get_assign_order()
{
 

$.ajax({
  url: "php/get_assign_order.php",
  type: "get", //send it through get method
  data: {
 
 

  },
  success: function (response) {
console.log(response);

$('#order_list').empty()
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
     $('#order_list').append(" <li class=' list-group-item m-0 p-0'> <table class='table table-bordered table-sm m-0 p-0'> <tbody> <tr  class='text-bg-primary small '> <td class = 'small'> # "+obj.ass_id+" <span class='ms-3 me-2'><i class='fa fa-user' aria-hidden='true'></i></span>"+obj.cus_name+"</td> <td colspan='2' class='text-end small'> <span><i class='fa fa-phone me-2' aria-hidden='true'></i></span> "+obj.cus_phone+"</td> </tr> <tr> <td style='max-width: 120px;'class='small'><span><i class='fa fa-id-badge me-2' aria-hidden='true'></i></span>"+obj.emp_name+"</td> <td class='small' style='max-width: 120px;'>"+obj.order_no+"</td> <td class='small text-end'> "+obj.date_f+"</td> </tr> <tr> <td colspan = '3' class='small m-0 p-0'>  <ul class='list-group m-0 p-0' > <li class=' list-group-item m-0 p-0'> <div class='d-flex justify-content-around align-content-center text-decoration-underline'><p class='small'>"+obj.product+"</p><p class='small'>"+obj.model+"</p><p class='small'>"+obj.type+"</p> </div> <div class='d-flex justify-content-center border border-1'><p class='small'> "+obj.sub_type+" </p> </div> </li> </ul> </td> </tr><tr> <td colspan = '3' class=' small m-0 p-0'><div class = 'd-flex justify-content-center'> <button class='btn btn-warning btn-sm' value='"+obj.ass_id+"' >View</button></div></td> </tr> </tbody> </table> </li>") 
  });


}
else{
// $("#@id@") .append("<td colspan='0' scope='col'>No Data</td>");
// $("#payment_table") .append("<tr class = 'small'><td colspan='10' scope='col'>No Data</td></tr>");
$("#order_list") .append("<tr class = ' text-bg-warning'><td colspan='10' class ='text-center' scope='col'>No Data</td></tr>");
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
 
  order_category : "Sales"

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