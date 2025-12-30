

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
  firebase.initializeApp(firebaseConfig);
  var cus_id = '0';
  var current_user_id =  localStorage.getItem("ls_uid") ;
  console.log(current_user_id)
$(document).ready(function(){

 
  check_login();
  get_today_cstatus_sql();
 
 
   $("#unamed").text(localStorage.getItem("ls_uname"))


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



   });
   //
  
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
        //$("#create_cus_link").attr("href", "user_search.html?cus_id=" + cus_id);
         
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


   function check_login()
   {
    
    if (localStorage.getItem("logemail") == null) {
      window.location.replace("login.html");
  }
   }

  
   function get_today_cstatus_sql()
   {

  

$.ajax({
  url: "php/get_employee_cur_sts.php",
  type: "get", //send it through get method
  data: {
   
  emp_id : current_user_id
},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {
  var obj = JSON.parse(response);


var count =0 
  obj.forEach(function (obj) {
  
   count  = count + 1;
   if(obj.status == 'present')
 $("#user_status_table").append(" <tr class = 'text-bg-primary' > <td>" + count + "</td> <td>" + obj.emp_name + "</td> <td>" + obj.emp_phone + "</td> <td>" + obj.status + "</td> <td> <a target='_blank' href='work_summary_report.html?emp_id=" + obj.emp_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td><td> <a target='_blank' href='map_ref1.html?phone_id=" + obj.emp_phone_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td></tr>")
else if(obj.status == 'logout')
$("#user_status_table").append(" <tr class = 'text-bg-warning' > <td>" + count + "</td> <td>" + obj.emp_name + "</td> <td>" + obj.emp_phone + "</td> <td>" + obj.status + "</td> <td> <a target='_blank' href='work_summary_report.html?emp_id=" + obj.emp_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td><td> <a target='_blank' href='map_ref1.html?phone_id=" + obj.emp_phone_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td></tr>")
else
$("#user_status_table").append(" <tr > <td>" + count + "</td> <td>" + obj.emp_name + "</td> <td>" + obj.emp_phone + "</td> <td>" + obj.status + "</td> <td> <a target='_blank' href='work_summary_report.html?emp_id=" + obj.emp_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td><td> <a target='_blank' href='map_ref1.html?phone_id=" + obj.emp_phone_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td></tr>")


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


   
   function n(user,id,cun)
   {
    cun =cun+1;
    console.log(id);
       var table = document.getElementById('att_table');
       var date_milli = new Date().getTime();
         
      var row_count=0
              
      var nowDate = new Date(); 
      var date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate(); 
   
           var start_date =date.toString() + " 00:00:00";
          
           var start_date_milli = new Date(start_date).getTime();
      
           var status=""
           var today_start = start_date_milli;
           var today_end = start_date_milli + (86400000);
          
           var Ref = firebase.database().ref("attendance/" + id);
           Ref.orderByChild("login").startAt(today_start).endAt(today_end - 1).on("value", function (dat) {
             
   
            
               if (dat.val()==null)
               {
                   status = "Absent"
                  
               }
               dat.forEach(function (dat) {
                 
                   if (dat.val().logout == 0) {
                       status = "Live"
                      
                   }
                   else {
                       status = "Signed Out"
                      
                   }
                   console.log(status);
   
               });
              // $('#expenses').html( '₹ ' + billamount)
             
               table.rows[cun].cells[3].innerHTML = status
   
               if  (status=="Live")
               {
                table.rows[cun].cells[4].style.backgroundColor="#44db1a";
                  table.rows[cun].cells[3].style.backgroundColor="#44db1a";
                   table.rows[cun].cells[2].style.backgroundColor="#44db1a";
                   table.rows[cun].cells[1].style.backgroundColor="#44db1a";
                   table.rows[cun].cells[0].style.backgroundColor="#44db1a";
               }
               else if(status=="Signed Out")
               {
                   table.rows[cun].cells[2].style.backgroundColor="#f7e302";
                   table.rows[cun].cells[1].style.backgroundColor="#f7e302";
                   table.rows[cun].cells[0].style.backgroundColor="#f7e302";
                   table.rows[cun].cells[3].style.backgroundColor="#f7e302";
                   table.rows[cun].cells[4].style.backgroundColor="#f7e302";
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