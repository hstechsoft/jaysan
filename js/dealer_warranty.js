
var dname = localStorage.getItem("dname")
var did = localStorage.getItem("did")
var delivery_photo_addr = ""
var isfrmwrty = "no"
// console.log(role)

$(document).ready(function(){
    
    $("#role_name_txt").text(dname)
   
check_login()
get_implement();
get_today_delivery()
$('#dsubmit').on('click', function()
 {
   
    if($('#delivery_form')[0].checkValidity())
  {
insert_delivery();
  }
 
 });



 $('#wchk_btn').on('click', function()
 {
   
    if($('#chasis_no').val() != "")
  {
get_chk_warranty();
  }
 
 });
$('#warranty_term_chk').change(function() {
  if(this.checked) {
    $("#dphoto").show()
  }
  else
  $("#dphoto").hide()
  });

$('#delivery_photo_preview').click(function () {
  
  if($("#chasis_no").val()!="")
    $("#delivery_photo_up").trigger("click");
    else
    salert("Chasis No","Kindly enter chasis no","warning")
   });

   $('#delivery_photo_up').on('change',function ()
{
var property =this.files[0];


  upload_sv(property,"delivery_photo","#delivery_photo_preview"); 
delivery_photo_addr = upload_sv(property,"delivery_photo","#delivery_photo_preview"); 
console.log(delivery_photo_addr)
});



$('#implement').change(function() {
    if($('#implement :selected').val() != 0 )
    {
get_model($('#implement :selected').val());
    }

     });

$('#view_terms').click(function(event){
    event.stopPropagation();
    event.preventDefault();
    if($('#implement :selected').val() != 0 && $('#model :selected').val() != 0)
    get_warranty_terms()
    //
    else
    salert("Error", "kindly select model and implement ", "error");

});


$('#topbar_logout_btn').on('click', function()
{
  


  swal({
    title: "Are you sure? ",
    text: "You will logout",
    icon: "warning",
    buttons: [
      'No, cancel it!',
      'Yes, I am sure!'
    ],
    dangerMode: true,
  }).then(function(isConfirm) {
    if (isConfirm) {
      localStorage.clear();
      location.reload()
    } else {
      swal("Cancelled", "", "error");
    }
  })
});




   });


   
   function get_chk_warranty()
   {
    
   
   $.ajax({
     url: "php/get_chk_warranty.php",
     type: "get", //send it through get method
     data: {
     chasis_no :  $('#chasis_no').val(),
     did : did

     },
     success: function (response) {
   
   console.log(response)
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
   
   
     obj.forEach(function (obj) {
        count = count +1;
 $('#cus_name').val(obj.cus_name)
 $('#cus_name').prop('disabled', true);
 $('#cus_phone').val(obj.cus_phone)
 $('#cus_phone').prop('disabled', true);
 $('#cus_addr').val(obj.cus_addr)
 $('#cus_addr').prop('disabled', true);
 $('#chasis_no').val(obj.chasis_no)
 $('#chasis_no').prop('disabled', true);
 $('#implement').val(obj.implement)
 $('#implement').prop('disabled', true);
 $('#model').append(" <option value='" + obj.model + "'>" + obj.model + "</option>")
 $('#model').val(obj.model)
 $('#model').prop('disabled', true);
 $('#remark').val("Delivery Date - " + obj.ddate + "\n\n" + obj.wterms)
 $('#remark').prop('disabled', true);
     });
   
    
   }
   else{
  salert("No Data","No Valid Data found kindly Enter Details Manually","warning")
 
   }
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }
   function get_today_delivery()
   {
    
   
   $.ajax({
     url: "php/get_today_service.php",
     type: "get", //send it through get method
     data: {
     did : did

     },
     success: function (response) {
   
   console.log(response);
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
   
   
     obj.forEach(function (obj) {
        count = count +1;
$('#delivery_table').append("<tr><td>"+count+"</td><td>"+obj.cus_name+"</td><td>"+obj.implement+"</td><td>"+obj.model+"</td><td>"+obj.chasis_no+"</td><td>"+obj.complaint+"</td><td>"+obj.ddate+"</td></tr>")

     });
   
    
   }
   else{
    $("#delivery_table") .append("<td colspan='7' scope='col'>No Data</td>");
 
   }
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }
   //

   function insert_delivery()
   {
    
   
   $.ajax({
     url: "php/insert_dservice.php",
     type: "get", //send it through get method
     data: {
     cus_name :  $('#cus_name').val(),
cus_phone :  $('#cus_phone').val(),
cus_addr :  $('#cus_addr').val(),
chasis_no :  $('#chasis_no').val(),
dimage : delivery_photo_addr,
implement :  $('#implement :selected').val(),
model :  $('#model :selected').val(),
remark :  $('#remark').val(),
complaint :  $('#complaint').val(),
did : did

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




   function upload_sv(property,fname,preview)
  { 
    
    var iaddr = ""
    {
      var file_name = property.name;
      var file_extension = file_name.split('.').pop().toLowerCase();


      var form_data = new FormData();
      form_data.append("file",property);
      form_data.append("did",did);
      form_data.append("chasis_no",$("#chasis_no").val());
      form_data.append("file_name",$("#chasis_no").val() );
      form_data.append("file_extension", "." +  file_extension);
  
      $.ajax({
          url:'upload_service.php',
          method:'POST',
          data: form_data,
         async : false,
          contentType:false,
          cache:false,
          processData:false,
          beforeSend:function(){
          //  $('#msg').html('Loading......');
          console.log('Loading......');
          },
          success:function(data){
            console.log(data);
            iaddr = data
           // $('#msg').html(data);
           var timestamp = new Date().getTime(); // Get current timestamp
          
           $(preview).attr("src", data  + "?" + timestamp);
           $("#dsubmit").show()
          }
          
        });
      
  }

  return  iaddr
  }

  

   function get_implement()
   {
    
   
    $.ajax({
      url: "php/get_all_warranty.php",
      type: "get", //send it through get method
      data: {
      
      
    },
     success: function (response) {
   
   
   if (response.trim() != "error") {
   
     var obj = JSON.parse(response);
   
   
   
     obj.forEach(function (obj) {
     
       
       $("#implement").append(" <option value='" + obj.implement + "'>" + obj.implement + "</option>");
   
   
   
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


   function get_model(imp)
   {
    
   
    $.ajax({
      url: "php/get_model.php",
      type: "get", //send it through get method
      data: {
       implement : imp
      
    },
     success: function (response) {
   
        console.log(response);
   if (response.trim() != "error") {
   
     var obj = JSON.parse(response);
   
   

     obj.forEach(function (obj) {
     
       
       $("#model").append(" <option value='" + obj.model_no + "'>" + obj.model_no + "</option>");
   
   
   
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

   function get_warranty_terms()
   {
    
   
    $.ajax({
      url: "php/get_warranty_terms.php",
      type: "get", //send it through get method
      data: {
       implement : $('#implement :selected').val(),
       model_no : $('#model :selected').val()
      
    },
     success: function (response) {
   
        console.log(response);
   if (response.trim() != "error") {
   
     var obj = JSON.parse(response);
   
   

     obj.forEach(function (obj) {
        $("#terms_text").html(convertToHTML(obj.terms))
       
     
   
   
     });
     $('#warranty_model').modal('show');
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
    
    if (localStorage.getItem("dname") == null) {
      window.location.replace("dealer_login.html");
  }

 

   }

  
   function convertToHTML(text) {
    // Replace tabs with a combination of non-breaking spaces
    // Each tab is typically equivalent to 4 spaces, but you can adjust as needed
    let htmlText = text.replace(/\t/g, '&emsp;&emsp;');
    
    // Replace newline characters with line break elements
    htmlText = htmlText.replace(/\n/g, '<br>');
    
    return htmlText;
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