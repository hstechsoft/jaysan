
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


$(document).ready(function(){
 

 check_login();
 get_lead();


 
   $("#unamed").text(localStorage.getItem("ls_uname"))
  // $("#tlead_att_on").text(localStorage.getItem("ls_uname"))

 
//   $("#leads_table").on("click","tr td a", function(event) {
//     //get button value
    
//         });


$("#leads_table").on("click","tr td a", function(event) {
   
  //$('#pwork_modal').modal('show'); 
  $(this)
  event.stopPropagation();
  event.preventDefault()
  event.p
 var lis_id =  create_listner()
 var href = $(this).attr("href")
 var lead_id =  $(this).attr("value")

href = href + "&type=lead" +  "&lis_id="+ lis_id
console.log(href)
  $('#task_iframe').attr('src',href)
  $('#task_modal').modal('show'); 

  const interval = window.setInterval(function () {
    var lis_work_id = check_listner(lis_id)
    if(lis_work_id != "")
    {
      $('#task_modal').modal('hide'); 
      console.log()
       update_lead(lead_id,lis_work_id,'assign');
      clearInterval(interval);
    }

  }, 2000);

});

  
$("#leads_table").on("click","tr td button", function(event) {
  //get button value
  var po_id = $(this).val()
console.log( $(this).val())

{
swal({
  title: "Are you sure - invalid? ",
  text: "You will not be recover this lead again!",
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
      
update_lead(po_id,0,'invalid') // <--- submit form programmatically
      
     
    });
  } else {
    swal("Cancelled", "lead is safe :)", "error");
  }
})
}

      });




   });

   function delete_lead(lead_id)
   {
      
       $.ajax({
           url: "php/delete_lead_web.php",
           type: "get", //send it through get method
           data: {
            lead_id: lead_id
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

  
   function update_lead(lead_id,work_id,status)
   {  


$.ajax({
  url: "php/update_lead_web.php",
  type: "get", //send it through get method
  data: {
    lead_id :  lead_id,
    work_id : work_id,
    status : status
    
   
  
}, 
  success: function (response) {
 location.reload()
   



    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }


   function get_lead()
   {
     $.ajax({
       url: "php/get_lead_web.php",
       type: "get", //send it through get method
       data: {
      
        
      
      },
       success: function (response) {

        $("#today_call_table_body").empty();
      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
       var obj = JSON.parse(response);
      
      var count = 0;
      console.log(obj)
      obj.forEach(function (obj) {
        

        
      count = count + 1;

      

      $('#leads_table').append("<tr><td>"+count+"</td><td  style='max-width: 100px;'>"+obj.sender_name+"</td><td  style='max-width: 100px;'>"+obj.sender_mobile+"</td><td  style='max-width: 200px;'>"+obj.subject+"</td><td  style='max-width: 100px;'>"+obj.sender_state+"</td><td  style='max-width: 100px;'>"+obj.generated_date+"</td><td  style='max-width: 100px;'>"+obj.lead_source+"</td></td>  <td>" + "<a target='_blank' value='"+obj.lead_id + "' href='create_customer.html?phone_no=" + obj.sender_mobile + "&phone_name=" + obj.sender_name + "&lead_source=" + obj.lead_source  + "&address=" + obj.sender_state + "' class='btn btn-primary btn-sm' role='button' value ="+obj.lead_id + ">Add</a>" + "</td><td>"+"<button value='"+obj.lead_id + "' type='button' class='btn text-danger' > <i class='fa-solid fa-trash-can'></i></button>"+"</td></tr>")
        
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