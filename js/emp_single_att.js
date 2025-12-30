


  var cus_id = '0';
  
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ;  
  var urlParams = new URLSearchParams(window.location.search);
  var phone_id = urlParams.get('phone_id');
  var sel_emp_id = urlParams.get('emp_id');
 var csdate = ""
 var cedate = ""
  let currentDate = new Date();
let currentDate_day = new Date();
let currentDate_week = new Date();
var date_start = format_date_start(currentDate)
var date_end = format_date_end(currentDate)
var calendar = ""
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
get_attendance()
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
   calendar.addEvent({
      title: "1800",
      start: '2024-10-18',
      color:  'gray', // Use color from data or default to blue
      textColor:  'white' // Text color
  });
});


$(document).ready(function(){


  
  $('#reportTabs button').on('shown.bs.tab', function (e) {

    switch (e.target.id) {
      case 'daily-tab':
        date_start = format_date_start(currentDate)
        date_end = format_date_end(currentDate)
        $("#daily_date").text(get_today_date_only(currentDate))
        $("#total_works").text("0")
        get_attendance()
       
        break;
        case 'weekly-tab':
          displayCurrentWeek();
          $("#total_works").text("0")
          get_attendance()
                 break;
      case 'custom-tab':
        $("#attendance").empty()
        $('#custom_date_form')[0].reset();
        $("#total_works").text("0")
  $('#custom_date').text("")
        break;
      case 'calender-tab':  // Both cases perform the same action
          calendar.render(); // Re-render calendar
          $("#attendance").empty()
          $("#total_works").text("0")
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
  
  $(".his").fadeToggle(0);
  $("#home_btn").click(function()
  {
   window.location.href =  "emp_single_detail.html?phone_id=" +phone_id  
  });
 
 
   check_login();
  //  

 

   

$("#attendance").on('click', '.show_history', function() {


  $(this).closest(".list-group-item").find(".his").fadeToggle(350); 
  
 $(this).closest("button").find("i").toggleClass("fa-caret-down fa-caret-up");
 $(this).closest(".list-group-item").siblings(".list-group-item").fadeToggle(250);

 
});
 
   $("#unamed").text(localStorage.getItem("ls_uname"))

   $("#daily_date").text(get_today_date_only(currentDate))
  
  
   $('#daily_pre_btn').on('click', function()
   {
    
   addDays(-1)
  
   });

   $('#custom_date_btn').on('click', function()
   {
    if($('#custom_date_form')[0].checkValidity())
      {
 

 
  date_start =  (format_date_start($('#fromDate').val()))
  date_end =  (format_date_end($('#toDate').val()))


  $('#custom_date').text(format_date_mysql(date_start)+ " to " + format_date_mysql (date_end))
  get_attendance()
      }
   });

   $('#daily_nxt_btn').on('click', function()
   {
   
   addDays(1)
   
 
   });

   $('#weekly_nxt_btn').on('click', function()
   {
    
    currentDate_week.setDate(currentDate_week.getDate() + 7);
displayCurrentWeek()



   });

   $('#weekly_pre_btn').on('click', function()
   {
    
    currentDate_week.setDate(currentDate_week.getDate() - 7);
    displayCurrentWeek()
    
   });

   });
   //

   function get_calender_attendance(sdate,edate)
   {

 
$.ajax({
  url: "php/get_admin_emp_att_report_cal.php",
  type: "get", //send it through get method
  data: {
   
  emp_id : current_user_id,
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
    if(obj.att_report == "Ab")
      {
       title = obj.att_report
       color = "red"
      }
      else if(obj.att_report == "Pa"){
    title =obj.att_report
       color = "gray"
      }
      else if(obj.att_report == "Pr"){
       title = obj.att_report
          color = "#008000 "
         }
if(obj.req != "")
{
  title =  obj.att_report + "("+ obj.req + ")"
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
    get_attendance()
  }

  function getStartOfWeek(date) {
    let dayOfWeek = date.getDay();
    let diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when Sunday (0)
    return new Date(date.setDate(diff));
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
    get_attendance()
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
        get_attendance()
    }
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
    if (response.trim() != "0 result" )
        {
     var obj = JSON.parse(response);
   
   
   
     obj.forEach(function (obj) {
     
       

       $("#sel_usr_in").append(" <option value='" + obj.emp_id + "'>" + obj.emp_name + "</option>");
   
        
   
     });
   
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
      
      get_attendance()
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

  
   function get_today_cstatus_sql()
   {

  

$.ajax({
  url: "php/get_employee_cur_sts.php",
  type: "get", //send it through get method
  data: {
   
  emp_id : current_user_id
},
  success: function (response) {
console.log(response);


if (response.trim() != "error") {
  var obj = JSON.parse(response);


var count =0 
  obj.forEach(function (obj) {
  
   count  = count + 1;
   if(obj.status == 'present')
 $("#user_status_table").append(" <tr class = 'text-bg-primary' > <td>" + count + "</td> <td>" + obj.emp_name + "</td> <td>" + obj.emp_phone + "</td> <td>" + obj.status + "</td> <td> <a target='_blank' href='work_summary_report.html?emp_id=" + obj.emp_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td><td> <a target='_blank' href='map_ref1.html?phone_id=" + obj.emp_phone_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td></tr>")
else if(obj.status == 'logout')
$("#user_status_table").append(" <tr class = 'text-bg-warning' > <td>" + count + "</td> <td>" + obj.emp_name + "</td> <td>" + obj.emp_phone + "</td> <td>" + obj.status + "</td> <td> <a target='_blank' href='work_summary_report.html?emp_id=" + obj.emp_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td><td> <a target='_blank' href='map_ref1.html?phone_id=" + obj.emp_phone_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td></tr>")
else
$("#user_status_table").append(" <tr > <td>" + count + "</td> <td>" + obj.emp_name + "</td> <td>" + obj.emp_phone + "</td> <td>" + obj.status + "</td> <td> <a target='_blank' href='work_summary_report.html?emp_id=" + obj.emp_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td><td> <a target='_blank' href='map_ref1.html?phone_id=" + obj.emp_phone_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td></tr>")


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

   function get_attendance()
   {

console.log(format_date_mysql(date_start));


$.ajax({
  url: "php/get_admin_emp_att_report.php",
  type: "get", //send it through get method
  data: {
   
  emp_id : current_user_id,
  astart_date :format_date_mysql(date_start) ,
  aend_date : format_date_mysql(date_end)
},
  success: function (response) {
console.log(response);

    $("#attendance").empty()
    
 $("#total_works").text("0")
if (response.trim() != "error") {
 

  if (response.trim() != "0 result") {
    var obj = JSON.parse(response);
   
var count =0 
var emp_name = ""
  obj.forEach(function (obj) {
  
   count  = count + 1;

   var date_color = ""
   var date_icon = ""
   var att_color = "text-success"
   var att_report = ""
    if(obj.att_report === "present" || obj.att_report ==="partial" )
    {
      att_report = "On Duty"
    }
    else
    {
      att_report = "Leave"
    } 
    if(obj.req != "" )
      {
        att_report = att_report + " ("+ obj.req + ")"
      }
     

if(att_report == "Leave")
{
 
 att_color = "text-danger";
 
}
  
  
$("#attendance").append(" <div class='list-group-item list-group-item-action flex-column '> <div class='d-flex justify-content-between'> <div><h6>"+ obj.att_report+ "</h6></div><div><p class='text-muted'>"+ obj.Date+ "</p></div> </div> <p class='mb-1 small'>Working Hours : "+ obj.Att_time_formatted+ "</p> <div class='d-flex justify-content-between align-items-center shadow-sm '> <div class=''> <p class='"+ att_color + " mb-0'> "+att_report+"</p> </div> <div> <button class='btn btn-light show_history'><i class='fa-solid fa-caret-down' aria-hidden='true'></i></button> </div> </div> <div class='list-group his shadow-sm mt-1' style='max-height: 60vh; overflow-y: auto;'> <div href='#' class='list-group-item list-group-item-action flex-column align-items-start'> <p class='mb-1 small text-muted'> "+ obj.time_history+ " </p> </div> </div> </div>")
emp_name = obj.emp_name

  });

 $("#total_works").text(count)
  $(".his").fadeToggle(0);
  $("#selected_usr_txt").text(emp_name)
}
else
{
  $("#attendance").append(" <div class='text-bg-secondary p-3 d-flex justify-content-center'><h6 class=''>No Work</h6> </div>")
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

   function get_today_date_only1(){
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    var hour = date.getHours();
    var mins = date.getMinutes();
  


    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
 
    var today = day + "-" + month + "-" + year ; 
    return today;
   }

   function get_today_date_only(date)
   {
    

    // Function to format date as DD-MM-YYYY
    
      let day = String(date.getDate()).padStart(2, '0');
      let month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
      let year = date.getFullYear();
      return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
    
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