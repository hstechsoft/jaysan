  // Import the functions you need from the SDKs you need
 
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
  import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
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
 
var urlParams = new URLSearchParams(window.location.search);
var work_id = urlParams.get('work_id');


$(document).ready(function(){

    if(work_id != null)
    {
        get_attchment(work_id);
    }
   });
  
 


  //  get today 

   

   


   


   




function get_attchment(work_id)
{



$.ajax({
  url: "php/get_work_attachment.php",
  type: "get", //send it through get method
  data: {
    work_id: work_id,
   
},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {



  if((response.trim() != "0 result"))
  {


  
    var obj = JSON.parse(response);

    var count = 0;
  
    obj.forEach(function (obj) {
      count = count+1;
      var date_color = ""
      var date_icon = ""
     
  
  var fname = obj.attach_location.substring(obj.attach_location.lastIndexOf('/')+1);
      var attch_type = obj.attach_type;
if(attch_type == "image")
{
    
   $("#attch").append("<div class='card '> <div class='card-header text-bg-secondary text-center'> <h6>"+ fname + "</h6> </div> <div class='card-body mx-auto'> <a href='"+ obj.attach_location +"'> <img id='' class='img-fluid' style='width: 10rem;' src='"+ obj.attach_location +"' alt></a> </div> </div>");

}
else if(attch_type == "video")
{
      
   $("#attch").append(" <div class='card '> <div class='card-header text-bg-secondary text-center'> <h6>"+ fname + " </h6> </div> <div class='card-body mx-auto ' > <div class='embed-responsive embed-responsive-1by1 ' > <a href='"+ obj.attach_location +"'> <img id='' class='img-fluid' style='width: 10rem;' src='img/Video.png' alt></a> </div> </div> </div>")
}

else if(attch_type == "pdf")
{
      
   $("#attch").append(" <div class='card '> <div class='card-header text-bg-secondary text-center'> <h6>"+ fname + " </h6> </div> <div class='card-body mx-auto ' > <div class='embed-responsive embed-responsive-1by1 ' > <a href='"+ obj.attach_location +"'> <img id='' class='img-fluid' style='width: 10rem;' src='img/PDF.png' alt></a> </div> </div> </div>")
}


else if(attch_type == "other")
{
      
   $("#attch").append(" <div class='card '> <div class='card-header text-bg-secondary text-center'> <h6>"+ fname + " </h6> </div> <div class='card-body mx-auto ' > <div class='embed-responsive embed-responsive-1by1 ' > <a href='"+ obj.attach_location +"'> <img id='' class='img-fluid' style='width: 10rem;' src='img/attachment.png' alt></a> </div> </div> </div>")
}

  
  
      
    });
 
 
  }

  else{
  
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


   function get_date_only_start(dates){
    var date = new Date(dates);

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
   
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
 
    var today_start = year + "-" + month + "-" + day +"T00:00"; 
    
    return get_millis(today_start);
   
   }


   function get_date_only_end(dates){
    var date = new Date(dates);

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
   
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
 
    var today_start = year + "-" + month + "-" + day +"T23:59:59"; 
    
    return get_millis(today_start);
   
   }


   function get_today_date(){
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    var hour = date.getHours();
    var mins = date.getMinutes();
  
    var today = year + "-" + month + "-" + day +"T"+ hour + ":"+ mins; 
    console.log(mins);

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
        onClose: reload_here        // Removed () from here
   }).then(function () {

    });
}


function reload_here(){
location.reload();
}
function millis_to_date( millis)
{
  var d = new Date(millis); // Parameter should be long value

  
return d.toLocaleString('en-GB');

}