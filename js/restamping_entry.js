

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
  
  var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var cus_id = urlParams.get('cus_id');
var work_id = urlParams.get('work_id');
var listner_id = urlParams.get('listner_id');
if(cus_id != null)
{
  get_cus_info();
}


  var restamp_att_addr = ""
  var current_user_id =  localStorage.getItem("ls_uid") ;
  var current_user_name =  localStorage.getItem("ls_uname") ;
$(document).ready(function(){

  check_login();
  get_restamp_details()

  $("#stamp_date").focusout(function(){
    var d = new Date()
    var n = d.getMonth()+1
  var q_now = get_quater(n)
  var year_now =   d.getFullYear()

    var restamp_date =  new Date($("#stamp_date").val())
    n = restamp_date.getMonth()+1
    var q_restamp = get_quater(n)
    var year_restamp =   restamp_date.getFullYear()
    
    var q_year = 4*(year_now-year_restamp)
    var q = (q_now -q_restamp)
    console.log(q+q_year)
    var delay =  parseInt(q)+parseInt(q_year)
    $("#fine_txt").text("quarter Delayed - " + delay)
    
 

  
     });

  $("#machine_type_auto").change(function(){
    if ($('#machine_type_auto').find(":selected").text() == "Other")
    {
      $("#machine_type_text").removeAttr("disabled");
      $("#machine_type_text").val("")
      $("#machine_type_text").focus()
    }
    else{
      $("#machine_type_text").val( $('#machine_type_auto').find(":selected").text()) 
    }   
  });

  $("#platform_size_auto").change(function(){
    if ($('#platform_size_auto').find(":selected").text() == "Other")
    {
      $("#platform_size_text").removeAttr("disabled");
      $("#platform_size_text").val("")
      $("#platform_size_text").focus()
    }
    else{
      $("#platform_size_text").val( $('#platform_size_auto').find(":selected").text()) 
    }   
  });

  $("#capacity_auto").change(function(){
    if ($('#capacity_auto').find(":selected").text() == "Other")
    {
      $("#capacity_text").removeAttr("disabled");
      $("#capacity_text").val("")
      $("#capacity_text").focus()
    }
    else{
      $("#capacity_text").val( $('#capacity_auto').find(":selected").text()) 
    }   
  });

 
   $("#unamed").text(localStorage.getItem("ls_uname"))

 
   $("#create_restamp_btn").on("click", function()
   {
    if($('#restamping_form')[0].checkValidity())
    {
      $("#create_restamp_btn").attr("disabled", true);
      insert_restamp();
    }
   
     // getPDF();
   });


   $("#create_restamp_btn_phone").on("click", function()
   {
    if($('#restamping_form')[0].checkValidity())
    {
      $("#create_restamp_btn_phone").attr("disabled", true);
      insert_restamp_phone();
    }
      
     // getPDF();
   });

   $('#restamp_attachment_up').on('change',function ()
   {
   var property =this.files[0];
   upload_ra(property,"restamp","#restamp_attachment_preview","#restamp_attachment_bar"); 
   });


   });

   function get_quater(n)
   {
    var q_now =0
    if(n <= 3)
    { 
     
    q_now =1;
    }
    else if(n<=6 && n>3)
    {
      q_now =2;
    }
    else if(n<=9 && n>6)
    {
      q_now =3;
    }
    else if(n<=12 && n>9)
    {
      q_now =4;
    }

    return q_now;
   }

 
   function insert_restamp_phone()
   {
   
   $.ajax({
     url: "php/insert_restamp.php",
     type: "get", //send it through get method
     data: {
            cus_id : cus_id,
        	emp_id : current_user_id,
        	machine_type :  $('#machine_type_auto').find(":selected").text(),
        	platform_size :  $('#platform_size_auto').find(":selected").text(),
        	capcity :  $('#capacity_auto').find(":selected").text(),
        	brand_name :  $("#brand_name").val(),
        	stamp_cer : $('#stamp_cer_auto').find(":selected").text(),
        	stamp_plate : $('#stamp_plate_auto').find(":selected").text(),
        	stamp_date : $("#stamp_date").val(),
        	amount : $("#amount").val(),
        	remark : $("#remark").val(),
        	restamp_attachment : restamp_att_addr,
          cur_time : get_cur_millis()
      
   
        
      
   
   },
     success: function (response) {
      console.log(response)
      var lis_res = response.trim()
    if(listner_id != null)
      update_listner(listner_id,lis_res)
  
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   }
   
   function insert_restamp()
   {
   
   $.ajax({
     url: "php/insert_restamp.php",
     type: "get", //send it through get method
     data: {
            cus_id : cus_id,
        	emp_id : current_user_id,
        	machine_type :  $('#machine_type_auto').find(":selected").text(),
        	platform_size :  $('#platform_size_auto').find(":selected").text(),
        	capcity :  $('#capacity_auto').find(":selected").text(),
        	brand_name :  $("#brand_name").val(),
        	stamp_cer : $('#stamp_cer_auto').find(":selected").text(),
        	stamp_plate : $('#stamp_plate_auto').find(":selected").text(),
        	stamp_date : $("#stamp_date").val(),
        	amount : $("#amount").val(),
        	remark : $("#remark").val(),
        	restamp_attachment : restamp_att_addr,
          cur_time : get_cur_millis()
      
   
        
      
   
   },
     success: function (response) {
      console.log(response)
      var lis_res = response.trim()
      if(listner_id != null)
      update_listner(listner_id,lis_res)
    else
      print();
  
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   }

   function get_restamp_details()
   {
   
    $.ajax({
        url: "php/get_restamp_details.php",
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
            var addr = obj.company_address
            
            
            addr =addr.replace(/\n/g, "<br />")
             
           
            
            $("#print_company_name").text(obj.company_name)
          
            $("#print_company_addr").html(addr)
            $("#print_logo_preview").attr("src", "/swen/company/logo.jpg");
           
           
            
          
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
   function get_cus_info()
   {
     $.ajax({
       url: "php/get_cus_info_service.php",
       type: "get", //send it through get method
       data: {
         cus_id:cus_id,
        
      
      },
       success: function (response) {
      
      
      if (response.trim() != "error") {
       var obj = JSON.parse(response);
      
      
      
       obj.forEach(function (obj) {
        $("#cus_name").val(obj.cus_name)
        $("#cus_phone").val(obj.cus_phone)
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
     
   //
   function upload_ra(property,fname,preview,prograss_bar)
   {
    var pid = ""

    $(prograss_bar + "1").show();
    
     {
       var file_name = property.name;
       var file_extension = file_name.split('.').pop().toLowerCase();
 
 
       var form_data = new FormData();
       form_data.append("file",property);
      
       form_data.append("file_name",fname + "." + file_extension);
       form_data.append("pid",null);
   
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
           url:'upload_ra.php',
           method:'POST',
           data: form_data,
           contentType:false,
           cache:false,
           processData:false,
           beforeSend:function(){
           //  $('#msg').html('Loading......');
           console.log('Loading......');
           $("#create_restamp_btn_phone").attr("disabled", true);
           },
           success:function(response){
       console.log(response)
          
            var obj = JSON.parse(response);
           
           pid  = parseInt(obj.insert_key)
       
           restamp_att_addr = "restamp/"+ pid + "/" + fname + "." + file_extension
             
                $(preview).attr("src", "restamp/"+ pid + "/" + fname + "." + file_extension);
        var tmpImg = new Image() ;
        tmpImg.src = $(preview).attr("src") ;
        $("#create_restamp_btn_phone").attr("disabled", false);
       
        tmpImg.onload = function() {
         // Run onload code.
         $(preview).show();
         $(prograss_bar + "1").hide();
     } ;
           }
           
         });
       
   }
   
   }

   function print()
   {
    $("#print_cus_name").text( $("#cus_name").val())
    $("#print_cus_phone").text( $("#cus_phone").val())
    $("#print_machine_type").text( $("#machine_type_text").val())

    $("#print_platform_size").text( $("#platform_size_text").val())

    $("#print_capacity").text( $("#capacity_text").val())

    $("#print_brand_name").text( $("#brand_name").val())

    $("#print_stamp_cer").text( $('#stamp_cer_auto').find(":selected").text())
    $("#print_stamp_plate").text( $('#stamp_plate_auto').find(":selected").text())

    $("#print_stamp_date").text( $("#stamp_date").val())
    $("#print_remarks").text( $("#remark").val())
    $("#print_amount").text(" Rs. " +  $("#amount").val())
   
  
    $("#print_restamp_attachment").attr("src", "swen/" + restamp_att_addr);
     
     $('#print').printThis({
      
      
      
     
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

function update_listner(listner_id,lis_res)
{
  $.ajax({
    url: "php/update_listner.php",
    type: "get", //send it through get method
    data: {
      listner_id :listner_id,
      lis_res :lis_res
  
  },
    success: function (response) {

  console.log(response)
 
  
      
    },
    error: function (xhr) {
        //Do Something to handle error
    }
  });

}