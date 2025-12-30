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
  
var is_cur_work = "no"
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
var selected_pino_id =""
var selected_sqno =""


var company_photo_addr = ""
var vc_photo_addr = ""
var roof_photo_addr = ""
var ge_photo_addr = ""
var hs_photo_addr = ""
var site_photo_addr = ""
var ep_photo_addr = ""
var selected_work_id = "0"
var selected_invoice_type=""
$(document).ready(function(){
  window.setInterval(get_next_work_time, 5000);
  check_login();
  get_employee();
  get_service_request()
  get_delivery()
  get_extw_requset_cus()
  get_cus_pay_history()

  if(cus_id != null)
  {
    if(cus_id == "0")
    {
      $("#work_show").hide();
      $("#no_work_show").hide();
      $("#no_data_show").show();
      $("#create_cus_link").attr("href", "create_customer.html");
    }
    else
    {
      $("#work_show").show();
      $("#no_data_show").hide();
      get_cus_info_sql(cus_id)
      $("#web_call_form *").prop("disabled", true);
      $("#work_table").show();
    }
    $("#no_work_show").hide();
  }

  else
  {
    $("#work_show").show();
      $("#no_data_show").hide();
    get_today_call_sql();
    $("#work_table").hide();
  }
  
  get_android_id();

  $('#call_new_work_btn').hide();
 

  
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
   work_id = selected_work_id

   get_work_type($(this).find('#work_table_work_type').html()) ;
get_history_sql( $(this).find('#work_table_work_id').html());
get_cur_work_sql( $(this).find('#work_table_work_id').html());
$("#work_schdule_table").slideUp();
$("#work_schdule_table_all").slideUp();
$("#history_table").slideDown();


if($(this).find('#work_table_emp_name').html() != current_user_name)
$("#web_call_form *").prop("disabled", true);
else{
  $("#web_call_form *").prop("disabled", false);
}



  });

  



// $('.de1').on('click', function() {
//   var $this = $(this);
  

//    //$('.active').removeClass('active');
//   $this.toggleClass('active')

//   console.log($this.attr('id'));  // Will log Paris | France | etc...
//   $("#work_schdule_table").slideUp();
//   $("#history_table").slideDown();

 
// });

$("#cur_work_table").dblclick(function(){
  console.log($(this).find("p").attr("id", "work_table_work_id").html())
  
   get_work_info($(this).find("p").attr("id", "work_table_work_id").html())
});

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
              $("#call_btn").attr("disabled", true);
              },
              success:function(data){
                $("#call_btn").attr("disabled", false);
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
 
 

}
  
  });


  $('#call_new_work_btn').click(function () {
   
      //$('#pwork_modal').modal('show'); 
      
     var lis_id =  create_listner()
  if(phone_id != null)
  $('#task_iframe').attr('src','create_work.html?pre_work_id='+ work_id + "&work_type=" +pipeline_work + "&work_cus_id=" + cus_id_g +"&listner_id=" + lis_id + "&phone_id=" + phone_id)
  else
      $('#task_iframe').attr('src','create_work.html?pre_work_id='+ work_id + "&work_type=" +pipeline_work + "&work_cus_id=" + cus_id_g +"&listner_id=" + lis_id)
      $('#task_modal').modal('show'); 
    
      const interval = window.setInterval(function () {
        if(check_listner(lis_id) == "finish")
        {
          $('#task_modal').modal('hide'); 
          
          $('#call_new_work_btn').prop("disabled",true)
          $('#call_btn').prop("disabled",false)
          clearInterval(interval);
          $('#call_btn').addClass('blink');
        }

      }, 2000);

  });

  $("#create_work_btn").click(function()
   {
    var his_comment = "work created by " + current_user_name + " and assigned to " + $('#sel_usr_in :selected').text()
    create_work("pending",$('#sel_usr_in :selected').val(),his_comment,"yes","assign")
   });


   $("#quote_table").on("click","tr td button", function(event) {
    selected_pino_id =  $(this).val();
    
    selected_invoice_type = 'quotation'
  {
      {
        swal({
          title: "Are you sure - Delete? ",
          text: "You will not be recover this list again!",
          icon: "warning",
          buttons: [
            'No, cancel it!',
            'Yes, I am sure!'
          ],
          dangerMode: true,
        }).then(function(isConfirm) {
          if (isConfirm) {
            swal({
              title: 'Applied!',
              text: 'successfully Deleted!',
              icon: 'success'
            }).then(function() {
              
              delete_list(selected_pino_id,selected_invoice_type) // <--- submit form programmatically
              
             
            });
          } else {
            swal("Cancelled", "lead is safe :)", "error");
          }
        })
        }

    }
   
   });

   $("#estimate_table").on("click","tr td button", function(event) {
    selected_pino_id =  $(this).val();
    selected_invoice_type = 'estimation'
  {
      {
        swal({
          title: "Are you sure - Delete? ",
          text: "You will not be recover this list again!",
          icon: "warning",
          buttons: [
            'No, cancel it!',
            'Yes, I am sure!'
          ],
          dangerMode: true,
        }).then(function(isConfirm) {
          if (isConfirm) {
            swal({
              title: 'Applied!',
              text: 'successfully Deleted!',
              icon: 'success'
            }).then(function() {
              
              delete_list(selected_pino_id,selected_invoice_type) // <--- submit form programmatically
              
             
            });
          } else {
            swal("Cancelled", "lead is safe :)", "error");
          }
        })
        }

    }
   
   });

   $("#proforma_invoice_table").on("click","tr td button", function(event) {
    selected_pino_id =  $(this).val();
    console.log(selected_pino_id)
    selected_sqno =  $(this).parent().parent().find("td").eq(1).html()
    selected_invoice_type = 'proforma'
    if($(this).html() == "pay")
    {
      $('#payment_entry_modal').modal('show'); 
     
    }
    else{
      {
        swal({
          title: "Are you sure - Delete? ",
          text: "You will not be recover this list again!",
          icon: "warning",
          buttons: [
            'No, cancel it!',
            'Yes, I am sure!'
          ],
          dangerMode: true,
        }).then(function(isConfirm) {
          if (isConfirm) {
            swal({
              title: 'Applied!',
              text: 'successfully Deleted!',
              icon: 'success'
            }).then(function() {
              
              delete_list(selected_pino_id,selected_invoice_type) // <--- submit form programmatically
              
             
            });
          } else {
            swal("Cancelled", "lead is safe :)", "error");
          }
        })
        }

    }
   
   });


   $("#invoice_table").on("click","tr td button", function(event) {
    selected_pino_id =  $(this).val();
    selected_sqno =  $(this).parent().parent().find("td").eq(1).html()

    selected_invoice_type = 'invoice'
    if($(this).html() == "pay")
    {
      $('#payment_entry_modal').modal('show'); 
     
    }
    else
    {
      {
        swal({
          title: "Are you sure - Delete? ",
          text: "You will not be recover this list again!",
          icon: "warning",
          buttons: [
            'No, cancel it!',
            'Yes, I am sure!'
          ],
          dangerMode: true,
        }).then(function(isConfirm) {
          if (isConfirm) {
            swal({
              title: 'Applied!',
              text: 'successfully Deleted!',
              icon: 'success'
            }).then(function() {
              
              delete_list(selected_pino_id,selected_invoice_type) // <--- submit form programmatically
              
             
            });
          } else {
            swal("Cancelled", "lead is safe :)", "error");
          }
        })
        }
      
    }
   
   });


   $("#payment_submit_btn").click(function()
   {
    if($('#payment_form')[0].checkValidity())
insert_payment()
   });

 

   $("#payment_his_table").on("click","tr td button", function(event) {
    //get button value
    var payment_id = $(this).val()
  
  
  {
  swal({
    title: "Are you sure - Delete? ",
    text: "You will not be recover this  again!",
    icon: "warning",
    buttons: [
      'No, cancel it!',
      'Yes, I am sure!'
    ],
    dangerMode: true,
  }).then(function(isConfirm) {
    if (isConfirm) {
      swal({
        title: 'Applied!',
        text: 'successfully Deleted!',
        icon: 'success'
      }).then(function() {
        
        delete_payment(payment_id) // <--- submit form programmatically
        
       
      });
    } else {
      swal("Cancelled", "lead is safe :)", "error");
    }
  })
  }
  
        });
  });



  function get_cus_pay_history()
  {
    $.ajax({
      url: "php/get_cus_payment_history.php",
      type: "get", //send it through get method
      data: {
     cus_id : cus_id
       
     
     },
      success: function (response) {

console.log(response);
     if (response.trim() != "error") {
       if (response.trim() != "0 result") {
      var obj = JSON.parse(response);
     
     var count = 0;
     var price = 0
     console.log(obj)
     obj.forEach(function (obj) {
       if(obj.sts == "pay")
        price = price + parseFloat(obj.price)
        else
        price = price - parseFloat(obj.price)

     price = parseFloat(price) + parseFloat(obj.price)
     console.log(price);
     
     count = count + 1;
     $('#pay_history').append("<tr class = 'small'><td>"+count+"</td><td style='min-width: 120px;'>"+obj.dated+"</td><td style='min-width: 120px;'>"+obj.product+"</td><td style='min-width: 80px;'>"+obj.price+"</td></tr>")
       
      });
      $('#pay_history').append("<tr class = 'small text-bg-secondary'><td colspan='3' style='text-align: center;'>Total</td><td style='min-width: 80px;'>"+price+"</td></tr>")
      
     
     }
     else{
       $("#pay_history") .append("<tr class = 'text-bg-danger'><td colspan='15' scope='col'>No Data</td></tr>");
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
   $("#pendig_work_table").append(" <tr><td colspan='6' scope='col' class='text-bg-danger h6'>Sorry no data!</td></tr>")
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

  function get_service_request()
   {
     $.ajax({
       url: "php/get_service_request_cus.php",
       type: "get", //send it through get method
       data: {
      cus_id : cus_id
        
      
      },
       success: function (response) {

console.log(response);
      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
       var obj = JSON.parse(response);
      
      var count = 0;
      console.log(obj)
      obj.forEach(function (obj) {
        var attach =""
        if(obj.simage != "")
        {
       
            attach = "<div><button onclick = location.href='"+ obj.simage + "'; class='btn '><i class='fa-solid fa-photo-film'></i></button></div>"
        }


      count = count + 1;
      $('#service_table').append("<tr class = 'small'><td>"+count+"</td><td style='min-width: 120px;'>"+obj.sdate+"</td><td style='min-width: 120px;'>"+obj.dname+"</td><td style='min-width: 80px;'>"+obj.chasis_no+"</td><td>"+obj.implement+"</td><td style='min-width: 120px;'>"+obj.model+"</td><td style='min-width: 150;'>"+obj.complaint+"</td><td style='min-width: 300px;'>"+obj.remark+"</td><td>"+attach+"</td></td> <td style='min-width: 150;'>"+obj.sts+"</td></tr>")
        
       });
      
       
      
      }
      else{
        $("#service_table") .append("<tr class = 'text-bg-danger'><td colspan='15' scope='col'>No Data</td></tr>");
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


   function get_delivery()
   {
     $.ajax({
       url: "php/get_delivery_cus.php",
       type: "get", //send it through get method
       data: {
      cus_id : cus_id
        
      
      },
       success: function (response) {

console.log(response);
      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
       var obj = JSON.parse(response);
      
      var count = 0;
      console.log(obj)
      obj.forEach(function (obj) {
        var attach =""
        if(obj.dimage != "")
        {
       
            attach = "<div><button onclick = location.href='"+ obj.dimage + "'; class='btn '><i class='fa-solid fa-photo-film'></i></button></div>"
        }


      count = count + 1;
      $('#delivery_table').append("<tr class = 'small'><td>"+count+"</td><td style='min-width: 120px;'>"+obj.ddate+"</td><td style='min-width: 120px;'>"+obj.dname+"</td><td style='min-width: 80px;'>"+obj.chasis_no+"</td><td>"+obj.implement+"</td><td style='min-width: 120px;'>"+obj.model+"</td></td> <td style='min-width: 150;'>"+obj.ext_warranty+"</td><td>"+attach+"</td></tr>")
        
       });
      
       
      
      }
      else{
        $("#service_table") .append("<tr class = 'text-bg-danger'><td colspan='15' scope='col'>No Data</td></tr>");
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


   function get_extw_requset_cus()
   {
     $.ajax({
       url: "php/get_extw_request_cus.php",
       type: "get", //send it through get method
       data: {
      cus_id : cus_id
        
      
      },
       success: function (response) {

console.log(response);
      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
       var obj = JSON.parse(response);
      
      var count = 0;
      console.log(obj)
      obj.forEach(function (obj) {
        var attach =""
        if(obj.dimage != "")
        {
       
            attach = "<div><button onclick = location.href='"+ obj.dimage + "'; class='btn '><i class='fa-solid fa-photo-film'></i></button></div>"
        }


      count = count + 1;
      $('#ext_warranty_table').append("<tr class = 'small'><td>"+count+"</td><td style='min-width: 120px;'>"+obj.ddate+"</td><td style='min-width: 120px;'>"+obj.dname+"</td><td style='min-width: 80px;'>"+obj.chasis_no+"</td><td>"+obj.implement+"</td><td style='min-width: 120px;'>"+obj.model+"</td></td> <td>"+attach+"</td><td style='min-width: 150;'>"+obj.sts+"</td></tr>")
        
       });
      
       
      
      }
      else{
        $("#service_table") .append("<tr class = 'text-bg-danger'><td colspan='15' scope='col'>No Data</td></tr>");
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
  function delete_list(id,url)
  {
    url = "php/delete_" + url + ".php"
     
      $.ajax({
          url: url,
          type: "get", //send it through get method
          data: {
           id: id
         },
          success: function (response) {
         console.log(response);
         
         if (response.trim() != "error") {
   
           if (response.trim() != "0 results") {
          
         
                 location.reload()
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


  function delete_payment(payment_id)
   {
      
       $.ajax({
           url: "php/delete_payment.php",
           type: "get", //send it through get method
           data: {
            payment_id: payment_id
          },
           success: function (response) {
          console.log(response);
          
          if (response.trim() != "error") {
    
            if (response.trim() != "0 results") {
           
          
                  location.reload()
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
  function insert_payment()
  {
    
    
    $.ajax({
      url: "php/insert_payment.php",
      type: "get", //send it through get method
      data: {
       cus_id : cus_id_g,
invoice_id : selected_pino_id,
dated : get_cur_millis(),
invoice_type : selected_invoice_type,
ref_id :  $('#ref_id').val(),
amount	 :  $('#amount').val(),
sqno : selected_sqno

       
     
     },
      success: function (response) {
     console.log(response);
     $('#payment_entry_modal').modal('hide'); 
     location.reload()
     if (response.trim() != "error") {

       if (response.trim() != "0 result") {
     
     
       }
       else{
        // $("#@id@") .append("<td colspan='0' scope='col'>No Data</td>");
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

  function get_user_quotation(cus_id)
  {
$.ajax({
 url: "php/get_user_quotation.php",
 type: "get", //send it through get method
 data: {
  
 cus_id: cus_id
},
 success: function (response) {
console.log(response)

if (response.trim() != "error") {
  if (response.trim() != "0 result") {
 var obj = JSON.parse(response);


var count =0 
 obj.forEach(function (obj) {
 
  count  = count + 1;

   $("#quote_table").append(" <tr> <td>"+ count + "</td> <td>"+ obj.qnos + "</td><td>"+ millis_to_date(parseFloat(obj.dated)) + "</td> <td>"+ obj.total_value + "</td> <td><a target='_blank' href=' quotation_single.html?qno="+ obj.qno + "&cus_id="+ cus_id +"' class='btn btn-primary btn-sm' role='button'>View</a></td> <td>"+"<button value='"+obj.qno + "' type='button' class='btn text-danger' > <i class='fa-solid fa-trash-can'></i></button>"+"</td></tr>")


 });

  }

  else{
    $("#quote_table").append(" <tr><td colspan='6' scope='col' class='text-bg-danger h6'>Sorry no data!</td></tr>")
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
  function get_user_estimate(cus_id)
  {
$.ajax({
 url: "php/get_user_estimate.php",
 type: "get", //send it through get method
 data: {
  
 cus_id: cus_id
},
 success: function (response) {
console.log(response)

if (response.trim() != "error") {
  if (response.trim() != "0 result") {
 var obj = JSON.parse(response);


var count =0 
 obj.forEach(function (obj) {
 
  count  = count + 1;

   $("#estimate_table").append(" <tr> <td>"+ count + "</td> <td>"+ obj.eno + "</td><td>"+ millis_to_date(parseFloat(obj.dated)) + "</td> <td>"+ obj.total_value + "</td> <td><a target='_blank' href=' estimation_single.html?qno="+ obj.eno + "&cus_id="+ cus_id +"' class='btn btn-primary btn-sm' role='button'>View</a></td> <td>"+"<button value='"+obj.eno + "' type='button' class='btn text-danger' > <i class='fa-solid fa-trash-can'></i></button>"+"</td></tr>")


 });
  }
  else{
    $("#estimate_table").append(" <tr><td colspan='6' scope='col' class='text-bg-danger h6'>Sorry no data!</td></tr>")
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

 

  function get_payment_history(cus_id)
  {
$.ajax({
 url: "php/get_payment_history.php",
 type: "get", //send it through get method
 data: {
  
  cus_id: cus_id
},
 success: function (response) {
console.log(response)

if (response.trim() != "error") {
  if (response.trim() != "0 result") {
 var obj = JSON.parse(response);


var count =0 
 obj.forEach(function (obj) {
 
  count  = count + 1;

   $("#payment_his_table").append(" <tr> <td>"+ count + "</td> <td>"+ obj.sqno + "</td><td>"+ obj.invoice_type + "</td><td>"+ millis_to_date(parseFloat(obj.dated)) + "</td> <td>"+ obj.amount + "</td><td>"+ obj.ref_id + "</td> <td>"+"<button value='"+obj.pid + "' type='button' class='btn text-danger' > <i class='fa-solid fa-trash-can'></i></button>"+"</td></tr>")


 });
  }
  else{
    $("#payment_his_table").append(" <tr><td colspan='8' scope='col' class='text-bg-danger h6'>Sorry no data!</td></tr>")
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

  function get_user_proforma_invoice(cus_id)
  {
$.ajax({
 url: "php/get_user_proforma_invoice.php",
 type: "get", //send it through get method
 data: {
  
 cus_id: cus_id
},
 success: function (response) {


if (response.trim() != "error") {
  if (response.trim() != "0 result") {
 var obj = JSON.parse(response);


var count =0 
 obj.forEach(function (obj) {
  console.log(obj.pino)
  count  = count + 1;
  var amount ='0'
  if(obj.amount != null)
  {
amount = obj.amount
  }

   $("#proforma_invoice_table").append(" <tr> <td>"+ count + "</td> <td>"+ obj.pinos + "</td><td>"+ millis_to_date(parseFloat(obj.dated)) + "</td> <td>"+ obj.total_value + "</td><td>"+ amount + "</td><td><button value='"+ obj.pino + "'  class='btn btn-success btn-sm'>pay</button> </td> <td><a target='_blank'  href=' proforma_single.html?qno="+ obj.pino  + "&cus_id="+ cus_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td><td>"+"<button value ='"+ obj.pino + " ' type='button' class='btn text-danger' > <i class='fa-solid fa-trash-can'></i></button>"+"</td> </tr>")


 });
  }
  else{
    $("#proforma_invoice_table").append(" <tr><td colspan='8' scope='col' class='text-bg-danger h6'>Sorry no data!</td></tr>")
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

  function get_user_invoice(cus_id)
  {
$.ajax({
 url: "php/get_user_invoice.php",
 type: "get", //send it through get method
 data: {
  
 cus_id: cus_id
},
 success: function (response) {
console.log(response)

if (response.trim() != "error") {
  if (response.trim() != "0 result") {
 var obj = JSON.parse(response);


var count =0 
 obj.forEach(function (obj) {
 
  count  = count + 1;

  var amount ='0'
  if(obj.amount != null || obj.amount1 != null)
  {
    var amount =0
    var amount1 = 0
    if(obj.amount != null)
    amount = obj.amount
    if(obj.amount1 != null)
    amount1 = obj.amount1

amount = parseFloat(amount)+ parseFloat(amount1)
  }

   $("#invoice_table").append(" <tr> <td>"+ count + "</td> <td>"+ obj.inos + "</td><td>"+ millis_to_date(parseFloat(obj.dated)) + "</td> <td>"+ obj.total_value + "</td><td>"+ amount + "</td><td><button value='"+ obj.ino + "' class='btn btn-success btn-sm'>pay</button> </td> <td><a target='_blank' href='invoice_single.html?qno="+ obj.ino + "&cus_id="+ cus_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td><td>"+"<button value='"+obj.ino + "' type='button' class='btn text-danger' > <i class='fa-solid fa-trash-can'></i></button>"+"</td> </tr>")


 });
  }
  else{
    $("#invoice_table").append(" <tr><td colspan='8' scope='col' class='text-bg-danger h6'>Sorry no data!</td></tr>")
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

  function get_user_reminder(cus_id)
  {
$.ajax({
 url: "php/get_user_reminder.php",
 type: "get", //send it through get method
 data: {
  
 cus_id: cus_id
},
 success: function (response) {
console.log(response)

if (response.trim() != "error") {
  if (response.trim() != "0 result") {
 var obj = JSON.parse(response);


var count =0 
 obj.forEach(function (obj) {
 
  count  = count + 1;

   $("#reminder_table").append(" <tr> <td>"+ count + "</td> <td>"+ obj.description + "</td><td>"+ millis_to_date(parseFloat(obj.remind_date)) + "</td></tr>")


 });
  }
  else{
    $("#reminder_table").append(" <tr><td colspan='6' scope='col' class='text-bg-danger h6'>Sorry no data!</td></tr>")
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

 
  




  function get_next_work_time(){
    
    $.ajax({
      url: "php/get_next_work_time.php",
      async : false,
      type: "get", //send it through get method
      data: {
        emp_id:current_user_id,
        cur_time : get_cur_millis
           },
      success: function (response) {
     
     console.log(response)
     if (response.trim() != "error") {
      if (response.trim() != "0 result"){
        var obj = JSON.parse(response);
      obj.forEach(function (obj) {
        if(parseFloat(obj.work_date) - get_cur_millis() < 1000*60)
        $("#next_work_time_txt").text("less than min")
        else
        $("#next_work_time_txt").text( msToTime(parseFloat(obj.work_date) - get_cur_millis()))
        console.log(get_cur_millis()+60000 >= parseFloat(obj.work_date))
    if(  (get_cur_millis()+60000 >= parseFloat(obj.work_date)))
    {
      if(is_cur_work == "no")
location.reload()
else{
  $("#next_work_time_txt").addClass("blink")
  $("#next_work_time_txt").attr("onclick"," window.location.href = 'user_call.html';")
}
    }
    else{
      $("#next_work_time_txt").removeClass("blink")
      $("#next_work_time_txt").removeAttr("onclick")
    }
               });
     
    
   

   
     }
     else{
      $("#next_work_time_txt").text("no work")
      $("#next_work_time_txt").removeClass("blink")
      $("#next_work_time_txt").removeAttr("onclick")
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
   his_emp_id : current_user_id,
   lead_source : "",
   current_work_id : selected_work_id,


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
  
 

  
   function check_incoming_call(android_id)
   {
    
    const db = getDatabase();
  
   
const starCountRef = ref(db, 'phone_state/'+ android_id);

onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();
 
var phone = data.phone_no.substr(data.phone_no.length - 10); // => "Tabs1"
if(data.phone_status=="ring")
{
//   salert(data.phone_status,"call from - "+data.phone_no,"warning");
//   var url = "user_call_incoming.html?phone_no=" + phone;
//  window.open(url, '_blank');
 get_call_cus_id(phone)
}
 

});

   }
   function get_call_cus_id(phone_no)
   {
    
   
   $.ajax({
     url: "php/get_call_cus_id.php",
     type: "get", //send it through get method
     data: {
      phone_no : phone_no
     },
     success: function (response) {
   
   console.log(response)
   if (response.trim() != "error") {

    if (response.trim() != "0 results")
    {
   
     var obj = JSON.parse(response);
   
   
   
     obj.forEach(function (obj) {



     
      var url = "user_call.html?cus_id=" + obj.cus_id;
      window.open(url, '_blank');
   
   
     });
   
    
   }
   else{
    var url = "user_call.html?cus_id=0";
    window.open(url, '_blank');
 
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
    $('#call_btn').prop("disabled",false)
    
   }
   else
   {
    $('#call_new_work_btn').show();
    $('#call_btn').prop("disabled",true)
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
       if(urlParams.get('cus_id') == null)
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
  url: "php/get_today_call.php",
  type: "get", //send it through get method
  data: {
    p_uid_p: localStorage.getItem("ls_uid"),
    p_cur_time_p1 : get_cur_millis(),
    p_ts_p1 : get_today_start_millis(),
    p_te_p1 : get_today_end_millis(),

},
  success: function (response) {


if (response.trim() != "error") {

console.log(response)
  if (response.trim() != "0 result")
  {
is_cur_work = "yes"
    $("#work_show").show();
    $("#no_work_show").hide();
  var obj = JSON.parse(response);

 

  obj.forEach(function (obj) {
      console.log(obj);
      $("#cus_name").text(obj.cus_name);
    
  
      $("#cus_phone").text(obj.cus_phone);

     
      
      //$("#tstatus").text(obj.work_status);


      $("#cus_address").text(obj.cus_address);
      $("#company_name").text(obj.cus_company_name);
      $("#cus_location").text(obj.cus_location);

      $("#cus_email").text(obj.cus_email);
      $("#cus_lead_source").text(obj.cus_lead_source);
      $("#cus_type").text(obj.cus_type);
      $("#cus_need").text(obj.cus_need);

    
work_id = obj.work_id;
      

      get_history_sql(obj.work_id)
      get_work_sql(obj.cus_id)
      get_cur_work_sql(work_id)
      get_work_type(obj.work_type);
      cus_id_g = obj.cus_id;
      get_user_estimate(obj.cus_id);
   
      get_user_proforma_invoice(obj.cus_id)
      get_payment_history(obj.cus_id)
      get_user_invoice(obj.cus_id)
      get_user_reminder(obj.cus_id)
     
      
     get_user_quotation(obj.cus_id) 
     $("#cus_edit").attr("onclick","window.open('create_customer.html?cus_id=" +obj.cus_id+ "&cus_type=old');")
if(phone_id != null)
$("#cus_task").attr("onclick","window.open('create_work.html?work_cus_id=" +obj.cus_id+ "&cus_type=old&phone_id="+phone_id + " ');")
else
      $("#cus_task").attr("onclick","window.open('create_work.html?work_cus_id=" +obj.cus_id+ "&cus_type=old');")
      $("#cus_estimation").attr("onclick","window.open('estimation.html?cus_id=" +obj.cus_id+ "');")
      $("#cus_quotation").attr("onclick","window.open('quotation.html?cus_id=" +obj.cus_id+ "');")
      $("#cus_invoice").attr("onclick","window.open('sales.html?cus_id=" +obj.cus_id+ "');")
      
      $("#call_wat_btn").attr("onclick","window.open('https://wa.me/91" +obj.cus_phone+ "');")
  });
}

else{
  is_cur_work= "no"
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

   function get_cus_info_sql(cus_id_1)
   {


$.ajax({
  url: "php/get_cus_info_all.php",
  type: "get", //send it through get method
  data: {
    cus_id : cus_id_1
 

},
  success: function (response) {


if (response.trim() != "error") {

console.log(response)
  if (response.trim() != "0 results")
  {

  
  var obj = JSON.parse(response);

 

  obj.forEach(function (obj) {
      console.log(obj);
      $("#cus_name").text(obj.cus_name);
    
  
      $("#cus_phone").text(obj.cus_phone);

     
      
      //$("#tstatus").text(obj.work_status);
cus_id_g = obj.cus_id

      $("#cus_address").text(obj.cus_address);
      $("#company_name").text(obj.cus_company_name);
      $("#cus_location").text(obj.cus_location);

      $("#cus_email").text(obj.cus_email);
      $("#cus_lead_source").text(obj.cus_lead_source);
      $("#cus_type").text(obj.cus_type);
      $("#cus_need").text(obj.cus_need);
     
      get_user_estimate(obj.cus_id);
      
      get_user_proforma_invoice(obj.cus_id)
      get_payment_history(obj.cus_id)
      get_work_sql(obj.cus_id)
      get_user_quotation(obj.cus_id)
      get_user_invoice(obj.cus_id)
      get_user_reminder(obj.cus_id)
      

$("#cus_edit").attr("onclick","window.open('create_customer.html?cus_id=" +obj.cus_id+ "&cus_type=old');")
if(phone_id != null)
$("#cus_task").attr("onclick","window.open('create_work.html?work_cus_id=" +obj.cus_id+ "&cus_type=old&phone_id="+phone_id + " ');")
else
      $("#cus_task").attr("onclick","window.open('create_work.html?work_cus_id=" +obj.cus_id+ "&cus_type=old');")

      $("#cus_estimation").attr("onclick","window.open('estimation.html?cus_id=" +obj.cus_id+ "');")
      $("#cus_quotation").attr("onclick","window.open('quotation.html?cus_id=" +obj.cus_id+ "');")
      $("#cus_invoice").attr("onclick","window.open('sales.html?cus_id=" +obj.cus_id+ "');")
        $("#call_wat_btn").attr("onclick","window.open('https://wa.me/91" +obj.cus_phone+ "');")
    is_cur_work = "yes"
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
      $("#status_in").empty()
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

   
   function get_cur_work_sql(work_id)
   {
   
   $.ajax({
     url: "php/get_cur_work.php",
     type: "get", //send it through get method
     data: {
      work_id: work_id,
      
   },
     success: function (response) {
   console.log(response)
   
   if (response.trim() != "error") {
     var obj = JSON.parse(response);
   
     var count = 0;
     $("#cur_work_table").empty();
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
   
   
   
   $("#cur_work_table").append(" <tr> <td> <div class='visually-hidden'><p id='work_table_work_id'>"+obj.work_id + "</p></div><div class='visually-hidden'><p id='work_table_work_date'>"+obj.work_date + "</p></div> <div class='d-flex justify-content-between mb-2'> <div><h6 class='small m-0 p-0'>" +obj.work_type + "</h6> </div><div><p class='small m-0 p-0'>" + millis_to_date(parseFloat(obj.work_date)) + "</p></div> </div><p class='small text-start'>" + obj.work_description + "</p><div class='d-flex justify-content-between'> <div><h6 class='m-0 p-0 " + date_color + "'><i class='fa-solid " + date_icon + "'></i></h6> </div>" + attach +  "<div><p class='p-0 m-0 text-success'>" + obj.work_status + "</p></div><div><p class=' small m-0 p-0'>" + obj.emp_name + "</p></div> </div> </td> </tr>");
   
   
     
    
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
  if (response.trim() != "0 result") {
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



$("#work_table").append(" <tr> <td> <div class='visually-hidden'><p id='work_table_work_id'>"+obj.work_id + "</p></div><div class='visually-hidden'><p id='work_table_work_date'>"+obj.work_date + "</p></div> <div class='d-flex justify-content-between mb-2'> <div><h6 id='work_table_work_type' class='small m-0 p-0'>" +obj.work_type + "</h6> </div><div><p class='small m-0 p-0'>" + millis_to_date(parseFloat(obj.work_date)) + "</p></div> </div><p class='small text-start'>" + obj.work_description + "</p><div class='d-flex justify-content-between'> <div><h6 class='m-0 p-0 " + date_color + "'><i class='fa-solid " + date_icon + "'></i></h6> </div>" + attach +  "<div><p id='work_table_work_status'class='p-0 m-0 text-success'>" + obj.work_status + "</p></div><div><p id='work_table_emp_name' class=' small m-0 p-0'>" + obj.emp_name + "</p></div> </div> </td> </tr>");


  
 
   // $("#work_table").append(" <button value='"+ work_edit + "' id='" + obj.work_id + "' class=' de1'> <div class='d-flex justify-content-between'> <div> <h6 class='text-primary' id='work_type_txt'>" +obj.work_type + "</h6> </div> <div> <p class='fw-bold' id='work_date_txt'>" + millis_to_date(parseFloat(obj.work_date)) + "</p> </div> </div> <p class='small' id='work_des_txt'>" + obj.work_description + "</p> <div class='d-flex justify-content-between'> <div> <h6 class='text-danger' id='work_exp_txt'>" + "Expired" + "</h6> </div> <div> <p class='fw-bold' id='work_by_txt'>" + "Harishkumar" + "</p> </div> </div> </button>")






  });

  $("#total_works").text(count)
 
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
      work_id_p : work_id,
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
   function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
  
    return hrs + ' hour ' + mins + " mins ";
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