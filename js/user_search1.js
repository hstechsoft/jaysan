  // Import the functions you need from the SDKs you need
 
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
  import { getDatabase, ref, set ,onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
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
  var cus_id_g="";
var pwork_create = "";


  var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var cus_id = urlParams.get('cus_id');


var pipeline_work ="";
var sts_upload_link = "";
var work_id = '0'
var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ;  
var current_android_id ="";
var selected_android_id ="";

var company_photo_addr = ""
var vc_photo_addr = ""
var roof_photo_addr = ""
var ge_photo_addr = ""
var hs_photo_addr = ""
var site_photo_addr = ""
var ep_photo_addr = ""
var selected_work_id = "0"

$(document).ready(function(){

  check_login();
  get_employee();
  get_today_call_sql();
  get_android_id();

  $('#call_new_work_btn').hide();
 

  $("#work_table").hide();
  $("#lead_table_body").hide();
    $("#work_schdule_table").hide();
    $("#work_schdule_table_all").hide();
   $("#unamed").text(localStorage.getItem("ls_uname"))
  // $("#tlead_att_on").text(localStorage.getItem("ls_uname"))
  
  //$("#sdate_in").attr("value", get_today_date());

 

$('#work_table1').on('click', 'tbody tr td', function(event) {
  //$('#work_table1').find('.text-bg-primary').removeClass('text-bg-primary')

 $('.text-bg-primary').removeClass('text-bg-primary')
   $(this).toggleClass('text-bg-primary');
   selected_work_id = $(this).find('#work_table_work_id').html()
   get_work_type($(this).find('#work_table_work_type').html());
get_history_sql( $(this).find('#work_table_work_id').html());
$("#work_schdule_table").slideUp();
$("#work_schdule_table_all").slideUp();
$("#history_table").slideDown();

  });

  



// $('.de1').on('click', function() {
//   var $this = $(this);
  

//    //$('.active').removeClass('active');
//   $this.toggleClass('active')

//   console.log($this.attr('id'));  // Will log Paris | France | etc...
//   $("#work_schdule_table").slideUp();
//   $("#history_table").slideDown();

 
// });

$("#lead_header").on("click", function()
{
  $("#lead_table_body").toggle();

});

$("#work_table_header").on("click", function()
{
  $("#work_table").toggle();
  $("#work_schdule_table").slideUp();
  $("#work_schdule_table_all").slideUp();
  $("#history_table").slideDown();
  $("#lead_table_body").hide();
});

$("#web_call_btn").on("click", function()
{
  

  const db = getDatabase();
  set(ref(db, 'web_call/' + current_android_id), {
    
    phone_no:  $("#cus_phone").text(),
    action : "call"
  
  });
  
  
});

$('#status_in').on('change', function() {
 

  if(  $("#status_in :selected").val() ==  "reschdule")   {
    $("#sdate_in_full").show()
  }
  else{
    $("#sdate_in_full").hide()
  }

  get_pipelinework();
});

   $("#call_btn").click(function(){
    if(selected_work_id =="0")
    {
        salert("Select  work" , "Kindly Select work","warning" )
      return
    }
    console.log(pipeline_work + " - " + pwork_create)
    if(pipeline_work != "" && pwork_create =="")
    {
      salert("Create work" , "Kindly create work","warning" )
      return
    }
    if($("#status_in").val() == 0)
    {
      salert("Choose Status" , "Kindly choose Status","warning" )
    }
    else if ($("#status_in").val() == "reschdule")
    {
      if(  $("#sdate_in").val() =="")
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
    
        
       }); 



     

      $('#call_sv_report').click(function () {
       
          // $('#sv_modal').modal('show'); 
          
          if(selected_work_id =="0")
   {
    salert("Work","Kindly choose work","warning")
   }
       else

       {
        window.open( "site_visit_report.html?work_id=" + selected_work_id, '_blank');
        
       }
          });


          $('#create_sv_btn').click(function () {
       
           update_site_visit();
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
          form_data.append("work_id",work_id);
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
              },
              success:function(data){
                console.log(data);
               // $('#msg').html(data);
               salert("Upload Result",data,"success")
              
sts_upload_link  = '<div><a href="attachment/work/'+work_id + '/' +$('#status_upload_name').val() + "."+  file_extension +  '" class="link-primary"><i class="fa-solid fa-paperclip h6"></i></a></div>'
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
   
      $('#pwork_modal').modal('show'); 
    
  });

  $("#create_work_btn").click(function()
   {
    var his_comment = "work created by " + current_user_name + " and assigned to " + $('#sel_usr_in :selected').text()
    create_work("pending",$('#sel_usr_in :selected').val(),his_comment,"yes","assign")
   });


   
   $('#cus_update_btn').click(function () {
   
    $("#new_cus_text").val($("#cus_name").text());
    $("#new_cus_phone_text").val($("#cus_phone").text());
    $("#new_cus_addr_text").val($("#cus_address").text());
    $("#new_cus_seg_text").val($("#tsegment").text());
    console.log($("#new_cus_phone_text").text())
 
       $('#cus_info_model').modal('show'); 
        
   });

   $('#cus_submit_btn').click(function () {
    update_cus_sql();
           });
    

           $("#call_wat_btn").click(function(){
            
            var wphone = $("#cus_phone").text().substr($("#cus_phone").text().length - 10)
       
        
            {
              window.open('https://api.whatsapp.com/send?phone=91' + parseFloat(wphone), '_blank');
            }
           
                // 
                    });
  });


  function update_cus_sql()
   {
     $.ajax({
       url: "php/update_customer.php",
       type: "get", //send it through get method
       data: {
        cus_name: $("#new_cus_text").val(),
        cus_phone: $("#new_cus_phone_text").val(),
        cus_address: $("#new_cus_addr_text").val(),
        cus_segment: $("#new_cus_seg_text").val(),
        cus_location: $("#new_cus_location_text").val(),
        cus_id:  cus_id_g
        
      
      },
       success: function (response) {
      
    
      if (response.trim() != "error") {
   
      
          
   location.reload();
      
       
    
       
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


  function create_work(work_assign_status_p,emp_id_p,his_comment_p,reload_p,his_status)
  {  


$.ajax({
 url: "php/insert_work.php",
 type: "get", //send it through get method
 data: {
   emp_id : emp_id_p,
   work_date  :get_millis($("#pwork_date").val()),
   cus_id  : cus_id_g,
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
   his_emp_id : current_user_id

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
      work_id : work_id

   
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
      form_data.append("work_id",work_id);
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
           $(preview).attr("src", "attachment/work/site_visit/"+ work_id + "/" + fname + "." + file_extension);
         
          }
          
        });
      
  }
  return "attachment/work/site_visit/"+ work_id + "/" + fname + "." + file_extension
  }
   function check_incoming_call(android_id)
   {
    
    const db = getDatabase();
  
   
const starCountRef = ref(db, 'phone_state/'+ android_id);

onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();
 
var phone = data.phone_no.substr(data.phone_no.length - 10); // => "Tabs1"
if(data.phone_status=="ring")
{
  salert(data.phone_status,"call from - "+data.phone_no,"warning");
  var url = "user_call_incoming.html?phone_no=" + phone;
 window.open(url, '_blank');
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
   }
   else
   {
    $('#call_new_work_btn').show();
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

   

   
  
   function get_android_id()
   {
     $.ajax({
       url: "php/get_android_id.php",
       type: "get", //send it through get method
       data: {
         emp_id:current_user_id,
        
      
      },
       success: function (response) {
      
      
      if (response.trim() != "error") {
       var obj = JSON.parse(response);
      
      
      
       obj.forEach(function (obj) {
         current_android_id = obj.emp_phone_id;
         
       });
      
       check_incoming_call(current_android_id);

      
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
  

   function get_today_call_sql()
   {



$.ajax({
  url: "php/get_today_call_user.php",
  type: "get", //send it through get method
  data: {
    cus_id : cus_id

},
  success: function (response) {


if (response.trim() != "error") {

console.log(response)
  if (response.trim() != "0 results")
  {

    $("#work_show").show();
    $("#no_work_show").hide();
  var obj = JSON.parse(response);

 

  obj.forEach(function (obj) {
      console.log(obj);
      $("#cus_name").text(obj.cus_name);
    
  
      $("#cus_phone").text(obj.cus_phone);

     
      
      $("#tstatus").text(obj.work_status);


      $("#cus_address").text(obj.cus_address);
      $("#tsegment").text(obj.cus_segment);
      $("#cus_location").text(obj.cus_location);

      $("#cus_email").text(obj.cus_email);
      $("#cus_lead_source").text(obj.cus_lead_source);
      $("#cus_type").text(obj.cus_type);
      $("#cus_need").text(obj.cus_need);
      $("#tlead_att_on").text(obj.cus_lead_on);
      $("#tlead_source").text(obj.cus_lead_source);
      $("#tlead_att_by").text(obj.cus_lead_by);
    
work_id = obj.work_id;
      

      get_history_sql(obj.work_id)
      get_work_sql(obj.cus_id)
     
      cus_id_g = obj.cus_id;

    
  });
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

   function get_work_type(work_name)
   {
   
   $.ajax({
     url: "php/get_work_type_ac.php",
     type: "get", //send it through get method
     data: {
       work_type_name: work_name,
       
      
   },
     success: function (response) {
   
console.log(response)
   
   if (response.trim() != "error") {
     
     if(response.trim() !="0 result")
     {
        $("#status_in").empty();
       var obj = JSON.parse(response);
       $("#status_in").append( "<option value ='0' selected>Status...</option>")
      
      
       obj.forEach(function (obj) {
       
   
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

   
   

 
   function get_work_sql(cus_id)
{



$.ajax({
  url: "php/get_work_mcall.php",
  type: "get", //send it through get method
  data: {
    cus_id: cus_id,
   
},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {
  var obj = JSON.parse(response);

  var count = 0;

  obj.forEach(function (obj) {
      count = count+1;
      var date_color = ""
      var date_icon = ""
     
  if(obj.work_com_status =="complete")
  {
    
    date_color = "text-success";
    date_icon = "fa-clipboard-check";
  }
     else {
       
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



$("#work_table").append(" <tr> <td> <div class='visually-hidden'><p id='work_table_work_id'>"+obj.work_id + "</p> <p id='work_table_work_type'>"+obj.work_type + "</p></div><div class='visually-hidden'><p id='work_table_work_date'>"+obj.work_date + "</p></div> <div class='d-flex justify-content-between mb-2'> <div><h6 class='small m-0 p-0'>" +obj.work_type + "</h6> </div><div><p class='small m-0 p-0'>" + millis_to_date(parseFloat(obj.work_date)) + "</p></div> </div><p class='small text-start'>" + obj.work_description + "</p><div class='d-flex justify-content-between'> <div><h6 class='m-0 p-0 " + date_color + "'><i class='fa-solid " + date_icon + "'></i></h6> </div>" + attach +  "<div><p class='p-0 m-0 text-success'>" + obj.work_status + "</p></div><div><p class=' small m-0 p-0'>" + obj.emp_name + "</p></div> </div> </td> </tr>");
    
 
   // $("#work_table").append(" <button value='"+ work_edit + "' id='" + obj.work_id + "' class=' de1'> <div class='d-flex justify-content-between'> <div> <h6 class='text-primary' id='work_type_txt'>" +obj.work_type + "</h6> </div> <div> <p class='fw-bold' id='work_date_txt'>" + millis_to_date(parseFloat(obj.work_date)) + "</p> </div> </div> <p class='small' id='work_des_txt'>" + obj.work_description + "</p> <div class='d-flex justify-content-between'> <div> <h6 class='text-danger' id='work_exp_txt'>" + "Expired" + "</h6> </div> <div> <p class='fw-bold' id='work_by_txt'>" + "Harishkumar" + "</p> </div> </div> </button>")






  });

  $("#total_works").text(count)
 
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


 
    $("#thist").append("  <tr><td > " + count + " </td><td class='text-nowrap' >" + millis_to_date(parseFloat(obj.his_date)) + "</td><td >" + obj.comments + "</td></tr>")






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




   function update_work_sql()
   {

    var work_date = ""
    var status = ""
    var work_com_status = ""
   


    if($("#status_in").val() == "reschdule")   {

       status =  $("#status_in :selected").text()  + " - "+ $("#remarks_in").val() + " so work is reschudled  to " + millis_to_date(get_millis($("#sdate_in").val())) + " by " + current_user_name +  " on " + get_today_date();
     work_date =  get_millis($("#sdate_in").val());
     work_com_status = "incomplete"
    }
    else
    {
      status=  $("#status_in :selected").text() + " - "+ $("#remarks_in").val()  + " so work Finished by " + current_user_name +  " on " + get_today_date();
      work_date = get_cur_millis();
      work_com_status = "complete"
    }
  

    $.ajax({
      url: "php/update_work_mcall.php",
      type: "get", //send it through get method
      data: {
      work_id_p : selected_work_id,
      his_date_p : get_millis($("#sdate_in").val()),
      last_att_p: get_cur_millis(),
      remark_p: status +   sts_upload_link,
      work_date_p : work_date,
      work_com_status : work_com_status,
       cus_id: cus_id_g,
       his_comment : "work assigned by - " + current_user_name,
       his_status : $("#status_in :selected").text(),
       his_emp_id : current_user_id
    
    },
      success: function (response) {
 
   // console.log(response)
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