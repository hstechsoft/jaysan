
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 
 var process_id =0;
 var machine_id = 0;
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

    get_all_machine_list()
    
  $("#unamed").text(localStorage.getItem("ls_uname"))

  $('#process_name').on('input',function(){
    //check the value not empty
    if ($(this).val().trim() !== "") {
        $("label[for='process_name']").fadeOut(300);
    } else {
        $("label[for='process_name']").fadeIn(300);
    }


        if($('#process_name').val() !="")
        {
          $('#process_name').autocomplete({
            //get data from databse return as array of object which contain label,value
         
            source: function(request, response) {
              $.ajax({
                url: "php/get_process_auto.php",
                type: "get", //send it through get method
                data: {
                
                  process : request.term
              
              },
              dataType: "json", 
                success: function (data) {
         
              console.log(data);
              response($.map(data, function(item) {
                return {
                    label: item.process_name ,
                    value: item.process_name,
                    
                    process_id: item.process_id
                };
            }));
                  
                }
            
              });
            },
            minLength: 2,
            cacheLength: 0,
            select: function(event, ui) {
             
              $(this).data("selected-process_id", ui.item.process_id);
              $("#machine_name").closest('.col').removeClass('d-none')
              $("#machine_name").focus()

              $("label[for='process_name']").fadeIn(300);
              $('#process_name').closest('.col').find('*').prop('disabled', true);
              process_id = ui.item.process_id;
            //   get_machine_time(ui.item.process_id)
            get_work_time_summary()
            } ,
     
          })
        }
       
       });
 

       $('#machine_name').on('input',function(){
        //check the value not empty
        if ($(this).val().trim() !== "") {
            $("label[for='machine_name']").fadeOut(300);
        } else {
            $("label[for='machine_name']").fadeIn(300);
        }
    
    
            if($('#machine_name').val() !="")
            {
              $('#machine_name').autocomplete({
                //get data from databse return as array of object which contain label,value
             
                source: function(request, response) {
                  $.ajax({
                    url: "php/get_machine_auto.php",
                    type: "get", //send it through get method
                    data: {
                    
                      machine : request.term
                  
                  },
                  dataType: "json", 
                    success: function (data) {
             
                  console.log(data);
                  response($.map(data, function(item) {
                    return {
                        label: item.machine_name ,
                        value: item.machine_name,
                        
                        machine_id: item.jmid
                    };
                }));
                      
                    }
                
                  });
                },
                minLength: 2,
                cacheLength: 0,
                select: function(event, ui) {
                 
                  $(this).data("selected-process_id", ui.item.machine_id);
                  $("#min_time").closest('.col').removeClass('d-none')
                  $("#max_time").closest('.col').removeClass('d-none')
                  $("#min_time").focus()
    
                  $("label[for='machine_name']").fadeIn(300);
                  $('#machine_name').closest('.col').find('*').prop('disabled', true);
                  machine_id = ui.item.machine_id;
                  get_work_time_master_id()

    
                } ,
         
              })
            }
           
           });

       $('#add_new_process_btn').on('click', function(e) {
      
        
        var processName = $('#process_name').val();
        var processDes = "";
      
     insert_jaysan_process()
      });


      $('#add_new_machine_btn').on('click', function(e) {
      
        
        var machineName = $('#machine_name').val();
        
      
     insert_jaysan_machine()
      });

$('#add_time_btn').on('click', function(e) {
        
          
          var min_time = parseFloat($('#min_time').val());
          var max_time = parseFloat($('#max_time').val());
          if ((min_time % 1 > 0 && (min_time % 1) * 100 > 60) || (max_time % 1 > 0 && (max_time % 1) * 100 > 60)) {
            salert("Error", "Decimal part (minutes) cannot exceed 60", "error");
            return;
          }
          if(min_time == "" || max_time == "")
          {
             salert("Error", "Please enter time", "error")
             return
          }
          if(min_time > max_time)
          {
             salert("Error", "Min time should be less than max time", "error")
             return
          }
          
          insert_work_time_master()
        });



        $('#update_time_btn').on('click', function(e) {
            
            
            var min_time = parseFloat($('#min_time').val());
            var max_time = parseFloat($('#max_time').val());
            
               if ((min_time % 1 > 0 && (min_time % 1) * 100 > 60) || (max_time % 1 > 0 && (max_time % 1) * 100 > 60)) {
            salert("Error", "Decimal part (minutes) cannot exceed 60", "error");
            return;
          }

          
            if(min_time == "" || max_time == "")
            {
                salert("Error", "Please enter time", "error")
                return
            }
            if(min_time > max_time)
            {
                salert("Error", "Min time should be less than max time", "error")
                return
            }
            
            update_work_time_master()
              
        });


        $('#machine_table').on('click', 'button', function(e) {
            
          var wtid = $(this).val()
                {
                  swal({
                    title: "Are you sure - delete? ",
                    text: "You will not be recover this  again!",
                    icon: "warning",
                    buttons: [
                      'No, cancel it!',
                      'Yes, I am sure!'
                    ],
                    dangerMode: true,
                  }).then(function(isConfirm) {
                    if (isConfirm) {
            
                  
                  delete_work_time_master(wtid)
                 
                  
                    }
                  
                  })
                }
});
});


function get_all_machine_list()
{
 

$.ajax({
  url: "php/get_all_machine_list.php",
  type: "get", //send it through get method
  data: {
  process_id : process_id

  },
  success: function (response) {
    $('#machine_table_all').empty()
console.log(response);

if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
$('#machine_table_all').append("<tr><td style='max-width: 5px;'>"+count+"</td><td>"+obj.process_name+"</td><td>"+obj.details+"</td></tr>")

  });

 
}
else{
// $("#@id@") .append("<td colspan='5' scope='col'>No Data</td>");

}
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
  wtid : $('#update_time_btn').val(),
min_time :  $('#min_time').val(),
max_time :  $('#max_time').val(),
process_id : process_id,
machine_id : machine_id

  },
  success: function (response) {


    if (response.trim() == "ok") {
        get_work_time_summary()
        $('#min_time').val("")
        $('#max_time').val("")
        $('#machine_name').val("")
        
        
        $('#min_time').closest('.col').addClass('d-none')
        $('#max_time').closest('.col').addClass('d-none')
        $('#machine_name').closest('.col').find('*').prop('disabled', false);
        $('#machine_name').focus()
        $('#add_time_btn').addClass('d-none')
        $('#update_time_btn').addClass('d-none')
        get_all_machine_list()
        }




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}





function delete_work_time_master(wtid)
{
 

$.ajax({
  url: "php/delete_work_time_master.php",
  type: "get", //send it through get method
  data: {
    wtid : wtid

  },
  success: function (response) {


if (response.trim() == "ok") {

    get_work_time_summary()

}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}





function get_work_time_summary()
{
 

$.ajax({
  url: "php/get_work_time_summary.php",
  type: "get", //send it through get method
  data: {
  process_id : process_id

  },
  success: function (response) {
    $('#machine_table').empty()

if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
$('#machine_table').append("<tr><td>"+count+"</td><td>"+obj.machine_name+"</td><td>"+obj.min_time+"</td><td>"+obj.max_time+"</td><td> <button value='"+obj.wtid+"' class='btn btn-outline-danger btn-sm border-0'> <i class='fa fa-trash' aria-hidden='true'></i> </button> </td></tr>")

  });

 
}
else{
// $("#@id@") .append("<td colspan='5' scope='col'>No Data</td>");

}
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}

function get_work_time_master_id()
{
 

$.ajax({
  url: "php/get_work_time_master_id.php",
  type: "get", //send it through get method
  data: {
  process_id : 	process_id,
machine_id : machine_id

  },
  success: function (response) {


if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {
    $('#update_time_btn').removeClass('d-none')
    if($('#add_btn').hasClass('d-none')== false)
    $('#add_btn').addClass('d-none')


  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
     $('#update_time_btn').val(obj.wtid)
  });

 
}
else{
$('#add_time_btn').removeClass('d-none')
if($('#update_time_btn').hasClass('d-none')== false)
$('#update_time_btn').addClass('d-none')
$('#update_time_btn').val("")
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
  min_time :  $('#min_time').val(),
max_time :  $('#max_time').val(),
process_id : process_id,
machine_id : machine_id

  },
  success: function (response) {


if (response.trim() == "ok") {
get_work_time_summary()
$('#min_time').val("")
$('#max_time').val("")
$('#machine_name').val("")


$('#min_time').closest('.col').addClass('d-none')
$('#max_time').closest('.col').addClass('d-none')
$('#machine_name').closest('.col').find('*').prop('disabled', false);
$('#machine_name').focus()
$('#add_time_btn').addClass('d-none')
$('#update_time_btn').addClass('d-none')

get_all_machine_list()
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}




function insert_jaysan_machine()
{
 

$.ajax({
  url: "php/insert_jaysan_machine.php",
  type: "get", //send it through get method
  data: {
  machine_name :  $('#machine_name').val(),
  running_cost : "0"

  },
  success: function (response) {
console.log(response);


if (response.trim() > 0) {

machine_id = response.trim()
$('#machine_name').closest('.col').find('*').prop('disabled', true);
$("label[for='machine_name']").fadeIn(300);
$("#min_time").closest('.col').removeClass('d-none')
$("#max_time").closest('.col').removeClass('d-none')
$("#min_time").focus()
$('#add_time_btn').removeClass('d-none')
if($('#update_time_btn').hasClass('d-none')== false)
$('#update_time_btn').addClass('d-none')
$('#update_time_btn').val("")

}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}



function insert_jaysan_process()
{
 

$.ajax({
  url: "php/insert_jaysan_process.php",
  type: "get", //send it through get method
  data: {
  process_name :  $('#process_name').val(),
process_des : ""

  },
  success: function (response) {
console.log(response);


if (response.trim() > 0) {

process_id = response.trim()
$('#process_name').closest('.col').find('*').prop('disabled', true);
$("label[for='process_name']").fadeIn(300);
$("#machine_name").closest('.col').removeClass('d-none')
$("#machine_name").focus()

get_work_time_summary
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