  // Import the functions you need from the SDKs you need
 
 
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var latti = urlParams.get('latti');
var longi = urlParams.get('longi');

var work_id = urlParams.get('work_id');
var listner_id = urlParams.get('listner_id');


var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ;  


var company_photo_addr = ""
var vc_photo_addr = ""
var roof_photo_addr = ""
var ge_photo_addr = ""
var hs_photo_addr = ""
var site_photo_addr = ""
var ep_photo_addr = ""
var sts_upload_link = "";
$(document).ready(function(){
 
  check_login();
  
 
  $("#vc_photo_bar1").hide()
  $("#company_photo_bar1").hide()
  $("#roof_photo_bar1").hide()
  $("#ge_photo_bar1").hide()
  $("#hs_photo_bar1").hide()
  $("#ep_photo_bar1").hide()
  $("#site_photo_bar1").hide()












  
    
    $('#create_sv_btn').click(function () {
    
       
        $("#create_sv_btn").prop("disabled", true);
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

  //upload_sv(property,"company_photo","#company_photo_preview"); 
 upload_sv(property,"company_photo","#company_photo_preview","#company_photo_bar"); 

});

$('#vc_photo_up').on('change',function ()
{
var property =this.files[0];

  //upload_sv(property,"Visiting Card","#vc_photo_preview"); 
 upload_sv(property,"Visiting Card","#vc_photo_preview","#vc_photo_bar"); 
});


$('#roof_photo_up').on('change',function ()
{
var property =this.files[0];

 // upload_sv(property,"Roof","#roof_photo_preview"); 
 upload_sv(property,"Roof","#roof_photo_preview","#roof_photo_bar"); 
});


$('#ge_photo_up').on('change',function ()
{
var property =this.files[0];

  //upload_sv(property,"Google_Earth","#ge_photo_preview"); 
 upload_sv(property,"Google_Earth","#ge_photo_preview","#ge_photo_bar"); 
});


$('#hs_photo_up').on('change',function ()
{
var property =this.files[0];

 // upload_sv(property,"Hand_sketch","#hs_photo_preview"); 
 upload_sv(property,"Hand_sketch","#hs_photo_preview","#hs_photo_bar"); 
});


$('#ep_photo_up').on('change',function ()
{
var property =this.files[0];

  //upload_sv(property,"Evocation Point","#ep_photo_preview"); 
upload_sv(property,"Evocation Point","#ep_photo_preview","#ep_photo_bar");
});

$('#site_photo_up').on('change',function ()
{
var property =this.files[0];

  //upload_sv(property,"Site","#site_photo_preview"); 
 upload_sv(property,"Site","#site_photo_preview","#site_photo_bar");

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

   });

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
       work_id : work_id,
       latti : latti,
       longi : longi,
       cur_time : get_cur_millis(),
       emp_id :current_user_id
 
    
    },
      success: function (response) {
        var lis_res = response.trim()
        if(listner_id != null)
        update_listner(listner_id,lis_res)
       location.reload();
    
    
        
      },
      error: function (xhr) {
          //Do Something to handle error
      }
    });
 
   }
 
  
   function upload_sv(property,fname,preview,prograss_bar)
  {
    var raddr = ""
    {
      $(prograss_bar + "1").show();
      
      $(preview).hide();
      var file_name = property.name;
      var file_extension = file_name.split('.').pop().toLowerCase();


      var form_data = new FormData();
      form_data.append("file",property);
      form_data.append("work_id",work_id);
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
          url:'upload_site_visit.php',
          method:'POST',
          data: form_data,
         
          contentType:false,
          cache:false,
          processData:false,
          beforeSend:function(){
          //  $('#msg').html('Loading......');
          console.log('Loading......');
          $("#create_sv_btn").prop("disabled", true);
          },
          success:function(data){
            console.log(data);

            $("#create_sv_btn").prop("disabled", false);
         raddr = data.trim();
        
         switch (fname) {
          case "company_photo":
            company_photo_addr = data.trim()
            break;
          case "Visiting Card":
            vc_photo_addr = data.trim()
            break;
          case "Roof":
            roof_photo_addr = data.trim()
            break;
           
            case "Google_Earth":
                ge_photo_addr = data.trim()
            break;
            
            case "Hand_sketch":
                hs_photo_addr = data.trim()
            break;
            
            case "Evocation Point":
                ep_photo_addr = data.trim()
            break; 

            case "Site":
                site_photo_addr = data.trim()
            break;     
         
        }

           // $('#msg').html(data);
           var tmpImg = new Image() ;
           tmpImg.src = $(preview).attr('src') ;
           $(preview).attr("src", raddr);
          
           tmpImg.onload = function() {
            // Run onload code.
            $(preview).show();
            $(prograss_bar + "1").hide();
        } ;
          }
          
        });
      
  }
 
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
      work_id_p : work_id,
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
      work_id_p : work_id,
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