
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 
 
$(document).ready(function(){
  var socket = new WebSocket("ws://esp32.local:81/");

  socket.onopen = function () {
      console.log("WebSocket Connected!");
      socket.send("get_status"); // Request data from ESP32
     
  };

  $("#clear_btn").on('click',function()
  {
    $("#fall_table").empty()
  });
  $("#download_xl_btn").on('click',function()
  {
    $("#fall_table").table2excel({
      
               exclude: ".noExl",
                              name: "Excel Document Name",
                              filename: "fall_data" + new Date().toLocaleDateString().replace(/[\-\:\.]/g, "_") + ".xls",
                              fileext: ".xls",
                              exclude_img: true,
                              exclude_links: true,
                              exclude_inputs: true,
                              
      })
  
  });


  socket.onmessage = function (event) {
    console.log("Data received:", event.data);
    var data = JSON.parse(event.data);

    $("#ai_result").text(data.Prediction);
    console.log("Pin Status:", data.pin_status);
   
if(data.sts != 'fall')
{

    if(data.count < 7)
        $("#beep-sound").attr("src", "img/short-beep.mp3");
else
$("#beep-sound").attr("src", "img/war.mp3");

    let beepSound = $("#beep-sound")[0];
    if (beepSound) {
        beepSound.muted = false;  // Unmute if needed
        beepSound.currentTime = 0; // Restart audio
        beepSound.play().catch(e => console.log("Playback error:", e));
    }
}

else{
  console.log( $("#fall_table tr:last").find('td').eq(0).text());
  var ts = ($("#fall_table tr:last").find('td').eq(0).text()).trim()
  if(ts == "" || ts == null || ts == NaN || ts == undefined)
    ts = 0;
  else
  ts = parseInt(ts) + parseInt(20)
    $("#fall_table").append("<tr> <td>"+ts+"</td><td>"+data.a_x+"</td><td>"+data.a_y+"</td><td>"+data.a_z+"</td><td>"+data.g_x+"</td><td>"+data.g_y+"</td><td>"+data.g_z+"</td></tr>");
}
  

   
// if(data.Prediction == 'fall')
// {
//   $("#beep-sound").attr("src", "img/war.mp3");
    

//     let beepSound = $("#beep-sound")[0];
//     if (beepSound) {
//         beepSound.muted = false;  // Unmute if needed
//         beepSound.currentTime = 0; // Restart audio
//         beepSound.play().catch(e => console.log("Playback error:", e));
//     }
// }




};



  socket.onerror = function (error) {
      console.log("WebSocket Error:", error);
  };

  socket.onclose = function () {
      console.log("WebSocket Disconnected!");
  };
 







});







  

   



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
      

      console.log(response);
      
      
       obj.forEach(function (obj) {
         current_user_id = obj.emp_id;
         current_user_name =  obj.emp_name;
       });
      
    //    get_sales_order()
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

  
   function shw_toast(title,des,theme)
   {
   
     
         $('.toast-title').text(title);
         $('.toast-description').text(des);
   var toast = new bootstrap.Toast($('#myToast'));
   toast.show();
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