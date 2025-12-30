
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
  import { getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword  } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js'
  import { getDatabase, ref, set ,onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBjJiV3e3SU_qH63XsYV2ZUJTHpzadoBAI",
    authDomain: "company-3f8de.firebaseapp.com",
    databaseURL: "https://company-3f8de-default-rtdb.firebaseio.com",
    projectId: "company-3f8de",
    storageBucket: "company-3f8de.appspot.com",
    messagingSenderId: "88832033166",
    appId: "1:88832033166:web:fe0e78a0fd38f2a194e4df",
    measurementId: "G-ZSER2W9H21"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');

var cus_id = '0';
var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ;  

var thismonth = 'UNIX_TIMESTAMP(DATE_FORMAT(NOW() ,"%Y-%m-01"))*1000'
var thisweek = 'UNIX_TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL(-WEEKDAY(CURDATE())) DAY))*1000'
var thisyear ='UNIX_TIMESTAMP(DATE_FORMAT(NOW() ,"%Y-01-01"))*1000'
var last3months = 'UNIX_TIMESTAMP(DATE_SUB(DATE_FORMAT(NOW() ,"%Y-%m-01"), INTERVAL 3 month))*1000'
var now_s = 'UNIX_TIMESTAMP( NOW())*1000'
var ref_query = '1';
var lead_source = '1'
var date_query_start = 'UNIX_TIMESTAMP(CURDATE())*1000'
var date_query_end = 'UNIX_TIMESTAMP( NOW())*1000'
$(document).ready(function(){
 


  // SELECT count(report_master.report_cat) as count,report_master.report_cat from report_master WHERE concat(report_master.work_type, ' - ', report_master.work_status) in (SELECT max(CONCAT(work.work_type, ' - ', work.work_status)) FROM `lead` INNER JOIN work ON lead.work_id = work.pipeline_id WHERE lead.dated BETWEEN 0 and 1 GROUP BY lead.work_id) GROUP by report_master.report_cat

 check_login();

 get_lead()
get_lead_source()

get_employee();
   $("#unamed").text(localStorage.getItem("ls_uname"))
  // $("#tlead_att_on").text(localStorage.getItem("ls_uname"))

 
//   $("#leads_table").on("click","tr td a", function(event) {
//     //get button value
    
//         });
$("#ref_phone").focus(function(){
   
        $("#ref_name").val("")
        
    
     });

     $("#ref_name").focus(function(){
   
        $("#ref_phone").val("")
        
    
     });

$('#ref_phone').on('input',function(){
    //check the value not empty
        if($('#ref_phone').val() !="")
        {
          $('#ref_phone').autocomplete({
            //get data from databse return as array of object which contain label,value
            source: get_refphone_autocomplete(),
            minLength: 2,
            cacheLength: 0,
            select: function(event, ui) {
          
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

       
$('#ref_name').on('input',function(){
    //check the value not empty
        if($('#ref_name').val() !="")
        {
          $('#ref_name').autocomplete({
            //get data from databse return as array of object which contain label,value
            source: get_refname_autocomplete(),
            minLength: 2,
            cacheLength: 0,
            select: function(event, ui) {
          
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



   $('#today_radio').change(function() {
    if(this.checked) {
    date_query_start = 'UNIX_TIMESTAMP(CURDATE())*1000'
     date_query_end = 'UNIX_TIMESTAMP( NOW())*1000'

     if( $("#ref_name").val() != "")
     {
ref_query = 'ref_cus_name =  '+ "'"+$("#ref_name").val() + "'"
     }
     else if( $("#ref_phone").val() != "")
     {
        ref_query = 'ref_cus_phone = '+ "'"+$("#ref_phone").val() + "'"
     }
     else
     {
        ref_query = '1'
     }
    }


    get_lead()
    });

    $('#thisweek_radio').change(function() {
      if(this.checked) {
        date_query_start = thisweek
        date_query_end = 'UNIX_TIMESTAMP( NOW())*1000'
        if( $("#ref_name").val() != "")
        {
   ref_query = 'ref_cus_name =  '+ "'"+$("#ref_name").val() + "'"
        }
        else if( $("#ref_phone").val() != "")
        {
           ref_query = 'ref_cus_phone = '+ "'"+$("#ref_phone").val() + "'"
        }
        else
        {
           ref_query = '1'
        }
      }
      get_lead()
      });

      $('#thismonth_radio').change(function() {
        if(this.checked) {
          date_query_start = thismonth
          date_query_end = 'UNIX_TIMESTAMP( NOW())*1000'
          if( $("#ref_name").val() != "")
          {
     ref_query = 'ref_cus_name =  '+ "'"+$("#ref_name").val() + "'"
          }
          else if( $("#ref_phone").val() != "")
          {
             ref_query = 'ref_cus_phone = '+ "'"+$("#ref_phone").val() + "'"
          }
          else
          {
             ref_query = '1'
          }
        }
        get_lead()
        });
        $('#l3months_radio').change(function() {
          if(this.checked) {
            date_query_start = last3months
            date_query_end = 'UNIX_TIMESTAMP( NOW())*1000'
            if( $("#ref_name").val() != "")
            {
       ref_query = 'ref_cus_name =  '+ "'"+$("#ref_name").val() + "'"
            }
            else if( $("#ref_phone").val() != "")
            {
               ref_query = 'ref_cus_phone = '+ "'"+$("#ref_phone").val() + "'"
            }
            else
            {
               ref_query = '1'
            }
          }
          get_lead()
          });

 
          $('#thisyear_radio').change(function() {
            if(this.checked) {
              date_query_start = thisyear
              date_query_end = 'UNIX_TIMESTAMP( NOW())*1000'
              if( $("#ref_name").val() != "")
              {
         ref_query = 'ref_cus_name =  '+ "'"+$("#ref_name").val() + "'"
              }
              else if( $("#ref_phone").val() != "")
              {
                 ref_query = 'ref_cus_phone = '+ "'"+$("#ref_phone").val() + "'"
              }
              else
              {
                 ref_query = '1'
              }
            }
            get_lead()
            });


            $('#report_search_btn').on('click', function()
{
  if($('#search_form')[0].checkValidity())
  {
    date_query_start = "'"+  get_millis($('#search_start_date').val()) + "'"
    date_query_end = "'"+  get_millis($('#search_end_date').val())+ "'"
    if( $("#ref_name").val() != "")
    {
ref_query = 'ref_cus_name =  '+ "'"+$("#ref_name").val() + "'"
    }
    else if( $("#ref_phone").val() != "")
    {
       ref_query = 'ref_cus_phone = '+ "'"+$("#ref_phone").val() + "'"
    }
    else
    {
       ref_query = '1'
    }
    get_lead()

    console.log(date_query_start)
  }
 

});

$("#download_xl_btn").on('click',function()
{
  $("#leads_table1").table2excel({
    
             exclude: ".noExl",
							name: "Excel Document Name",
							filename: "leade_ref_report_" + new Date().toLocaleDateString().replace(/[\-\:\.]/g, "_") + ".xls",
							fileext: ".xls",
							exclude_img: true,
							exclude_links: true,
							exclude_inputs: true,
							
    })

});



$('#sel_usr_in').on('change', function() {
  console.log( $(this).find(':selected').text());
  var searchText = $(this).find(':selected').text(); // The text to filter by
if(searchText == "Select Employee...")
{
  $("#leads_table  tr").show();
}
else{
  // Hide all rows
  $("#leads_table  tr").hide();
  var rows = $("#leads_table  tr").hide();
  // Filter and only show rows that contain the search text in the second column (cus_name)
  var filteredRows = rows.filter(function() {
    return $(this).find("td:eq(1)").text() === searchText;
  }).show();

  // Renumber the # column of the visible rows
  filteredRows.each(function(index) {
    $(this).find("td:eq(0)").text(index + 1); // Assuming the first column (0 index) is the serial number
  });
}

});

   });


   function get_refphone_autocomplete()
   {
     
        var ref_phone =  $('#ref_phone').val() + '%';
    var customer = [];
    var obj = {};
     $.ajax({
       url: "php/get_refphone_autocomplete.php",
       type: "get", //send it through get method
       data: {
        ref_phone:ref_phone,
        
     
     },
       success: function (response) {

     console.log(response)
     if (response.trim() != "0 result") {
       var obj = JSON.parse(response);
   
 
     
   
       obj.forEach(function (obj) {
 
          object = {
        
           label:  + obj.ref_cus_phone +" - "+obj.ref_cus_name,
          
           value : obj.ref_cus_phone
 
          
           
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


   
   function get_refname_autocomplete()
   {
     
        var ref_name =  $('#ref_name').val() + '%';
    var customer1 = [];
    var object1 = {};
     $.ajax({
       url: "php/get_refname_autocomplete.php",
       type: "get", //send it through get method
       data: {
        ref_name:ref_name,
        
     
     },
       success: function (response) {

     console.log(response)
     if (response.trim() != "0 result") {
       var obj = JSON.parse(response);
   
 
     
   
       obj.forEach(function (obj) {
 
          object1 = {
        
           label:   obj.ref_cus_name +" - "+obj.ref_cus_phone,
          
           value : obj.ref_cus_name
 
          
           
       };
        customer1.push(object1);
      
         console.log(customer1)
       });
      
     
     }
     
     else {
       customer1 = [];
        object1 = {
       
         value:"No data",
         cus_id : "",
         cus_addr : ""
          
     };
      customer1.push(object1);
     
    
     }
     
     
         
       },
       error: function (xhr) {
           //Do Something to handle error
 
           customer1 = [];
            object1 = {
       
             value:"No data",
             cus_id : "",
             cus_addr : ""
              
         };
          customer1.push(object1);
           
       }
     });
 
    
     console.log(customer1)
    
    
     return customer1;
    
   }


   function get_lead_source()
   {
 $.ajax({
  url: "php/get_lead_source.php",
  type: "get", //send it through get method
  data: {
  
   
 
 },
  success: function (response) {
 
 
 if (response.trim() != "error") {
   if (response.trim() != "0 result") {
  var obj = JSON.parse(response);
 
 
 
  obj.forEach(function (obj) {
      
    
     $("#lead_source").append(" <option value='" + obj.lead_source + "'>" + obj.lead_source + "</option>");
    
   
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
  


   function get_lead()
   {
     $.ajax({
       url: "php/lead_ref_report.php",
       type: "get", //send it through get method
       data: {
       
        date_query_start : date_query_start,
        date_query_end : date_query_end,
       ref_query : ref_query
      
      },
       success: function (response) {
console.log(response)
        $("#leads_table").empty();
      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
       var obj = JSON.parse(response);
      
      var count = 0;
      console.log(obj)
      obj.forEach(function (obj) {
        
// var com= obj.comments
// com = com.replace(/\n/g, '<br><br><i class="fa-solid fa-turn-down h4"></i>'+'( 10-02-2023)');
//         console.log(com)
      count = count + 1;

      $('#leads_table').append("<tr><td>"+count+"</td><td>"+obj.ref_cus_name+"</td><td>"+obj.ref_cus_phone+"</td><td>"+obj.lead_details+"</td><td>"+obj.total_ref+"</td></tr>")
        
       });
      
       
      
      }
      else{
        $("#leads_table") .append("<tr class = 'text-bg-danger'><td colspan='9' scope='col'>No Data</td></tr>");
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
   

  

 
  function get_customer_autocomplete()
  {
    
       var cusname =  $('#search_cus_text').val() + '%';
   var customer = [];
   var obj = {};
    $.ajax({
      url: "php/get_customer_autocomplete.php",
      type: "get", //send it through get method
      data: {
        cus_name:cusname,
       
    },
      success: function (response) {
  console.log("res - " + response)
    
    if (response.trim() != "0 result") {
      var obj = JSON.parse(response);
  

    
  
      obj.forEach(function (obj) {

         object = {
       
          label:obj.cus_name + " - " +  obj.cus_address,
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
       
        res = obj.response
       
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