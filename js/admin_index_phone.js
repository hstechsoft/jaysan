

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
  var emp_id_array = [];
  var cus_id = '0';
  var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ;  
var total_notify_no = 0 
  console.log(current_user_id)
$(document).ready(function(){

 
   check_login();
 
 
 
   $("#unamed").text(localStorage.getItem("ls_uname"))
   $("#total_notification").click(function()
   {
 
   });

   $("#search_cus_btn").click(function()
   {
console.log(cus_id)
window.open('user_search.html?cus_id=' + cus_id, '_blank'); 
   });
 
   $('#emp_details').on('click', '.ok_btn', function() {
    // do something
   
    insert_attendance_verify($(this).closest('.card').data("emp_id"),"approved")
});
   

$('#emp_details').on('click', '.d_btn', function() {
  // do something
 
  insert_attendance_verify($(this).closest('.card').data("emp_id"),"declined")
});
   
   $('#search_cus_text').on('input',function(e){

    if($('#search_cus_text').val() !="")
    {
      $('#search_cus_text').autocomplete({
        
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

   $("#search_emp_txt").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#emp_details .card").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
 
   });
   //
  
   function insert_attendance_verify(emp_id,sts)
   {
   
   $.ajax({
     url: "php/insert_attendance_verify.php",
     type: "get", //send it through get method
     data: {
   
      emp_id : emp_id,
          sts : sts,
         
     },
     success: function (response) {
   console.log(response);
   
   
   
   if (response.trim() == "ok") {
   
      location.reload();
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

    else
    {
        get_today_cstatus_sql();
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
      
      
      if (response.trim() != "error") {
       var obj = JSON.parse(response);
      

      console.log(response);
      
      
       obj.forEach(function (obj) {
         current_user_id = obj.emp_id;
         current_user_name =  obj.emp_name;
       });
      
       get_today_cstatus_sql()
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
  url: "php/get_employee_cur_sts_phone.php",
  type: "get", //send it through get method
  data: {
   
  emp_id : current_user_id
},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {
 

  if (response.trim() != "0 result") {
    var obj = JSON.parse(response);
var count =0 
  obj.forEach(function (obj) {
  
   count  = count + 1;
   var att_verify = ""
   if(obj.att_verify == "approved")
    att_verify = "<div><i class=' m-0 mt-2 fa-regular fa-thumbs-up text-success'></i></div>"
     else if(obj.att_verify == "declined")
    att_verify = "<div><i class=' m-0 mt-2 fa-regular fa-thumbs-down text-danger'></i></div>"
  else
   att_verify = "<div><i class='m-0 mt-2 fa-solid fa-stopwatch text-danger'></i></div>"
   var att_sts = ""
       if(obj.status == 'present')
   var att_sts =  "<h6 class='m-0 mt-2 text-center text-success p-0 small'>"+obj.status+"</h6>"
else if(obj.status == 'logout')
  var att_sts =  "<h6 class='m-0 mt-2 text-center text-info p-0 small'>"+obj.status+"</h6>"
else if(obj.status == 'absent')
  var att_sts =  "<h6 class='m-0 mt-2 text-center text-danger p-0 small'>"+obj.status+"</h6>"
//  $("#user_status_table").append(" <tr class = 'text-bg-primary' > <td>" + count + "</td> <td>" + obj.emp_name + "</td> <td>" + obj.emp_phone + "</td> <td>" + obj.status + "</td> <td> <a target='_blank' href='work_summary_report.html?emp_id=" + obj.emp_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td><td> <a target='_blank' href='map_ref1.html?phone_id=" + obj.emp_phone_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td></tr>")
// else if(obj.status == 'logout')
// $("#user_status_table").append(" <tr class = 'text-bg-warning' > <td>" + count + "</td> <td>" + obj.emp_name + "</td> <td>" + obj.emp_phone + "</td> <td>" + obj.status + "</td> <td> <a target='_blank' href='work_summary_report.html?emp_id=" + obj.emp_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td><td> <a target='_blank' href='map_ref1.html?phone_id=" + obj.emp_phone_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td></tr>")
// else
// $("#user_status_table").append(" <tr > <td>" + count + "</td> <td>" + obj.emp_name + "</td> <td>" + obj.emp_phone + "</td> <td>" + obj.status + "</td> <td> <a target='_blank' href='work_summary_report.html?emp_id=" + obj.emp_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td><td> <a target='_blank' href='map_ref1.html?phone_id=" + obj.emp_phone_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td></tr>")
emp_id_array.push(obj.emp_id)
$("#emp_details").append(" <div class='card p-0 m-0' data-emp_id="+obj.emp_id+" ><div class='card-header text-bg-light text-center p-1 m-0'> <p class='m-0 p-1 text-truncate text-muted small'>"+obj.emp_name +  "</p></div><div class='card-body px-3 m-0'> <div class='d-flex justify-content-between'> <div> <p class='text-muted m-0 p-0 small'>&#8377 "+ obj.amount + "</p> </div> <div> <i class='fa-regular fa-bell position-relative' style='font-size: 20px;'> <span id = '"+obj.emp_id + "_notify' class='position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-warning' style='font-size: 10px; padding: 3px 6px;'> 0 </span> </i> </div> </div> <div class='d-flex justify-content-between mt-1 p-0'> <div class='d-flex gap-1'>"+ att_sts + att_verify +  "</div> <div> <button onclick=\"window.location.href='tel:+91"+ obj.emp_phone + "'\" class='btn btn-light btn-sm m-0 mt-1 text-center'><i class='fa fa-phone text-secondary' aria-hidden='true'></i></button> </div></div> </div> <div class='card-footer m-0 p-0'>  <div class='d-flex justify-content-between px-1 small'> <div> <button class='btn btn-sm btn-primary ok_btn'><i class='fa-regular fa-thumbs-up'></i></button> </div> <div> <button class='btn btn-sm btn-warning d_btn'><i class='fa-regular fa-thumbs-down'></i></button> </div> </div> <button  onclick=\"window.location.href='admin_emp_single_detail.html?emp_id="+obj.emp_id+"&phone_id="+phone_id+"'\" class='w-100 btn btn-secondary'>view</button> </div> </div>")
  });

  $("#total_emp").text(count)
}
console.log(emp_id_array);
$.each(emp_id_array, function(index, emp_id) {
  
  get_employee_notification(emp_id,current_user_id)
  console.log(total_notify_no);

})

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


   
   function get_employee_notification(emp_id_p,admin_id_p)
   {

  

$.ajax({
  url: "php/get_employee_notification.php",
  type: "get", //send it through get method
  data: {
   
  emp_id : emp_id_p,
  admin_id : admin_id_p
},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {
  
  if (response.trim() != "0 result") {
  var obj = JSON.parse(response);


var count =0 
  obj.forEach(function (obj) {
  
  
   if(obj.emp_id !=null)
   {
    total_notify_no  = total_notify_no + Number(obj.count);
   console.log(total_notify_no);
     
$("#total_notification").text(total_notify_no)
  var id_sel = "#" + obj.emp_id + "_notify"

$(id_sel).text(obj.count)
$(id_sel).addClass("blink");
   }
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



function millis_to_date( millis)
{
  var d = new Date(millis); // Parameter should be long value

  
return d.toLocaleString('en-GB');

}