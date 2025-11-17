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

  var current_user_id =  localStorage.getItem("ls_uid") ;
  var current_user_name =  localStorage.getItem("ls_uname") ; 
  var phone_id = urlParams.get('phone_id');

  var work_id = urlParams.get('work_id');

  if(work_id == null)
  work_id = 0
$(document).ready(function(){
 
  check_login();

  get_exp_cat_all()
   $("#unamed").text(localStorage.getItem("ls_uname"))

   $('#pay_date').val(get_today_date());
  
  $('#sel_all_chk').change(function() {
    if(this.checked) {
       
  $("#exp_table tr").each(function () {
    
    var this_row = $(this);
this_row.find('td:eq(5) input:checkbox')[0].checked = true
});
    }
    
    else{
        $("#exp_table tr").each(function () {
    
            var this_row = $(this);
        this_row.find('td:eq(5) input:checkbox')[0].checked = false
        });
    }
          
});
 
$("#unapprove_view_btn").click(function()
{
  if(phone_id != null)
    window.open('exp_unapprove_single.html?phone_id='+ phone_id
  , '_self'); 
  else
  window.open('exp_unapprove_single.html', '_self'); 
});


$("#decline_view_btn").click(function()
{
  if(phone_id != null)
    window.open('exp_decline_single.html?phone_id='+ phone_id, '_self');
    else
  window.open('exp_decline_single.html', '_self'); 
});


$("#exp_add_btn").click(function()
   {
    if($('#emp_exp_form')[0].checkValidity())

   insert_expense()
   });


   $('#emp_exp_form').submit(function(e){
   
    e.preventDefault()
    e.stopPropagation()
    $("#exp_des_txt").val("")
    $("#exp_cat").val("")
    $("#exp_amt_txt").val("")
    $('#pay_date').val(get_today_date());

  
   });
 
   $("#exp_delete_btn").click(function(){
   $("#exp_table tr").each(function () {
   
    var this_row = $(this);
    if(this_row.find('td:eq(5) input:checkbox')[0].checked)
   this_row.remove()



 


});
var count = 0
$('#exp_table tr').each(function () {
  count =count+1
    var this_row = $(this);
   
    (this_row.find('td:eq(0)').html(count))

 });

 var total = 0
$('#exp_table tr').each(function () {
  total = total + parseFloat($(this).find("td").eq(4).html())
});
console.log(total)
$("#total_exp_txt").html("Toatl - &#x20B9 " + total)

$("#sel_all_chk").prop('checked', false);


});

$("#submit_exp_btn").click(function(){

  $("#submit_exp_btn").prop('disabled', true);

  var count =0;
  var rowCount = $('#exp_table tr').length;
  $('#exp_table tr').each(function () {
    count = count+1;
    var this_row = $(this);
   
    var exp_des = $.trim(this_row.find('td:eq(3)').html())
    var exp_cat = $.trim(this_row.find('td:eq(2)').html())
    var exp_amount	 = $.trim(this_row.find('td:eq(4)').html())
    var exp_date = $.trim(this_row.find('td:eq(1)').html())
     

    var reload_p="";

if (count >= rowCount)
{
 reload_p="yes";
}
else{
  reload_p="no";
}

     insert_emp_expense(exp_des,exp_cat,exp_amount,exp_date,reload_p)

  });
});

  


   });
   //


   function get_expense_summary_single()
   {

  

$.ajax({
  url: "php/get_expense_summary_single.php",
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
  $("#unapprove_amt").html("&#x20b9; " + obj.unapproved)
  $("#decline_amt").html("&#x20b9; " + obj.decline)
   
   

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

   function insert_emp_expense(exp_des,exp_cat,exp_amount,exp_date,reload_p)
   {
     
  

   $.ajax({
     url: "php/insert_emp_expenses.php",
     type: "get", //send it through get method
     data: {
      exp_des : exp_des,
      exp_cat : exp_cat ,
      exp_amount :parseFloat(exp_amount) ,
      exp_date : get_millis(exp_date),
      exp_emp_id : current_user_id,
      exp_work_id :work_id
     
        
      
   
   },
     success: function (response) {
   console.log(response)
   if(reload_p =="yes")
    {

      {
        swal({
          title: "Added",
          text: "Expenses added Successfully!",
          icon: "success",
          showConfirmButton: true,
          dangerMode: false,
        }).then(function() {
          location.reload()
        })
        }
   
    }
    
  

   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   }

   function get_exp_cat_all()
   {
 $.ajax({
  url: "php/get_exp_cat_all.php",
  type: "get", //send it through get method
  data: {
  
   
 
 },
  success: function (response) {
 console.log(response)
 
 if (response.trim() != "error") {
  var obj = JSON.parse(response);
 
 
 
  obj.forEach(function (obj) {
   
    
     $("#exp_cat_data").append(" <option>" + obj.exp_cat + "</option>");
     
 
  });
 
  
 
 
 }
 
    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
 });
 
   }

 function insert_expense()
 {
  console.log($('#exp_table tr').length)
  // table_count = table_count + 1;
  $("#exp_table").append(" <tr><td>"+ (parseInt($('#exp_table tr').length) + 1) + "</td><td>"+ $("#pay_date").val() +  "</td><td>"+ $("#exp_cat").val() +  "</td><td>"+ $("#exp_des_txt").val() +  "</td><td>"+ $("#exp_amt_txt").val() +  "</td><td><input class='form-check-input' type='checkbox'></td> </tr>")

var total = 0
$('#exp_table tr').each(function () {
  total = total + parseFloat($(this).find("td").eq(4).html())
});
console.log(total)
$("#total_exp_txt").html("Toatl - &#x20B9 " + total)
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
else{
  get_expense_summary_single()
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
    get_expense_summary_single()
   
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


