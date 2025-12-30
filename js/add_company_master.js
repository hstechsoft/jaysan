
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




var cus_id = '0';
var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 

var logo_addr = "";
var logo_addr1 = "";


$(document).ready(function(){
    
 

 check_login();
 get_company();

 $("#update_company_btn").hide();
 $("#create_company_btn").show();

 
 
   $("#unamed").text(localStorage.getItem("ls_uname"))
  // $("#tlead_att_on").text(localStorage.getItem("ls_uname"))

  
 
  

  $("#create_company_btn").click(function()
  {

  insert_company_sql();

});


$("#update_company_btn").click(function()
{

update_company_sql();

});

$('#logo_up').on('change',function ()
{
var property =this.files[0];
  logo_addr =  upload_logo(property,"logo","#logo_preview","#logo_bar"); 
});

$('#logo_up1').on('change',function ()
{
var property =this.files[0];
  logo_addr1 =  upload_logo(property,"logo1","#logo_preview1","#logo_bar1"); 
  console.log(logo_addr1)
});


   });


   
   function update_company_sql()
   {

    
   
    console.log(logo_addr1)
   
   
   $.ajax({
  
     url: "php/update_company.php",
     type: "get", //send it through get method
     data: {
     
        company_name : $("#company_name").val(),
        company_address : $("#company_address").val(),
        company_terms :$("#company_terms").val() ,
        company_terms_pi :$("#company_terms_pi").val() ,
        company_terms_q :$("#company_terms_q").val() ,
        company_logo : logo_addr,
        company_logo1 : logo_addr1,
        company_bank : $("#company_bank").val(),
        gst : $("#gst").val(),
        qno_seq:  $("#qno_seq").val(),
        ino_seq:  $("#ino_seq").val(),
        pino_seq:  $("#pino_seq").val()
      
   },
     success: function (response) {
   console.log(response)
   location.reload();
  
   

   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   }

   function get_company()
   {
   
    $.ajax({
        url: "php/get_company.php",
        type: "get", //send it through get method
        data: {
          
          
         
      },
        success: function (response) {
      console.log(response)
      if (response.trim() != "error") {
   
   
   
        if((response.trim() != "0 result"))
        {
      
          var obj = JSON.parse(response);
      
          var count = 0;
        
          obj.forEach(function (obj) {
            
          $("#company_name").val(obj.company_name);
            $("#company_address").val(obj.company_address);
            $("#company_terms").val(obj.company_terms);
            $("#company_terms_pi").val(obj.company_terms_pi) 
            $("#company_terms_q").val(obj.company_terms_q) 
            $("#logo_preview").attr("src", obj.company_logo);
            $("#logo_preview1").attr("src", obj.company_logo1);
            $("#company_bank").val(obj.company_bank);
            $("#gst").val(obj.gst)
            $("#qno_seq").val(obj.qno_seq)
            $("#ino_seq").val(obj.ino_seq)
            $("#pino_seq").val(obj.pino_seq)
            

             logo_addr  = obj.company_logo;
             logo_addr1  = obj.company_logo1;

          });
        
         
          $("#update_company_btn").show();
          $("#create_company_btn").hide();
       
        }
      
        else{
            $("#update_company_btn").hide();
 $("#create_company_btn").show();
        
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


   function insert_company_sql()
   {
     
   $.ajax({
     url: "php/insert_company.php",
     type: "get", //send it through get method
     data: {
        company_name : $("#company_name").val(),
            company_address : $("#company_address").val(),
            company_terms :$("#company_terms").val() ,
            company_terms_pi :$("#company_terms_pi").val() ,
            company_terms_q :$("#company_terms_q").val() ,
            company_logo : logo_addr,
            company_logo1 : logo_addr1,
            company_bank : $("#company_bank").val(),
            gst : $("#gst").val(),
            qno_seq:  $("#qno_seq").val(),
            ino_seq:  $("#ino_seq").val(),
            pino_seq:  $("#pino_seq").val()
       
      
   },
     success: function (response) {
   console.log(response)
   //location.reload();
  
   

   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   }


  
   function get_product_autocomplete()
   {
     
        var product =  $('#pname_txt').val() + '%';
    var customer = [];
    var obj = {};
     $.ajax({
       url: "php/get_product_autocomplete.php",
       type: "get", //send it through get method
       data: {
        product:product,
        
     
     },
       success: function (response) {
 
     
     if (response.trim() != "0 result") {
       var obj = JSON.parse(response);
   
 
     
   
       obj.forEach(function (obj) {
 
          object = {
        
           label:obj.pname ,
          
           value : obj.pname
 
          
           
       };
        customer.push(object);
      
         
       });
      
     
     }
     
     else {
       customer = [];
       var object = {
       
         value:"No data",
         cus_id : "",
         cus_addr : ""
          
     };
      customer.push(object);
      console.log(customer)
    
     }
     
     
         
       },
       error: function (xhr) {
           //Do Something to handle error
 
           customer = [];
           var object = {
       
             value:"No data",
             cus_id : "",
             cus_addr : ""
              
         };
          customer.push(object);
           
       }
     });
 
    
     console.log(customer)
    
    
     return customer;
    
   }

   
  
   function upload_logo(property,fname,preview,prograss_bar)
   {
    var addr=""
    console.log(fname)
    var pid = ""

    $(prograss_bar + "1").show();
    
     {
       var file_name = property.name;
       var file_extension = file_name.split('.').pop().toLowerCase();
 
 
       var form_data = new FormData();
       form_data.append("file",property);
      
       form_data.append("file_name",fname + "." + file_extension);
       
   
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
           url:'upload_logo.php',
           method:'POST',
           data: form_data,
          async: false,
           contentType:false,
           cache:false,
           processData:false,
           beforeSend:function(){
           //  $('#msg').html('Loading......');
           console.log('Loading......');
           },
           success:function(response){
       console.log(response)
          
     
       addr =response.trim()

             
                $(preview).attr("src", addr);
        var tmpImg = new Image() ;
        tmpImg.src = $(preview).attr("src") ;
   
       
        tmpImg.onload = function() {
         // Run onload code.
         $(preview).show();
         $(prograss_bar + "1").hide();
     } ;
           }
           
         });
       
   }
   return addr;
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