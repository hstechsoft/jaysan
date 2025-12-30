

  var cus_id = '0';
  
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ;  
  var urlParams = new URLSearchParams(window.location.search);
  var phone_id = urlParams.get('phone_id');
  var sel_emp = urlParams.get('emp_id');
 
  console.log(current_user_id)
$(document).ready(function(){
get_details()
 
   check_login();
  
   $("#home_btn").click(function()
   {
    window.location.href =  "admin_index_phone.html?phone_id=" +phone_id 
   });
   
   $("#unamed").text(localStorage.getItem("ls_uname"))


   $('#sel_usr_in').change(function() {
     sel_emp = $('#sel_usr_in :selected').val()
   get_details()
 
     });


   });
   //
   function get_details()
   {
    $("#task_btn").attr("onclick", "window.location.href = 'admin_emp_single_task.html?phone_id=" + phone_id + "&emp_id="+sel_emp+"';");
    $("#att_btn").attr("onclick", "window.location.href = 'admin_emp_single_att.html?phone_id=" + phone_id + "&emp_id="+sel_emp+"';");
    $("#leave_btn").attr("onclick", "window.location.href = 'admin_tour.html?phone_id=" + phone_id + "&emp_id="+sel_emp+"';");
    $("#tour_btn").attr("onclick", "window.location.href = 'admin_tour.html?phone_id=" + phone_id + "&emp_id="+sel_emp+"';");
    $("#exp_btn").attr("onclick", "window.location.href = 'admin_expense_single_phone.html?phone_id=" + phone_id + "&emp_id="+sel_emp+"';");

get_task()
get_att()
get_tour_req()
get_leave_req()
get_expense()
   }
   function get_expense()
   {

  

$.ajax({
  url: "php/get_expense_summary_single.php",
  type: "get", //send it through get method
  data: {
   emp_id : sel_emp
  
},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {
  if (response.trim() != "0 result") {
  var obj = JSON.parse(response);


var count =0 
  obj.forEach(function (obj) {
  $("#exp_unapprove").html("&#x20b9; " + obj.unapproved)
  $("#decline_amt").html("&#x20b9; " + obj.decline)
   
   

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
   function get_leave_req()
   {
    
   
   $.ajax({
     url: "php/get_emp_tour_sum_phone.php",
     type: "get", //send it through get method
     data: {
      emp_id : sel_emp,
      admin_id : current_user_id,
      leave_type : "leave"
   },
     success: function (response) {
   
   console.log(response);
   
   if (response.trim() != "error") {
    if (response.trim() != "0 result" )
        {
     var obj = JSON.parse(response);
   
   
   
     obj.forEach(function (obj) {
     
        $("#leave_no").text(obj.count)
        
        // $("#emp_pending_no").text(obj.pending)
        // $("#selected_usr_txt").text(obj.emp_name)
        
   
     });
   
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
   function get_tour_req()
   {
    
   
   $.ajax({
     url: "php/get_emp_tour_sum_phone.php",
     type: "get", //send it through get method
     data: {
      emp_id : sel_emp,
      admin_id : current_user_id,
      leave_type : "tour"
   },
     success: function (response) {
   
   console.log(response);
   
   if (response.trim() != "error") {
    if (response.trim() != "0 result" )
        {
     var obj = JSON.parse(response);
   
   
   
     obj.forEach(function (obj) {
     
        $("#tour_no").text(obj.count)
        
        // $("#emp_pending_no").text(obj.pending)
        // $("#selected_usr_txt").text(obj.emp_name)
        
   
     });
   
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
   function get_task()
   {
    
   
   $.ajax({
     url: "php/get_emp_task_sum_phone.php",
     type: "get", //send it through get method
     data: {
      emp_id : sel_emp
      
     
   },
     success: function (response) {
   
   console.log(response);
   
   if (response.trim() != "error") {
    if (response.trim() != "0 result" )
        {
     var obj = JSON.parse(response);
   
   
   
     obj.forEach(function (obj) {
     
        $("#emp_today_no").text(obj.today_work)
        $("#emp_pending_no").text(obj.pending)
        $("#selected_usr_txt").text(obj.emp_name)
        
   
     });
   
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
   function get_att()
   {
    

   $.ajax({
    url: "php/get_emp_att_report.php",
    type: "get", //send it through get method
    data: {
    emp_id : sel_emp,
astart_date : millis_to_date_only(get_today_start_millis()),
aend_date : millis_to_date_only(get_cur_millis())
   },
     success: function (response) {
   
   console.log(response);
   
   if (response.trim() != "error") {
    if (response.trim() != "0 result" )
        {
     var obj = JSON.parse(response);
   
   
   
     obj.forEach(function (obj) {
        if(obj.att_report == 'present')
        {
            $("#att_sts").addClass ("text-success")
            $("#att_sts").removeClass ("text-danger")
        }
        if(obj.att_report == 'absent')
            {
                $("#att_sts").removeClass ("text-success")
                $("#att_sts").addClass ("text-danger")
            }
        $("#att_sum").text(obj.time_history)
        $("#att_sts").text(obj.att_report)
        $("#selected_usr_txt").text(obj.emp_name)
        
   
     });
   
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
  
   function get_employee()
   {
    
   
   $.ajax({
     url: "php/get_all_emp_hi.php",
     type: "get", //send it through get method
     data: {
      emp_id : current_user_id
     
   },
     success: function (response) {
   

   
   if (response.trim() != "error") {
    if (response.trim() != "0 result" )
        {
     var obj = JSON.parse(response);
   
   
   
     obj.forEach(function (obj) {
     
       

       $("#sel_usr_in").append(" <option value='" + obj.emp_id + "'>" + obj.emp_name + "</option>");
   
        
   
     });
   
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

   function check_login()
   {
    
  if (localStorage.getItem("logemail") == null && phone_id == null )  {
    window.location.replace("login.html");
 }
 else if (localStorage.getItem("logemail") == null && phone_id != null )
    {
  get_current_userid_byphoneid();
  $('#menu_bar').hide()
    }

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
      console.log(response);
      
      
      if (response.trim() != "error") {
       var obj = JSON.parse(response);
      

      
      
       obj.forEach(function (obj) {
         current_user_id = obj.emp_id;
         current_user_name =  obj.emp_name;
       });
      
      
       get_employee();
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
  url: "php/get_employee_cur_sts.php",
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
   if(obj.status == 'present')
 $("#user_status_table").append(" <tr class = 'text-bg-primary' > <td>" + count + "</td> <td>" + obj.emp_name + "</td> <td>" + obj.emp_phone + "</td> <td>" + obj.status + "</td> <td> <a target='_blank' href='work_summary_report.html?emp_id=" + obj.emp_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td><td> <a target='_blank' href='map_ref1.html?phone_id=" + obj.emp_phone_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td></tr>")
else if(obj.status == 'logout')
$("#user_status_table").append(" <tr class = 'text-bg-warning' > <td>" + count + "</td> <td>" + obj.emp_name + "</td> <td>" + obj.emp_phone + "</td> <td>" + obj.status + "</td> <td> <a target='_blank' href='work_summary_report.html?emp_id=" + obj.emp_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td><td> <a target='_blank' href='map_ref1.html?phone_id=" + obj.emp_phone_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td></tr>")
else
$("#user_status_table").append(" <tr > <td>" + count + "</td> <td>" + obj.emp_name + "</td> <td>" + obj.emp_phone + "</td> <td>" + obj.status + "</td> <td> <a target='_blank' href='work_summary_report.html?emp_id=" + obj.emp_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td><td> <a target='_blank' href='map_ref1.html?phone_id=" + obj.emp_phone_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td></tr>")


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


   
   function n(user,id,cun)
   {
    cun =cun+1;
    console.log(id);
       var table = document.getElementById('att_table');
       var date_milli = new Date().getTime();
         
      var row_count=0
              
      var nowDate = new Date(); 
      var date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate(); 
   
           var start_date =date.toString() + " 00:00:00";
          
           var start_date_milli = new Date(start_date).getTime();
      
           var status=""
           var today_start = start_date_milli;
           var today_end = start_date_milli + (86400000);
          
           var Ref = firebase.database().ref("attendance/" + id);
           Ref.orderByChild("login").startAt(today_start).endAt(today_end - 1).on("value", function (dat) {
             
   
            
               if (dat.val()==null)
               {
                   status = "Absent"
                  
               }
               dat.forEach(function (dat) {
                 
                   if (dat.val().logout == 0) {
                       status = "Live"
                      
                   }
                   else {
                       status = "Signed Out"
                      
                   }
                   console.log(status);
   
               });
              // $('#expenses').html( '₹ ' + billamount)
             
               table.rows[cun].cells[3].innerHTML = status
   
               if  (status=="Live")
               {
                table.rows[cun].cells[4].style.backgroundColor="#44db1a";
                  table.rows[cun].cells[3].style.backgroundColor="#44db1a";
                   table.rows[cun].cells[2].style.backgroundColor="#44db1a";
                   table.rows[cun].cells[1].style.backgroundColor="#44db1a";
                   table.rows[cun].cells[0].style.backgroundColor="#44db1a";
               }
               else if(status=="Signed Out")
               {
                   table.rows[cun].cells[2].style.backgroundColor="#f7e302";
                   table.rows[cun].cells[1].style.backgroundColor="#f7e302";
                   table.rows[cun].cells[0].style.backgroundColor="#f7e302";
                   table.rows[cun].cells[3].style.backgroundColor="#f7e302";
                   table.rows[cun].cells[4].style.backgroundColor="#f7e302";
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

function millis_to_date_only( millis)
{
console.log(millis)
  if(millis != 0)
  {
    var d = new Date(millis); // Parameter should be long valu
    var d = new Date(millis);
    var year = d.getFullYear();
    var month = ('0' + (d.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() returns zero-based month
    var day = ('0' + d.getDate()).slice(-2);
    var formattedDate = year + '-' + month + '-' + day;
    
    return formattedDate;
  }
  else
  {
    return ''
  }
  

}

function millis_to_date( millis)
{
  var d = new Date(millis); // Parameter should be long value

  
return d.toLocaleString('en-GB');

}