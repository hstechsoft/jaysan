
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
  var urlParams = new URLSearchParams(window.location.search);
  var emp_id = urlParams.get('emp_id');
  var thismonth = 'UNIX_TIMESTAMP(DATE_FORMAT(NOW() ,"%Y-%m-01"))*1000'
  var thisweek = 'UNIX_TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL(-WEEKDAY(CURDATE())) DAY))*1000'
  var thisyear ='UNIX_TIMESTAMP(DATE_FORMAT(NOW() ,"%Y-01-01"))*1000'
  var last3months = 'UNIX_TIMESTAMP(DATE_SUB(DATE_FORMAT(NOW() ,"%Y-%m-01"), INTERVAL 3 month))*1000'

  var date_query_start = 'UNIX_TIMESTAMP(CURDATE())*1000'
var date_query_end = 'UNIX_TIMESTAMP( NOW())*1000'

 
 var work_data =[];
 var lead_data =[];
 var lead_out_data =[];

 var current_user_id =  localStorage.getItem("ls_uid") ;
$(document).ready(function(){
// google chart
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
  
//   get_employee();
  get_work_type();
 
   $("#unamed").text(localStorage.getItem("ls_uname"))
 
   $('#today_radio').change(function() {
    if(this.checked) {
    date_query_start = 'UNIX_TIMESTAMP(CURDATE())*1000'
    }
    get_work_report_detailed()
   get_lead_report_chart()
  get_call_log(); 
  get_work_report_chart();
  get_lead_out_report_chart();
  
 });

    $('#thisweek_radio').change(function() {
      if(this.checked) {
        date_query_start = thisweek
      }
      get_work_report_detailed()

 ;     get_lead_report_chart()
  get_call_log();  
  get_work_report_chart();
  get_lead_out_report_chart();
  });

      $('#thismonth_radio').change(function() {
        if(this.checked) {
          date_query_start = thismonth
        }
        get_work_report_detailed()

 ;       get_lead_report_chart()
  get_call_log();      
  get_work_report_chart();
  get_lead_out_report_chart();
});
        $('#l3months_radio').change(function() {
          if(this.checked) {
            date_query_start = last3months
          }
          get_work_report_detailed()

 ;         get_lead_report_chart()
  get_call_log();     
  get_work_report_chart();
  get_lead_out_report_chart();
});

 
          $('#thisyear_radio').change(function() {
            if(this.checked) {
              date_query_start = thisyear
            }
            get_work_report_detailed()

            get_lead_report_chart()
  get_call_log();        
  get_work_report_chart();
  get_lead_out_report_chart();
});
  
   $("#report_search_btn").click(function()
   {
    if($('#search_form')[0].checkValidity())
    {
      date_query_start = "'"+  get_millis($('#search_start_date').val()) + "'"
      date_query_end = "'"+  get_millis($('#search_end_date').val())+ "'"
      get_work_report_detailed();
      get_lead_report_chart();
      get_call_log();
      
    }


//get_summary(get_millis($('#search_start_date').val()), get_millis($('#search_end_date').val()))
   });
  

//    $('#sel_usr_in').change(function() {
//     get_work_report_detailed();
//     get_work_report_chart();
//     get_lead_out_report_chart();
//     get_lead_report_chart()
//     get_call_log();

//      });

   });


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

   function get_summary(start_date,end_date)
   {
     $.ajax({
       url: "php/get_summary.php",
       type: "get", //send it through get method
       data: {
      
        today_start :start_date,
        today_end :end_date
      
      },
       success: function (response) {
        
       
      if (response.trim() != "error") {
        if (response.trim() != "0 results") {
       var obj = JSON.parse(response);
      
 
      
       obj.forEach(function (obj) {


        $("#total_sale_txt").text(obj.total_sale)
        $("#total_sale_amount_txt").text(obj.total_sale_amount)

        $("#total_service_txt").text(obj.total_service)
        $("#total_service_amount_txt").text(obj.total_service_amount)

        $("#total_restamping_txt").text(obj.total_restamping)
        $("#total_restamping_amount_txt").text(obj.total_restamping_amount)
       
        $("#total_lead_txt").text(obj.total_lead)

       });
   
      }
      else{
        
      }
      
    }
      
      
         
       },
       error: function (xhr) {
           //Do Something to handle error
       }
      });
   }

   function get_call_log()
   {
     $.ajax({
       url: "php/get_call_log.php",
       type: "get", //send it through get method
       data: {
        emp_id_p:current_user_id,
        today_start :date_query_start,
        today_end : date_query_end
      
      },
       success: function (response) {
        
        $("#phone_call_history").empty();
      if (response.trim() != "error") {
        if (response.trim() != "0 results") {
       var obj = JSON.parse(response);
      
 
      
       obj.forEach(function (obj) {
var webname = "No Entry";
var phonename = "No caller ID"
if( obj.cus_name !=null)
{
webname = obj.cus_name
}


if( obj.call_name !="null")
{
  phonename = obj.call_name
}


        $("#phone_call_history") .append(" <tr> <td> <div class='d-flex justify-content-between mb-1'> <div> <h6 id='webname'> " + webname + " </h6> <p class='small text-danger' id='phonename'><span><i class='fa-solid fa-phone'></i> </span>" + phonename + "</p> </div> <div> <p class='small' id='phone_number'> " + obj.phone_number + " </p> </div> <div><p class='small' id='call_date'> " + millis_to_date(parseFloat(obj.call_date))  + "</p></div> <div><p class='small' id='duration'>  " + obj.call_duration  + "</p></div> <div><p class='small' id='calltype'>  " + obj.call_type  + "</p></div> </div> </td> </tr>")
       });
   
      }
      else{
        $("#phone_call_history").append("<div class='text-bg-warning h6 py-2 text-center'>Sorry no Call Log!</div>")
      }
      
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
        emp_id:current_user_id,
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


   
   function get_lead_report_chart()
   {
     $.ajax({
       url: "php/emp_lead_summary_chart.php",
       type: "get", //send it through get method
       data: {
        emp_id:current_user_id,
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


   function get_lead_out_report_chart()
   {
     $.ajax({
       url: "php/emp_lead_out_summary_chart.php",
       type: "get", //send it through get method
       data: {
        emp_id:current_user_id,
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


   function get_work_report_detailed()
   {
     $.ajax({
       url: "php/work_summary_report.php",
       type: "get", //send it through get method
       data: {
        emp_id:current_user_id,
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
   
     var obj = JSON.parse(response);
   
   
   
     obj.forEach(function (obj) {
     
       
       $("#sel_usr_in").append(" <option value='" + obj.emp_id + "'>" + obj.emp_name + "</option>");
   
   
   
     });
     if(emp_id !=null)
     {
     
       $('#sel_usr_in').val(emp_id)
       get_work_report_detailed()
get_work_report_chart()
       get_call_log(); 
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
    
    if (localStorage.getItem("logemail") == null) {
      window.location.replace("login.html");
  }
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