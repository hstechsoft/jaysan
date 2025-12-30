
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
  var current_user_id =  localStorage.getItem("ls_uid") ;
$(document).ready(function(){



  //check_login();



 
//   get_employee();
  get_work_type();
  
   $("#unamed").text(localStorage.getItem("ls_uname"))
 
  
   $("#report_search_btn").click(function()
   {

    var query =""
var sel_usr  = "0";
var sel_wt  = "0";
var sel_sts  = "0";
var sel_wf  = "0";


    if($('#sel_usr_in :selected').val() !="0")
    {
sel_usr ="1"
    }

    if($('#sel_sts_in :selected').val() !="0")
    {
sel_sts ="1"
    }

    if($('#sel_wt_in :selected').val() !="0")
    {
sel_wt ="1"
    }

    if($('#sel_wf_in :selected').val() !="0")
    {
sel_wf ="1"
    }
var rq = ( sel_usr  + sel_wt + sel_sts+ sel_wf)
console.log(rq)
if(rq == "0001")
{
  query =   "SELECT * FROM `work` INNER JOIN employee on work.emp_id = employee.emp_id WHERE work.work_com_status = '" +  $('#sel_wf_in :selected').text() + "'"
}
else if(rq == "0100")
{
  query =   "SELECT * FROM `work` INNER JOIN employee on work.emp_id = employee.emp_id WHERE work.work_type= '" +  $('#sel_wt_in :selected').text() + "'"
}

else if(rq == "0110")
{
  query =   "SELECT * FROM `work` INNER JOIN employee on work.emp_id = employee.emp_id WHERE work.work_type= '" +  $('#sel_wt_in :selected').text() + "'&& work.work_status ='"  +  $('#sel_sts_in :selected').text() + "'"
}

else if(rq == "0111")
{
  query =   "SELECT * FROM `work` INNER JOIN employee on work.emp_id = employee.emp_id WHERE work.work_type= '" +  $('#sel_wt_in :selected').text() + "'&& work.work_status ='"  +  $('#sel_sts_in :selected').text() + "'&& work.work_com_status ='" +   $('#sel_wf_in :selected').text() + "'"
}

else if(rq == "1000")
{
  query =   "SELECT * FROM `work` INNER JOIN employee on work.emp_id = employee.emp_id WHERE work.emp_id= '" +  current_user_id +  "'"
}

else if(rq == "1001")
{
    query =   "SELECT * FROM `work` INNER JOIN employee on work.emp_id = employee.emp_id WHERE work.emp_id= '" +  current_user_id + "'&& work.work_com_status ='"  +  $('#sel_wf_in :selected').text() + "'"
}

else if(rq == "1100")
{
    query =   "SELECT * FROM `work` INNER JOIN employee on work.emp_id = employee.emp_id WHERE work.emp_id= '" +  current_user_id + "'&& work.work_type ='"  +  $('#sel_wt_in :selected').text() + "'"
}

else if(rq == "1101")
{
  query =   "SELECT * FROM `work` INNER JOIN employee on work.emp_id = employee.emp_id WHERE work.emp_id= '" +  current_user_id + "'&& work.work_type ='"  +  $('#sel_wt_in :selected').text() + "'&& work.work_com_status ='" +   $('#sel_wf_in :selected').text() + "'"
}
else if(rq == "1110")
{
  query =   "SELECT * FROM `work` INNER JOIN employee on work.emp_id = employee.emp_id WHERE work.emp_id= '" +  current_user_id + "'&& work.work_type ='"  +  $('#sel_wt_in :selected').text() + "'&& work.work_status ='" +   $('#sel_sts_in :selected').text() + "'"
}
else if(rq == "1111")
{
  query =   "SELECT * FROM `work` INNER JOIN employee on work.emp_id = employee.emp_id WHERE work.emp_id= '" +  current_user_id + "'&& work.work_type ='"  +  $('#sel_wt_in :selected').text() + "'&& work.work_status ='" +   $('#sel_sts_in :selected').text() + "'&& work.work_com_status ='" +  $('#sel_wf_in :selected').text() + "'"
}
else{
    salert("choose Work","kindly choose proper work","warning")
    return
}

get_work_report_detailed(query);
   });
  

   $('#sel_usr_in').change(function() {
    
    
     });

     $('#sel_wt_in').change(function() {
        if( $('#sel_wt_in :selected').val()!="0")
        {
           
        get_work_status($('#sel_wt_in :selected').text());
        }
        
         });
    


   });


   function get_work_report_detailed(query)
   {
    var sdate =  get_today_start_millis();
    var edate = get_today_end_millis()

    if($('#search_start_date').val()!="" && $('#search_end_date').val() !="" )
    {
      sdate = get_millis($('#search_start_date').val())
      edate = get_millis($('#search_end_date').val())
    }
     $.ajax({
       url: "php/work_search.php",
       type: "get", //send it through get method
       data: {
         query:query,
         
      
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
      //   $("#detailed_work_report_table") .append("<tr> <td>" + count + " </td><td>" + obj.emp_name + " </td><td>" + obj.emp_nme + " </td> <td>" + millis_to_date(parseFloat(obj.his_date) )+ "</td> <td>" + obj.work_description + "</td> <td>" +obj.STATUS + " </td> <td>" + obj.comments+ "</td> <td>" + obj.work_type + "</td>  <td>" + "<a target='_blank' href='user_search.html?cus_id= " + obj.cus_id + "' class='btn btn-primary btn-sm' role='button'>View</a>" + "</td></tr>")

      $("#detailed_work_report_table") .append( " <tr><td>" + count + "</td> <td>" + obj.emp_name + "</td> <td>" + millis_to_date(parseFloat(obj.work_date) ) + "</td> <td>" + obj.work_type + "</td> <td>" + obj.work_description + "</td> <td>" + obj.work_status + "</td> <td>" + obj.work_com_status + "</td> <td>" + "<a target='_blank' href='user_call.html?cus_id= " + obj.cus_id + "' class='btn btn-primary btn-sm' role='button'>View</a>" + "</td></tr>");
       });
      
       
      
    
      }
      else{
        $("#detailed_work_report_table").append(" <tr><td colspan='8' scope='col' class='text-bg-danger h6'>Sorry no data!</td></tr>")
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
     
   
    $("#sel_wt_in").append(" <option value='" + obj.work_type_id + "'>" + obj.work_type_name + "</option>");

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

  function get_work_status(work_type)
  {
$.ajax({
 url: "php/get_wstatus.php",
 type: "get", //send it through get method
 data: {
 work_type : work_type
  

},
 success: function (response) {


if (response.trim() != "error") {
 var obj = JSON.parse(response);

var count = 0  
$("#sel_sts_in").empty();
$("#sel_sts_in").append(" <option value='" + 0 + "'>" + "Select Status..." + "</option>");
 obj.forEach(function (obj) {
     count = count + 1
   
    $("#sel_sts_in").append(" <option value='" + count + "'>" + obj.work_status + "</option>");

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