
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
var work_cus_id = urlParams.get('work_cus_id');



var cus_id = '0';
var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ;  
var his_comment = "work created"

$(document).ready(function(){
 

  $("#assign_others_hide").hide();
 check_login();
 get_work_type();
 get_employee();
 
 $('#work_attachment').on('change',function ()
  {
    var filename= $(this).val();
    var property =this.files[0];

    var file_name = property.name;
    var file_extension = file_name.split('.').pop().toLowerCase();
{
        var form_data = new FormData();
        form_data.append("file",property);

        $.ajax({
            url:'upload_work_attachment.php',
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
             salert("Upload Result",data,"success")
            }
          });
        
    }

         var filePath = filename.replace(/^.*\\/, "");
         
        console.log(filePath);
  });
 


 $('#sel_usr_in').change(function() {
var trlength = $('#work_select_employee_table tr').length;
  if( $('#sel_usr_in').find(":selected").val()>0)
{
  $("#work_select_employee").append(" <tr> <td >"+ trlength+"</td> <td>" + $('#sel_usr_in').find(":selected").text()+ "</td> <td>" + $('#sel_usr_in').find(":selected").val()+ "</td> </tr> ");

  $('#selected_user_count_txt').text(trlength)
  
}

 });


 $('#work_user_selectall_checkbox').change(function() {
  if(this.checked) {
  get_all_employee();
  }
  else
  {
    $("#work_select_employee").empty();
    $('#selected_user_count_txt').text("0")

  }
    
});
 

 $('#assigntoothers_checkbox').change(function() {
  if(this.checked) {
    $("#assign_others_hide").show();
  }
  else

  $("#assign_others_hide").hide();      
});



$("#create_work_btn").click(function()
   {
    //create_work();
  
    if($('#assigntoothers_checkbox').is(":checked"))
    {
      var count =0;
      var rowCount = $('#work_select_employee_table tr').length-1;
      $("#work_select_employee_table tr:gt(0)").each(function () {
        count = count+1;
        var this_row = $(this);
       
        var emp_id_p = $.trim(this_row.find('td:eq(2)').html())
        var emp_name_p = $.trim(this_row.find('td:eq(1)').html())
his_comment = "work created by " + current_user_name + " and assigned to " + emp_name_p
var reload_p="";

if (count >= rowCount)
{
  reload_p="yes";
}
else{
  reload_p="no";
}



create_work("pending",emp_id_p,his_comment,reload_p,"assign")
    });
   
    

    
    }
    else
    {
      //create_work(); 
      his_comment = "work created by " + current_user_name 
      var reload_p="yes";
     
      create_work("accept",current_user_id,his_comment,reload_p,"create");
      
    }
   });
 
$("#selected_clear_btn").click(function()
   {
   
    $("#work_select_employee").empty();
    $('#selected_user_count_txt').text("0");
    $('#work_user_selectall_checkbox').prop('checked', false);
   });
 
   $("#unamed").text(localStorage.getItem("ls_uname"))
  // $("#tlead_att_on").text(localStorage.getItem("ls_uname"))

 

//change autocomplete source when text box changes
  $('#work_for_text').on('input',function(e){

    if($('#work_for_text').val() !="")
    {
      $('#work_for_text').autocomplete({
        
        source: get_customer_autocomplete(),
        minLength: 2,
        cacheLength: 0,
        select: function(event, ui) {
         
        cus_id = ui.item.cus_id;
      
        } ,
        //display no result 
        response: function(event, ui) {
          if (!ui.content.length) {
              var noResult = { value:"",label:"No results found" };
              ui.content.push(noResult);
          }
      }
      });
    }
   
   });




  





   });

   function get_firebase_email()
   {
    

     const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
 
    const uid = user.email;
    // ...
    $("#fire_demo").text(uid);
    console.log(uid);
  } else {
    // User is signed out
    // ...
  }
});
  
   }

   function create_work(work_assign_status_p,emp_id_p,his_comment_p,reload_p,his_status)
   {  

    if(work_assign_status_p == "pending")
    {
   get_android_id_by_userid(emp_id_p)
    }

$.ajax({
  url: "php/insert_work.php",
  type: "get", //send it through get method
  data: {
    emp_id : emp_id_p,
    work_date  :get_millis($("#work_date").val()),
    cus_id  : cus_id,
    work_created_by  : current_user_id,
    work_assign_status  : work_assign_status_p,
    work_type  : $('#work_type_list :selected').text(),
    work_status  :"",
    work_description  :  $("#work_textbox").val(),
    work_location  : $("#work_location_textbox").val(),
    work_attachment  : "",
    work_com_status  : "incomplete",
    last_att : get_cur_millis(),
    his_comment :his_comment_p,
    his_status : his_status,
    his_emp_id : current_user_id

},
  success: function (response) {
   console.log(work_assign_status_p)

if(reload_p =="yes")
{
// salert("success","work successfully created","success");
 window.location.reload();
}



    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

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
      
       var selected_android_id =""
      
       obj.forEach(function (obj) {
       selected_android_id =   obj.emp_phone_id;
         
       });
      
       const db = getDatabase();
    set(ref(db, 'notify/' + selected_android_id), {
notification: "Work assigned on - " + millis_to_date(get_millis($("#work_date").val())),
      
    
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

   function get_all_employee()
   {
    
   $.ajax({
     url: "php/get_employee.php",
     type: "get", //send it through get method
    
     success: function (response) {
   
   
   if (response.trim() != "error") {
   
     var obj = JSON.parse(response);
   
     var trlength = 0;
   
     obj.forEach(function (obj) {
       trlength = $('#work_select_employee_table tr').length;
      $("#work_select_employee").append(" <tr> <td >"+ trlength+"</td> <td>" + obj.emp_id + "</td> <td>" + obj.emp_name + "</td> </tr> ");

    
   
     });
     $('#selected_user_count_txt').text(trlength)
    
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
 
  function get_customer_autocomplete()
  {
    
       var cusname =  $('#work_for_text').val() + '%';
   var customer = [];
   var obj = {};
    $.ajax({
      url: "php/get_customer_autocomplete.php",
      type: "get", //send it through get method
      data: {
        cus_name:cusname,
       
    
    },
      success: function (response) {
  console.log("res - " + response)
    
    if (response.trim() != "0 result") {
      var obj = JSON.parse(response);
  

    
  
      obj.forEach(function (obj) {

         object = {
       
          label:obj.cus_name + " - " +  obj.cus_address,
          cus_id : obj.cus_id,
          cus_addr : obj.cus_address,
          value : obj.cus_name

         
          
      };
       customer.push(object);
     
        
      });
     
    
    }
    
    else {
      customer = [];
      var object = {
      
        value:"No data",
        cus_id : "",
        cus_addr : ""
         
    };
     customer.push(object);
     console.log(customer)
   
    }
    
    
        
      },
      error: function (xhr) {
          //Do Something to handle error

          customer = [];
          var object = {
      
            value:"No data",
            cus_id : "",
            cus_addr : ""
             
        };
         customer.push(object);
          
      }
    });

   
    console.log(customer)
   
   
    return customer;
   
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
     
   
    $("#work_type_list").append(" <option value='" + obj.work_type_id + "'>" + obj.work_type_name + "</option>");

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