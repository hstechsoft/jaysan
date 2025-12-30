
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
  import { getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword  } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js'
  import { getDatabase, ref, set ,onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
  const app = initializeApp(firebaseConfig);

  var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var product_id = urlParams.get('pid');

if(product_id !=null)
{
get_product();
get_product_reminder();
$("#product_title").text("Update Product");
$("#update_product_btn").show();
$("#create_product_btn").hide();
}
else{
    $("#product_title").text("Create Product");
    $("#update_product_btn").hide();
$("#create_product_btn").show();
}

var cus_id = '0';
var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 

var image1_addr = "";
var image2_addr = "";
var image3_addr = "";


$(document).ready(function(){
    $(product_image1_bar1).hide();

 check_login();
 
 get_reminder();
 

 
 
   $("#unamed").text(localStorage.getItem("ls_uname"))
  // $("#tlead_att_on").text(localStorage.getItem("ls_uname"))

  $('#pname_txt').on('input',function(e){

    if($('#pname_txt').val() !="")
    {
      $('#pname_txt').autocomplete({
        
        source: get_product_autocomplete,
        minLength: 2,
        cacheLength: 0,
        select: function(event, ui) {
         
        cus_id = ui.item.cus_id;
      
        } ,
        //display no result 
     
      });
    }
   
  //   get_product_autocomplete("null", function(data) {
  //     console.log(data);  // Now this logs the actual data after AJAX completes
  // });
   });
 
  

  $("#create_product_btn").click(function()
  {
    if($('#product_entry_form')[0].checkValidity())
    {
      insert_product_sql();
      $("#create_product_btn").prop("disabled", true);
    }
   
  else
  {
    salert("Mandatory","kindly fill mandatory Fields","warning")
    return
  }
 


});


$("#update_product_btn").click(function()
{

update_product_sql();

});

$('#product_image1_up').on('change',function ()
{
var property =this.files[0];
   upload_pp(property,"image1","#product_image1_preview","#product_image1_bar"); 
});


$('#product_image2_up').on('change',function ()
{
var property =this.files[0];

  upload_pp(property,"image2","#product_image2_preview","#product_image2_bar"); 
});

$('#product_image3_up').on('change',function ()
{
var property =this.files[0];
 
  upload_pp(property,"image3","#product_image3_preview","#product_image3_bar"); 
});

$('#reminder_add_button').click(function() {
  var trlength = $('#reminder_table1 tr').length;
    if( $('#sel_reminder_in').find(":selected").val()>0)
  {
    $("#reminder_table").append(" <tr> <td >"+ trlength+"</td> <td>" + $('#sel_reminder_in').find(":selected").text()+ "</td> <td>" + $('#sel_reminder_in').find(":selected").val()+ "</td><td> <button type='button' class='btn btn-outline-danger border-0'> <i class='fa-solid fa-trash-can'></i> </button> </td> </tr> ");
  
    $('#selected_user_count_txt').text(trlength)
    
  }
  
   })


   $("#reminder_table").on("click","tr td button", function(event) {
    //get button value
    $(this).parent().parent().remove()
   
    
  var count = 0
    $('#reminder_table tr').each(function () {
      count =count+1
        var this_row = $(this);
       
        (this_row.find('td:eq(0)').html(count))

     });

     


     

     $('#selected_user_count_txt').text($('#reminder_table tr').length)
    
  
        });


        
   $("#reminder_table_av").on("click","tr td button", function(event) {
    //get button value
    
   
console.log($(this).val())
     

delete_product_reminder($(this).val())
     

    
    
  
        });

   });

   function delete_product_reminder(id)
   {
    $.ajax({
      url : "php/delete_product_reminder.php",
      type : "get",
      data :
      {
id:id
      },
      success: function (response) {
console.log(response)
location.reload()
      }

    })
   }



   function get_reminder()
   {
    
   $.ajax({
     url: "php/get_reminder.php",
     type: "get", //send it through get method
    
     success: function (response) {
   console.log(response)
   
   if (response.trim() != "error") {
    if (response.trim() != "0 result")
    {
     var obj = JSON.parse(response);
   
   
   
     obj.forEach(function (obj) {
     
       
       $("#sel_reminder_in").append(" <option value='" + obj.remind_id + "'>" + obj.remind_name + " - " + obj.reminder_days + " Days" +  "</option>");
     
   
   
     });
   
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


   
   function get_product_reminder()
   {
    
   $.ajax({
     url: "php/get_product_reminder.php",
     type: "get", //send it through get method
     data: {
  
      pid: product_id
    },
     success: function (response) {
   console.log(response)
   
   if (response.trim() != "error") {
    if (response.trim() != "0 result")
    {
     var obj = JSON.parse(response);
   
   var count =0
   var des=""
     obj.forEach(function (obj) {
     count = count+1
       des  = "reminder Days - " + obj.reminder_days + "<br>" +"reminder Before - " + obj.remind_before + " days <br>"+ "repeat - " + obj.repeat_sts

      $("#reminder_table_av").append(" <tr> <td >"+ count+"</td> <td>" +obj.remind_name+ "</td> <td>" + des + "</td><td> <button type='button' value = '"+obj.id + "' class='btn btn-outline-danger border-0'> <i class='fa-solid fa-trash-can'></i> </button> </td> </tr> ");
     
   
     });
   
    }
    else{
      $("#reminder_table_av").append(" <tr><td colspan='8' scope='col' class='text-bg-danger h6'>Sorry no data!</td></tr>")

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

   
   function update_product_sql()
   {
     
   $.ajax({
     url: "php/update_product.php",
     type: "get", //send it through get method
     data: {
        pname : $("#pname_txt").val(),
        pid : product_id,
        des : $("#des_txt").val(),
        price : parseFloat($("#price_txt").val()),
        qty : "",
        hsn_code : $("#hsn_txt").val(),
        tax_rate :$('#tax_rate_txt').find(":selected").text(),
        image1 : image1_addr,
        image2 : image2_addr,
        image3 : image3_addr,
        restamping : $('#restamp_txt').find(":selected").text()
      
   },
     success: function (response) {
   console.log(response)
  
   var count = 0
   var rowCount = $('#reminder_table1 tr').length-1;
   console.log(rowCount)
   if(rowCount == 0)
   {
    location.reload();
   }
   $("#reminder_table1 tr:gt(0)").each(function () {
    count = count+1;
    var this_row = $(this);
   
    var remind_id = $.trim(this_row.find('td:eq(2)').html())
    var remind_name = $.trim(this_row.find('td:eq(1)').html())
console.log(remind_name)

var reload_p="";

if (count >= rowCount)
{
reload_p="yes";
}
else{
reload_p="no";
}



create_reminder(remind_id,reload_p)

});
   
  
   

   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   }

   function get_product()
   {
   
    $.ajax({
        url: "php/get_product.php",
        type: "get", //send it through get method
        data: {
            pid : product_id,
          
         
      },
        success: function (response) {
      console.log(response)
      if (response.trim() != "error") {
   
   
   
        if((response.trim() != "0 result"))
        {
      
        
        
          var obj = JSON.parse(response);
      
          var count = 0;
        
          obj.forEach(function (obj) {
           
           
            $("#pname_txt").val(obj.pname) 
           $("#des_txt").val(obj.des)  
             $("#price_txt").val(parseFloat(obj.price))
           $("#hsn_txt").val(obj.hsn_code)
             $('#tax_rate_txt').find(":selected").text(obj.tax_rate)
             $('#restamp_txt').find(":selected").text(obj.restamping)
             $("#product_image1_preview").attr("src", obj.image1);
             $("#product_image2_preview").attr("src", obj.image2);
             $("#product_image3_preview").attr("src", obj.image3);

             image1_addr  = obj.image1;
             image2_addr  = obj.image2;
             image3_addr  = obj.image3;

          });
        
         
      
       
        }
      
        else{
        
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

   function create_reminder(remind_id,reload_p)
   {
     console.log(product_id)
   $.ajax({
     url: "php/insert_product_reminder.php",
     type: "get", //send it through get method
     data: {
      remind_id : remind_id,
        pid : product_id
      
      
   },
     success: function (response) {
   console.log(reload_p)
   //location.reload();
  
   if (reload_p == "yes")
{
location.reload();
}

   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });

   }
   function insert_product_sql()
   {
    
   $.ajax({
     url: "php/insert_product.php",
     type: "get", //send it through get method
     data: {
        pname : $("#pname_txt").val(),
        des : $("#des_txt").val(),
        price : parseFloat($("#price_txt").val()),
        qty : "",
        hsn_code :  $("#hsn_txt").val(),
        tax_rate :$('#tax_rate_txt').find(":selected").text(),
        image1 : image1_addr,
        image2 : image2_addr,
        image3 : image3_addr,
        restamping : $('#restamp_txt').find(":selected").text()
      
   },
     success: function (response) {
   console.log(response)
  
   var count = 0
   var rowCount = $('#reminder_table1 tr').length-1;
   console.log(rowCount)
   if(rowCount == 0)
   {
    location.reload();
   }
   $("#reminder_table1 tr:gt(0)").each(function () {
    count = count+1;
    var this_row = $(this);
   
    var remind_id = $.trim(this_row.find('td:eq(2)').html())
    var remind_name = $.trim(this_row.find('td:eq(1)').html())
console.log(remind_name)

var reload_p="";

if (count >= rowCount)
{
reload_p="yes";
}
else{
reload_p="no";
}



create_reminder(remind_id,reload_p)

});
   

   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   }


  
   function get_product_autocomplete(request, response)
   {
     console.log(request);
     
        var product =  $('#pname_txt').val() + '%';
    var customer = [];
   
     $.ajax({
       url: "php/get_product_autocomplete.php",
       type: "get", //send it through get method
       data: {
        product:product,
        
     
     },
       success: function (data) {
 console.log(data);
 
     
     if (data.trim() != "0 result") {
       var obj = JSON.parse(data);
   
 
     
   
       obj.forEach(function (obj) {
        customer.push({
          label: obj.pname,
          value: obj.pname
        });
      
         
       });
      
       response(customer);
     }
     
     else {
      response([{
        label: "No data",
        value: "",
        cus_id: null
    }]);
     }
     
     
         
       },
       error: function (xhr) {
           //Do Something to handle error
 
           customer.push({
            label: "No data",
            value: "No data"
          });
          response(customer);
       }
     });
 
    
   
    
   }
   
  
   function upload_pp(property,fname,preview,prograss_bar)
   {
    var pid = ""
var raddr=""
    $(prograss_bar + "1").show();
    $(preview).hide();
     {
       var file_name = property.name;
       var file_extension = file_name.split('.').pop().toLowerCase();
 
 
       var form_data = new FormData();
       form_data.append("file",property);
       form_data.append("file_name",fname + "." + file_extension);
       form_data.append("pid",product_id);
   
       $.ajax({
        xhr: function() {
          var xhr = new window.XMLHttpRequest();
      
          xhr.upload.addEventListener("progress", function(evt) {
            if (evt.lengthComputable) {
              var percentComplete = evt.loaded / evt.total;
              percentComplete = parseInt(percentComplete * 100);
              console.log(percentComplete);
              $(prograss_bar).css("width", percentComplete + "%").text(percentComplete + "%");
              if (percentComplete === 100) {
              
                $(prograss_bar).css("width", percentComplete + "%").text("Uploaded !!");
              }
      
            }
          }, false);
      
          return xhr;
        },
           url:'upload_pp.php',
           method:'POST',
           data: form_data,
          
           contentType:false,
           cache:false,
           processData:false,
          
           beforeSend:function(){
           //  $('#msg').html('Loading......');
           console.log('Loading......');
           $("#create_product_btn").prop("disabled", true);
           $("#update_product_btn").prop("disabled", true);
           },
           success:function(response){
       console.log(response)
          
         raddr = response.trim();
        
         switch (fname) {
          case "image1":
          image1_addr = response.trim()
            break;
          case "image2":
            image2_addr = response.trim()
            break;
          case "image3":
            image3_addr = response.trim()
            break;
         
        }
             
                $(preview).attr("src", raddr);
        var tmpImg = new Image() ;
        tmpImg.src = $(preview).attr("src") ;
   
       
        tmpImg.onload = function() {
         // Run onload code.
         $(preview).show();
         $(prograss_bar + "1").hide();
     } ;

     $("#create_product_btn").prop("disabled", false);
     $("#update_product_btn").prop("disabled", false);
     
           }

           
           
         });
        
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