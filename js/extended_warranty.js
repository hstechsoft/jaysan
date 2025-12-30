
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
 get_extwarranty_request();

 $("#search_cus_btn").click(function()
 {
console.log(cus_id)
window.open('user_search.html?cus_id=' + cus_id, '_blank'); 
 });

 $('#search_cus_text').on('input',function(e){

  if($('#search_cus_text').val() !="")
  {
    $('#search_cus_text').autocomplete({
      
      source: get_customer_autocomplete(),
      minLength: 2,
      cacheLength: 0,
      select: function(event, ui) {
       
      cus_id = ui.item.cus_id;
    
      } ,
      //display no result 
      response: function(event, ui) {
        if (!ui.content.length) {
            var noResult = { value:"",label:"No results found" };
            ui.content.push(noResult);
        }
    }
    });
  }
 
 });
 
   $("#unamed").text(localStorage.getItem("ls_uname"))
  // $("#tlead_att_on").text(localStorage.getItem("ls_uname"))

 
//   $("#ext_warranty_table").on("click","tr td a", function(event) {
//     //get button value
    
//         });


$("#ext_warranty_table").on("click","tr td a", function(event) {
   
  //$('#pwork_modal').modal('show'); 
  $(this)
  event.stopPropagation();
  event.preventDefault()

 var lis_id =  create_listner()
 var href = $(this).attr("href")
 var ext_warranty_id =  $(this).attr("value")

href = href +  "&listner_id="+ lis_id + "&work_type=ext_warranty"+"&work_des=Extended Warranty requested"
console.log(ext_warranty_id)
  $('#task_iframe').attr('src',href)
  $('#task_modal').modal('show'); 

  const interval = window.setInterval(function () {
    var lis_work_id = check_listner(lis_id)
    if(lis_work_id != "")
    {
      $('#task_modal').modal('hide'); 
     
       update_ext_warranty(ext_warranty_id,lis_work_id);
      clearInterval(interval);
    }

  }, 2000);

});






   });

   
  
   function update_ext_warranty(ext_warranty_id,work_id)
   {  


$.ajax({
  url: "php/update_ext_warranty.php",
  type: "get", //send it through get method
  data: {
    ext_warranty_id :  ext_warranty_id,
    work_id : work_id
  
    
   
  
}, 
  success: function (response) {
  location.reload()
   



    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }


   function get_extwarranty_request()
   {
     $.ajax({
       url: "php/get_ext_warranty_request.php",
       type: "get", //send it through get method
       data: {
      
        
      
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
       
            attach = "<div><button onclick = location.href='"+ obj.dimage + "'; class='btn '><i class='fa-solid fa-photo-film'></i></button></div>"
        }


      count = count + 1;
      $('#ext_warranty_table').append("<tr><td>"+count+"</td><td style='min-width: 120px;'>"+obj.sdate+"</td><td style='min-width: 120px;'>"+obj.dname+"</td><td style='min-width: 120px;'>"+obj.cus_name+"</td><td style='min-width: 120px;'>"+obj.cus_phone+"</td><td style='min-width: 150px;'>"+obj.cus_addr+"</td><td style='min-width: 120px;'>"+obj.chasis_no+"</td><td>"+obj.implement+"</td><td style='min-width: 120px;'>"+obj.model+"</td><td>"+attach+"</td></td>  <td>" + "<a target='_blank' value='"+obj.deid + "' href='create_work.html?work_cus_id=" + obj.cus_id + "' class='btn btn-primary btn-sm' role='button' value ="+obj.deid + ">Add</a>" + "</td></tr>")
        
       });
      
       
      
      }
      else{
        $("#ext_warranty_table") .append("<tr class = 'text-bg-danger'><td colspan='15' scope='col'>No Data</td></tr>");
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