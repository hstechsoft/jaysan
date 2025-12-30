

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
  
  var cus_id = '0';
  var budget_data =[];
  var total_income_month = 0
  var total_income_year = 0
  var total_savings_month = 0
  var total_savings_year = 0
  var total_expenses_month = 0
  var total_expenses_year = 0

  var urlParams = new URLSearchParams(window.location.search);
  var pbid = urlParams.get('pbid');
  if(pbid == null)
  pbid = 0
$(document).ready(function(){

  google.charts.load('current', {'packages':['corechart']});
  get_budget_details()
get_budget("#print_savings_table","budget_savings")
get_budget("#print_misc_table","budget_misc")
get_budget("#print_holiday_exp_table","budget_holiday_exp")
get_budget("#print_festival_exp_table","budget_festival_exp")
get_budget("#print_health_exp_table","budget_health_exp")
get_budget("#print_movies_exp_table","budget_movies_exp")
get_budget("#print_insurance_table","budget_insurance_exp")
get_budget("#print_child_exp_table","budget_child_exp")
get_budget("#print_loan_table","budget_loan_exp")
get_budget("#print_income_table","budget_income")
get_budget("#print_home_exp_table","budget_home_exp")
get_budget("#print_tax_table","budget_tax_exp")
budget_summary_chart();

$("#print_btn").on("click", function()
   {
    
   
    $('#print').printThis({
      
      
      
     
    });
   });


   });
   //
 
function budget_summary_chart()
{
  $.ajax({
    url: "php/budget_summary_chart.php",
    type: "get", //send it through get method
    data: {
     pbid : pbid,
    
   
   },
    success: function (response) {
     console.log(response)
    
   if (response.trim() != "error") {
     if (response.trim() != "0 result") {
    var obj = JSON.parse(response);
   
   var count = 0;
   budget_data =[];
   
    obj.forEach(function (obj,key) {

     budget_data .push(["total_savings" ,parseInt(obj.total_savings)])
     budget_data .push(["total_income" ,parseInt(obj.total_income)])
     budget_data .push(["total_expenses" ,parseInt(obj.total_expenses)])

  
    
    });
   

  

              google.charts.setOnLoadCallback(draw_budget_bar);
              google.charts.setOnLoadCallback(draw_budget_pie);
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

function draw_budget_pie() {

  var data = google.visualization.arrayToDataTable([
    ["details", "amount"],
    ["Income", total_income_year],
    [" Savings",total_savings_year],
    [" Expenses", total_expenses_year]
  ]);

  var options = {
 

  colors: ['#0D6EFD', '#198754', '#FFC107'],
  is3D: false
  };

  var chart = new google.visualization.PieChart(document.getElementById('chart_budget_pie'));

  chart.draw(data, options);
}

function draw_budget_bar() {

  var data = new google.visualization.DataTable();
  var data = google.visualization.arrayToDataTable([
    ["details", "amount", { role: "style" } ],
    [" Income", total_income_year, "#0D6EFD"],
    ["Savings",total_savings_year, "#198754"],
    [" Expenses", total_expenses_year, "#FFC107"]
  ]);

  var view = new google.visualization.DataView(data);
  view.setColumns([0, 1,
                   { calc: "stringify",
                     sourceColumn: 1,
                     type: "string",
                     role: "annotation" },
                   2]);

  var options = {
    title: "performa of a Budget",
    
   
    bar: {groupWidth: "75%"},
    legend: { position: "none" },
  };
  
  var chart = new google.visualization.ColumnChart(document.getElementById('chart_budget_bar'));
  chart.draw(view, options);
}

   function check_login()
   {
    
    if (localStorage.getItem("logemail") == null) {
      window.location.replace("login.html");
  }
   }

   function get_budget(table,mytable)
   {
    
$.ajax({
    url: "php/get_budget.php",
    type: "get", //send it through get method
    data: {
       pbid :pbid,
       mytable : mytable
      
    
  },
  success: function (response) {

    $(table).empty();
  if (response.trim() != "error") {
    if (response.trim() != "0 result") {
   var obj = JSON.parse(response);
  
  var count = 0;

  var month_total =0 
  var year_total =0 
  obj.forEach(function (obj) {
    month_total =  month_total+ parseFloat(obj.monthly)
    year_total =  year_total+parseFloat(obj.yearly)
  
    let nf = new Intl.NumberFormat('en-US');
   


  $(table).append("<tr><td class='text-start col-6'>"+obj.col_name+"</td><td class = 'col-3'>"+"<div class='d-flex justify-content-between'><div> &#x20b9;</div><div>" + formatNumber(obj.monthly)+ "</div></div>"+"</td><td class = 'col-3'>"+"<div class='d-flex justify-content-between'><div> &#x20b9;</div><div>"+ formatNumber(obj.yearly) + "</div></div>"+"</td></tr>")
    
   });
 
   $(table).append("<tr class='text-bg-secondary bg-opacity-50 '><th class='col-6'>"+"Total"+"</th><th  class = 'col-3'>"+"<div class='d-flex justify-content-between'><div> &#x20b9;</div><div>"+ formatNumber(month_total) + "</div></div>"+"</th><th  class = 'col-3'>"+"<div class='d-flex justify-content-between'><div> &#x20b9;</div><div>"+ formatNumber(year_total) + "</div></div>"+"</th></tr>")
  

   switch(mytable)
   {
   case "budget_savings" : 
   {
    total_savings_month = parseFloat(month_total)
    total_savings_year = parseFloat(year_total)
    break;
   }
   case "budget_income":
    {
      
      total_income_month = parseFloat(month_total)
      total_income_year = parseFloat(year_total)
      break;
    }

    default : 
    {
      console.log(month_total)
      total_expenses_month = parseFloat(total_expenses_month) +  parseFloat(month_total)
      total_expenses_year = parseFloat(total_expenses_year) +  parseFloat(year_total)
    }
   



}

$("#sum_income_month").empty()
$("#sum_income_yearly").empty()
$("#sum_savings_month").empty()
$("#sum_savings_yearly").empty()
$("#sum_expenses_month").empty()
$("#sum_expenses_yearly").empty()

$("#sum_income_month").append("<div class='d-flex justify-content-between'><div> &#x20b9;</div><div>"+ formatNumber(total_income_month) + "</div></div>")

$("#sum_income_yearly").append("<div class='d-flex justify-content-between'><div> &#x20b9;</div><div>"+ formatNumber(total_income_year) + "</div></div>")
$("#sum_savings_month").append("<div class='d-flex justify-content-between'><div> &#x20b9;</div><div>"+ formatNumber(total_savings_month) + "</div></div>")

$("#sum_savings_yearly").append("<div class='d-flex justify-content-between'><div> &#x20b9;</div><div>"+ formatNumber(total_savings_year) + "</div></div>")

$("#sum_expenses_month").append("<div class='d-flex justify-content-between'><div> &#x20b9;</div><div>"+ formatNumber(total_expenses_month) + "</div></div>")

$("#sum_expenses_yearly").append("<div class='d-flex justify-content-between'><div> &#x20b9;</div><div>"+ formatNumber(total_expenses_year) + "</div></div>")

  }
  else{
    $(table) .append("<tr class = 'text-bg-danger'><td colspan='9' scope='col'>No Data</td></tr>");
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

   function get_budget_details()
   {
    
$.ajax({
    url: "php/get_budget_details.php",
    type: "get", //send it through get method
    data: {
       pbid :pbid,
       
      
    
  },
  success: function (response) {

   
  if (response.trim() != "error") {
    if (response.trim() != "0 result") {
      var obj = JSON.parse(response);
  obj.forEach(function (obj) {
   $("#print_cus_name").text(obj.cus_name)
   $("#print_cus_phone").text(obj.phone1)
   $("#print_dated").text(millis_to_date_only(parseFloat(obj.dated)))

   $("#print_cus_name1").text(obj.cus_name)
   $("#print_cus_phone1").text(obj.phone1)
   $("#print_dated1").text(millis_to_date_only(parseFloat(obj.dated)))
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

   function formatNumber (num) {
   return (new Intl.NumberFormat('en-IN').format(num));

}


   function insert_personal_budget()
   {
    
$.ajax({
    url: "php/insert_personal_budget.php",
    type: "get", //send it through get method
    data: {
      dated : get_cur_millis(),
      cus_name : $("#cus_name").val(),
      phone1 : $("#phone").val(),
      phone2 : $("#alternate_phone").val(),
      email	: $("#email").val(),
      status : "new"	
      
       
  },
    success: function (response) {
 
  
  insert_details(response.trim())
 
  
  
      
    },
    error: function (xhr) {
        //Do Something to handle error
    }
  });
   }
  

function val_phone(phone)
{
  var regex = /^[6-9][0-9]{9}$/;
  if (regex.test(phone)) {
   return true
} else {
   return false
}
}


function get_prograss(no)
{
  var progrss = parseInt(no)/12;
 
progrss = progrss * 100;
progrss = parseInt(progrss)
return progrss;
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

function millis_to_date_only( millis)
{
  var d = new Date(millis); // Parameter should be long value

  
return d.toLocaleDateString('en-GB');

}