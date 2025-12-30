
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
$(document).ready(function(){
  check_login();

 // get_candidate_report();


 
   $("#unamed").text(localStorage.getItem("ls_uname"))
 

   $("#qualification_add_btn").click(function(){


 $("#qualification_tbody").append(" <tr><td>" + $("#qualification").val() + "</td></tr>");
 $("#qualification").val("");
 $("#qualification").focus();
   });
   
   $("#qualification_clear_btn").click(function(){
    $("#qualification_tbody").empty();
   });
  

   $("#tech_skills_add_btn").click(function(){
    $("#tech_skills_tbody").append(" <tr><td>" + $("#tech_skills").val() + "</td></tr>");
    $("#tech_skills").val("");
    $("#tech_skills").focus();
      });
      
      $("#tech_skills_clear_btn").click(function(){
       $("#tech_skills_tbody").empty();
      });
  

      
   $("#exp_add_btn").click(function(){
    $("#exp_tbody").append(" <tr><td>" + $("#exp").val() + "</td></tr>");
    $("#exp").val("");
    $("#exp").focus();
      });
      
      $("#exp_clear_btn").click(function(){
       $("#exp_tbody").empty();
      });


           
   $("#gender_add_btn").click(function(){
    $("#gender_tbody").append(" <tr><td>" + $("#gender").val() + "</td></tr>");
    $("#gender").val("");
    $("#gender").focus();
      });
      
      $("#gender_clear_btn").click(function(){
       $("#gender_tbody").empty();
      });

      $("#export_btn").click(function(){
        $("#searchtbl").table2excel({
          
          filename: "candiate.xls"
      });
      });


   });
   

   


   function check_login()
   {
    
    if (localStorage.getItem("logemail") == null) {
      window.location.replace("login.html");
  }
   }

   $("#search_btn").click(function()
   {
     var gneral_q = "SELECT * FROM candidate WHERE"
    var full_query = ""
    
if($('#qualification_tbody tr').length >0)
 {
  full_query = full_query + "("
  var query = ""
  var con_op =""
  $("#qualification_tbody tr").each(function (index) {
     
    var this_row = $(this);
 if($('#qualification_tbody tr').length-1 > index)
 {
  con_op = " || "
  console.log(con_op)
 }

 else{
con_op="";
 }
    query = query + "candidate.qualification LIKE '%" + $.trim(this_row.find('td:eq(0)').html()) + "%'"  + con_op  ;
})

full_query = full_query + query + ")"
 }



 if($('#tech_skills_tbody tr').length >0)
 {
  if($('#qualification_tbody tr').length >0) 
  {
    full_query = full_query + " && ("
  }
  else{
    full_query = full_query + "("
  }
  
  var query = ""
  var con_op =""
  $("#tech_skills_tbody tr").each(function (index) {
     
    var this_row = $(this);
 if($('#tech_skills_tbody tr').length-1 > index)
 {
  con_op = " || "

 }

 else{
con_op="";
 }
    query = query + "candidate.tech_skills LIKE '%" + $.trim(this_row.find('td:eq(0)').html()) + "%'"  + con_op  ;
})

full_query = full_query + query + ")"
 }


 if($('#exp_tbody tr').length >0)
 {
  if($('#qualification_tbody tr').length >0 || $('#tech_skills_tbody tr').length >0 ) 
  {
    full_query = full_query + " && ("
  }
  else{
    full_query = full_query + "("
  }
  
  var query = ""
  var con_op =""
  $("#exp_tbody tr").each(function (index) {
     
    var this_row = $(this);
 if($('#exp_tbody tr').length-1 > index)
 {
  con_op = " || "

 }

 else{
con_op="";
 }
    query = query + "candidate.experience >= " + $.trim(this_row.find('td:eq(0)').html())  + con_op  ;
})

full_query = full_query + query + ")"
 }


 
 if($('#gender_tbody tr').length >0)
 {
  if($('#qualification_tbody tr').length >0 || $('#tech_skills_tbody tr').length >0  || $('#exp_tbody tr').length >0) 
  {
    full_query = full_query + " && ("
  }
  else{
    full_query = full_query + "("
  }
  
  var query = ""
  var con_op =""
  $("#gender_tbody tr").each(function (index) {
     
    var this_row = $(this);
 if($('#gender_tbody tr').length-1 > index)
 {
  con_op = " || "

 }

 else{
con_op="";
 }
    query = query + "candidate.gender = '" + $.trim(this_row.find('td:eq(0)').html()) + "'" + con_op  ;
})

full_query = full_query + query + ")"
 }


 gneral_q = gneral_q + full_query;

 if($('#qualification_tbody tr').length >0 || $('#tech_skills_tbody tr').length >0  || $('#exp_tbody tr').length >0 || $('#gender_tbody tr').length >0) 
 {
  get_candidate_report(gneral_q);
 }
 else{
  salert("Enter Value","Please Enter Some Value","warning")
 }
    
   });
    

  
   
   function get_candidate_report(q_text)
   {
    
      $.ajax({
       url: "php/get_candidate_report.php",
       type: "get", //send it through get method
       data: {
         query_text:q_text,
        
      
      },
       success: function (response) {
      console.log(response);
      
      if (response.trim() != "error") {

        if (response.trim() != "0 result") {
       var obj = JSON.parse(response);
      
       var count = 0;
      
       obj.forEach(function (obj) {
        
        count = count + 1;
        $("#search_tbody") .append("<tr> <td>" + obj.candidate_name  + "</td> <td>" + obj.candidate_phone   + "</td> <td>" + obj.qualification  + "</td> <td>" + obj.experience  + "</td> <td>" + obj.address  + "</td> <td>" + obj.email  + "</td> <td>" + obj.tech_skills  + "</td> <td>" + obj.exp_salary  + "</td> <td>" + obj.cur_working_in  + "</td> <td>" + obj.aoi  + "</td> <td>" + obj.gender  + "</td> <td>" + "<a target='_blank' href='https://api.whatsapp.com/send?phone=91" + obj.candidate_phone + "' class='btn btn-primary btn-sm' role='button'><i class='fa-brands fa-whatsapp'></i></a>" + "</td> </tr> ");
       });
      
        }
        else{
          $("#search_tbody") .append("<td colspan='12' scope='col'>No Data</td>");
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