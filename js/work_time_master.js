
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 
 var wtid = 0;
$(document).ready(function(){
 
  
  $("#menu_bar").load('menu.html',
    function() { 
      var lo = (window.location.pathname.split("/").pop());
      var web_addr = "#"+ (lo.substring(0, lo.indexOf(".")))
 
    
     if($(web_addr).find("a").hasClass('nav-link'))
     {
      $(web_addr).find("a").toggleClass('active')
     }
     else if($(web_addr).find("a").hasClass('dropdown-item'))
{
$(web_addr).parent().parent().find("a").eq(0).toggleClass('active')
}
      
     
    }
 );



    check_login();
    
  $("#unamed").text(localStorage.getItem("ls_uname"))
$("#add_work_time").on('click', function() {

  if($('#work_time_form')[0].checkValidity());
insert_work_time_master()

  });

  $("#update_work_time").on('click', function() {

    if($('#work_time_form')[0].checkValidity());
    update_work_time_master()
  
    });
get_work_time_master()

$("#work_time_table").on('click', 'button', function() {   
     wtid = $(this).attr('val')
    
 if ($(this).attr('name') == 'delete')
{

    {
        swal({
          title: "Are you sure - Delete? ",
          text: "You will not be recover this  again!",
          icon: "warning",
          buttons: [
            'No, cancel it!',
            'Yes, I am sure!'
          ],
          dangerMode: true,
        }).then(function(isConfirm) {
          if (isConfirm) {
            swal({
              title: 'Applied!',
              text: 'successfully Deleted!',
              icon: 'success'
            }).then(function() {
              
            delete_work_time_master() // <--- submit form programmatically
              
             
            });
          } else {
            swal("Cancelled", "lead is safe :)", "error");
          }
        })
        }
        

}
else
   get_work_time_master_single( )
});  

});


function delete_work_time_master()
{
 


$.ajax({
  url: "php/delete_work_time_master.php",
  type: "get", //send it through get method
  data: {
  wtid  : wtid

  },
  success: function (response) {

console.log(response);

if (response.trim() == "ok") {
location.reload()


}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}




function update_work_time_master()
{
 

$.ajax({
  url: "php/update_work_time_master.php",
  type: "get", //send it through get method
  data: {
  work_title :  $('#work_title').val(),
min_time :  $('#min_time').val(),
max_time :  $('#max_time').val(),
buf_time :  $('#buf_time').val(),
wtid  : wtid

  },
  success: function (response) {
console.log(response);


if (response.trim() == "ok") {

 location.reload()

}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}







function get_work_time_master_single()
{
 
  
$.ajax({
  url: "php/get_work_time_master_single.php",
  type: "get", //send it through get method
  data: {
  wtid : wtid

  },
  success: function (response) {

console.log(response);

if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
$('#work_title').val(obj.work_title)
$('#min_time').val(obj.min_time)
$('#max_time').val(obj.max_time)
$('#buf_time').val(obj.buf_time)

  });

  if($("#add_work_time").hasClass('d-none')== false)
  {
    $("#add_work_time").addClass('d-none')
  }
  if($("#update_work_time").hasClass('d-none'))
  {
    $("#update_work_time").removeClass('d-none')
  }
 
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

function get_work_time_master()
{
 

$.ajax({
  url: "php/get_work_time_master.php",
  type: "get", //send it through get method
  data: {
  
  },
  success: function (response) {


if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
$('#work_time_table').append("<tr><td>"+count+"</td><td>"+obj.work_title+"</td><td>"+obj.min_time+"</td><td>"+obj.max_time+"</td><td>"+obj.buf_time+"</td> <td><button type = 'button' name = 'edit' val= '"+obj.wtid +"' class='btn btn-outline-secondary border-0 btn-sm'><i class='fa fa-pencil' aria-hidden='true'></i></button></td> <td><button type = 'button' name = 'delete' val= '"+obj.wtid +"' class='btn btn-outline-danger border-0 btn-sm'><i class='fa fa-trash-can' aria-hidden='true'></i></button></td> </tr>")

  });

 
}
else{
    $('#work_time_table') .append("<tr class='small text-bg-secondary'><td colspan='7' scope='col'>No Data</td></tr>");

}
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}


function insert_work_time_master()
{
 

$.ajax({
  url: "php/insert_work_time_master.php",
  type: "get", //send it through get method
  data: {
  work_title :  $('#work_title').val(),
min_time :  $('#min_time').val(),
max_time :  $('#max_time').val(),
buf_time :  $('#buf_time').val()

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
      
    //    get_sales_order()
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

  
   function shw_toast(title,des,theme)
   {
   
     
         $('.toast-title').text(title);
         $('.toast-description').text(des);
   var toast = new bootstrap.Toast($('#myToast'));
   toast.show();
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