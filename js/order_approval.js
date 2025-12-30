
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 
 var sales_oid = 0
var calendar = ""
var csdate = ""
 var cedate = ""
 var selected_date = ""
 var selected_type = "" 
 var is_emergency = 0

 var edit_mode = ""
 var old_date = ""
 
 var opid = ""

//  document.addEventListener('DOMContentLoaded', function() {
//   var calendarEl = document.getElementById('calendar');
//    calendar = new FullCalendar.Calendar(calendarEl, {
//     initialView: 'dayGridMonth',
    
  
//     headerToolbar: {
//         left: 'prev,next today',
//         right: 'title',
       
//     },
   
//     themeSystem: 'bootstrap',  // Use Bootstrap theme if you are using Bootstrap
//     height: 'auto' ,
    
//     dateClick: function(info) {
//       // Display the clicked date
//       removeHighlightedDates();

//       // Highlight the clicked date
//       highlightSelectedDate(info.dateStr);

// date_end = format_date_end(info.dateStr)
// date_start = format_date_start(info.dateStr)
// get_attendance()
//       console.log(format_date_mysql(date_end));
      
//      }, // Automatically adjust height

//         // This callback is triggered when the visible dates are changed
//         datesSet: function(info) {
//            csdate = info.startStr; // First visible day of the month
//           cedate = info.endStr;     // Last visible day of the month
 
         
         
//           // Call your custom function to get the events for the whole month
//          get_calender_attendance(format_date_mysql(format_date_start(csdate)),format_date_mysql(format_date_start(cedate)))
//         }
    
// });
//    calendar.addEvent({
//       title: "1800",
//       start: '2024-10-18',
//       color:  'gray', // Use color from data or default to blue
//       textColor:  'white' // Text color
//   });
// });

document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
   calendar = new FullCalendar.Calendar(calendarEl, {
 
    initialView: 'dayGridMonth',
    
  
    headerToolbar: {
        left: 'prev,next today',
        right: 'title',
       
    },
  
   
    themeSystem: 'bootstrap',  // Use Bootstrap theme if you are using Bootstrap
    height: 'auto' ,
     // Event to trigger when calendar starts rendering
    
    dayCellDidMount: function(info) {
      let dayNumber = info.date.getDay(); // 0 = Sunday
      if (dayNumber === 0) {
          info.el.style.backgroundColor = '#ebe5e5'; // Light red for Sundays
      }
  },
  datesSet: function(info) {
    csdate = info.startStr; // First visible day of the month
   cedate = info.endStr;     // Last visible day of the month

 
  
  
   // Call your custom function to get the events for the whole month
  get_calender_assign(format_date_mysql(format_date_start(csdate)),format_date_mysql(format_date_start(cedate)))
 },
 dateClick: function(info) {
  // Display the clicked date
  removeHighlightedDates();

  // Highlight the clicked date
  highlightSelectedDate(info.dateStr);

// $('#selected_date_div').removeClass('d-none')
// $('#selected_date').html(info.dateStr)
  console.log((info.dateStr));
 
  // $("#assign_date").modal('hide');
  if(edit_mode != "mod")
  {
    $('#production_date').val(info.dateStr)
    selected_date = info.dateStr
    get_cal_assign_report(selected_date)
  }
  else
  {
    $('#production_mod_date').val(info.dateStr)
    
    
  }
  

 },

  });
  
});

$(document).ready(function(){

 
  var swipeArea = $('#calendar')[0]; // Get the raw DOM element
    if (swipeArea) {
        var hammer = new Hammer(swipeArea);

         // Handle swipe left
         hammer.on('swipeleft', function() {
          $('#spinner').removeClass('d-none');
          calendar.next();
          // Re-render the calendar after a slight delay to allow spinner visibility
          setTimeout(() => {
            $('#spinner').addClass('d-none');
          // Re-render after spinner hides
          }, 300); 
         
      });

      // Handle swipe right
      hammer.on('swiperight', function() {
        $('#spinner').removeClass('d-none');
        calendar.prev();
        // Re-render the calendar after a slight delay to allow spinner visibility
        setTimeout(() => {
          $('#spinner').addClass('d-none');
        // Re-render after spinner hides
        }, 300); 
      });
    }
  $('#assign_date').on('shown.bs.modal', function () {
     selected_date = "" 
  if(selected_type == "Production")
    calendar.render(); // Re-render calendar when modal is shown
  else if(selected_type == "Production_mod")
    calendar.render(); 
   else   if(selected_type == "Finshed")
   {
    calendar.destroy()
    get_godown_name();
   }
   else
   calendar.destroy()

});

$("#view_cal").on("click",function(){
  $("#calendar_div").show()
  $("#assign_de_form").hide()
 

  $("#assign_date").modal('show');
  selected_type = "Production_mod"
})



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
    
    $("#unamed").text(localStorage.getItem("ls_uname"))

get_sales_order_summary()


$('#sale_order_no').change(function() {
  var order_no = $(this).val();
  get_order_details(order_no)   

});



$('#assign_date_btn').on('click', function() {
  $("#assign_date").modal('hide')
console.log(edit_mode);

  shw_toast("Info","Selected Date : "+ $('#production_date').val(),"",true)
});


   $('#approve_btn').on('click', function() {
update_sales_order_form("1")
   });
   

   $('#dis_approve_btn').on('click', function() {
    update_sales_order_form("2")
       });
       $('#order_list').on('click', '.pro_btn', function() {
      
        console.log($(this).parent().siblings().find('select').val());
      
        var qty = 0;
        if($(this).parent().siblings().find('input').val() !="")
        qty = $(this).parent().siblings().find('input').val();
      if(qty > 0)
          insert_assign_product($(this).val(),qty,selected_type,selected_date)
        else
        shw_toast("Error","Please Enter Quantity","error")
       });


       $('#order_list').on('change', 'select', function() {
   
        $('.order_list_control').removeClass('border border-warning shawdow');
        $(this).closest('.order_list_control').addClass('border border-warning shawdow');
      selected_date = ""
      selected_type = $(this).val()
    
      $("#calendar_div").hide()
      $("#assign_de_form").hide()
     
      console.log($("#calendar_div").html());
      
       if($(this).val() == "Production") 
       {
        $("#calendar_div").show()
        $("#assign_de_form").hide()
       

        $("#assign_date").modal('show');
       }
       else if ($(this).val() == "Finshed") 
       {
       
        $("#calendar_div").hide()
        $("#assign_de_form").show()
        $("#assign_date").modal('show');
       }
      
    
       });

       $('#order_list').on('input', '.pro_qty', function() {
        console.log($(this).data('max_qty'));
        if($(this).val() > $(this).data('max_qty') || $(this).val() <= 0)
        {
          if($(this).val() != "")
          $(this).val($(this).data('max_qty'))
        }
       });
       
       
       $('#order_list').on('click', 'button', function() {
       if($(this).children().hasClass("fa-regular"))
{
  is_emergency = 1
  $(this).children().removeClass("fa-regular")
  $(this).children().addClass("fa-solid")
}
else
{
  is_emergency = 0
  $(this).children().removeClass("fa-solid")
  $(this).children().addClass("fa-regular  ")
}
        console.log($(this).children().attr("class"));
        
       
       }); 

       $('#assign_de_btn').on('click', function() {
        console.log($("#godown").val() );
        
if($("#godown").val() != "" && $("#godown").val() !=null)
{
  $("#assign_date").modal('hide');
  shw_toast("Info","Godown : "+ $('#godown option:selected').text(),"",true)
}

else
shw_toast("Error","Please Enter Description","error")

       });


       $('#production_table').on("click","tr",function()
      {
      
        
        if ($(this).hasClass("selected")) {
edit_mode = ""
          $(this).removeClass("selected");

         if($("#production_div").hasClass("d-none")) 
         {
          $("#production_div").addClass("d-flex")
          $("#production_div").removeClass("d-none")
         }
         
       
         if($("#production_mod_div").hasClass("d-flex")) 
         {
          $("#production_mod_div").addClass("d-none")
          $("#production_mod_div").removeClass("d-flex")
         }
         

      } else {

        edit_mode = "mod"
         
        $('#production_table tr').removeClass("selected");
          $(this).addClass("selected");
     
      opid =  $(this).data("opid")
      old_date = $(this).data("dated")
      $('#max_qty').text($(this).data("qty"))

          if($("#production_div").hasClass("d-flex")) 
          {
            $("#production_div").addClass("d-none")
            $("#production_div").removeClass("d-flex")
          }
           
         
           if($("#production_mod_div").hasClass("d-none")) 
           {
            $("#production_mod_div").addClass("d-flex")
            $("#production_mod_div").removeClass("d-none")
           }
           
         
      }
        
      })
     

      
$("#assign_date_mod_btn").on("click",function(){
  if ($('#production_mod_date').val() !== "" && $('#mod_qty').val() !== "")
    {
console.log(old_date);

console.log(opid);
modify_assign_product();
    } 
    
 

  else
shw_toast("Invalid","Enter Date and Qty","")
})

$('#mod_qty').on('input', function() {
  console.log($('#max_qty').text());
  if(parseInt($(this).val()) > parseInt($('#max_qty').text()) || parseInt($(this).val() <= 0))
  {
    if($(this).val() != "")
    $(this).val($('#max_qty').text())
  }
 });

});

// function modify_assign_product()
// {
 

// $.ajax({
//   url: "php/modify_assign_product.php",
//   type: "get", //send it through get method
//   data: {
//     opid : opid,
//     dated : old_date,
//     qty : $('#mod_qty').val(),
//     ins_date : $('#production_mod_date').val()
//   },
//   success: function (response) {
//   console.log(response);
  
   

//   if (response.trim() == "ok") {
//     shw_toast("Success","Product Assigned","success")
//     $('#production_table').empty()
//      get_cal_assign_report(selected_date)
//     old_date = ""
//     opid = ""
//     edit_mode = ""
//       $('#max_qty').html("0")
//     $('#mod_qty').val("")
//     $('#production_mod_date').val("")
//       if($("#production_div").hasClass("d-none")) 
//          {
//           $("#production_div").addClass("d-flex")
//           $("#production_div").removeClass("d-none")
//          }
         
       
//          if($("#production_mod_div").hasClass("d-flex")) 
//          {
//           $("#production_mod_div").addClass("d-none")
//           $("#production_mod_div").removeClass("d-flex")
//          }
//   // Destroy the calendar
//   calendar.destroy();

//   // Show the spinner
//   $('#spinner').removeClass('d-none');
//   calendar.render(); 
//   // Re-render the calendar after a slight delay to allow spinner visibility
//   setTimeout(() => {
//     $('#spinner').addClass('d-none');
//   // Re-render after spinner hides
//   }, 1000); // 
//     }



    
//   },
//   error: function (xhr) {
//       //Do Something to handle error
//   }
// });



   
// }

function modify_assign_product()
{
 

$.ajax({
  url: "php/modify_assign_product_approve.php",
  type: "get", //send it through get method
  data: {
    emp_id : current_user_id,
    opid : opid,
    dated : old_date,
    qty : $('#mod_qty').val(),
    ins_date : $('#production_mod_date').val()
  },
  success: function (response) {
  console.log(response);
  
   

  if (response.trim() == "ok") {
    shw_toast("Success","Product Modification requested","success")
    $('#production_table').empty()
    get_cal_assign_report(selected_date)
    old_date = ""
    opid = ""
      $('#max_qty').html("0")
    edit_mode = ""
    $('#mod_qty').val("")
    $('#production_mod_date').val("")

     if($("#production_div").hasClass("d-none")) 
         {
          $("#production_div").addClass("d-flex")
          $("#production_div").removeClass("d-none")
         }
         
       
         if($("#production_mod_div").hasClass("d-flex")) 
         {
          $("#production_mod_div").addClass("d-none")
          $("#production_mod_div").removeClass("d-flex")
         }
  // Destroy the calendar
  calendar.destroy();

  // Show the spinner
  $('#spinner').removeClass('d-none');
  calendar.render(); 
  // Re-render the calendar after a slight delay to allow spinner visibility
  setTimeout(() => {
    $('#spinner').addClass('d-none');
  // Re-render after spinner hides
  }, 1000); // 
    }



    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}

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

function get_cal_assign_report(cal_date)
{
 

$.ajax({
  url: "php/get_cal_assign_report.php",
  type: "get", //send it through get method
  data: {

  dated : cal_date

  },
  success: function (response) {
    $('#production_table').empty()

   console.log(response);
   
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;

     
     $('#production_table').append(" <tr data-opid ='"+obj.opid+"'   data-dated ='"+cal_date+"'  data-qty ='"+obj.aqty+"'  class='small'> <td  style='max-width: 50px;'>"+ count + "</td> <td style='max-width: 150px;'>"+obj.customer+"</td> <td>"+obj.product+"</td> </tr>")
 if(parseInt(obj.modify_qty)>0)
 {
  $('#production_table tr:last').find("td").eq(2).append(obj.date_info);

 }

 $("#report_date").text(
  selected_date
    ? new Date(selected_date).toLocaleDateString('en-GB')
    : ""
)
 })

}
else{
  $('#production_table') .append("<tr class = 'small text-bg-secondary'><td colspan='5' scope='col'>No Data</td></tr>");

}
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   
}


function highlightSelectedDate(dateStr) {
  var selectedDateEl = document.querySelector('[data-date="' + dateStr + '"]');
  if (selectedDateEl) {
    selectedDateEl.classList.add('fc-day-selected');
  }
}

function get_calender_assign(sdate,edate)
{

$.ajax({
url: "php/get_assign_cal_details.php",
type: "get", //send it through get method
data: {


astart_date :sdate.split(' ')[0] ,
aend_date : edate.split(' ')[0]
},
success: function (response) {

console.log(response);

if (response.trim() != "error") {

var title = ""
var color = ""
var customClass = ""
if (response.trim() != "0 result") {
 var obj = JSON.parse(response);

// Clear previous events before adding new ones
calendar.getEvents().forEach(event => event.remove());
obj.forEach(function (obj) {
 if(obj.tot == '0')
   {
    title = "0"
    color = "gray"
    customClass = "no_qty"; // Default styling
   }
   else if(obj.tot > 20 ){
 title = obj.tot
     color = "#008000 "
     customClass = "above_qty"; // Default styling
   }
   else{
    title = obj.tot
     color = "#008000 "
     customClass = "below_qty"; // Default styling
   }
  

     
 calendar.addEvent({
   title: title,
   start: obj.Date,
   color:  'white', // Use color from data or default to blue
   textColor: color, // Text color
   classNames: customClass
});



});

$(".his").fadeToggle(0);
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
function insert_assign_product(opid,qty,selected_type,selected_date)
{
 

$.ajax({
  url: "php/insert_assign_product.php",
  type: "get", //send it through get method
  data: {
  opid : opid,
qty : qty,
selected_type : selected_type,
selected_date : selected_date,
is_emergency : is_emergency,
des : "",
godown : $("#godown").val()

  },
  success: function (response) {

console.log(response);

if (response.trim() == "ok") {
shw_toast("Success","Product Assigned","success")
  get_sales_order_summary()

}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}


function removeHighlightedDates() {
  var highlightedDates = document.querySelectorAll('.fc-day-selected');
  highlightedDates.forEach(function(dayEl) {
    dayEl.classList.remove('fc-day-selected');
  });
}


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



function get_sales_order_summary()
{
 

$.ajax({
  url: "php/get_sales_order_summary.php",
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
     $('#order_list').append(" <li class=' list-group-item m-0 p-0'> <table class='table table-bordered table-sm m-0 p-0'> <tbody> <tr  class='text-bg-primary small '> <td class = 'small'> <span class='me-2'><i class='fa fa-user' aria-hidden='true'></i></span>"+obj.cus_name+"</td> <td colspan='2' class='text-end small'> <span><i class='fa fa-phone me-2' aria-hidden='true'></i></span> "+obj.cus_phone+"</td> </tr> <tr> <td style='max-width: 120px;'class='small'><span><i class='fa fa-id-badge me-2' aria-hidden='true'></i></span>"+obj.emp_name+"</td> <td class='small' style='max-width: 120px;'>"+obj.order_no+"</td> <td class='small text-end'> "+obj.date_f+"</td> </tr> <tr> <td colspan = '3' class='small m-0 p-0'>  <ul class='list-group m-0 p-0' >"+ obj.product_list+"</ul> </td></tr> </tbody> </table> </li>") 
  });

  calendar.destroy()
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

  
  //  function shw_toast(title,des,theme)
  //  {
   
     
  //        $('.toast-title').text(title);
  //        $('.toast-description').text(des);
  //  var toast = new bootstrap.Toast($('#myToast'));
  //  toast.show();
  //  }  

   function shw_toast(title, des, theme,hide) {
    if(hide === undefined)
      hide = true
    $('.toast-title').text(title);
    $('.toast-description').text(des);
    
    var toastElement = $('#myToast');
    var toast = new bootstrap.Toast(toastElement, {
        autohide: hide // Prevent automatic hiding
    });

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

function format_date_mysql(date)
{
 let formattedDate = date.getFullYear() + '-' + 
 ('0' + (date.getMonth() + 1)).slice(-2) + '-' + 
 ('0' + date.getDate()).slice(-2) + ' ' + 
 ('0' + date.getHours()).slice(-2) + ':' + 
 ('0' + date.getMinutes()).slice(-2) + ':' + 
 ('0' + date.getSeconds()).slice(-2);
return formattedDate

}

function format_date_start(date)
{
 let date_temp = new Date(date);
 let startOfDay = new Date(date_temp.getFullYear(), date_temp.getMonth(), date_temp.getDate(), 0, 0, 0);
 return startOfDay
}

function format_date_end(date)
{
 let date_temp = new Date(date);
 let endOfDay = new Date(date_temp.getFullYear(), date_temp.getMonth(), date_temp.getDate(), 23, 59, 59);
 return endOfDay
}