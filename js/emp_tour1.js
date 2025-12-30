


  var cus_id = '0';
  
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ;  
  var urlParams = new URLSearchParams(window.location.search);
  var phone_id = urlParams.get('phone_id');
 
  console.log(current_user_id)
  let currentDate = new Date();
let currentDate_day = new Date();
let currentDate_week = new Date();
var date_start = ""
var date_end = ""
var calendar = ""
var type_p = "pending"
var date_p = "1"
var current_tab = ""
$(document).ready(function(){


  $('#reportTabs button').on('shown.bs.tab', function (e) {
    current_tab = e.target.id
    switch (e.target.id) {
    
      case 'request-tab':
type_p = "pending"
        get_employee_tour()
       
        break;
        case 'approved-tab':
          type_p = "approved"
          get_employee_tour()
                 break;
      case 'declined-tab':
        type_p = "declined"
        get_employee_tour()
        break;
     
      default:
          // Optional: handle other cases or do nothing
          break;
  }


  

  //   calendar.addEvent({
  //     title: "hi",
  //     start: '2024-10-18',
  //     color:  'blue', // Use color from data or default to blue
  //     textColor:  'white' // Text color
  // });
});
  
 
  $("#home_btn").click(function()
  {
   window.location.href =  "emp_single_detail.html?phone_id=" +phone_id 
  });
 
   check_login();
   displayCurrentWeek();
 
//    $('#reportTabs button').on('shown.bs.tab', function (e) {
//     currentDate = new Date();
//     console.log(currentDate);
//     get_today_date_only()
    
//   });


$('#req_submit_btn').on('click', function()
{
   if($('#leave_req_form')[0].checkValidity())
       {
           insert_leave_req();
       }
      

});

$('#add_request_btn').on('click', function() {
$('#requestmodal').modal('show'); 
});

$('#decline_btn').on('click', function() {
    $('#remarkmodal').modal('show');
  });


  $(document).on('click', '.delete_btn', function() {

    var req_id = $(this).data("id")
 
   
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
        delete_att_req(req_id)
    
     
     
     
       }
     
     })
   
   
      })

    
  $(document).on('click', '.show_history', function() {

  $(this).closest(".list-group-item").find(".his").fadeToggle(350); 
  
 $(this).closest("button").find("i").toggleClass("fa-caret-down fa-caret-up");
 $(this).closest(".list-group-item").siblings(".list-group-item").fadeToggle(250);

 
});

$(document).on('click', '.show_planned_works', function() {

console.log( $(this).data('from_date'));

get_task(current_user_id,$(this).data('from_date'),$(this).data('to_date'))
    $(this).closest(".list-group-item").find(".planned_works").fadeToggle(350); 
    
   $(this).closest("button").find("i").toggleClass("fa-caret-down fa-caret-up");
   $(this).closest(".list-group-item").siblings(".list-group-item").fadeToggle(250);
  
   
  });

  $(document).on('click', '.approval_sts_btn', function() {

    console.log( $(this).data('from_date'));
    get_att_req_sts($(this).data('id'))
    // get_task(current_user_id,$(this).data('from_date'),$(this).data('to_date'))
        $(this).closest(".list-group-item").find(".approval_sts").fadeToggle(350); 
        
       $(this).closest("button").find("i").toggleClass("fa-caret-down fa-caret-up");
       $(this).closest(".list-group-item").siblings(".list-group-item").fadeToggle(250);
      
       
      });
 
   $("#unamed").text(localStorage.getItem("ls_uname"))

   $("#daily_date").text(get_today_date_only(currentDate))
   $('#daily_pre_btn').on('click', function()
   {
    
   addDays(-1)
  
   });

   $('#custom_date_btn').on('click', function()
   {
    if($('#custom_date_form')[0].checkValidity())
      {
 

  console.log(format_date_start($('#fromDate').val()));
  date_start =  format_date_mysql(format_date_start($('#fromDate').val()))
  date_end =  format_date_mysql(format_date_end($('#toDate').val()))

  console.log(date_start + " -- "  + date_end);
  $('#custom_date').text( date_start+ " to " +  date_end)
      }
   });

   $('#daily_nxt_btn').on('click', function()
   {
   
   addDays(1)
   
 
   });

   $('#weekly_nxt_btn').on('click', function()
   {
    
    currentDate_week.setDate(currentDate_week.getDate() + 7);
displayCurrentWeek()



   });

   $('#weekly_pre_btn').on('click', function()
   {
    
    currentDate_week.setDate(currentDate_week.getDate() - 7);
    displayCurrentWeek()
    console.log(date_start + "--" + date_end);
   });

   });
   //

   function insert_leave_req()
   {
    
   
   $.ajax({
     url: "php/insert_leave_req.php",
     type: "get", //send it through get method
     data: {
     from_date :  $('#from_date').val(),
to_date :  $('#to_date').val(),
emp_id : current_user_id,
leave_type :  $('#leave_type :selected').text(),
reason :  $('#reason').val(),
status : "pending"

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
   function format_date_start(date)
   {
    let date_temp = new Date(date);
    let startOfDay = new Date(date_temp.getFullYear(), date_temp.getMonth(), date_temp.getDate(), 0, 0, 0);
    return startOfDay
   }

   function format_date_end(date)
   {
    let date_temp = new Date(date);
    let endOfDay = new Date(date_temp.getFullYear(), date_temp.getMonth(), date_temp.getDate(), 23, 59, 59);
    return endOfDay
   }
   function format_date_mysql(date)
   {
    let formattedDate = date.getFullYear() + '-' + 
    ('0' + (date.getMonth() + 1)).slice(-2) + '-' + 
    ('0' + date.getDate()).slice(-2) + ' ' + 
    ('0' + date.getHours()).slice(-2) + ':' + 
    ('0' + date.getMinutes()).slice(-2) + ':' + 
    ('0' + date.getSeconds()).slice(-2);
return formattedDate

   }
   function displayCurrentWeek() {
    let startOfWeek = getStartOfWeek(currentDate_week);
    let endOfWeek = getEndOfWeek(currentDate_week);
 

    date_start = format_date_start(startOfWeek)
    date_end = format_date_end(endOfWeek)
    $('#weekly_date').text(`${get_today_date_only(startOfWeek)} to ${get_today_date_only(endOfWeek)}`);
  }

  function getStartOfWeek(date) {
    let dayOfWeek = date.getDay();
    let diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when Sunday (0)
    return new Date(date.setDate(diff));
  }

  // Function to get the end of the current week (Sunday)
  function getEndOfWeek(date) {
    let startOfWeek = getStartOfWeek(new Date(date)); // Get start of the week
    return new Date(startOfWeek.setDate(startOfWeek.getDate() + 6)); // Add 6 days to get Sunday
  }

   function addDays(days) {
    currentDate_day.setDate(currentDate_day.getDate() + days);
    date_start = format_date_start(currentDate_day)
    date_end = format_date_end(currentDate_day)
    $("#daily_date").text(get_today_date_only(currentDate_day))
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
        // get_today_cstatus_sql();
    }
   }

   
   function delete_att_req(req_id)
   {



$.ajax({
  url: "php/delete_tour_req.php",
  type: "get", //send it through get method
  async : false,
  data: {
    req_id : req_id,
    
  
},
  success: function (response) {


console.log(response);

location.reload()


    
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
     
       get_employee_tour()
    
      
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

   function get_task(emp_id,sdate,edate)
   {



$.ajax({
  url: "php/get_emp_task_detail.php",
  type: "get", //send it through get method
  data: {
   
  emp_id : emp_id,
  start_date :sdate ,
  end_date : edate
},
  success: function (response) {
console.log(response);

    $(".planned_works").empty()
    $(".planned_works").append("<div class='d-flex justify-content-between shadow align-items-center p-2 small text-bg-secondary'> <div> <p class='my-auto'>Total Works</p> </div> <div> <p class='my-auto' id='total_works'> 0 </p> </div> </div>")

if (response.trim() != "error") {
 

  if (response.trim() != "0 result") {
    var obj = JSON.parse(response);
   
var count =0 
var emp_name = ""
  obj.forEach(function (obj) {
  
   count  = count + 1;

   var date_color = ""
   var date_icon = ""
  
if(obj.work_com_status =="complete")
{
 
 date_color = "text-success";
 date_icon = "fa-clipboard-check";
}
  else {
    
       if(parseFloat(obj.work_date1) < parseFloat(get_cur_millis())){
           date_color = "text-danger";
           date_icon = "fa-calendar-xmark";
               }
     
         else{
                 date_color = "text-success";
                 date_icon = "fa fa-clock-o";
               }
   }
  
$(".planned_works").append(" <div class='list-group-item list-group-item-action flex-column '> <div class='d-flex justify-content-between'> <div> <h6>"+obj.work_type + "</h6> </div> <div> <p class='text-muted'>"+obj.work_date+"</p> </div> </div> <p class='mb-1'>"+obj.work_description+"</p> <div class='d-flex justify-content-between align-items-center shadow-sm '> <div class=''> <h6 class='m-0 p-0 " + date_color + "'><i class='fa-solid " + date_icon + "'></i></h6></div> <div class=''> <p class='text-muted small'>"+obj.work_status+"</p></div> <div> <button class='btn btn-light show_history'><i class='fa-solid fa-caret-down' aria-hidden='true'></i></button> </div> </div> <div class='list-group his shadow-sm mt-1' style='max-height: 60vh; overflow-y: auto;'> <!-- history here -->"+ obj.his + "</div> </div>")
emp_name = obj.emp_name
  });
  $(".his").fadeToggle(0);
 $("#total_works").text(count)

  $("#selected_usr_txt").text(emp_name)
}
else
{
  $(".planned_works").append(" <div class='text-bg-secondary p-3 d-flex justify-content-center'><h6 class=''>No Work</h6> </div>")
}
console.log($(".planned_works").html());

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

   function get_att_req_sts(req_id)
   {

console.log(req_id);


$.ajax({
  url: "php/get_tour_approval_sts.php",
  type: "get", //send it through get method
  data: {
   
  req_id : req_id,
  
},
  success: function (response) {
console.log(response);

    $(".approval_sts").empty()
 

if (response.trim() != "error") {
 

  if (response.trim() != "0 result") {
    var obj = JSON.parse(response);
   
var count =0 
var emp_name = ""
  obj.forEach(function (obj) {
  
   count  = count + 1;

   var date_color = ""
   var date_icon = ""
  

 
  
$(".approval_sts").append(" <div class='list-group-item list-group-item-action flex-column '> <div class='d-flex justify-content-between'> <div> <h6 class='small'>"+obj.emp_name+ " - "+obj.sts + "</h6> </div></div> </div>")

  });




}
else
{
  $(".approval_sts").append(" <div class='text-bg-secondary p-3 d-flex justify-content-center'><h6 class=''>No Data</h6> </div>")
}
console.log($(".planned_works").html());

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
  
   function get_employee_tour()
   {

  

$.ajax({
  url: "php/get_emp_tour.php",
  type: "get", //send it through get method
  data: {
   
  emp_id : current_user_id,
 
  type : type_p

},
  success: function (response) {
console.log(response)
$("#req_data").empty()
if (response.trim() != "error") {
  
  if (response.trim() != "0 result") {
  var obj = JSON.parse(response);
var des = ""
var d =""

var count =0 
  obj.forEach(function (obj) {
  des =  "leave approval for "+ obj.reason +" from <span class = 'text-danger'>"+obj.from_date+" to "+obj.to_date + "</span>"
    $("#req_data").append(" <div class='list-group-item list-group-item-action flex-column '> <div class='d-flex justify-content-between'> <div><h6>"+obj.emp_name+"</h6></div><div><p class='text-muted'>"+obj.dated+"</p></div> </div> <p class='mb-1'><span class='text-muted'> "+ des + "</span></p> <div class= 'mb-1 p-1 small d-flex justify-content-between mt-1 shadow'> <button class='btn btn-light btn-sm delete_btn'  data-id='"+obj.id+"' ><i class='text-danger fa-solid fa-trash-can small'></i></button> <p class='my-auto fw-bold text-muted'> status : "+ obj.status +" </p> </div>  <div class='d-flex justify-content-between align-items-center shadow-sm '> <div class=''> <p class='text-secondary mb-0'> Planned Works </p> </div> <div> <button class='btn btn-light show_planned_works'  data-from_date='"+obj.from_date+"'  data-to_date='"+obj.to_date+"'><i class='fa-solid fa-caret-down' aria-hidden='true'></i></button> </div> </div> <div class='list-group planned_works shadow-sm mt-1 ' style='max-height: 75vh; overflow-y: auto;'> </div> <div class='mt-1 d-flex justify-content-between align-items-center shadow-sm '> <div class=''> <p class='text-secondary mb-0'> Approval Status </p> </div> <div> <button class='btn btn-light approval_sts_btn'  data-id='"+obj.id+"' ><i class='fa-solid fa-caret-down' aria-hidden='true'></i></button> </div> </div> <div class='list-group approval_sts shadow-sm mt-1 ' style='max-height: 75vh; overflow-y: auto;'> </div> </div>")
  
  });
  
  $(".planned_works").fadeToggle(0);
  $(".approval_sts").fadeToggle(0); 
 
}
else{
  $("#req_data").append(" <div class='text-bg-secondary p-3 d-flex justify-content-center'><h6 class=''>No Requests</h6> </div>")
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

   function get_today_date_only1(){
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    var hour = date.getHours();
    var mins = date.getMinutes();
  
console.log(mins)

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
 
    var today = day + "-" + month + "-" + year ; 
    return today;
   }

   function get_today_date_only(date)
   {
    

    // Function to format date as DD-MM-YYYY
    
      let day = String(date.getDate()).padStart(2, '0');
      let month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
      let year = date.getFullYear();
      return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
    
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