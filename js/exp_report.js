

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
  var exp_cat_data =[];
  var current_user_id =  localStorage.getItem("ls_uid") ;
  var current_user_name =  localStorage.getItem("ls_uname") ; 
  var phone_id = urlParams.get('phone_id');

  var thismonth = 'UNIX_TIMESTAMP(DATE_FORMAT(NOW() ,"%Y-%m-01"))*1000'
var thisweek = 'UNIX_TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL(-WEEKDAY(CURDATE())) DAY))*1000'
var thisyear ='UNIX_TIMESTAMP(DATE_FORMAT(NOW() ,"%Y-01-01"))*1000'
var last3months = 'UNIX_TIMESTAMP(DATE_SUB(DATE_FORMAT(NOW() ,"%Y-%m-01"), INTERVAL 3 month))*1000'
var now_s = 'UNIX_TIMESTAMP( NOW())*1000'

var date_query_start = 'UNIX_TIMESTAMP(CURDATE())*1000'
var date_query_end = 'UNIX_TIMESTAMP( NOW())*1000'
var emp_id_query = '1'
$(document).ready(function(){
  google.charts.load('current', {'packages':['corechart']});
  check_login();
  get_exp()
  get_exp_summary()
  get_employee()
 
   $("#unamed").text(localStorage.getItem("ls_uname"))




   $('#today_radio').change(function() {
    if(this.checked) {
    date_query_start = 'UNIX_TIMESTAMP(CURDATE())*1000'
    }
    get_exp()
      get_exp_summary()
    });

    $('#thisweek_radio').change(function() {
      if(this.checked) {
        date_query_start = thisweek
      }
      get_exp()
        get_exp_summary()
      });

      $('#thismonth_radio').change(function() {
        if(this.checked) {
          date_query_start = thismonth
        }
        get_exp()
          get_exp_summary()
        });
        $('#l3months_radio').change(function() {
          if(this.checked) {
            date_query_start = last3months
          }
          get_exp()
            get_exp_summary()
          });

 
          $('#thisyear_radio').change(function() {
            if(this.checked) {
              date_query_start = thisyear
            }
            get_exp()
              get_exp_summary()
            });


            $('#report_search_btn').on('click', function()
{
  if($('#search_form')[0].checkValidity())
  {
    date_query_start = "'"+  get_millis($('#search_start_date').val()) + "'"
    date_query_end = "'"+  get_millis($('#search_end_date').val())+ "'"
    get_exp()
  get_exp_summary()
    console.log(date_query_start)
  }
 

});


$('#emp_list').change(function() {
    //$('#lead_source').find(':selected').text()
    if($('#emp_list').find(':selected').val() != '0')
    {
    emp_id_query = "exp_emp_id = " +  "'" +$('#emp_list').find(':selected').val() + "'"
    $('#emp_txt').text(" - " + $('#emp_list').find(':selected').text()) 
    }
    else
    {
        emp_id_query = '1'
        $('#emp_txt').text(" - All" ) 
    }

  
    get_exp()
  get_exp_summary()
     });

  



  


   });
   //

   function get_employee()
   {
    
   $.ajax({
     url: "php/get_employee.php",
     type: "get", //send it through get method
    
     success: function (response) {
   
   
   if (response.trim() != "error") {
   
     var obj = JSON.parse(response);
   
   
   
     obj.forEach(function (obj) {
     
       
       $("#emp_list").append(" <option value='" + obj.emp_id + "'>" + obj.emp_name + "</option>");
      
   
   
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

   function get_exp()
   {
    console.log(emp_id_query)
     $.ajax({
       url: "php/get_exp_report.php",
       type: "get", //send it through get method
       data: {
        emp_id_query : emp_id_query,
        date_query_start : date_query_start,
        date_query_end : date_query_end
       
      
      },
       success: function (response) {
console.log(response)
        $("#exp_table").empty();
      
if (response.trim() != "error") {
    if (response.trim() != "0 result") {
    var obj = JSON.parse(response);
  
  var des = ""
  var count =0 
  var total =0
    obj.forEach(function (obj) {
       
    count =count +1 ;
    total = total + parseFloat(obj.exp_amount)
      $("#exp_table").append(" <tr><td>"+ count + "</td><td>"+ obj.emp_name + "</td><td>"+ millis_to_date_only(parseFloat(obj.exp_date)) +  "</td><td>"+ obj.exp_cat +  "</td><td>"+ obj.exp_des +  "</td><td>"+obj.exp_amount +  "</td> </tr>")
     
     
    });
  
    $("#total_exp_txt").html("Toatl - &#x20B9 " + total)
  
  }
  
  else{
      $("#exp_table").append("<tr> <td class='text-bg-danger' colspan='7'>No Data  </td> </tr>");
  
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

function millis_to_date_only( millis)
{

  if(millis != 0)
  {
    var d = new Date(millis); // Parameter should be long valu
  
    return d.toLocaleDateString('en-GB');
  }
  else
  {
    return ''
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
  
console.log(mins)

    if (month < 10) 
    month = "0" + month;
    if (day < 10) 
    day = "0" + day;
    if (hour < 10) 
    hour = "0" + hour;

    if (mins < 10) 
    mins = "0" + mins;
 
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