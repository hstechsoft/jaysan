

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


  check_login();
 get_all_sv();
 
 
   $("#unamed").text(localStorage.getItem("ls_uname"))

   $("#search_quote_txt").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#quote_table tr").filter(function() {
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

  
   function get_all_sv()
   {

  

$.ajax({
  url: "php/get_sv_all.php",
  type: "get", //send it through get method
  data: {
   
  
},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {
    if (response.trim() != "0 result") {
  var obj = JSON.parse(response);


var count =0 
var si = ""
  obj.forEach(function (obj) {
 
   count  = count + 1;

    $("#sv_table").append(" <tr> <td>"+ count + "</td> <td>"+ obj.emp_name + "</td><td>"+ obj.cus_info + "</td> <td>"+ obj.dated + "</td> <td>"+ obj.remark + "</td> <td><a target='_blank' href=' site_visit_report.html?work_id="+ obj.work_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td> </tr>")


  });
    }

    else{
        $("#sv_table").append(" <tr><td colspan='6' scope='col' class='text-bg-danger h6'>Sorry no data!</td></tr>")
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