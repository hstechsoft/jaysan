
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 
 
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
   
    get_godown_name();
  $("#unamed").text(localStorage.getItem("ls_uname"))



  $('#order_table').on("click","button",function(){
    var order_no = $(this).val();
    if($(this).hasClass('download'))
    {
      get_order_details(order_no)   
      console.log(order_no);
    }
    else if($(this).hasClass('dcf_btn'))
    {
      var emp_id_dcf = $(this).data("emp_id")
  
      get_dispatch_count(order_no, function(count) {
     if(count > 0)
   {
  if(current_user_id == emp_id_dcf)
  window.open("dispatch_clearance_form.html?phone_id="+phone_id+"&oid=" + order_no, "_blank");
    else
    {
        var narration = prompt("Enter Reason for DCF Creation:");

// Optional: handle if user cancels the prompt
if (narration !== null) {
  // Encode the narration to make it URL-safe
  narration = encodeURIComponent(narration);
  
  // Open the new window with narration included
  window.open(
    "dispatch_clearance_form.html?phone_id=" + phone_id +
    "&oid=" + order_no +
    "&narration=" + narration,
    "_blank"
  );
} 
    }
 
   }
      else
shw_toast("Machine","No Product ready to Dispatch","")
    });
         
         
    }
 

   });



});



function get_godown_name()
{
 

$.ajax({
  url: "php/get_godown_name.php",
  type: "get", //send it through get method
  data: {
  
  },
  success: function (response) {
    $('#godown').empty()
    $('#godown').append("<option disabled  selected>Choose Options...</option>")
   
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
$('#godown').append("<option data-des = '"+obj.des+"' value = '"+obj.gid+"'>"+obj.godown_name+"</option>")

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

function get_dispatch_count(oid,callback)
{
 

$.ajax({
  url: "php/get_dispatch_count.php",
  type: "get", //send it through get method
  data: {
  oid : oid

  },
  success: function (response) {

console.log(response);

if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 

  obj.forEach(function (obj) {
     count = obj.count

  });
callback (count);
 
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



function print()
{



  $('#order_form').printThis({
   
   
   
  
});


}


function get_order_details(ass_id)
{
 

$.ajax({
  url: "php/get_sales_order_details_approved.php",
  type: "get", //send it through get method
  data: {

    order_id : ass_id

  },
  success: function (response) {
console.log(response);

   
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {
  if($('#order_form_div').hasClass("d-none"))
$('#order_form_div').removeClass("d-none")
  if($('#dispatch_form_div').hasClass("d-none") == false)
$('#dispatch_form_div').addClass("d-none")
  var obj = JSON.parse(response);
var count =0 
$('html, body').animate({
  scrollTop: $('#order_form').offset().top
}, 500);


  obj.forEach(function (obj) {
     count = count +1;


 
     
     $('#order_category_tbl').text(obj.order_category + " Order")
      
      $('#cus_name_tbl').html(obj.cus_name)
      $('#cus_phone_tbl').html(obj.cus_phone)
      $('#order_type_tbl').html(obj.order_type)
      
      if(obj.oe_supply == "1")
      {
        $('#oe_supply_tbl').html("Yes")
      }
        else
        {
          $('#oe_supply_tbl').html("No")
        }
        var nex_pay_date = " nil"
        if(obj.nex_payment_date == '0000-00-00 00:00:00')
nex_pay_date = " nil "
        else
        nex_pay_date = obj.nex_payment_date
        
        $('#nex_payment_date_tbl').html(nex_pay_date)
        $('#desigi_tbl').html(obj.emp_role)
        $('#commitment_date_tbl').html(obj.commitment_date)
      $('#document_date_tbl').html(obj.dated)
      $('#required_qty_tbl').html(obj.required_qty)
      $('#color_choice_des_tbl').html(obj.color_choice_des)
      $('#chasis_choice_des_tbl').html(obj.chasis_choice_des)
      $('#any_other_spec_tbl').html(obj.any_other_spec)
      $('#loading_type_tbl').html(obj.loading_type)
      $('#delivery_address_tbl').html(obj.delivery_addr + "</br>" + obj.pincode)
      const paid_amount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(obj.paid);
    
      $('#advance_payment_tbl').html(paid_amount)
      const total_amount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(obj.total_payment);
      $('#total_payment_tbl').html(total_amount)
   
      $('#order_no_tbl').html(obj.order_no)
      $('#emp_name_tbl').html(obj.emp_name)
      
$('#production_untill_tbl').html(obj.production_untill)
    
     
      const balancePayment = obj.total_payment - obj.paid;
      const bal_percent = (balancePayment / obj.total_payment) * 100;
      const bal_amount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(balancePayment);
      $('#balance_payment_tbl').html(bal_amount + " (" + bal_percent.toFixed(2) + "%)");
      $('#regular_clr_chk_tbl').html(obj.color_choice)
      $('#regular_chasis_chk_tbl').html(obj.chasis_choice)
      if(obj.payment_details != null)
      {
        $('.pay').remove();


        $('#payment_details_tr').after(obj.payment_details)
      
      }
      $('.product').remove();
      
      $('#app_product_details').after(obj.product_details)
      console.log( $('#payment_details_tr').html());

   
 })

 get_assign_sts(ass_id)

//  html2canvas(document.querySelector("#order_form")).then(canvas => {
//   let imgData = canvas.toDataURL("image/png");
//   let { jsPDF } = window.jspdf;
//   let pdf = new jsPDF();

//   // Set page size based on the canvas size
//   let imgWidth = 190;
//   let imgHeight = (canvas.height * imgWidth) / canvas.width;
//   let pageHeight = imgHeight + 20; // Adding some space at the bottom
//   pdf.internal.pageSize.height = pageHeight;

//   // Add the image to the PDF
//   pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

//   // Save the PDF
//   pdf.save("document.pdf");
// });

print()

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




function get_assign_sts(order_id)
{
 

$.ajax({
  url: "php/get_pro_assign_sts.php",
  type: "get", //send it through get method
  data: {

    order_id : order_id

  },
  success: function (response) {
console.log(response);

   
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 
$('.product_sts').remove();


  obj.forEach(function (obj) {
     count = count +1;


 
    
 
      
      $('#product_status_tr').after( obj.product)
     ;
 })



//  html2canvas(document.querySelector("#order_form")).then(canvas => {
//   let imgData = canvas.toDataURL("image/png");
//   let { jsPDF } = window.jspdf;
//   let pdf = new jsPDF();

//   // Set page size based on the canvas size
//   let imgWidth = 190;
//   let imgHeight = (canvas.height * imgWidth) / canvas.width;
//   let pageHeight = imgHeight + 20; // Adding some space at the bottom
//   pdf.internal.pageSize.height = pageHeight;

//   // Add the image to the PDF
//   pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

//   // Save the PDF
//   pdf.save("document.pdf");
// });

//  print()

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



function get_sales_order()
{
 

$.ajax({
  url: "php/get_sales_report1.php",
  type: "get", //send it through get method
  data: {

  },
  success: function (response) {
console.log(response);


    $('#order_table').empty()
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
     $('#order_table').append("<tr class = ''><td>"+count+"</td><td class = 'small' style='max-width: 50px;'>"+obj.order_no+"</td>><td class = 'small' style='max-width: 100px;'>"+obj.dated+"</td> <td class = 'small'>"+obj.emp+"</td><td class = 'small ' style='max-width: 250px;'>"+obj.pay_details+"</td> <td class = 'small ' style='max-width: 100px;'>"+obj.cus+"</td><td style='max-width: 250px;'><div>"+obj.pro+"</div></td> <td style='max-width: 50px;'><button type ='button' value='"+obj.oid+"' class='btn btn-outline-primary download border-0'><i class='fa-solid fa-download'></i></button></td><td style='max-width: 50px;'><button data-emp_id = '"+obj.emp_id+"' type ='button' value='"+obj.oid+"' class='dcf_btn btn btn-outline-primary border-0'><i class='fa-regular fa-file'></i></button></td></tr>")
     
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
    get_sales_order()
    // get_sales_order_approval(1)
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
      
       get_sales_order()
      //  get_sales_order_approval(1)
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