
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
  import { getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword  } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js'
  import { getDatabase, ref, set ,onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

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
var phone_id = urlParams.get('phone_id');




var cus_id = '0';
var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 




$(document).ready(function(){
   

 check_login();
 
   $("#unamed").text(localStorage.getItem("ls_uname"))
  // $("#tlead_att_on").text(localStorage.getItem("ls_uname"))

  $("#coupen_code").focusout(function(){
    check_coupen_no($("#coupen_code").val());
     });
     $("#coupen_entry_btn").click(function()
     {
        insert_coupen(); 
        // swal({
        //     title: "Are you sure?",
        //     text: "You will not be able to recover this imaginary file!",
        //     icon: "warning",
        //     buttons: [
        //       'No, cancel it!',
        //       'Yes, I am sure!'
        //     ],
        //     dangerMode: true,
        //   }).then(function(isConfirm) {
        //     if (isConfirm) {
        //       swal({
        //         title: 'Shortlisted!',
        //         text: 'Candidates are successfully shortlisted!',
        //         icon: 'success'
        //       }).then(function() {
        //         insert_coupen(); // <--- submit form programmatically
        //       });
        //     } else {
        //       swal("Cancelled", "Your imaginary file is safe :)", "error");
        //     }
        //   })

        
     });

   });

   function insert_coupen()
   {  

$.ajax({
  url: "php/insert_coupen.php",
  type: "get", //send it through get method
  data: {
    coupen_code :  $('#coupen_code').val(),
    validity : get_millis($('#validity').val()),
    used_sts : "new",
    discount :  $('#discount').val()

},
  success: function (response) {
    console.log(response)

window.location.reload();


    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }
   
  


   function check_coupen_no(coupen_no)
   {  

$.ajax({
  url: "php/check_coupen.php",
  type: "get", //send it through get method
  data: {
    coupen_no:coupen_no
},
  success: function (response) {
    
    if (response.trim() != "0 result") {
   
      var obj = JSON.parse(response);
     

      obj.forEach(function (obj) {
        salert("warning","Coupen Already inserted" ,"warning")
       
      });
     
  
    }
   

},
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }



   function get_all_product()
   {

  

$.ajax({
  url: "php/get_product_all.php",
  type: "get", //send it through get method
  data: {
   
  
},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {
  var obj = JSON.parse(response);


var count =0 
  obj.forEach(function (obj) {
    var tax = parseFloat(obj.tax_rate)/100
  tax = parseFloat(tax);
  tax = 1 + tax;
   count  = count + 1;

    $("#pro_table").append(" <tr> <td>"+ count + "</td> <td>"+ obj.pname + "</td><td>"+ obj.hsn_code + "</td> <td>"+ obj.tax_rate + "</td> <td>"+ obj.price + "</td> <td>"+  parseFloat(obj.price) * tax + "</td>  <td><a target='_blank' href='product_entry.html?pid="+ obj.pid + "' class='btn btn-primary btn-sm' role='button'>View</a></td> </tr>")

    
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
    
    if (localStorage.getItem("logemail") == null && phone_id == null )  {
     window.location.replace("login.html");
  }
  else if (localStorage.getItem("logemail") == null && phone_id != null )
  {
get_current_userid_byphoneid();
  }

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