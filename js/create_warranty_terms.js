

var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');

var cus_type ="";
var cus_lang="";
var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ;  
var his_comment = "work created"

$("#unamed").text(localStorage.getItem("ls_uname"))
var phone_no = urlParams.get('phone_no');
var phone_name = urlParams.get('phone_name');
var latti = urlParams.get('latti');
var longi = urlParams.get('longi');
var lis_id = urlParams.get('lis_id');
var lead_source = urlParams.get('lead_source');
var cus_id = urlParams.get('cus_id');

var swid = 0


$(document).ready(function(){
    
    $("#wupdate").hide()

 check_login();
 

get_all_warranty();

$("#warranty_table").on("click","tr td button", function(event) {
    var wid = $(this).val()
    swid = wid
if($(this).closest("td").index() == 4)
{
get_warranty(wid);
}
else if($(this).closest("td").index() == 5)
{
    {
        swal({
          title: "Are you sure - Delete? ",
          text: "You will not be recover this  again!",
          icon: "warning",
          buttons: [
            'No, cancel it!',
            'Yes, I am sure!'
          ],
          dangerMode: true,
        }).then(function(isConfirm) {
          if (isConfirm) {
            swal({
              title: 'Applied!',
              text: 'successfully Deleted!',
              icon: 'success'
            }).then(function() {
              
        delete_warranty(wid) // <--- submit form programmatically
              
             
            });
          } else {
            swal("Cancelled", "Dealer is safe :)", "error");
          }
        })
        }
        
}
});



 $('#wsubmit').on('click', function()
 {
   
    if($('#warranty_form')[0].checkValidity())
  {
insert_warranty();
  }
 
 });

 $('#wupdate').on('click', function()
{
 
    if($('#warranty_form')[0].checkValidity())
    {
      update_warranty()
    }
   
});







 

  




       
   });


   function update_warranty()
   {
    
   
   $.ajax({
     url: "php/update_warranty.php",
     type: "get", //send it through get method
     data: {
        implement :  $('#implement').val(),
model_no :  $('#model_no').val(),
terms :  $('#terms').val(),
wid : swid

     },
     success: function (response) {
   console.log(response);
   
   if (response.trim() == "ok") {
location.reload();
 
   
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }


   function delete_warranty(wid)
   {
    
   
   $.ajax({
     url: "php/delete_warranty.php",
     type: "get", //send it through get method
     data: {
      
     wid : wid,
     

     },
     success: function (response) {
   console.log(response);
   
   if (response.trim() == "ok") {
location.reload();
 
   
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }




   function get_warranty(wid)
   {
    
   
   $.ajax({
     url: "php/get_warranty.php",
     type: "get", //send it through get method
     data: {
     wid : wid

     },
     success: function (response) {
   
   
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
   
   
     obj.forEach(function (obj) {
        count = count +1;
 $('#implement').val(obj.implement)
 $('#model_no').val(obj.model_no)
 $('#terms').val(obj.terms)
 


$("#wupdate").show()
$("#wsubmit").hide()
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
   function get_all_warranty()
   {
    
   
   $.ajax({
     url: "php/get_all_warranty.php",
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

  
$('#warranty_table').append("<tr><td>"+count+"</td><td>"+obj.implement+"</td><td>"+obj.model_no+"</td><td>"+obj.terms+"</td><td>"+"<button value='"+obj.wid + "' type='button' class='btn text-danger' > <i class='fa-solid fa-pencil'></i></button>"+"</td><td>"+"<button value='"+obj.wid + "' type='button' class='btn text-danger' > <i class='fa-solid fa-trash-can'></i></button>"+"</td></tr>")

     });
   
    
   }
   else{
    $("#warranty_table") .append("<tr><td colspan='8' scope='col'>No Data</td></tr>");
 
   }
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }

   function insert_warranty()
   {
    
   
   $.ajax({
     url: "php/insert_warranty.php",
     type: "get", //send it through get method
     data: {
     implement :  $('#implement').val(),
model_no :  $('#model_no').val(),
terms :  $('#terms').val(),


     },
     success: function (response) {
   
console.log(response);
   if (response.trim() == "ok") {

 location.reload()
   
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
  }

   }

   



  


  //  get today 

   

   


   
  


   


   





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


   function get_date_only_start(dates){
    var date = new Date(dates);

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
   
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
 
    var today_start = year + "-" + month + "-" + day +"T00:00"; 
    
    return get_millis(today_start);
   
   }


   function get_date_only_end(dates){
    var date = new Date(dates);

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
   
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
 
    var today_start = year + "-" + month + "-" + day +"T23:59:59"; 
    
    return get_millis(today_start);
   
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