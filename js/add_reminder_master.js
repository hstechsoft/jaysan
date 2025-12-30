
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
  var cus_id = '0';
$(document).ready(function(){


  check_login();
  get_all_reminder();
  
 
   $("#unamed").text(localStorage.getItem("ls_uname"))


  
   
   
   $("#reminder_submit_btn").click(function()
   {
    if($('#reminder_form')[0].checkValidity())

    insert_reminder()
   });

   $("#reminder_all_table").on("click","tr td button", function(event) {
    //get button value
    var remind_id = $(this).val()
  
  
  {
  swal({
    title: "Are you sure - Delete? ",
    text: "You will not be recover this Product again!",
    icon: "warning",
    buttons: [
      'No, cancel it!',
      'Yes, I am sure!'
    ],
    dangerMode: true,
  }).then(function(isConfirm) {
    if (isConfirm) {
      swal({
        title: 'Applied!',
        text: 'successfully Deleted!',
        icon: 'success'
      }).then(function() {
        
        delete_reminder(remind_id) // <--- submit form programmatically
        
       
      });
    } else {
      swal("Cancelled", "lead is safe :)", "error");
    }
  })
  }
  
        });

  


   });
   //

  
   function delete_reminder(remind_id)
   {
      
       $.ajax({
           url: "php/delete_reminder.php",
           type: "get", //send it through get method
           data: {
            remind_id: remind_id
          },
           success: function (response) {
          console.log(response);
          
          if (response.trim() != "error") {
    
            if (response.trim() != "0 results") {
           
          
                  location.reload()
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
 
  

   function insert_reminder()
   {
   

$.ajax({
  url: "php/insert_reminder.php",
  async :false,
  type: "get", //send it through get method
  data: {
 
    reminder_days : $('#due_date').val(),
    reminder_name : $('#reminder_name').val(),
    reminder_before :$('#remind_in').val() ,
    repeat_sts : $('#repeat :selected').val()
    
},
  success: function (response) {

   console.log(response);

window.location.reload();

    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }
   function get_all_reminder(){
   
      $.ajax({
        url: "php/get_all_reminder.php",
        type: "get", //send it through get method
        data: {
        
       
       },
        success: function (response) {
         console.log(response)
         
       if (response.trim() != "error") {
        if(response.trim() != "0 result")
{
        var obj = JSON.parse(response);
       
  var count =0;
       
        obj.forEach(function (obj) {

 count = count +1;
         $("#reminder_all_table") .append("<tr><td>" + count + "</td><td>" + obj.remind_name + "</td><td>" + obj.reminder_days + "</td><td>" + obj.remind_before + "</td> <td>" + obj.repeat_sts + "</td><td>"+"<button value='"+obj.remind_id + "' type='button' class='btn text-danger' > <i class='fa-solid fa-trash-can'></i></button>"+"</td> </tr> ")
        });
      }
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
      $("#sel_pwork_in").append(" <option value='" + obj.work_type_id + "'>" + obj.work_type_name + "</option>");
  
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