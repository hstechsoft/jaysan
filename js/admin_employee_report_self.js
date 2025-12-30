
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
  import { getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword  } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js'

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
   const firebaseConfig = {
    apiKey: "AIzaSyArBOz33-zRE8lMCj7d8mlzytL4hH6OSNQ",
    authDomain: "jaysan-8fa8d.firebaseapp.com",
    databaseURL: "https://jaysan-8fa8d-default-rtdb.firebaseio.com",
    projectId: "jaysan-8fa8d",
    storageBucket: "jaysan-8fa8d.appspot.com",
    messagingSenderId: "1077120566221",
    appId: "1:1077120566221:web:17e8bd20996c16bcc8fa84",
    measurementId: "G-6JNJZT1YCV"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  var thismonth = 'UNIX_TIMESTAMP(DATE_FORMAT(NOW() ,"%Y-%m-01"))*1000'
  var thisweek = 'UNIX_TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL(-WEEKDAY(CURDATE())) DAY))*1000'
  var thisyear ='UNIX_TIMESTAMP(DATE_FORMAT(NOW() ,"%Y-01-01"))*1000'
  var last3months = 'UNIX_TIMESTAMP(DATE_SUB(DATE_FORMAT(NOW() ,"%Y-%m-01"), INTERVAL 3 month))*1000'

  var date_query_start = 'UNIX_TIMESTAMP(CURDATE())*1000'
var date_query_end = 'UNIX_TIMESTAMP( NOW())*1000'
var att_date_start = millis_to_date_only(get_today_start_millis())
var att_date_end = millis_to_date_only(get_cur_millis())
var current_user_id =  localStorage.getItem("ls_uid") ;
$(document).ready(function(){

  

  check_login();
  
//   get_employee();
  get_work_type();
  
 
   $("#unamed").text(localStorage.getItem("ls_uname"))
 
   $('#today_radio').change(function() {
    if(this.checked) {
    date_query_start = 'UNIX_TIMESTAMP(CURDATE())*1000'

    console.log(millis_to_date_only(get_cur_millis()))
    }
    get_work_report_detailed()

get_lead_report(); 
 att_date_start = millis_to_date_only(get_today_start_millis())
 att_date_end = millis_to_date_only(get_cur_millis())
get_emp_att_report()

});

    $('#thisweek_radio').change(function() {
      if(this.checked) {
        date_query_start = thisweek
        var now = new Date(); // Current date
var dayOfWeek = now.getDay(); // Get the day of the week (0 - Sunday, 1 - Monday, ..., 6 - Saturday)
var daysSinceMonday = (dayOfWeek + 6) % 7; // Calculate days since Monday (0 for Monday, 1 for Tuesday, ..., 6 for Sunday)
var firstDayOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysSinceMonday); // Calculate the date for the Monday of the current week
var firstDayOfWeekMillis = firstDayOfWeek.getTime(); // Get timestamp for the first day of the week

att_date_start = millis_to_date_only(firstDayOfWeekMillis)
      }
      get_work_report_detailed()

get_lead_report(); 

 get_emp_att_report();
 
 
   });

      $('#thismonth_radio').change(function() {
        if(this.checked) {
          date_query_start = thismonth
          //first day of current month 
          var now = new Date(); // Current date
 
 var firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Set the day of the month to 1
 var firstDayOfMonthMillis = firstDayOfMonth.getTime(); 

 att_date_start = millis_to_date_only(firstDayOfMonthMillis)
        }
        get_work_report_detailed()

get_lead_report(); 
get_emp_att_report()    


});
        $('#l3months_radio').change(function() {
          if(this.checked) {
            date_query_start = last3months
          }
          get_work_report_detailed()

get_lead_report();        });

 
          $('#thisyear_radio').change(function() {
            if(this.checked) {
              date_query_start = thisyear
            }
            get_work_report_detailed()

get_lead_report();          });
   $("#report_search_btn").click(function()
   {
    if($('#search_form')[0].checkValidity())
    {
      date_query_start = "'"+  get_millis($('#search_start_date').val()) + "'"
      date_query_end = "'"+  get_millis($('#search_end_date').val())+ "'"
      get_work_report_detailed();
      get_lead_report();
      att_date_start =  millis_to_date_only(get_millis($('#search_start_date').val()))
      att_date_end = millis_to_date_only(get_millis($('#search_end_date').val()))
      get_emp_att_report();
   
    }

//get_lead_report();
   });
  

   $('#sel_usr_in').change(function() {
    get_work_report_detailed();
    get_lead_report();
    get_emp_att_report()
     });



   });


   function get_emp_att_report()
   {
    // if($('#sel_usr_in :selected').val() == 0)
    // return
   
   $.ajax({
     url: "php/get_emp_att_report.php",
     type: "get", //send it through get method
     data: {
     emp_id :current_user_id,
astart_date : att_date_start,
aend_date : att_date_end

     },
     success: function (response) {
   console.log(response)
   
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
      $('#atten_report_tbl').empty()
     var obj = JSON.parse(response);
   var count =0 
   
   var Datev = ""
   var Att = ""
   var report = ""

   var tp_txt = 0
   var ta_txt = 0
   var tpa_txt = 0
   var to_txt = 0
   var sum_txt = 0
   
     obj.forEach(function (obj) {
        count = count +1;
        if(obj.Att_time_formatted == null)
        Att = " - "
      else
      Att =obj.Att_time_formatted
    if(obj.att_report == 'present')
    tp_txt = tp_txt + 1
  else if(obj.att_report == 'absent')
  ta_txt = ta_txt + 1
  else if(obj.att_report == 'partial')
  tpa_txt = tpa_txt + 1
if(obj.total_time != null)
  sum_txt = sum_txt + parseFloat(obj.total_time)
$('#atten_report_tbl').append("<tr><td>"+count+"</td><td style='max-width: 100px;'>"+obj.Date+"</td><td style='max-width: 100px;'>"+Att+"</td><td style='max-width: 100px;'>"+obj.att_report+"</td><td style='max-width: 250px;'>"+obj.time_history+"</td></tr>")

     });
   
     $('#tp_txt').html(tp_txt)
     $('#ta_txt').html(ta_txt)
     $('#tpa_txt').html(tpa_txt)
     $('#to_txt').html(count)
     var att_millis = parseFloat(sum_txt) // Milliseconds

// Convert milliseconds to hours, minutes, and seconds



var milliseconds = (att_millis);

var totalSeconds = milliseconds
var hours = Math.floor(totalSeconds / 3600);
var minutes = Math.floor((totalSeconds % 3600) / 60);
var seconds = Math.floor(totalSeconds % 60);

        console.log('Hours: ' + hours + ', Minutes: ' + minutes + ', Seconds: ' + seconds);

     $('#sum_txt').html('Total App Working time <br/> ' + hours + ' Hrs : ' + minutes + ' Mins: ' + seconds  + ' Sec')
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


   function get_lead_report()
   {
    
     $.ajax({
       url: "php/lead_report.php",
       type: "get", //send it through get method
       data: {
         emp_id:current_user_id,
         start_date :date_query_start,
         end_date : date_query_end
      
      },
       success: function (response) {
        console.log(response)
        $("#detailed_work_table").empty();
      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
       var obj = JSON.parse(response);
      
      var count = 0;
      var sts =""
       obj.forEach(function (obj) {
      count = count + 1;
      
      sts =   obj.work_type + "   - " + obj.work_status + " - " + obj.work_com_status
        $("#detailed_work_table") .append("<tr><td>"+count+"</td><td>"+obj.cus_name+"</td><td>"+obj.work_des+"</td><td>"+obj.cur_work+"</td><td>"+obj.comments+"</td><td>"+obj.lead_date+"</td><td>"+obj.report+"</td></td><td>" + "<a target='_blank' href='user_call.html?cus_id=" + obj.cus_id + "' class='btn btn-primary btn-sm' role='button'>View</a>" + "</td></tr>")
       });
      
       
      
    
      }
      else{
        $("#detailed_work_table").append(" <tr><td colspan='10' scope='col' class='text-bg-danger h6'>Sorry no data!</td></tr>")
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
   function get_work_report_detailed()
   {
    var sdate =  get_today_start_millis();
    var edate = get_today_end_millis()

    // if($('#search_start_date').val()!="" && $('#search_end_date').val() !="" )
    // {
    //   sdate = get_millis($('#search_start_date').val())
    //   edate = get_millis($('#search_end_date').val())
    // }
     $.ajax({
       url: "php/work_report_detailed.php",
       type: "get", //send it through get method
       data: {
         emp_id:current_user_id,
         start_date :date_query_start,
         end_date : date_query_end
      
      },
       success: function (response) {
        console.log(response)
        $("#detailed_work_report_table").empty();
      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
       var obj = JSON.parse(response);
      
      var count = 0;
      
       obj.forEach(function (obj) {
      count = count + 1;
        $("#detailed_work_report_table") .append("<tr> <td>" + count + " </td> <td>" + millis_to_date(parseFloat(obj.his_date) )+ "</td> <td>" + obj.work_description + "</td> <td>" +obj.STATUS + " </td> <td>" + obj.comments+ "</td> <td>" + obj.work_type + "</td>  <td>" + "<a target='_blank' href='user_call.html?cus_id= " + obj.cus_id + "' class='btn btn-primary btn-sm' role='button'>View</a>" + "</td></tr>")
       });
      
       
      
    
      }
      else{
        $("#detailed_work_report_table").append(" <tr><td colspan='7' scope='col' class='text-bg-danger h6'>Sorry no data!</td></tr>")
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

   function get_work_type()
  {
$.ajax({
 url: "php/get_work_type.php",
 type: "get", //send it through get method
 data: {
 
  

},
 success: function (response) {


if (response.trim() != "error") {
 var obj = JSON.parse(response);



 obj.forEach(function (obj) {
     
   
    $("#work_type_list").append(" <option value='" + obj.work_type_id + "'>" + obj.work_type_name + "</option>");

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
    
    if (localStorage.getItem("logemail") == null) {
      window.location.replace("login.html");
  }
   }

  
   function millis_to_date_only( millis)
   {
   console.log(millis)
     if(millis != 0)
     {
       var d = new Date(millis); // Parameter should be long valu
       var d = new Date(millis);
       var year = d.getFullYear();
       var month = ('0' + (d.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() returns zero-based month
       var day = ('0' + d.getDate()).slice(-2);
       var formattedDate = year + '-' + month + '-' + day;
       
       return formattedDate;
     }
     else
     {
       return ''
     }
     
   
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