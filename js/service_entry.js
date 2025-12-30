

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


  var serice_att_addr = ""
  var current_user_id =  localStorage.getItem("ls_uid") ;
  var current_user_name =  localStorage.getItem("ls_uname") ;

  console.log(current_user_id)
$(document).ready(function(){

  check_login();
  get_invoice_details()

  $("#complaint_type_auto").change(function(){
    if ($('#complaint_type_auto').find(":selected").text() == "Other")
    {
      $("#complaint_type_text").removeAttr("disabled");
      $("#complaint_type_text").val("")
      $("#complaint_type_text").focus()
    }
    else{
      $("#complaint_type_text").val( $('#complaint_type_auto').find(":selected").text()) 
    }
    
   
  });
 
   $("#unamed").text(localStorage.getItem("ls_uname"))

 
   $("#create_service_btn").on("click", function()
   {
    
    if($('#service_form')[0].checkValidity())
    {
      $("#create_service_btn").attr("disabled", true);
      insert_service();
    }
    
      
     // getPDF();
   });


   $("#create_service_btn_phone").on("click", function()
   {
    if($('#service_form')[0].checkValidity())
    {
      $("#create_service_btn_phone").attr("disabled", true);
      insert_service_phone();
    }
      
     // getPDF();
   });
   $('#service_attachment_up').on('change',function ()
   {
   var property =this.files[0];
    upload_sa(property,"service","#service_attachment_preview","#service_attachment_bar"); 
   });


   });


   
   function insert_service()
   {
   
   $.ajax({
     url: "php/insert_service.php",
     type: "get", //send it through get method
     data: {
     
      
      cus_id :cus_id,
      emp_id : current_user_id,
      complaint_type : $("#complaint_type_text").val(),
      brand_name : $("#brand_name").val(),
      warranty : $('#warranty_auto').find(":selected").text(),
      amc : $('#amc_auto').find(":selected").text(),
      service_type : $('#service_type').find(":selected").text(),
      amount : $("#amount").val(),
      remark : $("#remark").val(),
      service_attachment : serice_att_addr,
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


     
   function insert_service_phone()
   {
   
   $.ajax({
     url: "php/insert_service.php",
     type: "get", //send it through get method
     data: {
     
      
      cus_id :cus_id,
      emp_id : current_user_id,
      complaint_type : $("#complaint_type_text").val(),
      brand_name : $("#brand_name").val(),
      warranty : $('#warranty_auto').find(":selected").text(),
      amc : $('#amc_auto').find(":selected").text(),
      service_type : $('#service_type').find(":selected").text(),
      amount : $("#amount").val(),
      remark : $("#remark").val(),
      service_attachment : serice_att_addr,
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
   function get_invoice_details()
   {
   
    $.ajax({
        url: "php/get_invoice_details.php",
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
            console.log(addr)
            
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
   function upload_sa(property,fname,preview,prograss_bar)
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
           url:'upload_sa.php',
           method:'POST',
           data: form_data,
        
           contentType:false,
           cache:false,
           processData:false,
           beforeSend:function(){
            $("#create_service_btn_phone").attr("disabled", true);
           //  $('#msg').html('Loading......');
           console.log('Loading......');
           },
           success:function(response){
       console.log(response)
          
            var obj = JSON.parse(response);
           
           pid  = parseInt(obj.insert_key)
       
           $("#create_service_btn_phone").attr("disabled", false);
           serice_att_addr = "service/"+ pid + "/" + fname + "." + file_extension
                $(preview).attr("src", "service/"+ pid + "/" + fname + "." + file_extension);
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
   
   }

   function print()
   {
    $("#print_cus_name").text( $("#cus_name").val())
    $("#print_cus_phone").text( $("#cus_phone").val())
    $("#print_compliant_type").text( $("#complaint_type_text").val())

    $("#print_brand_name").text( $("#brand_name").val())

    $("#print_warranty").text( $('#warranty_auto').find(":selected").text())

    $("#print_amc").text( $('#amc_auto').find(":selected").text())

    $("#print_service_type").text( $('#service_type').find(":selected").text())


    $("#print_remarks").text( $("#remark").val())
    $("#print_amount").text(" Rs. " +  $("#amount").val())
    $("#print_service_attachment").text( $("#cus_name").val())
  
    $("#print_service_attachment").attr("src", "swen/" + serice_att_addr);
     
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