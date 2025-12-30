  // Import the functions you need from the SDKs you need
 
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
  import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
 
  import { getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword  } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js'
 
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
var latti = urlParams.get('latti');
var longi = urlParams.get('longi');
var pipeline_work ="";
var pwork_create = "";
var form_name = ""
var selected_work_id="";
var selected_cus_id="";
var selected_work_date="";
var selected_work_type="";
var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ;  

var work_id =0
var company_photo_addr = ""
var vc_photo_addr = ""
var roof_photo_addr = ""
var ge_photo_addr = ""
var hs_photo_addr = ""
var site_photo_addr = ""
var ep_photo_addr = ""
var sts_upload_link = "";
$(document).ready(function(){
  $('#call_new_work_btn').hide();
  check_login();
  get_employee()
  $("#no_work_show").hide();
  $("#report_btn").hide();
  

  $("#work_table").dblclick(function(){
   
    
     get_work_info($(this).find("p").attr("id", "work_table_work_id").html())
  });

  $('#cus_info_call_btn').click(function () {

  if( $('#cus_info_phone_txt').text() !="") 
    {
      window.open('tel:'+  $('#cus_info_phone_txt').text());
    }
    
  });

  $('#status_in').on('change', function() {
 

    if(  $("#status_in :selected").val() ==  "reschdule")   {
      $("#work_date1").show()
    }
    else{
      $("#work_date1").hide()
    }
    get_pipelinework();
  });


  

  $('#view_history_btn').click(function () {
   
    if(selected_work_id>0)
    {
      get_history_sql(selected_work_id);
      $('#history_model').modal('show'); 
    }
    else{
      salert("Select Work","Kindly choose work","warning")
    }


  });

  $('#view_customer_btn').click(function () {
   
    if(selected_work_id>0)
    {
      get_cus_info_sql(selected_work_id);
      $('#cus_info_model').modal('show'); 
    }
    else{
      salert("Select Work","Kindly choose work","warning")
    }


  });

  $('#accept_work_radio').click(function () {
    if ($(this).is(':checked')) {
      $('#work_accept_date1').hide();
      $('#worka_remark_text').hide();
    }

});


$('#assign_status_in').on('change', function() {
 

  if(  $("#assign_status_in :selected").val() ==  "reschdule")   {
    $("#work_accept_date1").show()
    $('#worka_remark_text1').show();
  }
  else{
    $("#work_accept_date1").hide()
    $('#worka_remark_text1').hide();
  }
});


$('#rescdule_assign_radio').click(function () {
  if ($(this).is(':checked')) {
    $('#work_accept_date1').show();
  }
});



$('#finish_work_radio').click(function () {
  if ($(this).is(':checked')) {
    $('#work_date1').hide();
  }
});

$('#rescdule_work_radio').click(function () {
if ($(this).is(':checked')) {
  $('#work_date1').show();
}
});



$('#work_table1').on('click', 'tbody tr td', function(event) {
 
  $('#work_table1').find('.text-bg-primary').removeClass('text-bg-primary')

 //console.log( $(this).hasClass("text-bg-primary"))

 $(this).toggleClass('text-bg-primary');
//($('#work_table1').find('.text-bg-primary'))
// $('.text-bg-primary').removeClass('text-bg-primary')
  
   
   selected_work_id = $(this).find('#work_table_work_id').html();
   selected_cus_id =  $(this).find('#work_table_cus_id').html();
   selected_work_date = $(this).find('#work_table_work_date').html();
   selected_work_type = $(this).find('#work_table_work_type').html();

// if(selected_work_type == "service" || selected_work_type == "restamping")
// {
//   $("#report_btn").show();
// }
// else{
//   $("#report_btn").hide();
// }

   console.log(selected_work_type);
   get_work_type(selected_work_type);
});


$('#work_assign_submit_btn').click(function () {
  if(selected_work_id =="")
{
salert("select Work","Kindly select work","warning")
}
else{
  $('#work_assign_submit_btn').prop('disabled', true);
  update_assign_work_sql();
}

});


$('#work_submit_btn').click(function () {

 
if(selected_work_id =="")
{
salert("select Work","Kindly select work","warning")
}
else{
  $('#work_submit_btn').prop('disabled', true);
  if($("#status_in").val() == 0)
  {
    salert("Choose Status" , "Kindly choose Status","warning" )
  }
  else if ($("#status_in").val() == "reschdule")
  {
    if(  $("#work_date").val() =="")
    {
salert("Choose Date","Kindly Enter Date","warning")
    }
    else{
      update_work_sql();
    }
    
  }
  else{
    update_work_sql();
  }
}
 
  });


  $('#call_sv_report').click(function () {
   
    if(selected_work_id =="")
    {
    salert("select Work","Kindly select work","warning")
    }
    else{
      $('#sv_modal').modal('show');

    }
    
    });

    
    $('#create_sv_btn').click(function () {
    
       
    
      update_site_visit();
       });

       $('#company_photo_preview').click(function () {
        $("#company_photo_up").trigger("click");
       });

       $('#vc_photo_preview').click(function () {
        $("#vc_photo_up").trigger("click");
       });


       $('#roof_photo_preview').click(function () {
        $("#roof_photo_up").trigger("click");
       });


       $('#ge_photo_preview').click(function () {
        $("#ge_photo_up").trigger("click");
       });


       $('#hs_photo_preview').click(function () {
        $("#hs_photo_up").trigger("click");
       });


       $('#site_photo_preview').click(function () {
        $("#site_photo_up").trigger("click");
       });


       $('#ep_photo_preview').click(function () {
        $("#ep_photo_up").trigger("click");
       });


    
      
$('#company_photo_up').on('change',function ()
{
var property =this.files[0];

  upload_sv(property,"company_photo","#company_photo_preview"); 
company_photo_addr = upload_sv(property,"company_photo","#company_photo_preview"); 

});

$('#vc_photo_up').on('change',function ()
{
var property =this.files[0];

  upload_sv(property,"Visiting Card","#vc_photo_preview"); 
vc_photo_addr = upload_sv(property,"Visiting Card","#vc_photo_preview"); 
});


$('#roof_photo_up').on('change',function ()
{
var property =this.files[0];

  upload_sv(property,"Roof","#roof_photo_preview"); 
roof_photo_addr = upload_sv(property,"Roof","#roof_photo_preview"); 
});


$('#ge_photo_up').on('change',function ()
{
var property =this.files[0];

  upload_sv(property,"Google_Earth","#ge_photo_preview"); 
ge_photo_addr = upload_sv(property,"Google_Earth","#ge_photo_preview"); 
});


$('#hs_photo_up').on('change',function ()
{
var property =this.files[0];

  upload_sv(property,"Hand_sketch","#hs_photo_preview"); 
hs_photo_addr =  upload_sv(property,"Hand_sketch","#hs_photo_preview"); 
});


$('#ep_photo_up').on('change',function ()
{
var property =this.files[0];

  upload_sv(property,"Evocation Point","#ep_photo_preview"); 
ep_photo_addr = upload_sv(property,"Evocation Point","#ep_photo_preview");
});

$('#site_photo_up').on('change',function ()
{
var property =this.files[0];

  upload_sv(property,"Site","#site_photo_preview"); 
site_photo_addr = upload_sv(property,"Site","#site_photo_preview");

});

$('#status_upload').on('click',function (e)
{
  if( $('#status_upload_name').val() =="")
  {
    salert(" Upload Name","Kindly enter upload name","warning")
  e.preventDefault()
  e.stopPropagation();
  }
});

$('#status_upload').on('change',function (e)
{
  console.log($('#status_upload_name').val())
  if( $('#status_upload_name').val() !="")
  {
   
    var filename= $(this).val();
    var property =this.files[0];

    var file_name = property.name;
    var file_extension = file_name.split('.').pop().toLowerCase();
{
        var form_data = new FormData();
        form_data.append("file",property);
        form_data.append("work_id",selected_work_id);
        form_data.append("file_name", $('#status_upload_name').val());
        $.ajax({
            url:'upload_status_attachment.php',
            method:'POST',
            data:form_data,
            contentType:false,
            cache:false,
            processData:false,
            beforeSend:function(){
            //  $('#msg').html('Loading......');
            console.log('Loading......');
            $('#work_submit_btn').prop("disabled",true)
            },
            success:function(data){
              $('#work_submit_btn').prop("disabled",false)
              console.log(data);
             // $('#msg').html(data);
             salert("Upload Result",data,"success")
            
sts_upload_link  = '<div><a href="attachment/work/'+selected_work_id + '/' +$('#status_upload_name').val() + "."+  file_extension +  '" class="link-primary"><i class="fa-solid fa-paperclip h6"></i></a></div>'
            }
          });
        
    }

         var filePath = filename.replace(/^.*\\/, "");
         
        console.log(filePath);
  }
else
{
salert(" Upload Name","Kindly enter upload name","warning")
}

});

$('#call_new_work_btn').click(function () {
   
  // $('#pwork_modal').modal('show'); 
  var lis_id =  create_listner()
  $('#work_section').hide()
  $('#task_iframe').attr('src','create_work.html?phone_id='+phone_id+'&pre_work_id='+ selected_work_id + "&work_type=" + $('#status_in :selected').text() + "&work_cus_id=" + selected_cus_id +"&listner_id=" + lis_id)
  $('#task_modal').modal('show'); 

  const interval = window.setInterval(function () {
    if(check_listner(lis_id) == "finish")
    {
      $('#task_modal').modal('hide'); 
      
      $('#call_new_work_btn').prop("disabled",true)
      $('#work_submit_btn').prop("disabled",false)
      $('#work_submit_btn').addClass('blink');
      clearInterval(interval);
    }

  }, 2000);
});


$('#report_btn').click(function () {
   console.log(form_name)
  // $('#pwork_modal').modal('show'); 
  var lis_id =  create_listner()
  
  $('#form_iframe').attr('src',  form_name+".html?phone_id="+phone_id+"&work_id="+ selected_work_id +  "&cus_id=" + selected_cus_id +"&listner_id=" + lis_id)
  $('#form_modal').modal('show'); 

  const interval = window.setInterval(function () {
    if(check_listner(lis_id) == "finish")
    {
      $('#form_modal').modal('hide'); 
      
     
      clearInterval(interval);
    }

  }, 2000);
});


$("#create_work_btn").click(function()
{
 var his_comment = "work created by " + current_user_name + " and assigned to " + $('#sel_usr_in :selected').text()
 create_work("pending",$('#sel_usr_in :selected').val(),his_comment,"yes","assign")
});

   });


   function get_work_info(work_info_id)
   {
 
  
 $.ajax({
  url: "php/get_work_info_full.php",
  type: "get", //send it through get method
  data: {
   
   work_id : work_info_id,
    
 },   
 
 beforeSend: function() {
 
 },
  success: function (response) {
   console.log(response);
    $('#report_info').show()
    $('#work_info_modal').modal('show');
   
 
 $("#work_info_table").empty()
 if (response.trim() != "error") {
    if (response.trim() != "0 result") {
  var obj = JSON.parse(response);
 
 
 var count =0 
  obj.forEach(function (obj) {
  
   count  = count + 1;
  
 
    $("#work_info_table").append(" <tr><td>"+ obj.emp_name + "</td><td>"+ obj.his + "</td>  <td>" +obj.ct+ "</td></tr>")
 
 
  });
 
 
 }
 else{
    $("#work_info_table").append(" <tr><td colspan='6' scope='col' class='text-bg-danger h6'>Sorry no data!</td></tr>")
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

   function create_work(work_assign_status_p,emp_id_p,his_comment_p,reload_p,his_status)
   {  
 
 
 $.ajax({
  url: "php/insert_work.php",
  type: "get", //send it through get method
  data: {
    emp_id : emp_id_p,
    work_date  :get_millis($("#pwork_date").val()),
    cus_id  : selected_cus_id,
    work_created_by  : current_user_id,
    work_assign_status  : work_assign_status_p,
    work_type  : pipeline_work,
    work_status  :his_status,
    work_description  :  $("#work_textbox").val(),
    work_location  : $("#work_location_textbox").val(),
    work_attachment  : "",
    work_com_status  : "incomplete",
    last_att : get_cur_millis(),
    his_comment :his_comment_p,
    his_status : his_status,
    his_emp_id : current_user_id,
    current_work_id : selected_work_id
 
 },
  success: function (response) {
   console.log(response)
 
   pwork_create = "ok"
   $('#pwork_modal').modal('hide'); 
   if(work_assign_status_p == "pending")
   {
    if(reload_p =="yes")
    {
      get_android_id_by_userid(emp_id_p,"yes")
    }
    else
    {
      get_android_id_by_userid(emp_id_p,"no")
    }
  
   }
   else{
    if(reload_p =="yes")
    {
    pwork_create = "ok"
      
     salert("success","work successfully created","success");
     //window.location.reload();
    }
   }
 
 
 
 
    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
 });
 
   }


   function get_android_id_by_userid(userid,reload)
   {
     $.ajax({
       url: "php/get_android_id.php",
       async : false,
       type: "get", //send it through get method
       data: {
         emp_id:userid,
            },
       success: function (response) {
      
      console.log(response)
      if (response.trim() != "error") {
       var obj = JSON.parse(response);
      
       var selected_android_id =""
      
       obj.forEach(function (obj) {
       selected_android_id =   obj.emp_phone_id;
                });
      
       const db = getDatabase();
    set(ref(db, 'notify/' + selected_android_id), {
 notification: "Work assigned" ,
 tme : get_cur_millis()
        }).then(() => {
      // Data saved successfully!
      if(reload =="yes")
    {
     salert("success","work successfully created","success");
  
    // window.location.reload();
    }
    }).catch((error) => {
      // The write failed...
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
 

   function get_pipelinework()
   {
    
   
   $.ajax({
     url: "php/get_pipeline_work.php",
     type: "get", //send it through get method
     data: {
      work_status : $('#status_in :selected').text()
     },
     success: function (response) {
   
   console.log(response)
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   
   
   
     obj.forEach(function (obj) {


pipeline_work = obj.pipeline_work
     
   if(pipeline_work == "")
   {
    $('#call_new_work_btn').hide();
    $('#work_submit_btn').prop("disabled",false)
   }
   else
   {
    $('#call_new_work_btn').show();
    $('#work_submit_btn').prop("disabled",true)
   }
   
   
     });
   
    
   }
   else{
    pipeline_work = ""
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
   function update_site_visit()
   {
    $.ajax({
      url: "php/insert_sv.php",
      type: "get", //send it through get method
      data: {
       industry_type : $("#industry_type_txt").val(),
       eb_no : $("#eb_no_txt").val(),
       eb_reg_no: $("#eb_reg_no_txt").val(),
       eb_amount: $("#eb_amount_txt").val(),
       eb_tariff : $("#eb_tariff_txt").val(),
       eb_san_load : $("#eb_san_load_txt").val(),
       eb_tri_load: $("#eb_tri_load_txt").val(),
       type_ins : $("#type_ins_txt").val(),
       p2p_dis : $("#p2p_dis_txt").val(),
       total_mea : $("#total_mea_txt").val(),
       shift : $("#shift_txt").val(),
       fund : $("#fund_txt").val(),
       company_photo :company_photo_addr,
       vc_photo : vc_photo_addr,
       roof_photo :roof_photo_addr,
       ge_photo :ge_photo_addr,
       hs_photo : hs_photo_addr,
       site_photo : site_photo_addr,
       ep_photo : ep_photo_addr,
       cus_rating : $("#cus_rating_txt").val(),
       remark : $("#remark_txt").val(),
       work_id : selected_work_id,
       latti : latti,
       longi : longi,
       cur_time : get_cur_millis()
 
    
    },
      success: function (response) {
 
    
       location.reload();
    
    
        
      },
      error: function (xhr) {
          //Do Something to handle error
      }
    });
 
   }
 
   function upload_sv(property,fname,preview)
  {
    {
      var file_name = property.name;
      var file_extension = file_name.split('.').pop().toLowerCase();


      var form_data = new FormData();
      form_data.append("file",property);
      form_data.append("work_id",selected_work_id);
      form_data.append("file_name",fname + "." + file_extension);
  
  
      $.ajax({
          url:'upload_site_visit.php',
          method:'POST',
          data: form_data,
         
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
           $(preview).attr("src", "attachment/work/site_visit/"+ selected_work_id + "/" + fname + "." + file_extension);
           
          }
          
        });
      
  }
  return "attachment/work/site_visit/"+ selected_work_id + "/" + fname + "." + file_extension
  }

   function get_work_type(work_name)
   {
   
   $.ajax({
     url: "php/get_work_type_ac.php",
     type: "get", //send it through get method
     data: {
       work_type_name: work_name,
       
      
   },
     success: function (response) {
   

$("#status_in").empty();
   if (response.trim() != "error") {
     
     if(response.trim() !="0 result")
     {
       var obj = JSON.parse(response);
       $("#status_in").append( "<option value ='0' selected>Status...</option>")
       
      
       obj.forEach(function (obj) {
        console.log(obj.form )
      //  show form when form in work_type table
      if(obj.form != "")
      {
        $("#report_btn").show();
        form_name = obj.form;
      }
      else
      $("#report_btn").hide();

   
        $("#status_in").append(" <option value='"+ obj.status_type + "'>"+ obj.work_status +"</option>")
        
       });
   
       
     }
     else{
    
       $("#site_work_table").append("<tr> <td colspan='3'>No Work  </td> </tr>");
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
  
   function get_cus_info_sql(cus_id)
   {
     
   $.ajax({
     url: "php/get_cus_info.php",
     type: "get", //send it through get method
     data: {
      work_id: cus_id,
      
   },
     success: function (response) {
   console.log(response)
   
   if (response.trim() != "error") {
     var obj = JSON.parse(response);
   
   
     obj.forEach(function (obj) {
      
    
     $('#cus_info_name_txt').text(obj.cus_name) 
     $('#cus_info_phone_txt').text(obj.cus_phone) 
     $('#cus_info_addr_txt').text(obj.cus_address) 
     var map_lcation = "https://www.google.com/maps/"
if(obj.cus_location != "")
{

  if(obj.cus_location.search("https") != -1)
  {
    map_lcation = obj.cus_location
  }

}


  
     $("#cus_info_map").prop("href", map_lcation)
   
   
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



   function get_history_sql(cus_id)
   {
     
   $.ajax({
     url: "php/get_history.php",
     type: "get", //send it through get method
     data: {
       cus_id_p: cus_id,
      
   },
     success: function (response) {
   console.log(response)
   
   if (response.trim() != "error") {
     var obj = JSON.parse(response);
   
     var count = 0;
     $("#thist").empty();
     obj.forEach(function (obj) {
       count = count+1;
   
   
    
       $("#thist").append("  <tr><td > " + count + " </td><td class='text-wrap' >" + millis_to_date(parseFloat(obj.his_date)) + "</td><td >" + obj.comments + "</td></tr>")
   
   
   
   
   
   
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
     
      get_assign_work_sql(current_user_id);
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
  

   


   

 

   function get_assign_work_sql(cus_id)
{

$.ajax({
  url: "php/get_assign_work.php",
  type: "get", //send it through get method
  data: {
    emp_id: cus_id,
   
},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {



  if((response.trim() != "0 result"))
  {

    $("#work_show").show();
    $("#no_work_show").hide();


    $("#work_assign_control").show();
    $("#work_control").hide();
    var obj = JSON.parse(response);

    var count = 0;
  
    obj.forEach(function (obj) {
      count = count+1;
      var date_color = ""
      var date_icon = ""
     
  
      {
       
          if(parseFloat(obj.work_date) < parseFloat(get_cur_millis())){
              date_color = "text-danger";
              date_icon = "fa-calendar-xmark";
                  }
        
            else{
                    date_color = "text-success";
                    date_icon = "fa fa-clock-o";
                  }
      }
      
      
      var attach = "";

      if(parseInt(obj.attach) > 0)
      {
      attach = "<div><a href='attachment.html?work_id= " + obj.work_id + "' class='link-primary'><i class='fa-solid fa-paperclip h6'></i></a></div>"
      }
  
  $("#work_table").append(" <tr> <td> <div class='visually-hidden'><p id='work_table_work_id'>"+obj.work_id + "</p></div>  <div class='visually-hidden'><h6 id='work_table_work_date'>"+obj.work_date + "</h6></div> <div class='d-flex justify-content-between mb-2'> <div><p id='work_table_work_type'>"+obj.work_type + "</p> </div><div><p class='small m-0 p-0'>" + millis_to_date(parseFloat(obj.work_date)) + "</p></div> </div><p class='small text-start'>" + obj.work_description + "</p><div class='d-flex justify-content-between'> <div><h6 class='m-0 p-0 " + date_color + "'><i class='fa-solid " + date_icon + "'></i></h6> </div>"+attach+"<div><p class=' small m-0 p-0'>" + obj.emp_name + "</p></div> </div> </td> </tr> <div>");
  
      
    });
  
    $("#total_works").text(count)

    $("#work_type_text").text("Assigned Works")
 
  }

  else{
get_work_sql(cus_id);
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



function get_work_sql(cus_id)
{


  $("#work_assign_control").hide();
    $("#work_control").show();


$.ajax({
  url: "php/get_work.php",
  type: "get", //send it through get method
  data: {
    emp_id: cus_id,
   today_end : get_today_end_millis()
},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {



  if((response.trim() != "0 result"))
  {

    $("#work_show").show();
  $("#no_work_show").hide();
  
    var obj = JSON.parse(response);

    var count = 0;
  
    obj.forEach(function (obj) {
      count = count+1;
      var date_color = ""
      var date_icon = ""
     
  
      {
       
          if(parseFloat(obj.work_date) < parseFloat(get_cur_millis())){
              date_color = "text-danger";
              date_icon = "fa-calendar-xmark";
                  }
        
            else{
                    date_color = "text-success";
                    date_icon = "fa fa-clock-o";
                  }
      }
      
 
  
      var attach = "";

      if(parseInt(obj.attach) > 0)
      {
      attach = "<div><a href='attachment.html?work_id= " + obj.work_id + "' class='link-primary'><i class='fa-solid fa-paperclip h6'></i></a></div>"
      }
  
  $("#work_table").append(" <tr> <td> <div class='visually-hidden'><p id='work_table_work_id'>"+obj.work_id + "</p><p id='work_table_cus_id'>"+obj.cus_id + "</p></div><div class='visually-hidden'><p id='work_table_work_date'>"+obj.work_date + "</p></div> <div class='d-flex justify-content-between mb-2'> <div><h6 id= 'work_table_work_type' class='small m-0 p-0'>" +obj.work_type + "</h6> </div><div><p class='small m-0 p-0'>" + millis_to_date(parseFloat(obj.work_date)) + "</p></div> </div><p class='small text-start'>" + obj.work_description + "</p><div class='d-flex justify-content-between'> <div><h6 class='m-0 p-0 " + date_color + "'><i class='fa-solid " + date_icon + "'></i></h6> </div>"+attach + " </div> </td> </tr>");
  
      
    });
  
    $("#total_works").text(count)

    $("#work_type_text").text("Works")
 
  }

  else{
    $("#work_show").hide();
    $("#no_work_show").show();
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




   function update_assign_work_sql()
   {

    const db = getDatabase();
    set(ref(db, 'notify/' + phone_id), {
    });


    var work_date = ""
    var status = ""
    var work_com_status = ""
    var his_status="accepted"
    var work_assign_status="accept"
 



if ($("#assign_status_in").val() == "accept")
{
  work_date = selected_work_date
  status= " work accepted by " + current_user_name +  " on " + get_today_date();
  work_com_status = "incomplete"
 

}
else if ($("#assign_status_in").val() == "reschdule")

{
  work_date = get_millis($("#work_accept_date").val())
  status= " work accepted and reschduled to " + $("#work_accept_date").val() + "for " +$('#worka_remark_text').val() + "by " + current_user_name +  " on " + get_today_date();
  work_com_status = "incomplete"
}

    $.ajax({
      url: "php/update_work.php",
      type: "get", //send it through get method
      data: {
      work_id_p : selected_work_id,
      last_att_p: get_cur_millis(),
      work_date_p : work_date,
      work_com_status : work_com_status,
      work_assign_status : work_assign_status,
         his_status :his_status,
       his_comment : status ,
       his_emp_id : current_user_id
    
    },
      success: function (response) {
 
    
    location.reload();
   // console.log(response)
    
        
      },
      error: function (xhr) {
          //Do Something to handle error
      }
    });

   }


   

   function update_work_sql()
   {

    
    var work_date = ""
    var status = ""
    var work_com_status = ""
    var his_status=""
    var work_assign_status="accept"
 
    if ($("#status_in").val() == "finish")
{
  work_date = selected_work_date
  status= " work finished by " + current_user_name +  " on " + get_today_date() + " Remark as " + $('#work_remark_text').val();
  work_com_status = "complete"
  his_status = $("#status_in :selected").text();

}
else if ($("#status_in").val() == "reschdule")

{
work_date = get_millis($("#work_date").val())
status= " work reschduled to " + $("#work_date").val() + " for " +$('#work_remark_text').val() + " by " + current_user_name +  " on " + get_today_date();
work_com_status = "incomplete"
his_status = $("#status_in :selected").text();
}




    $.ajax({
      url: "php/update_work.php",
      type: "get", //send it through get method
      data: {
      work_id_p : selected_work_id,
      last_att_p: get_cur_millis(),
      work_date_p : work_date,
      work_com_status : work_com_status,
      work_assign_status : work_assign_status,
  
       his_status :his_status,
       his_comment : status + sts_upload_link,
       his_emp_id : current_user_id
    
    },
      success: function (response) {
 
    //console.log(response)
    location.reload();
    
    
        
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
  
    var today = year + "-" + month + "-" + day +"T"+ hour + ":"+ mins; 
    console.log(mins);

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
        onClose: reload_here        // Removed () from here
   }).then(function () {

    });
}


function reload_here(){
location.reload();
}
function millis_to_date( millis)
{
  var d = new Date(millis); // Parameter should be long value

  
return d.toLocaleString('en-GB');

}

function create_listner()
{
  var res = ""
  $.ajax({
    url: "php/insert_listner.php",
    type: "get", //send it through get method
    async : false,
    data: {
     
  
  },
    success: function (response) {

 

  res =  response
  
      
    },
    error: function (xhr) {
        //Do Something to handle error
    }
  });

  return res

}


function check_listner(listner_id)
  {
  var res = ""
      $.ajax({
        url: "php/check_listner.php",
        type: "get", //send it through get method
        async : false,
        data: {
         
         listner_id: listner_id
       },
        success: function (response) {
       console.log(response)
       
       if (response.trim() != "error") {
         if (response.trim() != "0 result") {
        var obj = JSON.parse(response);
       
       
      
        obj.forEach(function (obj) {
       
        res = obj.status
       
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
   
return res

  }