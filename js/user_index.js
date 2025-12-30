
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
  var current_user_name =  localStorage.getItem("ls_uname") ; 
  var selected_caller_name = ""
  var selected_caller_webname = ""
  var selected_caller_phone = ""
$(document).ready(function(){
    check_login();
    get_work_report_detailed();
    get_today_call_all();
    get_call_log();
    get_today_finished_call();
  $("#call_table").hide();
   $("#unamed").text(localStorage.getItem("ls_uname"))
  // $("#tlead_att_on").text(localStorage.getItem("ls_uname"))
  
 

  
 
       $('#phone_call_history').on('click', 'tr td', function(event) {
        //$('#work_table1').find('.text-bg-primary').removeClass('text-bg-primary')
      
       $('.text-bg-primary').removeClass('text-bg-primary')
         $(this).toggleClass('text-bg-primary');
         
         selected_caller_name =  $(this).find('#phonename').text()
         selected_caller_phone =  $(this).find('#phone_number').text()
         selected_caller_webname =  $(this).find('#webname').text()
        
      
        });

{/* <a href="https://api.whatsapp.com/send?phone=9626025240">Send Message</a> */}
 
        $("#call_add_cus_btn").click(function(){
     if(selected_caller_webname == "")
     {
      salert("Warning","Kindly choose Number","warning")
     }
     else if(selected_caller_webname != " No Entry ")
     {
      salert("Warning","already Registered","warning")
      console.log(selected_caller_webname)
     }
     else if(selected_caller_webname == " No Entry "){
      window.open('create_customer.html?phone_no=' + parseFloat(selected_caller_phone) + '&phone_name=' + selected_caller_name, '_blank');
     }
         // 
             }); 
             
             $("#call_whatsapp_btn").click(function(){
              if(selected_caller_webname == "")
              {
               salert("Warning","Kindly choose Number","warning")
              }
              else{
                window.open('https://api.whatsapp.com/send?phone=' + parseFloat(selected_caller_phone), '_blank');
              }
             
                  // 
                      });

    
    $("#user_sts").click(function(){
     
      $("#call_table").toggle();
         }); 
         

   


       


  

   });


 
   function get_call_log()
   {
     $.ajax({
       url: "php/get_call_log.php",
       type: "get", //send it through get method
       data: {
        emp_id_p:current_user_id,
        today_start : get_today_start_millis(),
        today_end : get_today_end_millis()
      
      },
       success: function (response) {
        console.log(response)
        $("#phone_call_history").empty();
      if (response.trim() != "error") {
       var obj = JSON.parse(response);
      
 
      
       obj.forEach(function (obj) {
var webname = "No Entry";
var phonename = "No caller ID"
if( obj.cus_name !=null)
{
webname = obj.cus_name
}


if( obj.call_name !="null")
{
  phonename = obj.call_name
}


        $("#phone_call_history") .append(" <tr> <td> <div class='d-flex justify-content-between mb-1'> <div> <h6 id='webname'> " + webname + " </h6> <p class='small text-danger' id='phonename'><span><i class='fa-solid fa-phone'></i> </span>" + phonename + "</p> </div> <div> <p class='small' id='phone_number'> " + obj.phone_number + " </p> </div> <div><p class='small' id='call_date'> " + millis_to_date(parseFloat(obj.call_date))  + "</p></div> <div><p class='small' id='duration'>  " + obj.call_duration  + "</p></div> <div><p class='small' id='calltype'>  " + obj.call_type  + "</p></div> </div> </td> </tr>")
       });
   
      }
      
      
      
      
         
       },
       error: function (xhr) {
           //Do Something to handle error
       }
      });
   }
   function get_work_report_detailed()
   {
     $.ajax({
       url: "php/work_summary_report.php",
       type: "get", //send it through get method
       data: {
         emp_id:current_user_id,
         start_date : get_today_start_millis(),
         end_date : get_today_end_millis()
      
      },
       success: function (response) {
        console.log(response)
        $("#summary_work_report_table").empty();
      if (response.trim() != "error") {
       var obj = JSON.parse(response);
      
      var count = 0;
      
       obj.forEach(function (obj) {
var work_type ="Lead Creation"
        if (obj.work_type != null)
        {
          work_type = obj.work_type;
        }

      count = count + 1;
        $("#summary_work_report_table") .append("<tr> <td>" + count + " </td> <td>" + work_type+ "</td> <td>" + obj.his_status + "</td> <td>" + obj.total + " </td> </tr>")
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

   

   function get_today_call_all()
   {
     $.ajax({
       url: "php/get_today_call_all.php",
       type: "get", //send it through get method
       data: {
        p_uid_p:current_user_id,
        p_cur_time_p1 : get_today_end_millis()
      
      },
       success: function (response) {
        console.log(response)
        $("#today_call_table_body").empty();
      if (response.trim() != "error") {
       var obj = JSON.parse(response);
      
      var count = 0;
      
       obj.forEach(function (obj) {
      count = count + 1;
        $("#today_call_table_body") .append("<tr> <td>" + count + " </td> <td>" +obj.cus_name + "</td> <td>" +millis_to_date(parseFloat(obj.work_date) ) + "</td> <td>" +obj.work_description + " </td>  <td>" + "<a target='_blank' href='user_call.html?cus_id=" + obj.cus_id + "' class='btn btn-primary btn-sm' role='button'>View</a>" + "</td></tr>")
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
   

   function get_today_finished_call()
   {
     $.ajax({
       url: "php/get_today_finished_call.php",
       type: "get", //send it through get method
       data: {
        emp_id:current_user_id,
        start_date : get_today_start_millis(),
        end_date : get_today_end_millis()
      
      },
       success: function (response) {
        console.log(response)
        $("#today_finished_call_body").empty();
      if (response.trim() != "error") {
       var obj = JSON.parse(response);
      
      var count = 0;
      
       obj.forEach(function (obj) {
      count = count + 1;
         $("#today_finished_call_body") .append("<tr> <td>" + count + " </td> <td>" +obj.cus_name + "</td> <td>" +millis_to_date(parseFloat(obj.his_date) ) + "</td> <td>" +obj.comments + " </td> <td>" +obj.his_status + " </td>  <td>" + "<a target='_blank' href='user_call.html?cus_id=" + obj.cus_id + "' class='btn btn-primary btn-sm' role='button'>View</a>" + "</td></tr>")
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


  //  get today 

 



   
 





   

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