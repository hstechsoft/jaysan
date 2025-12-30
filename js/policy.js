
  // Initialize Firebase
  
  var cus_id = '0';
  var query = "";
$(document).ready(function(){

  
 
  check_login();

 
 
   $("#unamed").text(localStorage.getItem("ls_uname"))

   
   $("#search_phone").focusout(function(){
    if($("#search_phone").val() != "")
    {
        $("#search_cus_name").val("")
        $("#search_policy_no").val("")
        $("#search_name").val("")
        $("#search_vno").val("")

    }
     });

     $("#search_cus_name").focusout(function(){
        if($("#search_cus_name").val() != "")
        {
            $("#search_phone").val("")
            $("#search_policy_no").val("")
            $("#search_name").val("")
            $("#search_vno").val("")
    
        }
         });
  
         $("#search_policy_no").focusout(function(){
            if($("#search_policy_no").val() != "")
            {
                $("#search_phone").val("")
                $("#search_cus_name").val("")
                $("#search_name").val("")
                $("#search_vno").val("")
                query =  "SELECT customer.cus_id,customer.cus_name,customer.cus_phone,customer.cus_address FROM policy inner join customer on policy.cus_id = customer.cus_id  WHERE policy_no = '"+$("#search_policy_no").val()+ "'"
            }
             });


             $("#search_name").focusout(function(){
                if($("#search_name").val() != "")
                {
                    $("#search_phone").val("")
                    $("#search_cus_name").val("")
                    $("#search_policy_no").val("")
                    $("#search_vno").val("")
            
                   query =  "SELECT customer.cus_id,customer.cus_name,customer.cus_phone,customer.cus_address FROM policy inner join customer on policy.cus_id = customer.cus_id  WHERE policy_holder_name = '"+$("#search_name").val()+ "'"
                }
                 });

                 $("#search_vno").focusout(function(){
                    if($("#search_vno").val() != "")
                    {
                        $("#search_phone").val("")
                        $("#search_cus_name").val("")
                        $("#search_policy_no").val("")
                        $("#search_name").val("")
                        query =  "SELECT customer.cus_id,customer.cus_name,customer.cus_phone,customer.cus_address FROM policy inner join customer on policy.cus_id = customer.cus_id WHERE vehicle_no = '"+$("#search_vno").val()+ "'"
                    }
                     });


                     $('#search_cus_name').on('input',function(){
                        //check the value not empty
                            if($('#search_cus_name').val() !="")
                            {
                              $('#search_cus_name').autocomplete({
                                //get data from databse return as array of object which contain label,value
                                source: get_customer_autocomplete(),
                                minLength: 2,
                                cacheLength: 0,
                                select: function(event, ui) {
                                 
                                cus_id = ui.item.cus_id;
                                var url = "user_call.html?cus_id=" + cus_id;
                                window.open(url,"_self");
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



                           $('#search_phone').on('input',function(){
                            //check the value not empty
                                if($('#search_phone').val() !="")
                                {
                                  $('#search_phone').autocomplete({
                                    //get data from databse return as array of object which contain label,value
                                    source: get_phone_autocomplete(),
                                    minLength: 2,
                                    cacheLength: 0,
                                    select: function(event, ui) {
                                     
                                    cus_id = ui.item.cus_id;
                      
                                    var url = "user_call.html?cus_id=" + cus_id;
                                      window.open(url,"_self");
                                  
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


                               $('#search_policy_no').on('input',function(){
                                //check the value not empty
                                    if($('#search_policy_no').val() !="")
                                    {
                                      $('#search_policy_no').autocomplete({
                                        //get data from databse return as array of object which contain label,value
                                        source: get_policy_no_autocomplete(),
                                        minLength: 2,
                                        cacheLength: 0,
                                        
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

                                   $('#search_name').on('input',function(){
                                    //check the value not empty
                                        if($('#search_name').val() !="")
                                        {
                                          $('#search_name').autocomplete({
                                            //get data from databse return as array of object which contain label,value
                                            source: get_name_autocomplete(),
                                            minLength: 2,
                                            cacheLength: 0,
                                            
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


                                       $('#search_vno').on('input',function(){
                                        //check the value not empty
                                            if($('#search_vno').val() !="")
                                            {
                                              $('#search_vno').autocomplete({
                                                //get data from databse return as array of object which contain label,value
                                                source: get_vno_autocomplete(),
                                                minLength: 2,
                                                cacheLength: 0,
                                                
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


                                           $("#search_btn").click(function()
{
 get_search_result()
});
                      

   });
   //
 
   function get_customer_autocomplete()
   {
     
        var cusname =   '%' + $('#search_cus_name').val() + '%';
    var customer = [];
    var obj = {};
     $.ajax({
       url: "php/get_customer_autocomplete.php",
       type: "get", //send it through get method
       data: {
         cus_name:cusname,
        
     
     },
       success: function (response) {

     console.log(response)
     if (response.trim() != "0 result") {
       var obj = JSON.parse(response);

       obj.forEach(function (obj) {
 
          object = {
        
           label:obj.cus_name + " - " +  obj.cus_phone,
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



   function get_phone_autocomplete()
   {
     
        var cus_phone =  $('#search_phone').val() + '%';
    var customer = [];
    var obj = {};
     $.ajax({
       url: "php/get_phone_autocomplete.php",
       type: "get", //send it through get method
       data: {
        cus_phone:cus_phone,
        
     
     },
       success: function (response) {

     console.log(response)
     if (response.trim() != "0 result") {
       var obj = JSON.parse(response);
   
 
     
   
       obj.forEach(function (obj) {
 
          object = {
        
           label: +  obj.cus_phone +" - "+obj.cus_name,
           cus_id : obj.cus_id,
           cus_addr : obj.cus_address,
           value : obj.cus_phone
 
          
           
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


   function get_policy_no_autocomplete()
   {
     
        var cusname =   '%' + $('#search_policy_no').val() + '%';
    var customer = [];
    var obj = {};
     $.ajax({
       url: "php/get_policy_no_autocomplete.php",
       type: "get", //send it through get method
       data: {
         cus_name:cusname,
        
     
     },
       success: function (response) {

     console.log(response)
     if (response.trim() != "0 result") {
       var obj = JSON.parse(response);

       obj.forEach(function (obj) {
 
          object = {
        
           label:obj.policy_no ,
         
           value : obj.policy_no
 
          
           
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


   function get_name_autocomplete()
   {
     
        var cusname =   '%' + $('#search_name').val() + '%';
    var customer = [];
    var obj = {};
     $.ajax({
       url: "php/get_name_autocomplete.php",
       type: "get", //send it through get method
       data: {
         cus_name:cusname,
        
     
     },
       success: function (response) {

     console.log(response)
     if (response.trim() != "0 result") {
       var obj = JSON.parse(response);

       obj.forEach(function (obj) {
 
          object = {
        
           label:obj.policy_holder_name ,
         
           value : obj.policy_holder_name
 
          
           
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




   function get_vno_autocomplete()
   {
     
        var cusname =   '%' + $('#search_vno').val() + '%';
    var customer = [];
    var obj = {};
     $.ajax({
       url: "php/get_vno_autocomplete.php",
       type: "get", //send it through get method
       data: {
         cus_name:cusname,
        
     
     },
       success: function (response) {

     console.log(response)
     if (response.trim() != "0 result") {
       var obj = JSON.parse(response);

       obj.forEach(function (obj) {
 
          object = {
        
           label:obj.vehicle_no ,
         
           value : obj.vehicle_no
 
          
           
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
   

   function check_login()
   {
    
    if (localStorage.getItem("logemail") == null) {
      window.location.replace("login.html");
  }
   }

  
   function get_search_result()
   {

  

$.ajax({
  url: "php/policy_search_report.php",
  type: "get", //send it through get method
  data: {
   query : query
  
},
  success: function (response) {
console.log(response)
$("#search_table").empty()
if (response.trim() != "error") {
    if (response.trim() != "0 result") {
  var obj = JSON.parse(response);


var count =0 
  obj.forEach(function (obj) {
  
   count  = count + 1;
  

    $("#search_table").append(" <tr> <td>"+ count + "</td> <td>"+ obj.cus_name + "</td><td>"+ obj.cus_phone + "</td>  <td>" +obj.cus_address+ "</td><td><a target='_self' href='user_call.html?cus_id="+ obj.cus_id  +   "' class='btn btn-primary btn-sm' role='button'>View</a></td></tr>")


  });

 
}
else{
    $("#search_table").append(" <tr><td colspan='4' scope='col' class='text-bg-danger h6'>Sorry no data!</td></tr>")
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