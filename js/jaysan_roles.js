
  var cus_id = '0';
  var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
$(document).ready(function(){

  
 
get_res();

   
  


   




   



   });
   //


 
 


  


  

   

   function get_res(){
   
      $.ajax({
        url: "php/get_jaysan_res.php",
        type: "get", //send it through get method
        data: {
        phone_id : phone_id
       
       },
        success: function (response) {
         console.log(response)
         
       if (response.trim() != "error") {
        if(response.trim() != "0 result")
{
        var obj = JSON.parse(response);
       
  var count =0;
       
        obj.forEach(function (obj) {
$("#res_text").html(convertToHTML(obj.res))
$("#role_name_txt").html((obj.role))
        });
      }
       }
       
       
       
       
          
        },
        error: function (xhr) {
            //Do Something to handle error
        }
       });
    }

    function get_all_app_role(){
   
      $.ajax({
        url: "php/get_all_app_role.php",
        type: "get", //send it through get method
        data: {
        
       
       },
        success: function (response) {
         console.log(response)
         $("#app_menu_all_table").empty()
       if (response.trim() != "error") {
        if(response.trim() != "0 result")
{
        var obj = JSON.parse(response);
       
  var count =0;
       
        obj.forEach(function (obj) {

 count = count +1;
         $("#app_menu_all_table") .append("<tr><td>" + count + "</td><td>" + obj.role + "</td><td style='word-wrap: break-word;min-width: 160px;max-width: 160px;'>" + obj.menu_list + "</td><td>"+"<button  type='button' class='btn  btn-lg text-danger' ><i class='fa-solid fa fa-trash'></i></button>"+"</td>  </tr> ")
        });
      }
       }
       
       
       
       
          
        },
        error: function (xhr) {
            //Do Something to handle error
        }
       });
    }
   
    function delete_app_menu()
    {
    
 
 $.ajax({
   url: "php/delete_app_menu.php",
   async :false,
   type: "get", //send it through get method
   data: {
  
 
 
     app_menu_id :  $("#app_menu_dropdown option:selected").val(),
     role  : $("#app_role_name option:selected").val(),
    
 
 },
   success: function (response) {
 
    console.log(response);
 get_all_app_role();
 
 
     
   },
   error: function (xhr) {
       //Do Something to handle error
   }
 });
 
    }


    function delete_app_all(menu_name)
    {
    
 
 $.ajax({
   url: "php/delete_app_all.php",
   async :false,
   type: "get", //send it through get method
   data: {
  
 
 
    app_menu :  menu_name,
   
    
 
 },
   success: function (response) {
 
    console.log(response);
 get_all_app_role();
 
 
     
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

function convertToHTML(text) {
  // Replace tabs with a combination of non-breaking spaces
  // Each tab is typically equivalent to 4 spaces, but you can adjust as needed
  let htmlText = text.replace(/\t/g, '&emsp;&emsp;');
  
  // Replace newline characters with line break elements
  htmlText = htmlText.replace(/\n/g, '<br>');
  
  return htmlText;
}