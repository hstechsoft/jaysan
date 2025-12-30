
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
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
  var cus_id = '0';
$(document).ready(function(){
  
  
  $("#menu_bar").load('menu.html',
    function() { 
      var lo = (window.location.pathname.split("/").pop());
      var web_addr = "#"+ (lo.substring(0, lo.indexOf(".")))
     console.log(web_addr)
    
     if($(web_addr).find("a").hasClass('nav-link'))
     {
      $(web_addr).find("a").toggleClass('active')
     }
     else if($(web_addr).find("a").hasClass('dropdown-item'))
{
$(web_addr).parent().parent().find("a").eq(0).toggleClass('active')
}
      
     
    }
 );
  check_login();
  get_all_work_type();
  get_work_type();
  get_all_report_type();
  get_all_work();
   $("#unamed").text(localStorage.getItem("ls_uname"))
  
   $("#work_type_form").submit(function(){
    $("#work_status_name").val("")
    $("#work_type_dropdown").val("")

  });

  $("#report_form").submit(function(){
    $('#sel_rwt_in').prop('selectedIndex',0);
    $('#sel_rsts_in').prop('selectedIndex',0);  

  });


 
  
   $("#work_type_add_btn").click(function()
   {

    if($('#work_type_form')[0].checkValidity())
    {
      
      var rowCount = $('#work_type_table tr').length;
      rowCount = rowCount +1
    
      $("#work_type_table").append("<tr><td>" + rowCount + "</td><td>" + $('#work_status_name').val() + "</td><td>" + $('#work_type_dropdown :selected').text() + "</td> </tr> ")
    
    }

  
   
   });
  

   $("#work_type_submit_btn").click(function()
   {
    var countv = 0;
    var rowC = $('#work_type_table tr').length;
 
    $("#work_type_table tr").each(function () {
      countv = countv + 1;
    
      
      var this_row = $(this);
   
      var status = $.trim(this_row.find('td:eq(1)').html())
      var type = $.trim(this_row.find('td:eq(2)').html())


var reload_p="";

if (countv >= rowC )
{
reload_p="yes";

}
else {
reload_p="no";
}
console.log(reload_p)
insert_work_type_sql(status,type,$('#work_name').val(),reload_p)

  });
    
   });

   $('#sel_wt_in').change(function() {
    if( $('#sel_wt_in :selected').val()!="0")
    {
       
    get_work_status($('#sel_wt_in :selected').text());
    }
    
     });

     $('#sel_rwt_in').change(function() {
      if( $('#sel_rwt_in :selected').val()!="0")
      {
         
      get_rwork_status($('#sel_rwt_in :selected').text());
      }
      
       });


     $("#pwork_btn").click(function()
     {
      if($('#pipe_line_form')[0].checkValidity())
      insert_pwork()
     });

     $("#rwork_btn").click(function()
     {
      if($('#report_form')[0].checkValidity())
      insert_rwork()
     });
$("#work_all_table").on("click", function(event) {
  event.preventDefault();
  // TODO: handle mouse event
});

     $("#work_all_table").on("click","tr td button", function(event) {
      //get button value
      var work_type_id = $(this).val()
  
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
          
          delete_work(work_type_id) // <--- submit form programmatically
          
         
        });
      } else {
        swal("Cancelled", "lead is safe :)", "error");
      }
    })
    }
    
          });

     $("#work_type_all_table").on("click","tr td button", function(event) {
      //get button value
      var work_type_id = $(this).val()
    
    
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
          
          delete_work_type(work_type_id) // <--- submit form programmatically
          
         
        });
      } else {
        swal("Cancelled", "lead is safe :)", "error");
      }
    })
    }
    
          });


          $("#report_type_all_table").on("click","tr td button", function(event) {
            //get button value
            var work_type_id = $(this).val()
          
          
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
                
                delete_work_report(work_type_id) // <--- submit form programmatically
                
               
              });
            } else {
              swal("Cancelled", "lead is safe :)", "error");
            }
          })
          }
          
                });
   });
   //


   
   function get_all_work(){
   
    $.ajax({
      url: "php/get_all_work.php",
      type: "get", //send it through get method
      data: {
      
     
     },
      success: function (response) {
       console.log(response)
       
     if (response.trim() != "error") {
      if(response.trim() != "0 result")
{
      var obj = JSON.parse(response);
     
var count =0;
     
      obj.forEach(function (obj) {

count = count +1;
       $("#work_all_table") .append("<tr><td>" + count + "</td><td>" + obj.work_type_name + "</td><td>"+"<button value='"+obj.work_type_id + "' type='button' class='btn text-danger' > <i class='fa-solid fa-trash-can'></i></button>"+"</td>  </tr> ")
      });
    }
     }
     
     
     
     
        
      },
      error: function (xhr) {
          //Do Something to handle error
      }
     });
  }


   function delete_work_report(work_type_id)
   {
    console.log(work_type_id)
      
       $.ajax({
           url: "php/delete_work_report.php",
           type: "get", //send it through get method
           data: {
            work_type_id: work_type_id
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

   function delete_work(work_type_id)
   {
      
       $.ajax({
           url: "php/delete_work.php",
           type: "get", //send it through get method
           data: {
            work_type_id: work_type_id
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

   function delete_work_type(work_type_id)
   {
      
       $.ajax({
           url: "php/delete_work_type.php",
           type: "get", //send it through get method
           data: {
            work_type_id: work_type_id
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
   function get_rwork_status(work_type)
   {
 $.ajax({
  url: "php/get_wstatus.php",
  type: "get", //send it through get method
  data: {
  work_type : work_type
   
 
 },
  success: function (response) {
 
 
 if (response.trim() != "error") {
  var obj = JSON.parse(response);
 
 var count = 0  
 $("#sel_rsts_in").empty();
 $("#sel_rsts_in").append(" <option value='" + 0 + "'>" + "Select Status..." + "</option>");
 $("#sel_rsts_in").append(" <option value='" +''+ "'>" + "create" + "</option>");
 $("#sel_rsts_in").append(" <option value='" +''+ "'>" + "assign" + "</option>");
 $("#sel_rsts_in").append(" <option value='" +''+ "'>" + "accept" + "</option>");
  obj.forEach(function (obj) {
      count = count + 1
    
     $("#sel_rsts_in").append(" <option value='" + count + "'>" + obj.work_status + "</option>");
 
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


   function get_work_status(work_type)
   {
 $.ajax({
  url: "php/get_wstatus.php",
  type: "get", //send it through get method
  data: {
  work_type : work_type
   
 
 },
  success: function (response) {
 
 
 if (response.trim() != "error") {
  var obj = JSON.parse(response);
 
 var count = 0  
 $("#sel_sts_in").empty();
 $("#sel_sts_in").append(" <option value='" + 0 + "'>" + "Select Status..." + "</option>");
  obj.forEach(function (obj) {
      count = count + 1
    
     $("#sel_sts_in").append(" <option value='" + count + "'>" + obj.work_status + "</option>");
 
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

   function insert_work_type_sql(status,type,work,reload_p)
   {
   

$.ajax({
  url: "php/insert_work_type.php",
  async :false,
  type: "get", //send it through get method
  data: {
 


    work_type_name : work,
    work_status  :status,
    status_type  : type
    

},
  success: function (response) {

   console.log(response);
if(reload_p == "yes")
{
window.location.reload();
}
    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }
  
   function insert_rwork()
   {
   

$.ajax({
  url: "php/insert_rwork.php",
  async :false,
  type: "get", //send it through get method
  data: {
 


    work_type : $('#sel_rwt_in :selected').text(),
    work_status  :$('#sel_rsts_in :selected').text(),
    report_cat  : $('#report_name').val()
    

},
  success: function (response) {

   console.log(response);

//window.location.reload();
get_all_report_type()

  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }

   function insert_pwork()
   {
   

$.ajax({
  url: "php/insert_pwork.php",
  async :false,
  type: "get", //send it through get method
  data: {
 


    work_type_id : $('#sel_wt_in :selected').val(),
    work_status  :$('#sel_sts_in :selected').text(),
    pipeline_work  : $('#sel_pwork_in :selected').text()
    

},
  success: function (response) {

   console.log(response);

window.location.reload();

    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }


   function get_all_work_type(){
   
      $.ajax({
        url: "php/get_all_work_type.php",
        type: "get", //send it through get method
        data: {
        
       
       },
        success: function (response) {
         console.log(response)
         
       if (response.trim() != "error") {
        if(response.trim() != "0 result")
{
        var obj = JSON.parse(response);
       
  var count =0;
       
        obj.forEach(function (obj) {

 count = count +1;
         $("#work_type_all_table") .append("<tr><td>" + count + "</td><td>" + obj.work_type_name + "</td><td>" + obj.work_status + "</td><td>" + obj.status_type + "</td> <td>" + obj.pipeline_work + "</td><td>"+"<button value='"+obj.id + "' type='button' class='btn text-danger' > <i class='fa-solid fa-trash-can'></i></button>"+"</td>  </tr> ")
        });
      }
       }
       
       
       
       
          
        },
        error: function (xhr) {
            //Do Something to handle error
        }
       });
    }

    function get_all_report_type(){
   
      $.ajax({
        url: "php/get_all_report_type.php",
        type: "get", //send it through get method
        data: {
        
       
       },
        success: function (response) {
         console.log(response)
         
       if (response.trim() != "error") {
        $("#report_type_all_table").empty()
        if(response.trim() != "0 result")
{
        var obj = JSON.parse(response);
       
  var count =0;
       
        obj.forEach(function (obj) {

 count = count +1;
         $("#report_type_all_table") .append("<tr><td>" + count + "</td><td>" + obj.report_cat + "</td><td>" + obj.comments + "</td><td>"+"<button value='"+obj.id + "' type='button' class='btn text-danger' > <i class='fa-solid fa-trash-can'></i></button>"+"</td>  </tr> ")
        });
      }
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
    if (response.trim() != "0 result") {
   var obj = JSON.parse(response);
  
  
  
   obj.forEach(function (obj) {
       
     
      $("#sel_wt_in").append(" <option value='" + obj.work_type_id + "'>" + obj.work_type_name + "</option>");
      $("#sel_pwork_in").append(" <option value='" + obj.work_type_id + "'>" + obj.work_type_name + "</option>");
      $("#sel_rwt_in").append(" <option value='" + obj.work_type_id + "'>" + obj.work_type_name + "</option>");
    
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


   function check_login()
   {
    
    if (localStorage.getItem("logemail") == null) {
      window.location.replace("login.html");
  }
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