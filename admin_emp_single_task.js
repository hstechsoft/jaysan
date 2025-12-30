


  var cus_id = '0';
  
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ;  
  var urlParams = new URLSearchParams(window.location.search);
  var phone_id = urlParams.get('phone_id');
  console.log(current_user_id)
  let currentDate = new Date();
let currentDate_day = new Date();
let currentDate_week = new Date();
$(document).ready(function(){

 
   check_login();
   displayCurrentWeek();
 
//    $('#reportTabs button').on('shown.bs.tab', function (e) {
//     currentDate = new Date();
//     console.log(currentDate);
//     get_today_date_only()
    
//   });
 
   $("#unamed").text(localStorage.getItem("ls_uname"))

   $("#daily_date").text(get_today_date_only(currentDate))
   $('#daily_pre_btn').on('click', function()
   {
    
   addDays(-1)
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
   function displayCurrentWeek() {
    let startOfWeek = getStartOfWeek(currentDate_week);
    let endOfWeek = getEndOfWeek(currentDate_week);
    console.log(currentDate_week);
    
    $('#weekly_date').text(`${get_today_date_only(startOfWeek)} to ${get_today_date_only(endOfWeek)}`);
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
    $("#daily_date").text(get_today_date_only(currentDate_day))
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
        get_today_cstatus_sql();
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
      
       get_today_cstatus_sql
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
console.log(response)

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