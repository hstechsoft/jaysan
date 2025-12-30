
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

$(document).ready(function(){
  var filePath ="";

  var cus_id_g="";
  $("#call_table").hide();
   $("#unamed").text(localStorage.getItem("ls_uname"))
  // $("#tlead_att_on").text(localStorage.getItem("ls_uname"))
  
  $("#sdate_in").attr("value", get_today_date);


 
  $('#cus_upload_in').on('change',function ()
  {
    var filename= $(this).val();


        filePath = filename.replace(/^.*\\/, "");
    
       console.log(filename);
  });

  $("#img_call").on("click", function()
  {
    var pn = $(phone_call1).text();


    window.open('tel:' + pn);
  });
  
  $('#cus_upload_btn').click('change',function ()
  {
       if(filePath =="" ||  $("#sel_usr_in").val()=="Select User..." )
       {
        salert("Error", "Please Choose File and select user", "warning");
       }
       else{
console.log($("#sel_usr_in").val());

 s="upload\\" + filePath;


         upload_cus_sql(s );
       }
    
  });


  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {

      form.addEventListener('submit', function (event) {
       
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
        else{
         
         
          event.preventDefault()
          console.log(form.id);
      
          var a = form.id + '_php';
          window[a]()
        }

        form.classList.add('was-validated')
      }, false)
    })


    
    $("#user_sts").click(function(){
     
      $("#call_table").toggle();
         }); 
         

  $("#call_btn").click(function(){
insert_mcall_sql();
    
   }); 
   


   $("#login_btn").click(function(){
    if( $("#username").val() == "admin@gmail.com"   &&   $("#password").val() == "654321")
   {

localStorage.setItem("ls_uid", '2')
localStorage.setItem("ls_uname", 'user1')

window.location.href = 'admin_index.html';
   }

   
  
  else{
   login_firebase();
  }
        
       }); 
       


  

   });

   function login_firebase()
   {
     
   
   
   
       var email = $("#username").val();
       var password = $("#password").val();
   
       const auth = getAuth();
       signInWithEmailAndPassword (auth, email, password)
     .then((userCredential) => {
       // Signed in 
       const user = userCredential.user;
       // ...
       console.log(user.uid);
       localStorage.setItem("logemail", email);
       window.location.replace("user_index.html");
     })
     .catch((error) => {
       const errorCode = error.code;
       const errorMessage = error.message;
       // ..
   
   
       console.log(errorMessage);
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
  url: "upload_cus.php",
  type: "get", //send it through get method
  data: {
    file_location : filepath1,
    sel_user:  $("#sel_usr_in").val(),
    sel_user_name: "upload by  -" + localStorage.getItem("ls_uname")

},
  success: function (response) {


    location.reload();


    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }



   function login_form_php()
   {
var arr = $('#login_form').serialize();
console.log(arr )

$.ajax({
  url: "php/demo.php",
  type: "get", //send it through get method
  data: $('#login_form').serialize(),
  success: function (response) {
console.log(response)
    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});


   }


  //  get today 

   function get_today_status_sql()
   {

    check_login();
console.log(get_today_start_millis());
console.log(get_today_end_millis());
$.ajax({
  url: "get_today_status.php",
  type: "get", //send it through get method
  data: {
    p_uid_p: localStorage.getItem("ls_uid"),
    p_cur_time_p1 : get_cur_millis(),
    today_start_p : get_today_start_millis(),
    today_end_p : get_today_end_millis()
},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {
  var obj = JSON.parse(response);



  obj.forEach(function (obj) {
  
    var login_status_color = "bg-success"

    var per = parseInt((obj.a_calls/obj.t_calls)*100);

    $("#user_sts").append("<div class='card text-center shadow border-1 bg-success bg-opacity-25 rounded-3 position-relative my-3'> <div class='row py-3 align-items-center'><div class='col-3'> <figure class='figure my-auto'> <img src='img/user.jfif' class='figure-img img-fluid rounded-circle w-25' alt=''> <figcaption class='figure-caption'> " + obj.user_name + "</figcaption>  </figure> </div> <div class='col-3'> <h6>Total  Calls</h6>  <h6>" + obj.t_calls + " </h6></div><div class='col-3'> <h6>Attended Calls</h5>  <h6> " + obj.a_calls + " </h6><div class='progress w-75 mx-auto'> <div class='progress-bar' role='progressbar' style='width:" +  per +"%;' aria-valuenow='25' aria-valuemin='0' aria-valuemax='100'> " + per + "%</div> </div> </div> <div class='col-3'> <h6 class=''>Missed Calls</h6>  <h6>" + obj.m_calls + "</h6> </div> </div><div class='position-absolute top-0 start-100 translate-middle'><span class='dot " +  login_status_color +  "'> </span></div></div>");



  });

 
}

else {
  salert("Error", "User ", "error");
}

get_today_call_table_sql()
    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   }

   function get_today_call_table_sql()
   {

 

$.ajax({
  url: "get_today_call_table.php",
  type: "get", //send it through get method
  data: {
    p_uid_p: localStorage.getItem("ls_uid"),
    p_cur_m: get_cur_millis(),
    cst : get_today_start_millis(),
    cet : get_today_end_millis
},
  success: function (response) {
console.log(response)
var count = 1;
if (response.trim() != "error") {
  var obj = JSON.parse(response);


 
  obj.forEach(function (obj) {
  
var cmillis = get_cur_millis();
var tsmillis = get_today_start_millis();
var tstmillis = get_today_end_millis();

var stdate = obj.his_date;
var stlast = obj.last_att;

var tsts="d"

if(stdate < cmillis)
{
tsts = "Missed"
$("#thist").append("  <tr><td > " + count + " </td><td>" + obj.cus_name + "</td><td >" + obj.cus_phone + "</td><td >" + obj.segment + "</td></td><td >" +  millis_to_date(parseFloat(obj.his_date)) + "</td><td >" +  millis_to_date(parseFloat(obj.last_att)) + "</td> <td >" +  tsts + "</td>  </tr>")

count = count+1;
}
if (stdate >= tstmillis  && (stlast > tsmillis && stlast <= tstmillis)  ) {
  {
    tsts = "Attend"
    $("#thist").append("  <tr><td > " + count + " </td><td>" + obj.cus_name + "</td><td >" + obj.cus_phone + "</td><td >" + obj.segment + "</td></td><td >" +  millis_to_date(parseFloat(obj.his_date)) + "</td><td >" +  millis_to_date(parseFloat(obj.last_att)) + "</td> <td >" +  tsts + "</td>  </tr>")
    count = count+1;

  }
} 

 if(stdate > cmillis && stdate <= tstmillis)
{
  tsts = "ip";
  $("#thist").append("  <tr><td > " + count + " </td><td>" + obj.cus_name + "</td><td >" + obj.cus_phone + "</td><td >" + obj.segment + "</td></td><td >" +  millis_to_date(parseFloat(obj.his_date)) + "</td><td >" +  millis_to_date(parseFloat(obj.last_att)) + "</td> <td >" +  tsts + "</td>  </tr>")

  count = count+1;
}

  
   


console.log(millis_to_date(parseFloat(obj.his_date))  + " - "+  millis_to_date(parseFloat(obj.last_att)));




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


   
   function get_today_cstatus_sql()
   {

  

$.ajax({
  url: "get_today_cstatus.php",
  type: "get", //send it through get method
  data: {
    p_uid_p: 2,
    p_cur_time_p1 : get_cur_millis(),
    p_te_p1 : get_today_end_millis,
    p_ts_p1 : get_today_start_millis()
},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {
  var obj = JSON.parse(response);



  obj.forEach(function (obj) {
  
    var login_status_color = "bg-success"

    var per = parseInt((obj.a_calls/obj.t_calls)*100);

    $("#user_sts").append("<div class='card text-center shadow border-1 bg-success bg-opacity-25 rounded-3 position-relative my-3'> <div class='row py-3 align-items-center'><div class='col-3'> <figure class='figure my-auto'> <img src='img/user.jfif' class='figure-img img-fluid rounded-circle w-25' alt=''> <figcaption class='figure-caption'> " + obj.user_name + "</figcaption>  </figure> </div> <div class='col-3'> <h6>Total  Calls</h6>  <h6>" + obj.t_calls + " </h6></div><div class='col-3'> <h6>Attended Calls</h5>  <h6> " + obj.a_calls + " </h6><div class='progress w-75 mx-auto'> <div class='progress-bar' role='progressbar' style='width:" +  per +"%;' aria-valuenow='25' aria-valuemin='0' aria-valuemax='100'> " + per + "%</div> </div> </div> <div class='col-3'> <h6 class=''>Missed Calls</h6>  <h6>" + obj.m_calls + "</h6> </div> </div><div class='position-absolute top-0 start-100 translate-middle'><span class='dot " +  login_status_color +  "'> </span></div></div>");



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


   function get_today_call_sql()
   {

  

$.ajax({
  url: "get_today_call.php",
  type: "get", //send it through get method
  data: {
    p_uid_p: localStorage.getItem("ls_uid"),
    p_cur_time_p1 : get_cur_millis(),
    p_ts_p1 : get_today_start_millis(),
    p_te_p1 : get_today_end_millis(),

},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {
  var obj = JSON.parse(response);

 

  obj.forEach(function (obj) {
      console.log(obj);
      $("#tname").text(obj.cus_name);
      $("#phone_cus").text(obj.cus_name);

      $("#tphone").text(obj.cus_phone);

      $("#phone_call1").text(obj.cus_phone);
      
      $("#tstatus").text(obj.status);


      $("#tsegment").text(obj.segment);
      $("#tlocation").text(obj.location);


      $("#tlead_att_on").text(obj.lead_att_on);
      $("#tlead_source").text(obj.lead_source);
      $("#tlead_att_by").text(obj.lead_att_by);


      $("#tss_assign_to").text(obj.ss_assigned_to);
      $("#tss_on").text(obj.appoinment_date);
      

      get_history_sql(obj.cus_id)

      cus_id_g = obj.cus_id;

     //get_history_sql();
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

function get_history_sql(cus_id)
{



$.ajax({
  url: "get_history.php",
  type: "get", //send it through get method
  data: {
    cus_id_p: cus_id,
   
},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {
  var obj = JSON.parse(response);

  console.log(obj);
  var count = 0;

  obj.forEach(function (obj) {
    count = count+1;


 
    $("#thist").append("  <tr><td > " + count + " </td><td class='text-nowrap' >" + millis_to_date(parseFloat(obj.hdate)) + "</td><td >" + obj.remark + "</td></tr>")






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



   function insert_mcall_sql()
   {
    var sts = 'nip';
    if($("#status_in").val() ==2){

sts='nip'
    }

$.ajax({
  url: "insert_mcall.php",
  type: "get", //send it through get method
  data: {
  call_status_p : sts,
  cus_id_p : cus_id_g,
  his_date_p : get_millis($("#sdate_in").val()),
  last_att_p: get_cur_millis(),
  user_id_p : localStorage.getItem("ls_uid"),
  remark_p: $("#remarks_in").val()

},
  success: function (response) {
    location.reload();




    
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