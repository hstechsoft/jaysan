

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
  firebase.initializeApp(firebaseConfig);
  var cus_id = '0';
  var urlParams = new URLSearchParams(window.location.search);
  var phone_id = urlParams.get('phone_id');
  
$(document).ready(function(){

 

 get_employee_single();
 
 


 
  
 






   });
   //


 
  



 
   function get_employee_single()
   {

  

$.ajax({
  url: "php/get_employee_info.php",
  type: "get", //send it through get method
  data: {
   
    phone_id : phone_id
},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {
    if (response.trim() != "0 result")
    {
  var obj = JSON.parse(response);



  obj.forEach(function (obj) {
  
    $("#emp_name").text(obj.emp_name);
    $("#emp_email").text(obj.emp_email);
    $("#emp_phone_id").text(obj.emp_phone_id);
    $("#emp_approve").text(obj.emp_approve);
  
   
  });

  
}
else
{
$("#emp_table").empty();
    $("#emp_table").append(" <tr> <td scope='col'>App Code</td> <td scope='col'><p id=''>"+phone_id+ "</p></td> </tr><tr><td  colspan='2'>For existing users to login to this app, kindly share the app code with your admin.</td></tr>");
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