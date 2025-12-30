

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
$(document).ready(function(){

  check_login();
 get_all_expense();
 
 
   $("#unamed").text(localStorage.getItem("ls_uname"))

   $("#search_emp_txt").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#exp_table tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
 
  


   });
   //
 


   function check_login()
   {
    
    if (localStorage.getItem("logemail") == null) {
      window.location.replace("login.html");
  }
   }

  
   function get_all_expense()
   {

  

$.ajax({
  url: "php/get_expense_all.php",
  type: "get", //send it through get method
  data: {
   
  
},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {
  if (response.trim() != "0 result") {
  var obj = JSON.parse(response);


var count =0 
  obj.forEach(function (obj) {
  
   count  = count + 1;

    $("#exp_table").append(" <tr> <td>"+ count + "</td> <td>"+ obj.emp_name + "</td><td>"+ obj.un_approve + "</td> <td>"+ obj.decline + "</td> <td>"+ obj.approve + "</td> <td>"+ obj.amount_paid + "</td>  <td><a target='_blank' href=' admin_expense_single.html?emp_id="+ obj.exp_emp_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td> </tr>")


  });

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