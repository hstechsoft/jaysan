

var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');

var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ;  


$(document).ready(function(){
 
  check_login();

  $('#assm_modal').modal('show'); 
   });

   



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
     console.log(response)
     
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