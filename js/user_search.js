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
  var cus_id_g="";

  
  var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var cus_id = urlParams.get('cus_id');



var work_id = '0'
var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ;  
var current_android_id ="";
var selected_android_id ="";
$(document).ready(function(){

  check_login();
  get_employee();
  get_today_call_sql();
  get_android_id();
  
  $("#work_table").hide();
  $("#lead_table_body").hide();
    $("#work_schdule_table").hide();
    $("#work_schdule_table_all").hide();
   $("#unamed").text(localStorage.getItem("ls_uname"))
  // $("#tlead_att_on").text(localStorage.getItem("ls_uname"))
  
  //$("#sdate_in").attr("value", get_today_date);

  
$('#sel_usr_in').on('change', function() {
    
  if ($(this).find(":selected").val()!="0")
  {
    
    get_site_visit_work($(this).find(":selected").val());
    get_site_visit_work_all($(this).find(":selected").val());
  }
 
 
});

$('#work_table1').on('click', 'tbody tr td', function(event) {
  //$('#work_table1').find('.text-bg-primary').removeClass('text-bg-primary')

 $('.text-bg-primary').removeClass('text-bg-primary')
   $(this).toggleClass('text-bg-primary');
   
   work_id =  $(this).find('#work_table_work_id').html();
get_history_sql( $(this).find('#work_table_work_id').html());
$("#work_schdule_table").slideUp();
$("#work_schdule_table_all").slideUp();
$("#history_table").slideDown();
  });


  $('#sdate_in').on('change', function() {
    if(($('#sel_usr_in').find(":selected").val())!="0")
    get_site_visit_work($('#sel_usr_in').find(":selected").val());
    get_site_visit_work_all($('#sel_usr_in').find(":selected").val());
    });







$("#lead_header").on("click", function()
{
  $("#lead_table_body").toggle();


});

$("#work_table_header").on("click", function()
{
  $("#work_table").toggle();
  $("#work_schdule_table").slideUp();
  $("#work_schdule_table_all").slideUp();
  $("#history_table").slideDown();
  $("#lead_table_body").hide();
});

$("#web_call_btn").on("click", function()
{
  

  const db = getDatabase();
  set(ref(db, 'web_call/' + current_android_id), {
    
    phone_no:  $("#tphone").text(),
    action : "call"
  
  });
  
  
});

   $("#call_btn").click(function(){
    update_work_sql();
        
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
      
  if (localStorage.getItem("logemail") == null && phone_id == null )  {
    window.location.replace("login.html");
 }
 else if (localStorage.getItem("logemail") == null && phone_id != null )
  {
get_current_userid_byphoneid();
  }
   }

   

   function get_android_id_by_userid(userid)
   {
     $.ajax({
       url: "php/get_android_id.php",
       type: "get", //send it through get method
       data: {
         emp_id:userid,
        
      
      },
       success: function (response) {
      
      console.log(response)
      if (response.trim() != "error") {
       var obj = JSON.parse(response);
      
      
      
       obj.forEach(function (obj) {
         selected_android_id = obj.emp_phone_id;
         
       });
      console.log(selected_android_id)
       const db = getDatabase();
    set(ref(db, 'notify/' + selected_android_id), {
      
      notification: "site Work assigned on - " + millis_to_date(get_millis($("#sdate_in").val())),
      
    
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

  
   function get_android_id()
   {
     $.ajax({
       url: "php/get_android_id.php",
       type: "get", //send it through get method
       data: {
         emp_id:current_user_id,
        
      
      },
       success: function (response) {
      
      
      if (response.trim() != "error") {
       var obj = JSON.parse(response);
      
      
      
       obj.forEach(function (obj) {
         current_android_id = obj.emp_phone_id;
         
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
  

   function get_today_call_sql()
   {

 console.log(get_today_end_millis());

$.ajax({
  url: "php/get_today_call_user.php",
  type: "get", //send it through get method
  data: {
   cus_id : cus_id

},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {


  if(response.trim() != "0 results")
  {

    $("#work_show").show();
    $("#no_work_show").hide();
    var obj = JSON.parse(response);

 

    obj.forEach(function (obj) {
        console.log(obj);
        $("#tname").text(obj.cus_name);
        $("#phone_cus").text(obj.cus_name);
    
        $("#tphone").text(obj.cus_phone);
  
        $("#phone_call1").text(obj.cus_phone);
        
        $("#tstatus").text(obj.work_status);
  
  
        $("#tsegment").text(obj.cus_segment);
        $("#tlocation").text(obj.cus_location);
  
  
        $("#tlead_att_on").text(obj.cus_lead_on);
        $("#tlead_source").text(obj.cus_lead_source);
        $("#tlead_att_by").text(obj.cus_lead_by);
  
  work_id = obj.work_id;
        
  console.log(obj.work_id)
        get_history_sql(obj.work_id)
        get_work_sql(obj.cus_id)
  
        cus_id_g = obj.cus_id;
  
      
    });
  }

else{
  $("#work_show").hide();
  $("#no_work_show").show();


  $("#create_cus_link").attr("href", "create_customer.html?phone_no=" + phone_no);
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


   function get_site_visit_work_all(emp_id)
   {
   
   $.ajax({
     url: "php/get_site_visit_work_all.php",
     type: "get", //send it through get method
     data: {
       emp_id: emp_id,
       start_time : get_date_only_start($("#sdate_in").val()),
       end_time : get_date_only_end($("#sdate_in").val()),
      
   },
     success: function (response) {
   
   $("#site_work_table_all").empty();
   
   if (response.trim() != "error") {
    
     if(response.trim() !="0 result")
     {
       var obj = JSON.parse(response);
     
       var count = 0;
      
       obj.forEach(function (obj) {
         count = count+1;
   
   
         $("#site_work_table_all").append("  <tr><td > " + count + " </td><td class='text-nowrap' >" + obj.emp_name  + " - " +  millis_to_date(parseFloat(obj.work_date)) + "</td><td >" + obj.work_location + "</td></tr>")
     
     
       });
   
       
     }
     else{
    
       $("#site_work_table").append("<tr> <td colspan='3'>No Work  </td> </tr>");
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
   
   function get_site_visit_work(emp_id)
   {
   
   $.ajax({
     url: "php/get_site_visit_work.php",
     type: "get", //send it through get method
     data: {
       emp_id: emp_id,
       start_time : get_date_only_start($("#sdate_in").val()),
       end_time : get_date_only_end($("#sdate_in").val()),
      
   },
     success: function (response) {
   
   $("#site_work_table").empty();
   
   if (response.trim() != "error") {
     $("#history_table").slideUp()
     $("#work_schdule_table").slideDown()
     $("#work_schdule_table_all").slideDown()
     if(response.trim() !="0 result")
     {
       var obj = JSON.parse(response);
     
       var count = 0;
      
       obj.forEach(function (obj) {
         count = count+1;
   
   
         $("#site_work_table").append("  <tr><td > " + count + " </td><td class='text-nowrap' >" + millis_to_date(parseFloat(obj.work_date)) + "</td><td >" + obj.work_location + "</td></tr>")
     
     
       });
   
       
     }
     else{
    
       $("#site_work_table").append("<tr> <td colspan='3'>No Work  </td> </tr>");
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

   function get_work_sql(cus_id)
{

console.log(cus_id);

$.ajax({
  url: "php/get_work_mcall.php",
  type: "get", //send it through get method
  data: {
    cus_id: cus_id,
   
},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {
  var obj = JSON.parse(response);

  console.log(obj);
  var count = 0;

  obj.forEach(function (obj) {
    count = count+1;
    var date_color = ""
    var date_icon = ""
   

    if(obj.work_com_status =="incomplete"){
     
        if(parseFloat(obj.work_date) < get_cur_millis()){
            date_color = "text-danger";
            date_icon = "fa-calendar-xmark";
                }
                else{
                  date_color = "text-success";
                  date_icon = "fa fa-clock-o";
                }
    }
    else
    {
        date_color = "text-success";
        date_icon = "fa fa-check-circle";
    }
    


$("#work_table").append(" <tr> <td> <div class='visually-hidden'><p id='work_table_work_id'>"+obj.work_id + "</p></div> <div class='d-flex justify-content-between mb-2'> <div><h6 class='small m-0 p-0'>" +obj.work_type + "</h6> </div><div><p class='small m-0 p-0'>" + millis_to_date(parseFloat(obj.work_date)) + "</p></div> </div><p class='small text-start'>" + obj.work_description + "</p><div class='d-flex justify-content-between'> <div><h6 class='m-0 p-0 " + date_color + "'><i class='fa-solid " + date_icon + "'></i></h6> </div><div><p class=' small m-0 p-0'>" + obj.emp_name + "</p></div> </div> </td> </tr>");

    
 
   // $("#work_table").append(" <button value='"+ work_edit + "' id='" + obj.work_id + "' class=' de1'> <div class='d-flex justify-content-between'> <div> <h6 class='text-primary' id='work_type_txt'>" +obj.work_type + "</h6> </div> <div> <p class='fw-bold' id='work_date_txt'>" + millis_to_date(parseFloat(obj.work_date)) + "</p> </div> </div> <p class='small' id='work_des_txt'>" + obj.work_description + "</p> <div class='d-flex justify-content-between'> <div> <h6 class='text-danger' id='work_exp_txt'>" + "Expired" + "</h6> </div> <div> <p class='fw-bold' id='work_by_txt'>" + "Harishkumar" + "</p> </div> </div> </button>")






  });

  $("#total_works").text(count)
 
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
  url: "php/get_history.php",
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
  $("#thist").empty();
  obj.forEach(function (obj) {
    count = count+1;


 
    $("#thist").append("  <tr><td > " + count + " </td><td class='text-nowrap' >" + millis_to_date(parseFloat(obj.his_date)) + "</td><td >" + obj.comments + "</td></tr>")






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


function insert_site_visit_sql()
   {
   

$.ajax({
  url: "php/insert_work.php",
  type: "get", //send it through get method
  data: {

    emp_id : $('#sel_usr_in').find(":selected").val(),
    work_date  :get_millis($("#sdate_in").val()),
    cus_id  : cus_id_g,
    work_created_by  : current_user_id,
    work_assign_status  : "pending",
    work_type  : "site_visit",
    work_status  :"",
    work_description  :  $("#remarks_in").val(),
    work_location  : $("#work_location_textbox").val(),
    work_attachment  : "",
    work_com_status  : "incomplete",
    last_att : get_cur_millis,
    his_status :"",
    his_comment : "work assigned by - " + current_user_name,
    his_emp_id : ""

},
  success: function (response) {
    get_android_id_by_userid($('#sel_usr_in').find(":selected").val());

salert("Success","site visit assigned","success")

    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }

   function update_work_sql()
   {
    var work_date = ""
    var status = ""
    var work_com_status = ""
    if($("#status_in").val() == 3)
    insert_site_visit_sql();


    if($("#status_in").val() == 2 || $("#status_in").val() == 4 || $("#status_in").val() == 5)   {

       status = "Incoming call  - " + $("#status_in :selected").text()  + " - "+ $("#remarks_in").val() + " so work is reschudled  to " + millis_to_date(get_millis($("#sdate_in").val())) + " by " + current_user_name +  " on " + get_today_date();
     work_date =  get_millis($("#sdate_in").val());
     work_com_status = "incomplete"
    }
    else if($("#status_in").val() == 0)
    {
      status = "Incoming call  - " + $("#status_in :selected").text()  + " - "+ $("#remarks_in").val() + " so work is reschudled  to " + millis_to_date(get_millis($("#sdate_in").val())) + " by " + current_user_name +  " on " + get_today_date();
     work_date =  get_millis($("#sdate_in").val());
     work_com_status = "incomplete"
    }
    else
    {
      status= "Incoming call  - " + $("#status_in :selected").text() + " - "+ $("#remarks_in").val()  + " so work Finished by " + current_user_name +  " on " + get_today_date();
      work_date = get_cur_millis();
      work_com_status = "complete"

    }
    console.log(status);

    $.ajax({
      url: "php/update_work_mcall.php",
      type: "get", //send it through get method
      data: {
        work_id_p : work_id,
        his_date_p : get_millis($("#sdate_in").val()),
        last_att_p: get_cur_millis(),
        remark_p: status,
        work_date_p : work_date,
        work_com_status : work_com_status,
         cus_id: cus_id_g,
         his_comment : "work assigned by - " + current_user_name,
         his_status : $("#status_in :selected").text() + "/",
         his_emp_id : current_user_id
    
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