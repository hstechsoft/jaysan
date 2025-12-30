

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
$(document).ready(function(){
  $("#pb_bar").css("width", get_prograss(1) + "%").text(get_prograss(1) + "%");

  $("#slide_1").show()
  $("#slide_2").hide()
  $("#slide_3").hide()
  $("#slide_4").hide()
  $("#slide_5").hide()
  $("#slide_6").hide()
  $("#slide_7").hide()
  $("#slide_8").hide()
  $("#slide_9").hide()
  $("#slide_10").hide()
  $("#slide_11").hide()
  $("#slide_12").hide()
  $("#slide_13").hide()
  $("#ha").hide()
  //check_login();

 

  $("#piform").submit(function(e){
    e.stopPropagation();
    e.preventDefault();
  });
  $("button").on('click', function (e) {
    // $("#pi_card").hide()
    // $("#ha").show()
    console.log( val_phone($("#phone").val()))
   if( val_phone($("#phone").val()) == false)
   {
    salert("Phone Number","please Enter Valid Phone Number","warning")
    $("#phone").focus()
    return
   }
  
console.log($(this).html())
console.log($(this).val())

if($(this).html() == "Next")
{
  if($(this).val() == 2)
  {
   
  if($('#piform')[0].checkValidity())
    {
     console.log($('#piform')[0].checkValidity())
     var next_slide_id = "#slide_" + $(this).val() 
     var cur_slide_id = "#slide_" +  (parseInt($(this).val())  - 1) 
  
      $(cur_slide_id).hide("slide", { direction: "left" }, 300, function () {
          $(next_slide_id).show("slide", { direction: "right" }, 200);
      });
    }
  }
  else{
    var next_slide_id = "#slide_" + $(this).val() 
    var cur_slide_id = "#slide_" +  (parseInt($(this).val())  - 1) 
 
     $(cur_slide_id).hide("slide", { direction: "left" }, 300, function () {
         $(next_slide_id).show("slide", { direction: "right" }, 200);
     });
  }

  
  }

  if($(this).html() == "Prev")
{
   var next_slide_id = "#slide_" + $(this).val() 
   var cur_slide_id = "#slide_" +  (parseInt($(this).val())  + 1) 


   console.log()
    $(cur_slide_id).hide("slide", { direction: "right" }, 300, function () {
        $(next_slide_id).show("slide", { direction: "left" }, 200);
    });
  }

  $("#pb_bar").css("width", get_prograss($(this).val()) + "%").text(get_prograss($(this).val()) + "%");

});



   $("#unamed").text(localStorage.getItem("ls_uname"))

   $('#pb_submit_btn').on('click', function()
{

 //insert_budget();

insert_personal_budget()



});
 

$("tbody").on("focusout","tr td input", function(event) {
  //get button value
  
    if($(this).parent().parent().index() == 1 && ($(this).val() >0))
    {
      $(this).parent().parent().parent().find("td").eq(2).find("input").prop("disabled", true);

      $(this).parent().parent().parent().find("td").eq(2).find("input").val(parseFloat($(this).val() * 12))
    }
  
else
$(this).parent().parent().parent().find("td").eq(2).find("input").prop("disabled", false);

    if($(this).parent().parent().index() == 2 && ($(this).val() >0))
    $(this).parent().parent().parent().find("td").eq(1).find("input").prop("disabled", true);
    else
    $(this).parent().parent().parent().find("td").eq(1).find("input").prop("disabled", false);

      });
  


   });
   //
 

function insert_details(id)
{
  $('#income_table > tr').each(function() { 
 
    insert_budget($(this).find("td").eq(0).html().trim(),$(this).find("td").eq(1).find('input').attr('value'),$(this).find("td").eq(2).find('input').attr('value'),"budget_income",id,"no")
  });
  
  
  $('#savings_table > tr').each(function() { 
   
    insert_budget($(this).find("td").eq(0).html().trim(),$(this).find("td").eq(1).find('input').attr('value'),$(this).find("td").eq(2).find('input').attr('value'),"budget_savings",id,"no")
  });
  
  
  $('#misc_table > tr').each(function() { 
   
    insert_budget($(this).find("td").eq(0).html().trim(),$(this).find("td").eq(1).find('input').attr('value'),$(this).find("td").eq(2).find('input').attr('value'),"budget_misc",id,"no")
  });
  
  
  $('#holiday_exp_table > tr').each(function() { 
   
    insert_budget($(this).find("td").eq(0).html().trim(),$(this).find("td").eq(1).find('input').attr('value'),$(this).find("td").eq(2).find('input').attr('value'),"budget_holiday_exp",id,"no")
  });
  
  $('#festival_exp_table > tr').each(function() { 
   
    insert_budget($(this).find("td").eq(0).html().trim(),$(this).find("td").eq(1).find('input').attr('value'),$(this).find("td").eq(2).find('input').attr('value'),"budget_festival_exp",id,"no")
  });
  
  $('#health_exp_table > tr').each(function() { 
   
    insert_budget($(this).find("td").eq(0).html().trim(),$(this).find("td").eq(1).find('input').attr('value'),$(this).find("td").eq(2).find('input').attr('value'),"budget_health_exp",id,"no")
  });
  
  $('#movies_exp_table > tr').each(function() { 
   
    insert_budget($(this).find("td").eq(0).html().trim(),$(this).find("td").eq(1).find('input').attr('value'),$(this).find("td").eq(2).find('input').attr('value'),"budget_movies_exp",id,"no")
  });
  
  $('#insurance_table > tr').each(function() { 
   
    insert_budget($(this).find("td").eq(0).html().trim(),$(this).find("td").eq(1).find('input').attr('value'),$(this).find("td").eq(2).find('input').attr('value'),"budget_insurance_exp",id,"no")
  });
  
  $('#child_exp_table > tr').each(function() { 
   
    insert_budget($(this).find("td").eq(0).html().trim(),$(this).find("td").eq(1).find('input').attr('value'),$(this).find("td").eq(2).find('input').attr('value'),"budget_child_exp",id,"no")
  });
  
  $('#loan_table > tr').each(function() { 
   
    insert_budget($(this).find("td").eq(0).html().trim(),$(this).find("td").eq(1).find('input').attr('value'),$(this).find("td").eq(2).find('input').attr('value'),"budget_loan_exp",id,"no")
  });

  $('#tax_exp_table > tr').each(function() { 
   
    insert_budget($(this).find("td").eq(0).html().trim(),$(this).find("td").eq(1).find('input').attr('value'),$(this).find("td").eq(2).find('input').attr('value'),"budget_tax_exp",id,"no")
  });
  var count = 0

  $('#home_exp_table > tr').each(function() { 
    count = count+1
    var reload_p ="no"
    if(count >= $('#home_exp_table tr').length )
     reload_p ="yes"
    

    insert_budget($(this).find("td").eq(0).html().trim(),$(this).find("td").eq(1).find('input').attr('value'),$(this).find("td").eq(2).find('input').attr('value'),"budget_home_exp",id,reload_p)
  });
  var rowCount = $('#home_exp_table tr').length-1;
  console.log(rowCount)
}
   function check_login()
   {
    
    if (localStorage.getItem("logemail") == null) {
      window.location.replace("login.html");
  }
   }

   function insert_budget(col_name,monthly,yearly,table_name,id,reload_p)
   {
    
$.ajax({
    url: "php/insert_budget.php",
    type: "get", //send it through get method
    data: {
       col_name :col_name,
       monthly : monthly,
       yearly : yearly,
       table_name : table_name,
       id : id
    
  },
    success: function (response) {
  console.log(response)
  
 if(reload_p == "yes")
 {

  swal({
    title: "Submitted",
    text: "Your Personal Budget data Successfully Submitted",
    type: "success"
}).then(function() {
  location.reload()
});

 }
  
 
  
  
      
    },
    error: function (xhr) {
        //Do Something to handle error
    }
  });
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
  console.log(response)
  
  insert_details(response.trim())
 
  
  
      
    },
    error: function (xhr) {
        //Do Something to handle error
    }
  });
   }
  
   function get_payment_report()
   {

  

$.ajax({
  url: "php/get_payment_report.php",
  type: "get", //send it through get method
  data: {
   cur_time : get_cur_millis()
  
},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {
    if (response.trim() != "0 result") {
  var obj = JSON.parse(response);


var count =0 
  obj.forEach(function (obj) {
  
   count  = count + 1;

    $("#payment_table").append(" <tr> <td>"+ count + "</td> <td>"+ obj.cus_name + "</td><td>"+ obj.cus_phone + "</td><td>"+ obj.ino + "</td><td>"+ millis_to_date(parseFloat(obj.dated)) + "</td><td>"+ obj.total_value + "</td><td>"+ obj.paid_amount + "</td></tr>")


  });

 
}
else{
    $("#remind_table").append(" <tr><td colspan='4' scope='col' class='text-bg-danger h6'>Sorry no data!</td></tr>")
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
  var progrss = parseInt(no)/13;
 
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