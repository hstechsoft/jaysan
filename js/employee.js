

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
  var current_user_id =  localStorage.getItem("ls_uid") ;
$(document).ready(function(){


  check_login();
 get_all_employee();
 
 
   $("#unamed").text(localStorage.getItem("ls_uname"))


 
  


   });
   //
 


   function check_login()
   {
    
    if (localStorage.getItem("logemail") == null) {
      window.location.replace("login.html");
  }
   }

  
   function get_all_employee()
   {

  

$.ajax({
  url: "php/get_all_emp_hi.php",
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

    // $("#user_sts").append("<div class='card text-center shadow border-1 bg-success bg-opacity-25 rounded-3 position-relative my-3'> <div class='row py-3 align-items-center'><div class='col-3'> <figure class='figure my-auto'> <img src='img/user.jfif' class='figure-img img-fluid rounded-circle w-25' alt=''> <figcaption class='figure-caption'> " + obj.user_name + "</figcaption>  </figure> </div> <div class='col-3'> <h6>Total  Calls</h6>  <h6>" + obj.t_calls + " </h6></div><div class='col-3'> <h6>Attended Calls</h5>  <h6> " + obj.a_calls + " </h6><div class='progress w-75 mx-auto'> <div class='progress-bar' role='progressbar' style='width:" +  per +"%;' aria-valuenow='25' aria-valuemin='0' aria-valuemax='100'> " + per + "%</div> </div> </div> <div class='col-3'> <h6 class=''>Missed Calls</h6>  <h6>" + obj.m_calls + "</h6> </div> </div><div class='position-absolute top-0 start-100 translate-middle'><span class='dot " +  login_status_color +  "'> </span></div></div>");
    $("#user_status_table").append(" <tr> <td>"+ count + "</td> <td>"+ obj.emp_name + "</td><td>"+ obj.emp_code + "</td> <td>"+ obj.emp_phone + "</td> <td>"+ obj.emp_role + "</td> <td>"+ obj.emp_phone_id + "</td> <td>"+ obj.emp_approve + "</td> <td><a target='_self' href='employee_single.html?emp_id="+ obj.emp_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td> </tr>")


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