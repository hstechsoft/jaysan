

  var cus_id = '0';
    
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ;  
  var urlParams = new URLSearchParams(window.location.search);
  var emp_id = urlParams.get('emp_id');
var exp_id_array =[]
var current_tab_query = " exp_approve = 'no' "
  var phone_id = urlParams.get('phone_id');
var his_query="SELECT * FROM expense_payment   where emp_id=" + emp_id
var query_exp = "SELECT * FROM expense inner join employee on employee.emp_id = expense.exp_emp_id where exp_emp_id=" + emp_id +" and exp_approve = 'no'"
let currentDate = new Date();
let currentDate_day = new Date();
let currentDate_week = new Date();
var date_start = ""
var date_end = ""
var calendar = ""
var csdate = ""
 var cedate = ""
var date_query = " and 1"
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
    
    dateClick: function(info) {
      // Display the clicked date
      removeHighlightedDates();

      // Highlight the clicked date
      highlightSelectedDate(info.dateStr);

date_end = format_date_end(info.dateStr)
date_start = format_date_start(info.dateStr)

date_query = " and exp_date between UNIX_TIMESTAMP('"+format_date_mysql(date_start)+ "') * 1000 and UNIX_TIMESTAMP('"+format_date_mysql(date_end)+"') * 1000" 

  
  get_expense()
  get_payment_history()
      console.log(format_date_mysql(date_end));
      
     }, // Automatically adjust height

        // This callback is triggered when the visible dates are changed
        datesSet: function(info) {
           csdate = info.startStr; // First visible day of the month
          cedate = info.endStr;     // Last visible day of the month
 
         
         
          // Call your custom function to get the events for the whole month
         get_calender_attendance(format_date_mysql(format_date_start(csdate)),format_date_mysql(format_date_start(cedate)))
        }
    
});
  
});

$(document).ready(function(){
  $('#sel_exp_sts_in').hide()
  
  $('#reportTabs button').on('shown.bs.tab', function (e) {

    switch (e.target.id) {
      case 'unapprove-tab':
         his_query="SELECT * FROM expense_payment   where emp_id=" + emp_id
         query_exp = "SELECT * FROM expense inner join employee on employee.emp_id = expense.exp_emp_id where exp_emp_id=" + emp_id +" and exp_approve = 'no'"
         current_tab_query = " exp_approve = 'no' " 
         $("#sel_exp_sts_in").val("0") 
         get_expense();
         get_payment_history();
         $("#exp_cat_txt").text("Un Approved") 
         $('#sel_exp_sts_in').hide()
         $('#exp_footer').show()
         date_query = " and 1"
        break;
        case 'decline-tab':
          his_query="SELECT * FROM expense_payment   where emp_id=" + emp_id
         query_exp = "SELECT * FROM expense inner join employee on employee.emp_id = expense.exp_emp_id where exp_emp_id=" + emp_id +" and exp_approve = 'decline'"
         current_tab_query = " exp_approve = 'decline' " 
         $("#sel_exp_sts_in").val("0")
         get_expense();
         get_payment_history();
         $("#exp_cat_txt").text("Declined")  
         $('#sel_exp_sts_in').hide()
         $('#exp_footer').show()
         date_query = " and 1"
                 break;
      case 'custom-tab':
        $("#expense_details").empty()
          $("#total_amt").text("0")
         current_tab_query = " 1 "
        $("#attendance").empty()
        $('#custom_date_form')[0].reset();
        $("#total_works").text("0")
  $('#custom_date').text("")
  $('#sel_exp_sts_in').show()
  $('#exp_footer').hide()
  date_query = " and 1"
  his_query="SELECT * FROM expense_payment   where emp_id=" + emp_id
  query_exp = "SELECT * FROM expense inner join employee on employee.emp_id = expense.exp_emp_id where exp_emp_id=" + emp_id +""

        break;
      case 'calender-tab':  // Both cases perform the same action
          his_query="SELECT * FROM expense_payment   where emp_id=" + emp_id
         query_exp = "SELECT * FROM expense inner join employee on employee.emp_id = expense.exp_emp_id where exp_emp_id=" + emp_id +""
      $("#expense_details").empty()
          $("#total_amt").text("0")
      current_tab_query = " 1 "
          calendar.render(); // Re-render calendar
          $("#attendance").empty()
          $("#total_works").text("0")
          $('#sel_exp_sts_in').hide()
          $("#sel_exp_sts_in").val("0")
          $('#exp_footer').hide()
          date_query = " and 1"
          break;
      default:
          // Optional: handle other cases or do nothing
          break;
  }


  

  //   calendar.addEvent({
  //     title: "hi",
  //     start: '2024-10-18',
  //     color:  'blue', // Use color from data or default to blue
  //     textColor:  'white' // Text color
  // });
});

  check_login();
  get_expense();
  get_payment_history();





   $("#unamed").text(localStorage.getItem("ls_uname"))

   $("#search_emp_txt").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#exp_table tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  $('#custom_date_btn').on('click', function()
   {
     
 
    if($('#custom_date_form')[0].checkValidity())
      {
 
date_query = " and exp_date between UNIX_TIMESTAMP('"+format_date_mysql(format_date_start($('#fromDate').val()))+ "') * 1000 and UNIX_TIMESTAMP('"+format_date_mysql(format_date_end($('#toDate').val()))+"') * 1000" 

  $('#custom_date').text( date_start+ " to " +  date_end)
  get_expense()
  get_payment_history()
      }
   });
  
  $('#sel_all_chk').change(function() {
    if(this.checked) {
       
  $("#exp_table_single tr").each(function () {
    
    var this_row = $(this);
this_row.find('td:eq(5) input:checkbox')[0].checked = true
});
    }
    
    else{
        $("#exp_table_single tr").each(function () {
    
            var this_row = $(this);
        this_row.find('td:eq(5) input:checkbox')[0].checked = false
        });
    }
          
});
 
$('#sel_usr_in').change(function() {
  
  if( $('#sel_usr_in').find(":selected").val()>0)
{

  if( $('#sel_exp_sts_in').find(":selected").val() != "0")
  {
    query_exp = "SELECT expense.*,employee.emp_name FROM expense inner join employee on employee.emp_id = expense.exp_emp_id where exp_emp_id=" + $('#sel_usr_in').find(":selected").val ()+ " and exp_approve = '"+ $('#sel_exp_sts_in').find(":selected").val() +"'" 
    
    his_query = "SELECT * FROM expense_payment   where emp_id=" +  $('#sel_usr_in').find(":selected").val ()
    get_payment_history()
    get_expense();
  }
  else{
    query_exp = "SELECT expense.*,employee.emp_name FROM expense inner join employee on employee.emp_id = expense.exp_emp_id where exp_emp_id=" + $('#sel_usr_in').find(":selected").val()  + " and " + current_tab_query
    his_query = "SELECT * FROM expense_payment   where emp_id=" +  $('#sel_usr_in').find(":selected").val ()
    get_payment_history() 
    get_expense();
  }
  $("#selected_usr").text("Employee - " + $('#sel_usr_in').find(":selected").text ());
  emp_id = $('#sel_usr_in').find(":selected").val ()
  get_calender_attendance(format_date_mysql(format_date_start(csdate)),format_date_mysql(format_date_start(cedate)))
}


 });

 $('#sel_exp_sts_in').change(function() {
   var sel_type_query = ""
  
  if( $('#sel_exp_sts_in').find(":selected").val()!= "0")
{

 sel_type_query = " and exp_approve = '"+ $('#sel_exp_sts_in').find(":selected").val()  +"'"

}
else
{
sel_type_query = " and 1"
}

if( $('#sel_usr_in').find(":selected").val() > 0)
  {
    query_exp = "SELECT expense.*,employee.emp_name FROM expense inner join employee on employee.emp_id = expense.exp_emp_id where exp_emp_id=" + $('#sel_usr_in').find(":selected").val ()+ sel_type_query

    his_query = "SELECT * FROM expense_payment   where emp_id="+  $('#sel_usr_in').find(":selected").val ()
    get_payment_history()
    get_expense();
  }
  else{
   
    query_exp = "SELECT expense.*,employee.emp_name FROM expense inner join employee on employee.emp_id = expense.exp_emp_id where exp_emp_id=" + emp_id  + sel_type_query
    
    his_query = "SELECT * FROM expense_payment   where emp_id=" + emp_id
    get_payment_history()
    get_expense();
  }

 });


 $('#custom_date_btn').on('click', function()
 {
 if($('#custom_date_form')[0].checkValidity())
  {


date_start =  (format_date_start($('#fromDate').val()))
date_end =  (format_date_end($('#toDate').val()))


$('#custom_date').text(format_date_mysql(date_start)+ " to " + format_date_mysql (date_end))
console.log(format_date_mysql(date_start) );

  }

 $('#view_history_btn').click(function () {
  $('#history_model').modal('show'); 
  });
});

  
 $('#pay_emp_btn').click(function () {
  $('#emp_pay_model').modal('show'); 
  });


  $('#submit_emp_btn').click(function () {
   insert_emp_pay();
    });


    $('#expense_details').on('click', '.list-group-item', function(event) {
 
      // $('#emp_sa_tbl').find('.text-bg-primary').removeClass('text-bg-primary')
     
       
  
     
      $(this).toggleClass('text-bg-primary');
     
      if ($(this).hasClass("text-bg-primary")) {
      
       exp_id_array.push( $(this).data('exp_id'));
     
       
   }

   else {
       var array_ind = (exp_id_array.indexOf( $(this).find($(this).data('exp_id'))));
       exp_id_array.splice(array_ind, 1);
       

   }
     
       
   console.log(exp_id_array); 
   
        
       
     });
  
 $('#submit_exp_btn').click(function () {
  if(exp_id_array.length <= 0 )
  {
    salert("status","kindly choose expenses","warning")
    return
  }
  else
  update_admin_emp_exp("yes")

  });

  $('#submit_dcln_btn').click(function () {
    if(exp_id_array.length <= 0 )
    {
      salert("status","kindly choose expenses","warning")
      return
    }
    else
    update_admin_emp_exp("decline")
  
    });

   });
   //
 // Function to highlight the selected date




 function highlightSelectedDate(dateStr) {
  var selectedDateEl = document.querySelector('[data-date="' + dateStr + '"]');
  if (selectedDateEl) {
    selectedDateEl.classList.add('fc-day-selected');
  }
}

// Function to remove previous highlights
function removeHighlightedDates() {
  var highlightedDates = document.querySelectorAll('.fc-day-selected');
  highlightedDates.forEach(function(dayEl) {
    dayEl.classList.remove('fc-day-selected');
  });
}



function update_admin_emp_exp(sts)
{


$.ajax({
url: "php/update_admin_emp_exp.php",
type: "POST", //send it through get method
data: {

  exp_id_array : exp_id_array,
sts :sts,

},
success: function (response) {

console.log(response);

if (response.trim() == "ok") {

location.reload()

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

   function get_calender_attendance(sdate,edate)
   {

 
$.ajax({
  url: "php/get_admin_emp_exp_report_cal.php",
  type: "get", //send it through get method
  data: {
   
  emp_id : emp_id,
  astart_date :sdate.split(' ')[0] ,
  aend_date : edate.split(' ')[0]
},
  success: function (response) {

console.log(response);

if (response.trim() != "error") {
 
var title = ""
var color = ""
  if (response.trim() != "0 result") {
    var obj = JSON.parse(response);
  
 // Clear previous events before adding new ones
 calendar.getEvents().forEach(event => event.remove());
  obj.forEach(function (obj) {
    if(obj.amount == null)
      {
       title = "₹ 0"
       color = "gray"
      }
      else if(obj.amount != null){
    title ="₹ " + obj.amount
        color = "#008000 "
      }
     

        
    calendar.addEvent({
      title: title,
      start: obj.Date,
      color:  'white', // Use color from data or default to blue
      textColor: color // Text color
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
   function displayCurrentWeek() {
    let startOfWeek = getStartOfWeek(currentDate_week);
    let endOfWeek = getEndOfWeek(currentDate_week);
 

    date_start = format_date_start(startOfWeek)
    date_end = format_date_end(endOfWeek)
    $('#weekly_date').text(`${get_today_date_only(startOfWeek)} to ${get_today_date_only(endOfWeek)}`);
  }

 
  // Function to get the end of the current week (Sunday)
  function getEndOfWeek(date) {
    let startOfWeek = getStartOfWeek(new Date(date)); // Get start of the week
    return new Date(startOfWeek.setDate(startOfWeek.getDate() + 6)); // Add 6 days to get Sunday
  }

   function addDays(days) {
    currentDate_day.setDate(currentDate_day.getDate() + days);
    date_start = format_date_start(currentDate_day)
    date_end = format_date_end(currentDate_day)
    $("#daily_date").text(get_today_date_only(currentDate_day))
  }
 function insert_emp_pay(){
  var paid_date = 0

  if($("#emp_pay_amount").val()=="")
  {
    salert("Amount","kindly enter Amount","warning")
    return
  }
  else
  {
if ($("#pay_date").val() =="")
{
  paid_date = get_cur_millis();
}
else 
{
  paid_date =  get_millis($("#pay_date").val())
}
  }
  $.ajax({
    url: "php/insert_expense_pay.php",
    type: "get", //send it through get method
    data: {
      emp_id : emp_id,
      paid_amount : $("#emp_pay_amount").val(),
      paid_date : paid_date
  
  },
    success: function (response) {

  
  
   location.reload();
  
  
      
    },
    error: function (xhr) {
        //Do Something to handle error
    }
  });
 }

   function update_expense(exp_id,exp_approve)
   {



$.ajax({
  url: "php/update_expense.php",
  type: "get", //send it through get method
  async : false,
  data: {
    exp_id : exp_id,
    exp_approve : exp_approve
  
},
  success: function (response) {

location.reload()

 


    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }

   function get_employee()
   {
    
   
   $.ajax({
     url: "php/get_all_emp_hi.php",
     type: "get", //send it through get method
     data: {
      emp_id : current_user_id
     
   },
     success: function (response) {
   
   
   
   if (response.trim() != "error") {
   
     var obj = JSON.parse(response);
   
   
   
     obj.forEach(function (obj) {
     
       
       $("#sel_usr_in").append(" <option value='" + obj.emp_id + "'>" + obj.emp_name + "</option>");
   
   
   
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
        
  
        
        
         obj.forEach(function (obj) {
           current_user_id = obj.emp_id;
           current_user_name =  obj.emp_name;
         });
        
         get_employee();
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

  
   function get_expense()
   {



$.ajax({
  url: "php/get_expense_single.php",
  type: "get", //send it through get method
  data: {
   query : query_exp + date_query
  
},
  success: function (response) {
console.log(response);

$("#expense_details").empty();
$("#total_amt").text("0");
if (response.trim() != "error") {
  if (response.trim() != "0 result") {
  var obj = JSON.parse(response);
  

var count =0 
var total_amount = 0
  obj.forEach(function (obj) {
  
   count  = count + 1;

 
var exp_sts = ""
    if(obj.exp_approve == "yes")
    exp_sts  = "Approved"
    else if(obj.exp_approve == "no")
    exp_sts  = "Not Approved"
    else if(obj.exp_approve == "decline")
    exp_sts  = "Declined"
    // $("#expense_details").append(" <tr> <td>"+ count + "</td> <td>"+ millis_to_date(parseFloat(obj.exp_date)) + "</td><td>"+ obj.exp_cat +  " " + obj.exp_des + "</td> <td>"+ obj.exp_amount + "</td> <td>"+ exp_sts + "</td> <td><input class='form-check-input' value = '"+obj.exp_id + "'type='checkbox' value=''> </td> </tr>")
total_amount = total_amount + Number( obj.exp_amount)

        $("#expense_details").append(" <div class='list-group-item list-group-item-action flex-column '  data-exp_id='"+obj.exp_id+"'> <div class='d-flex justify-content-between'> <div> <h6>&#8377;"+ obj.exp_amount + "</h6> </div> <div> <p class='text-muted'>"+ millis_to_date(parseFloat(obj.exp_date)) + "</p> </div> </div> <p class='mb-1'>"+ obj.exp_cat +  " - " + obj.exp_des + "</p> </div>")
    $("#selected_usr").text("Employee - " + obj.emp_name);
  });
  $("#total_amt").text(total_amount);
 
}
else{
 
  $("#expense_details").append("<tr> <td colspan='6'>No Data  </td> </tr>");
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

   function get_payment_history()
   {


$.ajax({
  url: "php/get_expense_single.php",
  type: "get", //send it through get method
  data: {
   query : his_query
  
},
  success: function (response) {

$("#exp_payment_tbl").empty();
if (response.trim() != "error") {
  if (response.trim() != "0 result") {
  var obj = JSON.parse(response);
  

var count =0 
var total =0
  obj.forEach(function (obj) {
  
   count  = count + 1;

  total = total + parseFloat(obj.paid_amount);

   
    $("#exp_payment_tbl").append(" <tr> <td>"+ count + "</td> <td>"+ millis_to_date(parseFloat(obj.paid_date)) + "</td><td>"+ obj.paid_amount+ "</td></tr>")

   
  });

  $("#exp_payment_tbl").append("<tr class='text-bg-warning'> <td colspan='2'> Total Amount </td> <td>" + total + "</td> </tr>" )
}
else{
 
  $("#exp_payment_tbl").append("<tr > <td colspan='4'>No Data  </td> </tr>");
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