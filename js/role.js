
  var cus_id = '0';
$(document).ready(function(){

  check_login();
get_role_type();
get_all_role();
get_app_menu_all();
get_app_menu_master();

   $("#unamed").text(localStorage.getItem("ls_uname"))

   $("#role_update_btn").hide()
   $("#role_submit_btn").show()
  

   $("#app_role_update_btn").hide()
   $("#app_role_submit_btn").show()

   $("#app_res_update_btn").hide()
   $("#app_res_submit_btn").show()

   $("#menu_add_btn").click(function()
   {
   if($('#menu_dropdown :selected').text()=="Choose menu...") 
   {
salert("Choose Type","Kindly Select menu","warning")
   }
   else{
    if($("#menu_text").val() == "")
    {
        $("#menu_text").val($('#menu_dropdown :selected').text())
    }
    else{
        $("#menu_text").val( $("#menu_text").val() + "," + $('#menu_dropdown :selected').text())
    }
   }

   $('#menu_dropdown').prop('selectedIndex',0);  
   
   });


   $("#app_menu_add_btn").click(function()
   {
   if($('#app_menu_dropdown :selected').text()=="Choose Menu...") 
   {
salert("Choose Type","Kindly Select menu","warning")
   }
   else{
    if($("#app_menu_text").val() == "")
    {
        $("#app_menu_text").val($('#app_menu_dropdown :selected').text())
    }
    else{
        $("#app_menu_text").val( $("#app_menu_text").val() + "," + $('#app_menu_dropdown :selected').text())
    }
   }

   $('#app_menu_dropdown').prop('selectedIndex',0);  
   
   });
  

   $("#role_submit_btn").click(function()
   {
  
  insert_role()
    
   });

   $("#app_role_submit_btn").click(function()
   {
    if($('#app_role_name :selected').text()=="Choose Role...") 
    {
 salert("Choose Role","Kindly Select Role","warning")
 return
    }
 insert_app_menu()
    
   });


   $("#app_role_update_btn").click(function()
   {
    if($('#app_role_name :selected').text()=="Choose Role...") 
    {
 salert("Choose Role","Kindly Select Role","warning")
 return
    }
 update_app_menu()
    
   });

   $("#role_update_btn").click(function()
   {
  
  update_role()
    
   });

   
   $("#menu_all_table").on("click","tr td button", function(event) {
    //get button value
   
    $("#role_update_btn").show()
    $("#role_submit_btn").hide()
  console.log($(this).parent().parent().find("td").eq(2).html())
  $("#menu_text").val($(this).parent().parent().find("td").eq(2).html())
  $("#role_name").val($(this).parent().parent().find("td").eq(1).html())
  $("#app_res_text").val($(this).parent().parent().find("td").eq(3).html())
        });



   
   $("#app_menu_all_table").on("click","tr td button", function(event) {
    //get button value
   
    $("#app_role_update_btn").show()
    $("#app_role_submit_btn").hide()
  
  $("#app_menu_text").val($(this).parent().parent().find("td").eq(2).html())
  $("#app_role_name").val($(this).parent().parent().find("td").eq(1).html())
        });

   });
   //


   function insert_app_menu()
   {
    
   
   $.ajax({
     url: "php/insert_app_menu.php",
     type: "get", //send it through get method
     data: {
      role :  $('#app_role_name').val(),
    menu :  $('#app_menu_text').val()
     },
     success: function (response) {
   
   console.log(response)
   if (response.trim() == "ok") {
location.reload()
 
   
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }


   function update_app_menu()
   {
    
   
   $.ajax({
     url: "php/update_app_menu.php",
     type: "get", //send it through get method
     data: {
      role :  $('#app_role_name').val(),
    menu :  $('#app_menu_text').val()
     },
     success: function (response) {
   
   console.log(response)
   if (response.trim() == "ok") {
location.reload()
 
   
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }



   function get_app_menu_all()
   {
    
   
   $.ajax({
     url: "php/get_app_menu_all.php",
     type: "get", //send it through get method
     data: {
     
     },
     success: function (response) {
   
   
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
   

     obj.forEach(function (obj) {
     
        count = count +1;
$('#app_menu_all_table').append("<tr><td>"+count+"</td><td  style='max-width: 100px;'>"+obj.role+"</td><td  style='max-width: 150px;'>"+obj.menu_name+"</td><td>"+"<button  type='button' class='btn  btn-lg text-danger' ><i class='fa-solid fa-pen-to-square'></i></button>"+"</td></tr>")

     });
   
    
   }
   else{
   // $("#@id@") .append("<td colspan='4' scope='col'>No Data</td>");
 
   }
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }

   function get_app_menu_master()
   {
    
   
   $.ajax({
     url: "php/get_app_menu_master.php",
     type: "get", //send it through get method
     data: {
     
     },
     success: function (response) {
   
   
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
      $("#app_menu_dropdown").append( "<option value ='0' selected>Choose Menu...</option>")
     var obj = JSON.parse(response);
   var count =0 
   
   
     obj.forEach(function (obj) {
        count = count +1;
$('#app_menu_dropdown').append("<option>"+obj.menu_name+"</option>")

     });
   
    
   }
   else{
   // $("#@id@") .append("<td colspan='0' scope='col'>No Data</td>");
 
   }
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }
   function get_role_type()
   {
   
   $.ajax({
     url: "php/get_role_type.php",
     type: "get", //send it through get method
     data: {
      
      
   },
     success: function (response) {
   
console.log(response)
$("#menu_dropdown").empty();
   if (response.trim() != "error") {
     
     if(response.trim() !="0 result")
     {
       var obj = JSON.parse(response);
       $("#menu_dropdown").append( "<option value ='0' selected>Choose menu...</option>")
       
      
      
       obj.forEach(function (obj) {
       
   
        $("#menu_dropdown").append(" <option value='"+ obj.menu_name + "'>"+ obj.menu_name +"</option>")
        
        
       });
   
       
     }
     else{
    
       $("#menu_dropdown").append("<option value ='0' selected>No menu...</option>");
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



   function update_role()
   {
   

$.ajax({
  url: "php/update_role.php",
  async :false,
  type: "get", //send it through get method
  data: {
 


    role :  $("#role_name").val(),
    menu  : $("#menu_text").val(),
    res  : $("#app_res_text").val(),

},
  success: function (response) {

   console.log(response);

window.location.reload();

    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }
 

   function insert_role()
   {
   

$.ajax({
  url: "php/insert_role.php",
  async :false,
  type: "get", //send it through get method
  data: {
 


    role :  $("#role_name").val(),
    menu  : $("#menu_text").val(),
    res  : $("#app_res_text").val(),
   

},
  success: function (response) {

   console.log(response);

window.location.reload();

    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }
  
  

   

   function get_all_role(){
   
      $.ajax({
        url: "php/get_all_role.php",
        type: "get", //send it through get method
        data: {
        
       
       },
        success: function (response) {
         console.log(response)
         
       if (response.trim() != "error") {
        if(response.trim() != "0 result")
{
        var obj = JSON.parse(response);
       
  var count =0;
  $("#app_role_name").append( "<option value ='0' selected>Choose Role...</option>")

        obj.forEach(function (obj) {
          $("#app_role_name").append(" <option value='"+ obj.role + "'>"+ obj.role +"</option>")
         
 count = count +1;
         $("#menu_all_table") .append("<tr><td>" + count + "</td><td  style='max-width: 100px;'>" + obj.role + "</td><td  style='max-width: 150px;'>" + obj.menu + "</td><td  style='max-width: 150px;'>" + obj.res + "</td><td>"+"<button  type='button' class='btn  btn-lg text-danger' ><i class='fa-solid fa-pen-to-square'></i></button>"+"</td>  </tr> ")
        });
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
    
    if (localStorage.getItem("logemail") == null) {
      window.location.replace("login.html");
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