
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 
var urlParams = new URLSearchParams(window.location.search);

var emp_id = urlParams.get('emp_id');
var thismonth = 'UNIX_TIMESTAMP(DATE_FORMAT(NOW() ,"%Y-%m-01"))*1000'
var thisweek = 'UNIX_TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL(-WEEKDAY(CURDATE())) DAY))*1000'
var thisyear ='UNIX_TIMESTAMP(DATE_FORMAT(NOW() ,"%Y-01-01"))*1000'
var last3months = 'UNIX_TIMESTAMP(DATE_SUB(DATE_FORMAT(NOW() ,"%Y-%m-01"), INTERVAL 3 month))*1000'

var date_query_start = 'UNIX_TIMESTAMP(CURDATE())*1000'
var date_query_end = 'UNIX_TIMESTAMP( NOW())*1000'
var att_date_start = millis_to_date_only(get_today_start_millis())
var att_date_end = millis_to_date_only(get_cur_millis())

var work_data =[];
var lead_data =[];
var lead_out_data =[];
var exp_cat_data =[];

var emp_id_query = "0"
$(document).ready(function(){
 
  google.charts.load('current', {'packages':['corechart']});
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
     get_role();
    
  $("#unamed").text(localStorage.getItem("ls_uname"))



// get_employee();


$('#today_radio').change(function() {
  if(this.checked) {
  date_query_start = 'UNIX_TIMESTAMP(CURDATE())*1000'
  att_date_start = millis_to_date_only(get_today_start_millis())
  att_date_end = millis_to_date_only(get_cur_millis())
  get_report();
  }

});

  $('#thisweek_radio').change(function() {
    if(this.checked) {
      date_query_start = thisweek
      var now = new Date(); // Current date
      var dayOfWeek = now.getDay(); // Get the day of the week (0 - Sunday, 1 - Monday, ..., 6 - Saturday)
      var daysSinceMonday = (dayOfWeek + 6) % 7; // Calculate days since Monday (0 for Monday, 1 for Tuesday, ..., 6 for Sunday)
      var firstDayOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysSinceMonday); // Calculate the date for the Monday of the current week
      var firstDayOfWeekMillis = firstDayOfWeek.getTime(); // Get timestamp for the first day of the week
      
      att_date_start = millis_to_date_only(firstDayOfWeekMillis)
      get_report();
    }

   
});

    $('#thismonth_radio').change(function() {
      if(this.checked) {
        date_query_start = thismonth
        //first day of current month 
        var now = new Date(); // Current date
 
        var firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Set the day of the month to 1
        var firstDayOfMonthMillis = firstDayOfMonth.getTime(); 
       
        att_date_start = millis_to_date_only(firstDayOfMonthMillis)
        get_report();
      }
     
});
      $('#l3months_radio').change(function() {
        if(this.checked) {
          date_query_start = last3months
          var now = new Date(); 
var firstDayOfMonth = new Date(now.getFullYear(), now.getMonth() - 3, 1); // Subtract 3 months and set the day of the month to 1
var firstDayOfMonthMillis = firstDayOfMonth.getTime();

 att_date_start = millis_to_date_only(firstDayOfMonthMillis)
 get_report();
        }
        
});


        $('#thisyear_radio').change(function() {
          if(this.checked) {
            date_query_start = thisyear
            var now = new Date(); // Current date
              var firstDayOfYear = new Date(now.getFullYear(), 0, 1); // Set the month to January (0) and day to 1
              var firstDayOfYearMillis = firstDayOfYear.getTime(); // Get timestamp for the first day of the year

              att_date_start = millis_to_date_only(firstDayOfYearMillis);
              get_report();
          }
         
});

 $("#report_search_btn").click(function()
 {
  if($('#search_form')[0].checkValidity())
  {
    date_query_start = "'"+  get_millis($('#search_start_date').val()) + "'"
    date_query_end = "'"+  get_millis($('#search_end_date').val())+ "'"
  
    att_date_start =  millis_to_date_only(get_millis($('#search_start_date').val()))
      att_date_end = millis_to_date_only(get_millis($('#search_end_date').val()))
      get_report();
  }

 
//get_summary(get_millis($('#search_start_date').val()), get_millis($('#search_end_date').val()))
 });


 $('#sel_usr_in').change(function() {
  if($('#sel_usr_in').find(':selected').val() != '0')
    {
    emp_id_query = "exp_emp_id = " +  "'" +$('#sel_usr_in').find(':selected').val() + "'"
    $('#emp_txt').text(" - " + $('#sel_usr_in').find(':selected').text()) 
    }
    

  get_report();

   });




 $('#sel_role').change(function() {
  if($('#sel_role').find(':selected').val() != '0')
    {
    get_employee($('#sel_role').find(':selected').val())
    
    }
    



   });

});


function get_report()
{
  get_emp_att_report()
  get_work_report_chart();
get_work_report_detailed();
get_lead_report_chart();
get_lead_out_report_chart();
 get_task();
 get_tour_req();
  get_leave_req();
  get_exp_summary(); 
  get_sales_order(); 
}

function get_sales_order()
{
 

$.ajax({
  url: "php/get_sales_report_emp1.php",
  type: "get", //send it through get method
  data: {
emp_id : $('#sel_usr_in :selected').val(),
  },
  success: function (response) {
console.log(response);


    $('#order_table').empty()
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
     $('#order_table').append("<tr class = ''><td>"+count+"</td><td class = 'small' style='max-width: 50px;'>"+obj.order_no+"</td>><td class = 'small' style='max-width: 100px;'>"+obj.dated+"</td> <td class = 'small ' style='max-width: 250px;'>"+obj.pay_details+"</td> <td class = 'small ' style='max-width: 100px;'>"+obj.cus+"</td><td style='max-width: 250px;'><div>"+obj.pro+"</div></td></tr>")
     console.log(obj.pro);
  });

 
}
else{
 $('#order_table').append("<tr ><td colspan='10' scope='col'>No Data</td></tr>");

}
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}

function get_exp_summary()
{
  $.ajax({
    url: "php/get_exp_cat.php",
    type: "get", //send it through get method
    data: {
     emp_id_query : emp_id_query,
     date_query_start : date_query_start,
     date_query_end : date_query_end
    
   
   },
    success: function (response) {
console.log(response)
     $("#exp_table_summary").empty();
     exp_cat_data = []
     console.log(exp_cat_data)
if (response.trim() != "error") {
 if (response.trim() != "0 result") {
 var obj = JSON.parse(response);


var count =0 
var total =0

 obj.forEach(function (obj) {
 count =count +1 ;
 total = total + parseFloat(obj.amount)
   $("#exp_table_summary").append(" <tr><td>"+ count + "</td><td>"+ obj.exp_cat +  "</td><td>"+obj.amount +  "</td> </tr>")
   exp_cat_data .push([obj.exp_cat ,parseFloat(obj.amount)])
  
 });

 $("#total_exp_txt1").html("Toatl - &#x20B9 " + total)

 

}


else{
   $("#exp_table_summary").append("<tr> <td class='text-bg-danger' colspan='7'>No Data  </td> </tr>");

}
google.charts.setOnLoadCallback(draw_exp_cat);
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

function draw_exp_cat() {

 var data = new google.visualization.DataTable();
 data.addColumn('string', 'Source');
 data.addColumn('number', 'result');

 data.addRows(exp_cat_data);



 var options = {'title':'Expense category',
};

 
 var chart = new google.visualization.PieChart(document.getElementById('chart_exp_sts'));
 chart.draw(data, options);
}


function get_leave_req()
{
 

$.ajax({
  url: "php/get_emp_tour_sum_phone.php",
  type: "get", //send it through get method
  data: {
    emp_id:$('#sel_usr_in :selected').val(),
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
  
     $("#tlr_txt").text(obj.count)
     
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
    emp_id:$('#sel_usr_in :selected').val(),
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
  
     $("#ttrq_txt").text(obj.count)
     
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
    emp_id:$('#sel_usr_in :selected').val(),
   
  
},
  success: function (response) {

console.log(response);

if (response.trim() != "error") {
 if (response.trim() != "0 result" )
     {
  var obj = JSON.parse(response);



  obj.forEach(function (obj) {
  

     $("#tpen_txt").text(obj.pending)
    
     

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


function get_lead_out_report_chart()
{
  $.ajax({
    url: "php/emp_lead_out_summary_chart.php",
    type: "get", //send it through get method
    data: {
     emp_id:$('#sel_usr_in :selected').val(),
     start_date :date_query_start,
     end_date : date_query_end
   
   },
    success: function (response) {
     console.log(response)
    
   if (response.trim() != "error") {
     if (response.trim() != "0 result") {
    var obj = JSON.parse(response);
   
   var count = 0;
   lead_out_data =[];
   
    obj.forEach(function (obj) {
   
     lead_out_data .push([obj.report_cat ,parseInt(obj.count)])
     count = count + 1;

  
    
    });
   

  

              google.charts.setOnLoadCallback(draw_emp_lead_out);
   }
   else{
     // $("#summary_work_report_table").append(" <tr><td colspan='4' scope='col' class='text-bg-danger h6'>Sorry no data!</td></tr>")
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

function get_lead_report_chart()
{
  $.ajax({
    url: "php/emp_lead_summary_chart.php",
    type: "get", //send it through get method
    data: {
     emp_id:$('#sel_usr_in :selected').val(),
     start_date :date_query_start,
     end_date : date_query_end
   
   },
    success: function (response) {
     console.log(response)
    
   if (response.trim() != "error") {
     if (response.trim() != "0 result") {
    var obj = JSON.parse(response);
   
   var count = 0;
   lead_data =[];
   
    obj.forEach(function (obj) {
   
     lead_data .push([obj.date ,parseInt(obj.count)])
     count = count + 1;

  
    
    });
   

  

              google.charts.setOnLoadCallback(draw_emp_lead);
   }
   else{
     // $("#summary_work_report_table").append(" <tr><td colspan='4' scope='col' class='text-bg-danger h6'>Sorry no data!</td></tr>")
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

function get_work_report_detailed()
{
  $.ajax({
    url: "php/work_summary_report.php",
    type: "get", //send it through get method
    data: {
     emp_id:$('#sel_usr_in :selected').val(),
     start_date :date_query_start,
     end_date : date_query_end
   
   },
    success: function (response) {
   
     $("#summary_work_report_table").empty();
   if (response.trim() != "error") {
     if (response.trim() != "0 result") {
    var obj = JSON.parse(response);
   
   var count = 0;
   
    obj.forEach(function (obj) {
var work_type ="Lead Creation"
     if (obj.work_type != null)
     {
       work_type = obj.work_type;
     }

   count = count + 1;
     $("#summary_work_report_table") .append("<tr> <td>" + count + " </td> <td>" + work_type+ "</td> <td>" + obj.his_status + "</td> <td>" + obj.total + " </td> </tr>")
    });
   
   
   
   }
   else{
     $("#summary_work_report_table").append(" <tr><td colspan='4' scope='col' class='text-bg-danger h6'>Sorry no data!</td></tr>")
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

function get_work_report_chart()
{
  $.ajax({
    url: "php/work_summary_chart.php",
    type: "get", //send it through get method
    data: {
     emp_id:$('#sel_usr_in :selected').val(),
     start_date :date_query_start,
     end_date : date_query_end
   
   },
    success: function (response) {
     console.log(response)
    
   if (response.trim() != "error") {
     if (response.trim() != "0 result") {
    var obj = JSON.parse(response);
   
   var count = 0;
   work_data =[];
    obj.forEach(function (obj) {
   
     work_data .push([obj.date ,parseInt(obj.count)])
     count = count + 1;

  
    
    });
   

  

              google.charts.setOnLoadCallback(drawBackgroundColor);
   }
   else{
     // $("#summary_work_report_table").append(" <tr><td colspan='4' scope='col' class='text-bg-danger h6'>Sorry no data!</td></tr>")
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


function get_emp_att_report()
{
 if($('#sel_usr_in :selected').val() == 0)
 return

$.ajax({
  url: "php/get_emp_att_report.php",
  type: "get", //send it through get method
  data: {
  emp_id : $('#sel_usr_in :selected').val(),
astart_date : att_date_start,
aend_date : att_date_end

  },
  success: function (response) {
console.log(response)

if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {
   $('#atten_report_tbl').empty()
  var obj = JSON.parse(response);
var count =0 

var Datev = ""
var Att = ""
var report = ""

var tp_txt = 0
var ta_txt = 0
var tpa_txt = 0
var to_txt = 0
var sum_txt = 0

  obj.forEach(function (obj) {
     count = count +1;
     if(obj.Att_time_formatted == null)
     Att = " - "
   else
   Att =obj.Att_time_formatted
 if(obj.att_report == 'present')
 tp_txt = tp_txt + 1
else if(obj.att_report == 'absent')
ta_txt = ta_txt + 1
else if(obj.att_report == 'partial')
tpa_txt = tpa_txt + 1
if(obj.total_time != null)
sum_txt = sum_txt + parseFloat(obj.total_time)
$('#atten_report_tbl').append("<tr><td>"+count+"</td><td style='max-width: 100px;'>"+obj.Date+"</td><td style='max-width: 100px;'>"+Att+"</td><td style='max-width: 100px;'>"+obj.att_report+"</td><td style='max-width: 250px;'>"+obj.time_history+"</td></tr>")

  });

  $('#tp_txt').html(tp_txt)
  $('#ta_txt').html(ta_txt)
  $('#tpa_txt').html(tpa_txt)
  $('#to_txt').html(count)
  var att_millis = parseFloat(sum_txt) // Milliseconds

// Convert milliseconds to hours, minutes, and seconds



var milliseconds = (att_millis);

var totalSeconds = milliseconds
var hours = Math.floor(totalSeconds / 3600);
var minutes = Math.floor((totalSeconds % 3600) / 60);
var seconds = Math.floor(totalSeconds % 60);

     console.log('Hours: ' + hours + ', Minutes: ' + minutes + ', Seconds: ' + seconds);

  $('#sum_txt').html('Total App Working time <br/> ' + hours + ' Hrs : ' + minutes + ' Mins: ' + seconds  + ' Sec')
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

function get_role()
{
 

 $.ajax({
   url: "php/get_all_emp_role.php",
   type: "get", //send it through get method
   data: {
 
   
 },
  success: function (response) {

console.log(response);

if (response.trim() != "error") {

  var obj = JSON.parse(response);



  obj.forEach(function (obj) {
  
    
    $("#sel_role").append(" <option value='" + obj.emp_role + "'>" + obj.emp_role + "</option>");



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



function get_employee(role)
{
 

 $.ajax({
   url: "php/get_all_emp_role_based.php",
   type: "get", //send it through get method
   data: {
    role : role
   
 },
  success: function (response) {
    $("#sel_usr_in").empty();
    $("#sel_usr_in").append(" <option value='0'>Select User</option>")

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

function drawBackgroundColor() {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Date');
  data.addColumn('number', 'Works');

  data.addRows(work_data);

 

  var options = {
    title: 'Work Done Report',
    isStacked: true,
    height : 300,
    chartArea: {
      top: 30,
      height: 150 
   },
    hAxis: {
      title: 'Date',
       direction:-1,
        slantedText:true, 
        slantedTextAngle:90
    },
    vAxis: {
      title: 'Total Works'
    },
    backgroundColor: '#f1f8e9'
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}


function draw_emp_lead() {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Date');
  data.addColumn('number', 'Leads');

  data.addRows(lead_data);

 

  var options = {
    title: 'Marketing Leads Report',
    isStacked: true,
    height : 300,
    chartArea: {
      top: 30,
      height: 150 
   },
    hAxis: {
      title: 'Date',
       direction:-1,
        slantedText:true, 
        slantedTextAngle:90
    },
    vAxis: {
      title: 'Total Leads'
    },
    backgroundColor: '#f1f8e9'
  };
  
  var chart = new google.visualization.LineChart(document.getElementById('chart_emp_lead'));
  chart.draw(data, options);
}

function draw_emp_lead_out() {

  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Date');
  data.addColumn('number', 'result');

  data.addRows(lead_out_data);

 

  var options = {
    title: 'Marketing Leads Report',
    isStacked: true,
    height : 300,
    chartArea: {
      top: 30,
      height: 150 ,
      
   },
    hAxis: {
      title: 'Convertion Status',
       direction:-1,
        slantedText:true, 
        slantedTextAngle:90
    },
    vAxis: {
      title: 'Total Leads'
    },
    backgroundColor: '#f1f8e9'
  };
  
  var chart = new google.visualization.ColumnChart(document.getElementById('chart_emp_lead_out'));
  chart.draw(data, options);
}