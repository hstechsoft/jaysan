
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
  get_employee();
  var filePath ="";


 
   $("#unamed").text(localStorage.getItem("ls_uname"))
 
  $('#cus_upload_in').on('change',function ()
  {
    var filename= $(this).val();
    var property =this.files[0];
    var file_name = property.name;
    var file_extension = file_name.split('.').pop().toLowerCase();



    if(jQuery.inArray(file_extension,['csv','']) == -1){
      alert("Invalid CSV file");
    }

    else{
        var form_data = new FormData();
        form_data.append("file",property);

        $.ajax({
            url:'ref.php',
            method:'POST',
            data:form_data,
            contentType:false,
            cache:false,
            processData:false,
            beforeSend:function(){
            //  $('#msg').html('Loading......');
            console.log('Loading......');
            },
            success:function(data){
              console.log(data);
             // $('#msg').html(data);
            }
          });
        
    }

  


       



        filePath = filename.replace(/^.*\\/, "");
        
       
        console.log(filePath);
  });

  
  $('#cus_upload_btn').click('change',function ()
  {
       if(filePath =="" ||  $("#sel_usr_in").val()=="Select User..." )
       {
        salert("Error", "Please Choose File and select user", "warning");
       }
       else{


 var s="upload\\" + filePath;


         upload_cus_sql(s );
       }
    
  });



  


  

   });


function get_employee()
{
 
$.ajax({
  url: "php/get_employee.php",
  type: "get", //send it through get method
 
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


   function upload_cus_sql(filepath1)
   {
   

$.ajax({
  url: "php/upload_canditate.php",
  type: "get", //send it through get method
  data: {
    file_location : filepath1,
    his_time:get_cur_millis(),
    his_comment :"candidate created by - " + current_user_name,
    his_status : 'excel_upload',
    his_emp_id : current_user_id
    

},

beforeSend:function(){
  //  $('#msg').html('Loading......');
  console.log('Loading......');
  $('#upload_sts_txt').val('Loading......');
  },
  success: function (response) {

console.log(response)
 // location.reload();

 $('#upload_sts_txt').val(response);
    
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