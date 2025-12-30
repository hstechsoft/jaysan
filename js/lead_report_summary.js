
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
var lead_data =[];
var lead_cat_data =[];
var cus_id = '0';
var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ;  

var thismonth = 'UNIX_TIMESTAMP(DATE_FORMAT(NOW() ,"%Y-%m-01"))*1000'
var thisweek = 'UNIX_TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL(-WEEKDAY(CURDATE())) DAY))*1000'
var thisyear ='UNIX_TIMESTAMP(DATE_FORMAT(NOW() ,"%Y-01-01"))*1000'
var last3months = 'UNIX_TIMESTAMP(DATE_SUB(DATE_FORMAT(NOW() ,"%Y-%m-01"), INTERVAL 3 month))*1000'
var now_s = 'UNIX_TIMESTAMP( NOW())*1000'

var lead_source = '1'
var date_query_start = 'UNIX_TIMESTAMP(CURDATE())*1000'
var date_query_end = 'UNIX_TIMESTAMP( NOW())*1000'
$(document).ready(function(){
 
    google.charts.load('current', {'packages':['corechart']});

  // SELECT count(report_master.report_cat) as count,report_master.report_cat from report_master WHERE concat(report_master.work_type, ' - ', report_master.work_status) in (SELECT max(CONCAT(work.work_type, ' - ', work.work_status)) FROM `lead` INNER JOIN work ON lead.work_id = work.pipeline_id WHERE lead.dated BETWEEN 0 and 1 GROUP BY lead.work_id) GROUP by report_master.report_cat

 check_login();

 get_lead()
get_lead_source()
get_lead_report_chart()
get_lead_cat_report_chart()
get_lead_cat_report_chart()
   $("#unamed").text(localStorage.getItem("ls_uname"))
  // $("#tlead_att_on").text(localStorage.getItem("ls_uname"))

 
//   $("#leads_table").on("click","tr td a", function(event) {
//     //get button value
    
//         });

$('#lead_source').change(function() {
  //$('#lead_source').find(':selected').text()
  if($('#lead_source').find(':selected').val() != '0')
  lead_source = "lead_source = " +  "'" +$('#lead_source').find(':selected').text() + "'"
  else
  lead_source = '1'

  get_lead()
  get_lead_report_chart()
  get_lead_cat_report_chart()
   });


   $('#today_radio').change(function() {
    if(this.checked) {
    date_query_start = 'UNIX_TIMESTAMP(CURDATE())*1000'
    }
    get_lead()
    get_lead_report_chart()
    get_lead_cat_report_chart()
    });

    $('#thisweek_radio').change(function() {
      if(this.checked) {
        date_query_start = thisweek
      }
      get_lead()
      get_lead_report_chart()
      get_lead_cat_report_chart()
      });

      $('#thismonth_radio').change(function() {
        if(this.checked) {
          date_query_start = thismonth
        }
        get_lead()
        get_lead_report_chart()
        get_lead_cat_report_chart()
        });
        $('#l3months_radio').change(function() {
          if(this.checked) {
            date_query_start = last3months
          }
          get_lead()
          get_lead_report_chart()
          get_lead_cat_report_chart()
          });

 
          $('#thisyear_radio').change(function() {
            if(this.checked) {
              date_query_start = thisyear
            }
            get_lead()
            get_lead_report_chart()
            get_lead_cat_report_chart()
            });


            $('#report_search_btn').on('click', function()
{
  if($('#search_form')[0].checkValidity())
  {
    date_query_start = "'"+  get_millis($('#search_start_date').val()) + "'"
    date_query_end = "'"+  get_millis($('#search_end_date').val())+ "'"
    get_lead()
    get_lead_report_chart()
get_lead_cat_report_chart()
    console.log(date_query_start)
  }
 

});

   });


   function draw_lead_source_cat() {

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Source');
    data.addColumn('number', 'result');

    data.addRows(lead_cat_data);

   

    var options = {'title':'lead source category',
   };

    
    var chart = new google.visualization.PieChart(document.getElementById('chart_lead_source'));
    chart.draw(data, options);
  }


 function get_lead_cat_report_chart()
   {
     $.ajax({
       url: "php/lead_cat_chart.php",
       type: "get", //send it through get method
       data: {
       
        start_date :date_query_start,
        end_date : date_query_end
      
      },
       success: function (response) {
        console.log(response)
       
      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
       var obj = JSON.parse(response);
      
      var count = 0;
      lead_cat_data =[];
      
       obj.forEach(function (obj) {
      
        lead_cat_data .push([obj.lead_source ,parseInt(obj.count)])
        count = count + 1;

     
       
       });
      
   
     

                 google.charts.setOnLoadCallback(draw_lead_source_cat);
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
       url: "php/lead_summary_chart.php",
       type: "get", //send it through get method
       data: {
        lead_source : lead_source,
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
      
        lead_data .push([obj.sts ,parseInt(obj.total_lead)])
        count = count + 1;

     
       
       });
      
   
     

                 google.charts.setOnLoadCallback(draw_lead_source);
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


   function draw_lead_source() {

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Date');
    data.addColumn('number', 'result');

    data.addRows(lead_data);

   

    var options = {
      title: 'Lead Report',
      isStacked: true,
      height : 600,
      chartArea: {
        top: 100,
        height: 300 ,
        
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
    
    var chart = new google.visualization.ColumnChart(document.getElementById('chart_lead_sts'));
    chart.draw(data, options);
  }


   

   function get_lead_source()
   {
 $.ajax({
  url: "php/get_lead_source.php",
  type: "get", //send it through get method
  data: {
  
   
 
 },
  success: function (response) {
 
 
 if (response.trim() != "error") {
   if (response.trim() != "0 result") {
  var obj = JSON.parse(response);
 
 
 
  obj.forEach(function (obj) {
      
    
     $("#lead_source").append(" <option value='" + obj.lead_source + "'>" + obj.lead_source + "</option>");
    
   
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


  

  
  


   function get_lead()
   {
     $.ajax({
       url: "php/get_lead_report.php",
       type: "get", //send it through get method
       data: {
        emp_id : current_user_id,
        date_query_start : date_query_start,
        date_query_end : date_query_end
       
      
      },
       success: function (response) {
console.log(response)
        $("#leads_table").empty();
      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
       var obj = JSON.parse(response);
      
      var count = 0;
      console.log(obj)
      obj.forEach(function (obj) {
        
var com= obj.comments
com = com.replace(/\n/g, '<br><br><i class="fa-solid fa-turn-down h4"></i>'+'( 10-02-2023)');
        console.log(com)
      count = count + 1;

      $('#leads_table').append("<tr><td>"+count+"</td><td>"+obj.cus_name+"</td><td>"+obj.work_des+"</td><td>"+obj.cur_work+"</td><td>"+obj.comments+"</td><td>"+obj.lead_date+"</td><td>"+obj.report+"</td></td><td>"+obj.lead_source+"</td></td><td>" + "<a target='_blank' href='user_call.html?cus_id=" + obj.cus_id + "' class='btn btn-primary btn-sm' role='button'>View</a>" + "</td></tr>")
        
       });
      
       
      
      }
      else{
        $("#leads_table") .append("<tr class = 'text-bg-danger'><td colspan='9' scope='col'>No Data</td></tr>");
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
   

  

 
  function get_customer_autocomplete()
  {
    
       var cusname =  $('#search_cus_text').val() + '%';
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

function create_listner()
{
  var res = ""
  $.ajax({
    url: "php/insert_listner.php",
    type: "get", //send it through get method
    async : false,
    data: {
     
  
  },
    success: function (response) {

 

  res =  response
  
      
    },
    error: function (xhr) {
        //Do Something to handle error
    }
  });

  return res

}


function check_listner(listner_id)
  {
  var res = ""
      $.ajax({
        url: "php/check_listner.php",
        type: "get", //send it through get method
        async : false,
        data: {
         
         listner_id: listner_id
       },
        success: function (response) {
       console.log(response)
       
       if (response.trim() != "error") {
         if (response.trim() != "0 result") {
        var obj = JSON.parse(response);
       
       
      
        obj.forEach(function (obj) {
       
        res = obj.response
       
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
   
return res

  }