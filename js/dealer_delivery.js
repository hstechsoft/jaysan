
var dname = localStorage.getItem("dname")
var did = localStorage.getItem("did")
var delivery_photo_addr = ""

// console.log(role)

$(document).ready(function(){
 


    $("#role_name_txt").text(dname)
    $("#dphoto").hide()
    $("#dsubmit").hide()
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


delivery_photo_addr = upload_sv(property,"delivery_photo","#delivery_photo_preview"); 

});





$("#chasis_no").focusout(function(){
    check_chasis_no($("#chasis_no").val());
     });

$('#implement').change(function() {
    if($('#implement :selected').val() != 0)
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

   function get_today_delivery()
   {
    
   
   $.ajax({
     url: "php/get_today_delivery.php",
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
$('#delivery_table').append("<tr><td>"+count+"</td><td>"+obj.cus_name+"</td><td>"+obj.implement+"</td><td>"+obj.model+"</td><td>"+obj.chasis_no+"</td><td>"+obj.ddate+"</td></tr>")

     });
   
    
   }
   else{
    $("#delivery_table") .append("<td colspan='6' scope='col'>No Data</td>");
 
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
     url: "php/insert_delivery.php",
     type: "get", //send it through get method
     data: {
     cus_name :  $('#cus_name').val(),
cus_phone :  $('#cus_phone').val(),
cus_addr :  $('#cus_addr').val(),
chasis_no :  $('#chasis_no').val(),
dimage : delivery_photo_addr,
implement :  $('#implement :selected').val(),
model :  $('#model :selected').val(),
ext_warranty :  $('#ext_warranty :selected').text(),
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

   $('#delivery_photo_up').on('change',function ()
   {
 
    
   
        
   });


   function upload_sv(property,fname,preview)
  {
    if (!property) {
      return; // No file selected
  }
    var file_name = property.name;
    var file_extension = file_name.split('.').pop().toLowerCase();
  {
   var form_data = new FormData();
   form_data.append("file",property);
   form_data.append("did",did);
   form_data.append("dname",dname);
   form_data.append("chasis_no",$("#chasis_no").val());
   form_data.append("file_name",$("#chasis_no").val().replace(/\//g, '#@#') + "." + file_extension);

     
       // Show the overlay and reset progress bar
      
   
        $.ajax({
            url:'upload_delivery.php',
            method:'POST',
            data:form_data,
            contentType:false,
            cache:false,
            processData:false,
            beforeSend:function(){
            //  $('#msg').html('Loading......');
            console.log('Loading......');
           
            },
           
            success:function(data){
            
           
             console.log(data);
             // $('#msg').html(data);
             var timestamp = new Date().getTime(); // Get current timestamp
            
             $(preview).attr("src", "attachment/delivery/" + did + "/" + $("#chasis_no").val() + "." + file_extension + "?" + timestamp);
             $("#dsubmit").show()
         
          
            }
          });
        
    }
  return  "attachment/delivery/"+ did + "/" + $("#chasis_no").val() + "." + file_extension
  }

   function check_chasis_no(chasis_no_p)
   {  

$.ajax({
  url: "php/check_chasis_no.php",
  type: "get", //send it through get method
  data: {
    chasis_no:chasis_no_p
},
  success: function (response) {
    
    if (response.trim() != "0 result") {
   
      var obj = JSON.parse(response);
     

      obj.forEach(function (obj) {
        salert("warning","chasis number already Registered" ,"warning")
       
      });
     
  
    }
   

},
  error: function (xhr) {
      //Do Something to handle error
  }
});

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