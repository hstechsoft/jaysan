

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

  


$(document).ready(function(){

  check_login();

   $("#unamed").text(localStorage.getItem("ls_uname"))

   
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
  window.open('exp_unapprove_single.html?emp_id=' + current_user_id, '_self'); 
});


$("#decline_view_btn").click(function()
{
  window.open('exp_decline_single.html?emp_id=' + current_user_id, '_self'); 
});


$("#exp_add_btn").click(function()
   {
    if($('#emp_exp_form')[0].checkValidity())

   insert_expense()
   });


  
   $("#exp_delete_btn").click(function(){
    var count =0;
var chk_count = 0
    $("#exp_table tr").each(function () {
   
        var this_row = $(this);
        if(this_row.find('td:eq(5) input:checkbox')[0].checked)
        chk_count = chk_count + 1
    });

   $("#exp_table tr").each(function () {
   
    var this_row = $(this);
    if(this_row.find('td:eq(5) input:checkbox')[0].checked)
    {
        count = count+1;
        var reload_p="";

        if (count >= chk_count)
        {
        reload_p="yes";
        }
        else{
        reload_p="no";
        }
        delete_expense($(this).find("td").eq(5).find('input').attr('value'),reload_p)
    }



});





});



  


   });
   //


   function get_expense_summary_single()
   {

  

$.ajax({
  url: "php/get_expense_decline_single.php",
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
var total =0
  obj.forEach(function (obj) {
  count =count +1 ;
  total = total + parseFloat(obj.exp_amount)
    $("#exp_table").append(" <tr><td>"+ count + "</td><td>"+ millis_to_date_only(parseFloat(obj.exp_date)) +  "</td><td>"+ obj.exp_cat +  "</td><td>"+ obj.exp_des +  "</td><td>"+obj.exp_amount +  "</td><td><input value = '"+ obj.exp_id + "' class='form-check-input' type='checkbox'></td> </tr>")
   
   
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

   function delete_expense(id,reload_p)
   {
     
  

   $.ajax({
     url: "php/delete_unapprove_exp.php",
     type: "get", //send it through get method
     data: {
      exp_id : id,
     
   
   },
     success: function (response) {
   console.log(response)
   if(reload_p =="yes")
    {

      {
        swal({
          title: "Added",
          text: "Expenses Deleted Successfully!",
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


