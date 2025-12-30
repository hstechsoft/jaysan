

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
  var emp_id = urlParams.get('emp_id');
var his_query="SELECT * FROM expense_payment   where emp_id=" + emp_id
var query_exp = "SELECT * FROM expense inner join employee on employee.emp_id = expense.exp_emp_id where exp_emp_id=" + emp_id
$(document).ready(function(){

  check_login();
 get_expense();
 get_payment_history();
 get_employee();

   $("#unamed").text(localStorage.getItem("ls_uname"))

   $("#search_emp_txt").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#exp_table tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  
  $('#sel_all_chk').change(function() {
    if(this.checked) {
       
  $("#exp_table_single tr").each(function () {
    
    var this_row = $(this);
this_row.find('td:eq(5) input:checkbox')[0].checked = true
});
    }
    
    else{
        $("#exp_table_single tr").each(function () {
    
            var this_row = $(this);
        this_row.find('td:eq(5) input:checkbox')[0].checked = false
        });
    }
          
});
 
$('#sel_usr_in').change(function() {
  
  if( $('#sel_usr_in').find(":selected").val()>0)
{

  if( $('#sel_exp_sts_in').find(":selected").val() != "0")
  {
    query_exp = "SELECT expense.*,employee.emp_name FROM expense inner join employee on employee.emp_id = expense.exp_emp_id where exp_emp_id=" + $('#sel_usr_in').find(":selected").val ()+ " and exp_approve = '"+ $('#sel_exp_sts_in').find(":selected").val() +"'"
    
    his_query = "SELECT * FROM expense_payment   where emp_id=" +  $('#sel_usr_in').find(":selected").val ()
    get_payment_history()
    get_expense();
  }
  else{
    query_exp = "SELECT expense.*,employee.emp_name FROM expense inner join employee on employee.emp_id = expense.exp_emp_id where exp_emp_id=" + $('#sel_usr_in').find(":selected").val() 
    his_query = "SELECT * FROM expense_payment   where emp_id=" +  $('#sel_usr_in').find(":selected").val ()
    get_payment_history() 
    get_expense();
  }

}


 });

 $('#sel_exp_sts_in').change(function() {
  
  if( $('#sel_exp_sts_in').find(":selected").val()!= "0")
{

  if( $('#sel_usr_in').find(":selected").val() > 0)
  {
    query_exp = "SELECT expense.*,employee.emp_name FROM expense inner join employee on employee.emp_id = expense.exp_emp_id where exp_emp_id=" + $('#sel_usr_in').find(":selected").val ()+ " and exp_approve = '"+ $('#sel_exp_sts_in').find(":selected").val()  +"'"

    his_query = "SELECT * FROM expense_payment   where emp_id="+  $('#sel_usr_in').find(":selected").val ()
    get_payment_history()
    get_expense();
  }
  else{
   
    query_exp = "SELECT expense.*,employee.emp_name FROM expense inner join employee on employee.emp_id = expense.exp_emp_id where exp_emp_id=" + emp_id + " and exp_approve = '"+ $('#sel_exp_sts_in').find(":selected").val() +"'"
    
    his_query = "SELECT * FROM expense_payment   where emp_id=" + emp_id
    get_payment_history()
    get_expense();
  }

}


 });


 $('#view_history_btn').click(function () {
  $('#history_model').modal('show'); 
  });


  
 $('#pay_emp_btn').click(function () {
  $('#emp_pay_model').modal('show'); 
  });


  $('#submit_emp_btn').click(function () {
   insert_emp_pay();
    });

  
 $('#submit_exp_btn').click(function () {
  if($('#sel_expc_sts_in').find(":selected").val() == "0")
  {
    salert("status","kindly choose status","warning")
    return
  }
  $("#exp_table_single tr").each(function () {
    console.log($('#sel_expc_sts_in').find(":selected").val())
    var this_row = $(this);
    if(this_row.find('td:eq(5) input:checkbox')[0].checked)
    update_expense((this_row.find('td:eq(5) input:checkbox')[0].value) , $('#sel_expc_sts_in').find(":selected").val())
// console.log(this_row.find('td:eq(5) input:checkbox')[0].value)
else
console.log("no")
});
location.reload();
  });

   });
   //
 function insert_emp_pay(){
  var paid_date = 0
console.log(($("#pay_date").val()))
  if($("#emp_pay_amount").val()=="")
  {
    salert("Amount","kindly enter Amount","warning")
    return
  }
  else
  {
if ($("#pay_date").val() =="")
{
  paid_date = get_cur_millis();
}
else 
{
  paid_date =  get_millis($("#pay_date").val())
}
  }
  $.ajax({
    url: "php/insert_expense_pay.php",
    type: "get", //send it through get method
    data: {
      emp_id : emp_id,
      paid_amount : $("#emp_pay_amount").val(),
      paid_date : paid_date
  
  },
    success: function (response) {
  console.log(response)
  
  
   location.reload();
  
  
      
    },
    error: function (xhr) {
        //Do Something to handle error
    }
  });
 }

   function update_expense(exp_id,exp_approve)
   {



$.ajax({
  url: "php/update_expense.php",
  type: "get", //send it through get method
  async : false,
  data: {
    exp_id : exp_id,
    exp_approve : exp_approve
  
},
  success: function (response) {
console.log(response)


 


    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }

   function get_employee()
   {
    
   
   $.ajax({
     url: "php/get_employee.php",
     type: "get", //send it through get method
    
     success: function (response) {
   
   
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
    
    if (localStorage.getItem("logemail") == null) {
      window.location.replace("login.html");
  }
   }

  
   function get_expense()
   {



$.ajax({
  url: "php/get_expense_single.php",
  type: "get", //send it through get method
  data: {
   query : query_exp
  
},
  success: function (response) {
console.log(response)
$("#exp_table_single").empty();
if (response.trim() != "error") {
  if (response.trim() != "0 result") {
  var obj = JSON.parse(response);
  

var count =0 
  obj.forEach(function (obj) {
  
   count  = count + 1;

  
var exp_sts = ""
    if(obj.exp_approve == "yes")
    exp_sts  = "Approved"
    else if(obj.exp_approve == "no")
    exp_sts  = "Not Approved"
    else if(obj.exp_approve == "decline")
    exp_sts  = "Declined"
    $("#exp_table_single").append(" <tr> <td>"+ count + "</td> <td>"+ millis_to_date(parseFloat(obj.exp_date)) + "</td><td>"+ obj.exp_cat +  " " + obj.exp_des + "</td> <td>"+ obj.exp_amount + "</td> <td>"+ exp_sts + "</td> <td><input class='form-check-input' value = '"+obj.exp_id + "'type='checkbox' value=''> </td> </tr>")

    $("#selected_usr").text("Employee - " + obj.emp_name);
  });

 
}
else{
 
  $("#exp_table_single").append("<tr> <td colspan='6'>No Data  </td> </tr>");
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

   function get_payment_history()
   {


$.ajax({
  url: "php/get_expense_single.php",
  type: "get", //send it through get method
  data: {
   query : his_query + " order by paid_date DESC"
  
},
  success: function (response) {
console.log(response)
$("#exp_payment_tbl").empty();
if (response.trim() != "error") {
  if (response.trim() != "0 result") {
  var obj = JSON.parse(response);
  

var count =0 
var total =0
  obj.forEach(function (obj) {
  
   count  = count + 1;

  total = total + parseFloat(obj.paid_amount);

   
    $("#exp_payment_tbl").append(" <tr> <td>"+ count + "</td> <td>"+ millis_to_date(parseFloat(obj.paid_date)) + "</td><td>"+ obj.paid_amount+ "</td></tr>")

   
  });

  $("#exp_payment_tbl").append("<tr class='text-bg-warning'> <td colspan='2'> Total Amount </td> <td>" + total + "</td> </tr>" )
}
else{
 
  $("#exp_payment_tbl").append("<tr > <td colspan='4'>No Data  </td> </tr>");
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