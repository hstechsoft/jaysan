

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

if(phone_id != null)
{
  check_phone_app(phone_no)

}

if(cus_id != null)
{
  get_customer()
  $("#new_cus_update_btn").show()
  $("#new_cus_submit_btn").hide()
}
else{
  $("#new_cus_update_btn").hide()
  $("#new_cus_submit_btn").show()
}
console.log(phone_no)
console.log(phone_name)
var map_location = ""
if(latti != null)
{
 map_location =  "https://www.google.com/maps/search/?api=1&query="+ latti + ","+ longi
 console.log(map_location)
 $("#cus_location").val(map_location)
 $("#cus_location").prop("disabled",true)
}





$(document).ready(function(){
  window.onload = function () { 
    $('#cus_type_model').modal('show'); 
   }
//  $(".dealer").hide();
//  $(".customer").hide();
$("#cus_phone").val(phone_no)
$("#cus_name").val(phone_name)
$("#cus_company_name").val(urlParams.get('company_name'))
$("#cus_address").val(urlParams.get('address'))


  $("#assign_others_hide").hide();
  $("#create_customer_work_form").hide(); 
 check_login();
 get_work_type();
 get_employee();
 
 //$('#cus_type_model').modal('show'); 
 
 
 
 $("#cus_phone").focusout(function(){
 check_phone_no($("#cus_phone").val());
  });

 $('#sel_usr_in').change(function() {
var trlength = $('#work_select_employee_table tr').length;
  if( $('#sel_usr_in').find(":selected").val()>0)
{
  $("#work_select_employee").append(" <tr> <td >"+ trlength+"</td> <td>" + $('#sel_usr_in').find(":selected").text()+ "</td> <td>" + $('#sel_usr_in').find(":selected").val()+ "</td> </tr> ");

  $('#selected_user_count_txt').text(trlength)
  
}

 });


 $('#work_user_selectall_checkbox').change(function() {
  if(this.checked) {
  get_all_employee();
  }
  else
  {
    $("#work_select_employee").empty();
    $('#selected_user_count_txt').text("0")

  }
    
});
 

 $('#assigntoothers_checkbox').change(function() {
  if(this.checked) {
    $("#assign_others_hide").show();
  }
  else
  
  $("#assign_others_hide").hide(); 
  

});


$("#new_cus_submit_btn").click(function()
{

create_customer();
});

$("#new_cus_update_btn").click(function()
{

update_customer();
});

$("#cus_type_btn").click(function()
{
  if($('#cus_type_customer').is(":checked"))
    {
      $(".dealer").hide();
      $(".customer").show();
      cus_type = "customer";
    }

    else if($('#cus_type_dealer').is(":checked"))
    {
      $(".dealer").show();
      $(".customer").hide();
      cus_type = "dealer";
    }
    else if($('#cus_type_other').is(":checked"))
    {
      $(".dealer").hide();
      $(".customer").hide();
      cus_type = "other";
    }
    
   
    $("#cus_type_model .btn-close").click()
});


 

  


$('#cus_name').on('input',function(){
  //check the value not empty
      if($('#cus_name').val() !="")
      {
        $('#cus_name').autocomplete({
          //get data from databse return as array of object which contain label,value
          source: get_customer_autocomplete(),
          minLength: 2,
          cacheLength: 0,
          select: function(event, ui) {
           
          cus_id = ui.item.cus_id;
          var url = "user_call.html?cus_id=" + cus_id;
          window.open(url,"_self");
          } ,
          //display no result 
          response: function(event, ui) {
            // if (!ui.content.length) {
            //     var noResult = { value:"",label:"No results found" };
            //     ui.content.push(noResult);
            // }
        }
        });
      }
     
     });

     $('#cus_phone').on('input',function(){
      //check the value not empty
          if($('#cus_phone').val() !="")
          {
            $('#cus_phone').autocomplete({
              //get data from databse return as array of object which contain label,value
              source: get_phone_autocomplete(),
              minLength: 2,
              cacheLength: 0,
              select: function(event, ui) {
               
              cus_id = ui.item.cus_id;

              var url = "user_call.html?cus_id=" + cus_id;
                window.open(url,"_self");
            
              } ,
              //display no result 
              response: function(event, ui) {
                // if (!ui.content.length) {
                //     var noResult = { value:"",label:"No results found" };
                //     ui.content.push(noResult);
                // }
            }
            });
          }
         
         });

       
   });

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
   

   function get_customer_autocomplete()
   {
     
        var cusname =  $('#cus_name').val() + '%';
    var customer = [];
    var obj = {};
     $.ajax({
       url: "php/get_customer_autocomplete.php",
       type: "get", //send it through get method
       data: {
         cus_name:cusname,
        
     
     },
       success: function (response) {

     
     if (response.trim() != "0 result") {
       var obj = JSON.parse(response);
   
 
     
   
       obj.forEach(function (obj) {
 
          object = {
        
           label:obj.cus_name + " - " +  obj.cus_phone,
           cus_id : obj.cus_id,
           cus_addr : obj.cus_address,
           value : obj.cus_name
 
          
           
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
  
   function get_phone_autocomplete()
   {
     
        var cus_phone =  $('#cus_phone').val() + '%';
    var customer = [];
    var obj = {};
     $.ajax({
       url: "php/get_phone_autocomplete.php",
       type: "get", //send it through get method
       data: {
        cus_phone:cus_phone,
        
     
     },
       success: function (response) {

     
     if (response.trim() != "0 result") {
       var obj = JSON.parse(response);
   
 
     
   
       obj.forEach(function (obj) {
 
          object = {
        
           label: +  obj.cus_phone +" - "+obj.cus_name,
           cus_id : obj.cus_id,
           cus_addr : obj.cus_address,
           value : obj.cus_phone
 
          
           
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

   function check_phone_no(phone_no_p)
   {  

$.ajax({
  url: "php/check_customer_phone.php",
  type: "get", //send it through get method
  data: {
    cus_phone:phone_no_p
},
  success: function (response) {
    
    if (response.trim() != "0 result") {
   
      var obj = JSON.parse(response);
     

      obj.forEach(function (obj) {
        salert("warning","phone number already Registered name - " + obj.cus_name + " address - " + obj.cus_address,"warning")
       
      });
     
  
    }
   

},
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }

   function check_phone_app(phone_no_p)
   {  

$.ajax({
  url: "php/check_customer_phone.php",
  type: "get", //send it through get method
  data: {
    cus_phone:phone_no_p
},
  success: function (response) {
    
    if (response.trim() != "0 result") {
   
      var obj = JSON.parse(response);
     

      obj.forEach(function (obj) {
        var url = "user_call.html?cus_id=" + obj.cus_id + "&phone_id="+ phone_id;
          window.open(url,"_self");
      });
     
  
    }
   

},
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }
   function create_customer()
   {  

    if($('#lang_tamil').is(":checked"))
    {
      cus_lang = cus_lang + "tamil,"
    }
    if($('#lang_english').is(":checked"))
    {
      cus_lang = cus_lang + "english,"
    }
    if($('#lang_kannada').is(":checked"))
    {
      cus_lang = cus_lang + "kannada,"
    }
    if($('#lang_telugu').is(":checked"))
    {
      cus_lang = cus_lang + "telugu,"
    }
    if($('#lang_malayalam').is(":checked"))
    {
      cus_lang = cus_lang + "malayalam,"
    }
    if($('#lang_hindi').is(":checked"))
    {
      cus_lang = cus_lang + "hindi,"
    }

$.ajax({
  url: "php/insert_customer.php",
  type: "get", //send it through get method
  data: {
    cus_name : $("#cus_name").val(),
    cus_address : $("#cus_address").val(),
    cus_lead_source: $("#cus_lead_source").val(),
    cus_location: $("#cus_location").val(),
    cus_phone: $("#cus_phone").val(),
    cus_aphone: $("#cus_aphone").val(),
    cus_place: $("#cus_place").val(),
    cus_state: $("#cus_state").val(),
    //$('#work_type_list :selected').text(),
    cus_lang: cus_lang,
    cus_exp: $("#cus_exp").val(),
    cus_tmodel: $("#cus_tmodel").val(),
    cus_imp: $("#cus_imp").val(),
    cus_sub: $('#cus_sub :selected').text(),
    cus_usecase:  $('#cus_usecase :selected').text(),
    cus_showroom:  $('#cus_showroom :selected').text(),
    cus_oproduct: $("#cus_oproduct").val(),
    cus_category: $('#cus_category :selected').text(),
    cus_gst: $("#cus_gst").val(),
    cus_type: cus_type,
   
    his_time:get_cur_millis(),
    his_comment :"customer created by - " + current_user_name,
    his_status : 'lead',
    his_emp_id : current_user_id

}, 
  success: function (response) {
    console.log(response)
    if (response.trim() != "error") {
     
      
      cus_id=response.trim();
      if(urlParams.get('type') == "lead")
{


  var url = "create_work.html?listner_id="+ lis_id + "&work_cus_id=" + cus_id + "&lead_source=" + lead_source;
  window.open(url,"_self");
}
else{
  var url = "user_call.html?cus_id=" + cus_id;
  window.open(url,"_self");
}
     
    }




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }


   function update_customer()
   {  


$.ajax({
  url: "php/update_customer.php",
  type: "get", //send it through get method
  data: {
cus_name : $("#cus_name").val(),
cus_address : $("#cus_address").val(),
cus_location: $("#cus_location").val(),
cus_company_name: $("#cus_company_name").val(),
cus_email: $("#cus_email").val(),
cus_phone: $("#cus_phone").val(),
cus_id : cus_id,
cus_gst : $("#cus_gst").val(),

cus_lead_source :$('#cus_lead_source').val(),
cus_aphone : $('#cus_aphone').val(),
cus_place : $('#cus_place').val(),
cus_state : $('#cus_state').val(),
cus_exp : $('#cus_exp').val(),
cus_tmodel : $('#cus_tmodel').val(),
cus_imp : $('#cus_imp').val(),
cus_oproduct: $('#cus_oproduct').val()






}, 
  success: function (response) {
    console.log(response)
    location.reload()




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }


   function create_work(work_assign_status_p,emp_id_p,his_comment_p,reload_p,his_status)
   {  

$.ajax({
  url: "php/insert_work.php",
  type: "get", //send it through get method
  data: {
    emp_id : emp_id_p,
    work_date  :get_millis($("#work_date").val()),
    cus_id  : cus_id,
    work_created_by  : current_user_id,
    work_assign_status  : work_assign_status_p,
    work_type  : $('#work_type_list :selected').text(),
    work_status  :"",
    work_description  :  $("#work_textbox").val(),
    work_location  : $("#work_location_textbox").val(),
    work_attachment  : "",
    work_com_status  : "incomplete",
    last_att : get_cur_millis(),
    his_comment :his_comment_p,
    his_status : his_status,
    his_emp_id : current_user_id

},
  success: function (response) {
    console.log(response)
if(reload_p =="yes")
{
// salert("success","work successfully created","success");
  window.location.reload();
}



    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }


   function get_all_employee()
   {
    
   $.ajax({
     url: "php/get_employee.php",
     type: "get", //send it through get method
    
     success: function (response) {
   
   
   if (response.trim() != "error") {
   
     var obj = JSON.parse(response);
   
     var trlength = 0;
   
     obj.forEach(function (obj) {
       trlength = $('#work_select_employee_table tr').length;
      $("#work_select_employee").append(" <tr> <td >"+ trlength+"</td> <td>" + obj.emp_id + "</td> <td>" + obj.emp_name + "</td> </tr> ");

    
   
     });
     $('#selected_user_count_txt').text(trlength)
    
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
   function get_employee()
   {
    
   $.ajax({
     url: "php/get_employee.php",
     type: "get", //send it through get method
    
     success: function (response) {
   
   
   if (response.trim() != "error") {
   
     var obj = JSON.parse(response);
   
   
   
     obj.forEach(function (obj) {
     
       
       $("#sel_usr_in").append(" <option value='" + obj.emp_id + "'>" + obj.emp_name + "</option>");
   
   
   
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
  
  function get_work_type()
  {
$.ajax({
 url: "php/get_work_type.php",
 type: "get", //send it through get method
 data: {
 
  

},
 success: function (response) {


if (response.trim() != "error") {
 var obj = JSON.parse(response);



 obj.forEach(function (obj) {
     
   
    $("#work_type_list").append(" <option value='" + obj.work_type_id + "'>" + obj.work_type_name + "</option>");

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