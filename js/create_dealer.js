

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

var sdid = 0


$(document).ready(function(){
    $("#dactive").hide()
    $("#dinactive").hide()
    $("#dupdate").hide()
//  $(".dealer").hide();
//  $(".customer").hide();

 check_login();
 

get_all_dealer();

$("#dealer_table").on("click","tr td button", function(event) {
    var did = $(this).val()
    sdid = did
if($(this).closest("td").index() == 6)
{
get_dealer(did);
}
else if($(this).closest("td").index() == 7)
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
              
        delete_dealer(did) // <--- submit form programmatically
              
             
            });
          } else {
            swal("Cancelled", "Dealer is safe :)", "error");
          }
        })
        }
        
}
});

 $('#generate_btn').on('click', function()
 {
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    var password = "";
    for (var i = 0; i < 6; i++) {
        var randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    $("#dpass").val(password);
 });

 $('#dsubmit').on('click', function()
 {
   
    if($('#task_form')[0].checkValidity())
  {
insert_dealer();
  }
 
 });

 $('#dupdate').on('click', function()
{
 
    if($('#task_form')[0].checkValidity())
    {
      update_dealer("valid")
    }
   
});


$('#dactive').on('click', function()
{
 
    if($('#task_form')[0].checkValidity())
    {
      update_dealer("valid")
    }
   
});

$('#dinactive').on('click', function()
{
    update_dealer("invalid")
   
   
});




 

  




       
   });


   function update_dealer(sts)
   {
    
   
   $.ajax({
     url: "php/update_dealer.php",
     type: "get", //send it through get method
     data: {
        dname :  $('#dname').val(),
dphone :  $('#dphone').val(),
daddr :  $('#daddr').val(),
dpass :  $('#dpass').val(),
     did : sdid,
     dstatus : sts

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


   function delete_dealer(did)
   {
    
   
   $.ajax({
     url: "php/delete_dealer.php",
     type: "get", //send it through get method
     data: {
      
     did : did,
     

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




   function get_dealer(did)
   {
    
   
   $.ajax({
     url: "php/get_dealer.php",
     type: "get", //send it through get method
     data: {
     did : did

     },
     success: function (response) {
   
   
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
   
   
     obj.forEach(function (obj) {
        count = count +1;
 $('#dname').val(obj.dname)
 $('#dphone').val(obj.dphone)
 $('#daddr').val(obj.daddr)
 $('#dpass').val(obj.dpass)
if(obj.dstatus == "valid")
$("#dinactive").show()
else if(obj.dstatus == "invalid")
$("#dactive").show()

$("#dupdate").show()
$("#dsubmit").hide()
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
   function get_all_dealer()
   {
    
   
   $.ajax({
     url: "php/get_all_dealer.php",
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

        if(obj.dstatus == 'invalid')
$('#dealer_table').append("<tr class = 'text-bg-danger opacity-75'><td>"+count+"</td><td>"+obj.dname+"</td><td>"+obj.dphone+"</td><td>"+obj.daddr+"</td><td>"+obj.dpass+"</td><td>"+obj.dstatus+"</td><td>"+"<button value='"+obj.did + "' type='button' class='btn text-white' > <i class='fa-solid fa-pencil'></i></button>"+"</td><td>"+"<button value='"+obj.did + "' type='button' class='btn text-white' > <i class='fa-solid fa-trash-can'></i></button>"+"</td></tr>")
else
$('#dealer_table').append("<tr><td>"+count+"</td><td>"+obj.dname+"</td><td>"+obj.dphone+"</td><td>"+obj.daddr+"</td><td>"+obj.dpass+"</td><td>"+obj.dstatus+"</td><td>"+"<button value='"+obj.did + "' type='button' class='btn text-danger' > <i class='fa-solid fa-pencil'></i></button>"+"</td><td>"+"<button value='"+obj.did + "' type='button' class='btn text-danger' > <i class='fa-solid fa-trash-can'></i></button>"+"</td></tr>")

     });
   
    
   }
   else{
   // $("#@id@") .append("<td colspan='8' scope='col'>No Data</td>");
 
   }
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }

   function insert_dealer()
   {
    
   
   $.ajax({
     url: "php/insert_dealer.php",
     type: "get", //send it through get method
     data: {
     dname :  $('#dname').val(),
dphone :  $('#dphone').val(),
daddr :  $('#daddr').val(),
dpass :  $('#dpass').val(),
dstatus : "valid"

     },
     success: function (response) {
   
   
   if (response.trim() == "ok") {

 location.reload()
   
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }




   function get_customer()
   {
    
   $.ajax({
     url: "php/get_customer_edit.php",
     type: "get", //send it through get method
     data: {
      cus_id:cus_id,
      
   
   },
     success: function (response) {
   
   console.log(response)
   if (response.trim() != "error") {
   
     var obj = JSON.parse(response);
   
     var trlength = 0;
   
     obj.forEach(function (obj) {
      $('#cus_name').val(obj.cus_name)
      $('#cus_address').val(obj.cus_address)
      $('#cus_lead_source').val(obj.cus_lead_source)
      $('#cus_location').val(obj.cus_location)
      $('#cus_phone').val(obj.cus_phone)
      $('#cus_aphone').val(obj.cus_aphone)
      $('#cus_place').val(obj.cus_place)
      $('#cus_state').val(obj.cus_state)
      $('#cus_exp').val(obj.cus_exp)
      $('#cus_tmodel').val(obj.cus_tmodel)
      $('#cus_impcus_sub').val(obj.cus_impcus_sub)
      $('#cus_oproduct').val(obj.cus_oproduct)
        $("#cus_gst").val(obj.cus_gst)
   
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