

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
  var emp_id = urlParams.get('emp_id');
  
$(document).ready(function(){

  check_login();
 get_employee();
 get_employee_single();
 get_role_type();
 get_emp_feature();
   $("#unamed").text(localStorage.getItem("ls_uname"))
   $("#reset_pass_btn").click(function () {
    $("#reset_pass_btn").attr("disabled", true)
    var email = $("#emp_email").val();
    var auth = firebase.auth();
    
    auth.sendPasswordResetEmail(email)
    .then(function () {
      salert("Sent", "Reset Link Successfully Sent to "+email, "success");
    })
    .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        salert("Error", errorMessage, "error");
    });
   
});

 
   $('#remove_btn').click(function () {
   
      
      $('#emp_rwork_modal').modal('show'); 

   
  });
  $('#update_btn').click(function () {
   
    if($('#employee_form')[0].checkValidity())
      
update_employee()

 
});

$('#approve_btn').click(function () {
   
  swal({
    title: "Approve?",
    text: "Are you sure want to approve - " + $("#emp_name").val(),
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      $("#emp_approve").val("yes");
       update_employee()
    } else {
      
    }
  });
  
  
   
  });


  $('#emp_change_btn').click(function () {
    if($('#sel_usr_in :selected').val()=="0")
    {
      salert("Employee","Select Employee","warning")
      return
    }
   
    swal({
      title: "Remove?",
      text: "Are you sure want to Remove - " + $("#emp_name").val() + " and Change to "+ $('#sel_usr_in :selected').text(),
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
   
         change_employee()
      } else {
        
      }
    });
    
    
     
    });

    $('#ep_submit_btn').on('click', function()
{
 if($('#map_loc :selected').val() == '0' || $('#work_assign_notify  :selected').val() == '0' || $('#work_alarm   :selected').val() == '0' || $('#call_end_notify   :selected').val() == '0' || $('#call_history   :selected').val() == '0' )
 {
  salert ("Select Correct Value","Kindly select all Fields","warning")
  return
 }
 insert_emp_fearture();

});

   });
   //


     function get_emp_feature()
   {
    
   
   $.ajax({
     url: "php/get_emp_feature.php",
     type: "get", //send it through get method
     data: {
      emp_id : emp_id
 
      },
     success: function (response) {
   
   
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
   
   
     obj.forEach(function (obj) {
        count = count +1;
 $('#map_loc').val(obj.map_loc).attr("selected","selected");
 $('#work_assign_notify').val(obj.work_assign_notify).attr("selected","selected");
 $('#work_alarm').val(obj.work_alarm).attr("selected","selected");
 $('#call_end_notify').val(obj.call_end_notify).attr("selected","selected");
 $('#call_history').val(obj.call_history).attr("selected","selected");

     });
   
    
   }
   else{
   // $("#@id@") .append("<td colspan='0' scope='col'>No Data</td>");
 
   }
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }

   function insert_emp_fearture()
   {
    
   
   $.ajax({
     url: "php/insert_emp_fearture.php",
     type: "get", //send it through get method
     data: {
     map_loc :  $('#map_loc :selected').text(),
work_assign_notify :  $('#work_assign_notify :selected').text(),
work_alarm :  $('#work_alarm :selected').text(),
call_end_notify :  $('#call_end_notify :selected').text(),
call_history :  $('#call_history :selected').text(),
emp_id : emp_id,
version : 1

     },
     success: function (response) {
   
   
   if (response.trim() == "ok") {

 location.reload()
   
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }





   function get_role_type()
   {
   
   $.ajax({
     url: "php/get_all_role.php",
     type: "get", //send it through get method
     data: {
      
      
   },
     success: function (response) {
   
console.log(response)
$("#role_dropdown").empty();
   if (response.trim() != "error") {
     
     if(response.trim() !="0 result")
     {
       var obj = JSON.parse(response);
       $("#role_dropdown").append( "<option value ='' selected>Choose role...</option>")
      
      
       obj.forEach(function (obj) {
       
   
        $("#role_dropdown").append(" <option value='"+ obj.role + "'>"+ obj.role +"</option>")
        
       });
   
       
     }
     else{
    
       $("#role_dropdown").append("<option value ='0' selected>No role...</option>");
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

   function change_employee()
   {
$.ajax({
  url: "php/change_employee.php",
  type: "get", //send it through get method
  data: {
   
    old_emp_id : emp_id,
    new_emp_id : $('#sel_usr_in :selected').val()



},
  success: function (response) {

location.reload();
if (response.trim() != "error") {
 



  
  
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
 
   function update_employee()
   {
    console.log($('#role_dropdown :selected').val())
    if($('#role_dropdown :selected').val() == 0)
    {
      salert("choose Role","kindly choose Role","warning")
      return;
    }

    $.ajax({
      url: "php/update_employee.php",
      type: "get", //send it through get method
      data: {
       
      emp_id : emp_id,
      emp_name :  $("#emp_name").val(),
      emp_code : $("#emp_code").val(),
      emp_phone :  $("#emp_phone").val(),
      emp_email :   $("#emp_email").val(),
      emp_acode : $("#emp_acode").val(),
      emp_approve : $("#emp_approve").val(),
      emp_role :  $('#role_dropdown :selected').text()
    
    
    },
      success: function (response) {
    location.reload()
    
    if (response.trim() != "error") {
      var obj = JSON.parse(response);
    
    
    
      obj.forEach(function (obj) {
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
   function get_employee_single()
   {

  

$.ajax({
  url: "php/get_employee_single.php",
  type: "get", //send it through get method
  data: {
   
  emp_id : emp_id
},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {
  var obj = JSON.parse(response);



  obj.forEach(function (obj) {
  
    $("#emp_name").val(obj.emp_name);
    $("#emp_code").val(obj.emp_code);
    $("#emp_phone").val(obj.emp_phone);
    $("#emp_email").val(obj.emp_email);
    $("#emp_acode").val(obj.emp_phone_id);
    $("#emp_approve").val(obj.emp_approve);
    if(obj.emp_role != "")
    {
      $("#current_role_txt").html("")
      $("#current_role_txt").html(obj.emp_role)
    }
  
     
    if(obj.emp_approve =="yes")
    {
      $("#approve_btn").hide();
    }
    else{
      $("#approve_btn").show();
    }
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