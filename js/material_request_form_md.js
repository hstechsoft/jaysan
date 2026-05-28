
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 
 var physical_stock_array = [];
  var mrf_id_g = 0;
  var purchase_mrf_id_g = 0;
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

  $("#print_container").load('material_request_form_report.html',
  function() { 
  $("#mrf_print_btn").on("click", function(event) {
  event.preventDefault();
  // TODO: handle click here


    $('#mrf_report_table').printThis({
        
      

});
});
 

  });


    check_login();
    
  $("#unamed").text(localStorage.getItem("ls_uname"))





var sts_array_tally = ["purchase_requested"];
get_material_request_form_list_purchase(sts_array_tally,'all');


var sts_array = [];
get_material_request_form_list(sts_array,current_user_id,"approved");

$("#material_requset_form_md_table").on("click", "tr", function(event) {
    event.preventDefault();
    $("#material_requset_form_md_table").find("tr").removeClass("table-active");
    $(this).addClass("table-active");
  purchase_mrf_id_g = $(this).find("button.print").val();
  

 
    });

    $("#material_requset_form_md_table").on("click", "tr td button", function(event) {

      if ($(this).hasClass("print")) { 
    var mrf_id = $(this).val();
  get_material_request_form_details_print(mrf_id);
      }
 
    });

        $('#material_request_form_md').on('submit', function (event) {
        event.preventDefault();
    
        if (!this.checkValidity()) {
          event.stopPropagation();
          $(this).addClass('was-validated');
          return;
        }
      
        $(this).addClass('was-validated');

console.log(mrf_id_g);

        if($("#material_request_form_md_update_btn").hasClass("d-none") == false && mrf_id_g != 0)
        {
    
          update_material_request_form_md();
        } 
        else if( purchase_mrf_id_g > 0)
        insert_material_request_form_md();
      else
      {
        salert("Error", "Please select a Material Request Form to insert", "error");  
    
      } 
      

 
      
        // // ✅ All database (AJAX) operations go here
        // if (actionType === 'submit') {
        //   // insert via AJAX
        // } else if (actionType === 'update') {
        //   // update via AJAX 
        // }
      });



      $("#material_requset_form_table").on("click", "tr td button", function(event) {
  event.preventDefault();
  if ($(this).hasClass("edit")) {
    var mrf_id = $(this).val();
    
    if($("#material_request_form_md_update_btn").hasClass("d-none") == true)

      {
        $("#material_request_form_md_update_btn").removeClass("d-none");
        $("#material_request_form_md_btn").addClass("d-none");
     
      }

   $('html, body').animate({
          scrollTop: 0
        }, 500);

        // Remove highlight from all rows
        $("#material_requset_form_table tr").removeClass("table-active");
        // Highlight the selected row
        $(this).closest("tr").addClass("table-active");


        get_material_request_form_details(mrf_id);
  }

  
    if ($(this).hasClass("print")) {
      var mrf_id = $(this).val();
  get_material_request_form_details_print(mrf_id);
    }
});
get_demo()

});

function get_demo()
   {
    
   
   $.ajax({
     url: "php/get_demo.php",
     type: "POST", //send it through get method
     data: {
    

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
$('#demo').append(
  "<tr><td>"+obj.final+"</td></tr>"

 
  
);
 console.log(obj.final);

     });
   
    
   }
   else{
   // $("#@id@") .append("<td colspan='7' scope='col'>No Data</td>");
 
   }
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }

function get_material_request_form_details(mrf_id)
   {
    $.ajax({
      url: "php/get_material_request_form_details_md.php",
      type: "get", //send it through get method
      data: {
      mrf_id : mrf_id,
    
  
      },
      success: function (response) {  
        mrf_id_g = mrf_id; // Set the global mrf_id variable
console.log(mrf_id_g);

      if (response.trim() != "error") { 
        
        var obj = JSON.parse(response);
     
         obj.forEach(function (obj) {
        $('#order_to').val(obj.order_to)
 $('#delivery_to').val(obj.delivery_to)
 $('#raw_material_part_id').val(obj.raw_material_part_id)
 $('#raw_material_stock').val(obj.raw_material_stock)
 $('#order_qty').val(obj.order_qty)
 $('#batch_qty').val(obj.batch_qty)
 $('#raw_material_rate').val(obj.raw_material_rate)
 $('#next_batch_date').val(obj.next_batch_date)
 $('#next_po_date').val(obj.next_po_date)
 $('#raw_material_budget').val(obj.raw_material_budget)




   

      
      });
     
      } 
      else {
        salert("Error", "Failed to fetch material request form details", "error");
      }
      
      },
      error: function (xhr) {
          //Do Something to handle error
          salert("Error", "An error occurred while fetching material request form details", "error");
      }
    });
   }

  function get_material_request_form_list(sts_array, emp_id, field_name)
   {
    
   
   $.ajax({
     url: "php/get_material_request_form_list.php",
     type: "POST", //send it through get method
     data: {
     status : JSON.stringify(sts_array),
   md_emp_id : emp_id


     },
     success: function (response) {
console.log(response);

   
   
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
 
 
     obj.forEach(function (obj) {
      console.log(obj.status);
        var edit_btn = "disabled";
  if(field_name == "approved")
   {
    if(obj. purchase_verified_by == current_user_id && (obj.status == "approved" || obj.status == "declined" || obj.status == "need change"))
    {
      edit_btn = "";
    }
    {
      edit_btn = "";
    }
   

   }
  

var emp_invalved_list = [];
emp_invalved_list.push("Created by " + obj.emp_name);

if (obj.tally_stock_approved_by != null && obj.tally_stock_approved_by != "" && obj.tally_stock_approved_by != "0") {
  emp_invalved_list.push("Tally Stock Approved by " + obj.tally_stock_approved_by_name);
}
if (obj.purchase_requested_by != null && obj.purchase_requested_by != "" && obj.purchase_requested_by != "0") {
  emp_invalved_list.push("Purchase Requested by " + obj.purchase_requested_by_name);
}
if (obj.purchase_verified_by != null && obj.purchase_verified_by != "" && obj.purchase_verified_by != "0") {
  emp_invalved_list.push("Purchase Verified by " + obj.purchase_verified_by);
}
if (obj.purchase_approved_by != null && obj.purchase_approved_by != "" && obj.purchase_approved_by != "0") {
  emp_invalved_list.push("Purchase Approved by " + obj.purchase_approved_by);
}
var emp_invalved = "<ul class='list-group small'><li class='list-group-item small m-0 p-0'>" + emp_invalved_list.join("</li><li class='list-group-item  m-0 p-0 small'>") + "</li></ul>";


   


        count = count +1;
$('#material_requset_form_table').append(
  "<tr><td>"+count+"</td><td>"+obj.part_name+"</td><td>"+obj.req_date_format+"</td><td><div class='accordion' id='acc_"+obj.mrf_id+"'> <div class='accordion-item'> <h2 class='accordion-header'> <button class='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#collapse_"+obj.mrf_id+"' aria-expanded='false' aria-controls='collapse_"+obj.mrf_id+"'> History </button> </h2> <div id='collapse_"+obj.mrf_id+"' class='accordion-collapse collapse' data-bs-parent='#acc_"+obj.mrf_id+"'> <div class='accordion-body'><ul class='list-group'> "+obj.form_history+"</ul> </div> </div> </div></div></td><td>"+obj.dated_format+"</td><td>"+obj.status+"</td> \
  <td><button "+edit_btn+" type='button' value='"+obj.mrf_id+"'  class='btn btn-outline-danger border-0 edit btn-animate' id=''><i class='fa fa-pencil'  aria-hidden='true'></i></button></td>\
  <td><button type='button'  value='"+obj.mrf_id+"' class='btn btn-outline-danger border-0 print btn-animate' id=''><i class='fa fa-print' aria-hidden='true'></i></button></td></tr>"
);


     });
   
    
   }
   else{
   // $("#@id@") .append("<td colspan='7' scope='col'>No Data</td>");
 
   }
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }


  function insert_material_request_form_md()
   {
    
   
   $.ajax({
     url: "php/insert_material_request_form_md.php",
     type: "get", //send it through get method
     data: {
     mrf_id : purchase_mrf_id_g,
     purchase_verified_by :  current_user_id,
     purchase_approved_by :  current_user_id,
     md_approve_option : $("#md_approve_option").val(),


     },
     success: function (response) {
   
   console.log(response);
   
   if (response.trim() == "ok") {

 
   
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }


  function update_material_request_form_md()
   {
    
   
   $.ajax({
     url: "php/update_material_request_form_md.php",
     type: "get", //send it through get method
     data: {
     mrf_id : mrf_id_g,
     purchase_verified_by :  current_user_id,
     purchase_approved_by :  current_user_id,
     md_approve_option : $("#md_approve_option").val(),


     },
     success: function (response) {
   
   console.log(response);
   
   if (response.trim() == "ok") {

 location.reload();
   
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }




 function get_material_request_form_list_purchase(sts_array, emp_id)
   {
    
   
   $.ajax({
     url: "php/get_material_request_form_list_purchase.php",
     type: "POST", //send it through get method
     data: {
     status : JSON.stringify(sts_array),
    emp_id : emp_id

     },
     success: function (response) {
console.log(response);

   
   
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
 
 
     obj.forEach(function (obj) {
      console.log(obj.status);
    

var emp_invalved_list = [];
emp_invalved_list.push("Created by " + obj.emp_name);

if (obj.tally_stock_approved_by != null && obj.tally_stock_approved_by != "" && obj.tally_stock_approved_by != "0") {
  emp_invalved_list.push("Tally Stock Approved by " + obj.tally_stock_approved_by_name);
}
if (obj.purchase_requested_by != null && obj.purchase_requested_by != "" && obj.purchase_requested_by != "0") {
  emp_invalved_list.push("Purchase Requested by " + obj.purchase_requested_by_name);
}
if (obj.purchase_verified_by != null && obj.purchase_verified_by != "" && obj.purchase_verified_by != "0") {
  emp_invalved_list.push("Purchase Verified by " + obj.purchase_verified_by);
}
if (obj.purchase_approved_by != null && obj.purchase_approved_by != "" && obj.purchase_approved_by != "0") {
  emp_invalved_list.push("Purchase Approved by " + obj.purchase_approved_by);
}
var emp_invalved = "<ul class='list-group small'><li class='list-group-item small m-0 p-0'>" + emp_invalved_list.join("</li><li class='list-group-item  m-0 p-0 small'>") + "</li></ul>";


   


        count = count +1;
$('#material_requset_form_md_table').append(
  "<tr data-purchase_id = "+obj.mrf_purchase_id+"><td>"+count+"</td><td>"+obj.part_name+"</td><td>"+obj.req_date_format+"</td><td><div class='accordion' id='acc1_"+obj.mrf_id+"'> <div class='accordion-item'> <h2 class='accordion-header'> <button class='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#collapse1_"+obj.mrf_id+"' aria-expanded='false' aria-controls='collapse1_"+obj.mrf_id+"'> History </button> </h2> <div id='collapse1_"+obj.mrf_id+"' class='accordion-collapse collapse' data-bs-parent='#acc1_"+obj.mrf_id+"'> <div class='accordion-body'><ul class='list-group'> "+obj.form_history+"</ul> </div> </div> </div></div></td><td>"+obj.dated_format+"</td><td><button type='button'  value='"+obj.mrf_id+"' class='btn btn-outline-danger border-0 print btn-animate' id=''><i class='fa fa-print' aria-hidden='true'></i></button></td></tr>"
);


     });
   
    
   }
   else{
   // $("#@id@") .append("<td colspan='7' scope='col'>No Data</td>");
 
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