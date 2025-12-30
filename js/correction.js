

  var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');




var cus_id = '0';
var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 




$(document).ready(function(){
   
get_all_correction();
 check_login();
 
   $("#unamed").text(localStorage.getItem("ls_uname"))
  // $("#tlead_att_on").text(localStorage.getItem("ls_uname"))

  $("#search_pro_txt").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#cus_table tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  $("#cus_table").on("click","tr td button", function(event) {
// update_policy()
// console.log($(this).closest("tr").find("td").eq(4).html().trim());
$(this).closest('tr').removeClass("text-bg-warning");
$(this).closest('tr').addClass("text-bg-success");
update_policy($(this).val(),$(this).closest("tr").find("td").eq(4).html().trim())

  });


  $("#cus_table").on("click","tr td a", function(event) {
   
( $(this).closest('tr').addClass("text-bg-warning"));

 

        });
 

   });


   function update_policy(policy_id,policy_holder_name)
   {
    $.ajax({
      url: "php/update_correction.php",
      type: "get", //send it through get method
      data: {
        policy_id: policy_id,
        policy_holder_name : policy_holder_name
     },
      success: function (response) {
     console.log(response);
     
     if (response.trim() != "error") {

       if (response.trim() == "ok") {
      
     
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


   function delete_customer(customer_id)
   {
      
       $.ajax({
           url: "php/delete_customer.php",
           type: "get", //send it through get method
           data: {
            cus_id: customer_id
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




   function get_all_correction()
   {

  

$.ajax({
  url: "php/get_all_correction.php",
  type: "get", //send it through get method
  data: {
   
  
},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {
  if (response.trim() != "0 result") {
  var obj = JSON.parse(response);


var count =0 
  obj.forEach(function (obj) {
    var  attach=""
    if(obj.attachment != "")
    {
     
     var pn = obj.policy_no.replace(/\//g, '%23@%23')
     attach = "<div><a target = '_blank' href='attachment/policy/"+ obj.cus_id + "/" +  pn+      ".pdf' class='link-primary'><i class='fa-solid fa-file-pdf h6'></i></a></div>"
   
    }


    var tax = parseFloat(obj.tax_rate)/100
  tax = parseFloat(tax);
  tax = 1 + tax;
   count  = count + 1;

    $("#cus_table").append(" <tr> <td>"+ count + "</td> <td>"+ obj.policy_id + "</td> <td>"+ obj.policy_no + "</td> <td>"+ obj.cus_name + "</td><td contenteditable>"+ obj.policy_holder_name + "</td> <td>"+ obj.cus_phone + "</td> <td>"+attach+"</td><td><a target='_self' href='user_call.html?cus_id="+ obj.cus_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td><td>"+"<button value='"+obj.policy_id + "' type='button' class='btn text-danger' > <i class='fa-solid fa-floppy-disk'></i></button>"+"</td> </tr>")

    
  });
$("#total_list").html(count);
 
}
else{
  $("#cus_table") .append("<tr><td colspan='8' class='text-bg-danger' scope='col'>No Data</td></tr>");
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