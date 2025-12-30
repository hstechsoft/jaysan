

var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');


var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ;  
var mtid = 0;

$("#unamed").text(localStorage.getItem("ls_uname"))

let autocompleteTimer;



$(document).ready(function(){
  
get_jaysan_final_product_all();
 check_login();
 $('#sub_type_table').on('click', 'button', function() {
    var msid = $(this).val();
    {
        swal({
          title: "Are you sure - Remove? ",
          text: "You will not  recover this  again!",
          icon: "warning",
          buttons: [
            'No, cancel it!',
            'Yes, I am sure!'
          ],
          dangerMode: true,
        }).then(function(isConfirm) {
          if (isConfirm) {
        
  delete_jaysan_model_subtype(msid);
       
        
        
        
          }
       
        })
      }
  
 });


 $("#product_name").on("input",function(e){
   
    if($("#product_name").val() !="")
        {
        $("#product_name").autocomplete({
        
            source: function(request, response) {
                get_product_autocomplete(request, response, "pname");
            },
            open: function () {
              // Start timer when autocomplete suggestions are shown
              autocompleteTimer = setTimeout(function () {
                  $("#product_name").autocomplete("close"); // Close autocomplete after 3 seconds of inactivity
              }, 3000);
          },
          close: function () {
              clearTimeout(autocompleteTimer); // Clear timer when autocomplete closes
          },
        minLength: 2,
        cacheLength: 0,
        
        select: function(event, ui) {
        
        
        } ,
        //display no result 
        
        }).focus();
        }
    


//  get_product_autocomplete("null", function(data) {
//  console.log(data); // Now this logs the actual data after AJAX completes
//  });
});

$("#product_model").on("input",function(e){

if($("#product_model").val() !="")
    {
    $("#product_model").autocomplete({
    
        source: function(request, response) {
            get_product_autocomplete(request, response, "pmodel");
        },
        open: function () {
          // Start timer when autocomplete suggestions are shown
          autocompleteTimer = setTimeout(function () {
              $("#product_model").autocomplete("close"); // Close autocomplete after 3 seconds of inactivity
          }, 3000);
      },
      close: function () {
          clearTimeout(autocompleteTimer); // Clear timer when autocomplete closes
      },
    minLength: 2,
    cacheLength: 0,
  
    select: function(event, ui) {
    
    
    } ,
    //display no result 
    
    });
    }



//  get_product_autocomplete("null", function(data) {
//  console.log(data); // Now this logs the actual data after AJAX completes
//  });
});


$("#product_type").on("input",function(e){

    if($("#product_type").val() !="")
        {
        $("#product_type").autocomplete({
        
            source: function(request, response) {
                get_product_autocomplete(request, response, "ptype");
            },
            open: function () {
              // Start timer when autocomplete suggestions are shown
              autocompleteTimer = setTimeout(function () {
                  $("#product_type").autocomplete("close"); // Close autocomplete after 3 seconds of inactivity
              }, 1500);
          },
          close: function () {
              clearTimeout(autocompleteTimer); // Clear timer when autocomplete closes
          },
        minLength: 2,
        cacheLength: 0,
      
        select: function(event, ui) {
        
        
        } ,
        //display no result 
        
        });
        }
    
    
    
    //  get_product_autocomplete("null", function(data) {
    //  console.log(data); // Now this logs the actual data after AJAX completes
    //  });
    });




 
$('#submit_product_btn').on('click', function()
{
  if($("#add_new_product_form")[0].checkValidity())
{
insert_jaysan_final_product()
}

});
  
$('#add_sub_type_btn').on('click', function()
{
    if($("#product_sub_type").val() != "")
    {
    insert_jaysan_model_subtype();
    }
    else
    {
        shw_toast("Error","Please enter sub type","error")
    }

});


$('#final_product_table').on('click', 'button', function() {
    console.log( $(this).attr("name"));
    mtid = $(this).val();
    if($(this).attr("name") == "edit")
    {
     
     get_jaysan_model_subtype();
     get_jaysan_product_details()
     $('#sub_type_div').removeClass("d-none");

     $("#add_new_product_form :input").prop("disabled", true);
    }
    if($(this).attr("name") == "delete")
        {
            {
                swal({
                  title: "Are you sure - Remove? ",
                  text: "You will not  recover this  again!",
                  icon: "warning",
                  buttons: [
                    'No, cancel it!',
                    'Yes, I am sure!'
                  ],
                  dangerMode: true,
                }).then(function(isConfirm) {
                  if (isConfirm) {
                
        delete_jaysan_model_type();
               
                
                
                
                  }
               
                })
              }
        }
});
   });


   function get_jaysan_product_details()
   {
    
   
   $.ajax({
     url: "php/get_jaysan_product_details.php",
     type: "get", //send it through get method
     data: {
     mtid : mtid

     },
     success: function (response) {
   console.log(response);
   

   
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
 
   
   
     obj.forEach(function (obj) {
       
  $('#product_name').val(obj.product)
  $('#product_model').val(obj.model_name)
  $('#product_type').val(obj.type_name)


     });
   
    
   }
   
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }
   
   function get_jaysan_final_product_all()
   {
    
   
   $.ajax({
     url: "php/get_jaysan_final_product_all.php",
     type: "get", //send it through get method
     data: {


     },
     success: function (response) {
   console.log(response);
   
   $('#final_product_table').empty()
   
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
   
   
     obj.forEach(function (obj) {
        count = count +1;
    
        $('#final_product_table').append(   "<tr> <td colspan='3' scope='col' class='bg-secondary bg-opacity-25'>"+obj.product_name+"</td> </tr>"+"<tr>"+obj.model+"</tr>")
     });
   
    
   }
   else{
    $('#sub_type_table').append("<tr><td class = 'text-bg-secondary' colspan='3' scope='col'>No Data</td></tr>");
 
   }
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }


   function delete_jaysan_model_type()
   {
       $.ajax({
           url: "php/delete_model_type.php",
           type: "get", //send it through get method
           data: {
           mtid : mtid
      
           },
           success: function (response) {
         
           console.log(response);
           
         
         {
      
          if (response.trim() == "ok")
          {
        location.reload();
         }
           else{
               shw_toast("Error","Error in deleting","error")
        }
       }
         
        
         
         
             
           },
           error: function (xhr) {
               //Do Something to handle error
           }
         });
   }

   function delete_jaysan_model_subtype(msid)
    {
        $.ajax({
            url: "php/delete_model_subtype.php",
            type: "get", //send it through get method
            data: {
            msid : msid
       
            },
            success: function (response) {
          
            console.log(response);
            
          
          {
       
           if (response.trim() == "ok")
           {
            get_jaysan_model_subtype()
            shw_toast("Success","Sub type deleted","success")
      
          
           
          }
            else{
                shw_toast("Error","Error in deleting","error")
         }
        }
          
         
          
          
              
            },
            error: function (xhr) {
                //Do Something to handle error
            }
          });
    }


   function get_jaysan_model_subtype()
   {
    
   
   $.ajax({
     url: "php/get_jaysan_model_subtype.php",
     type: "get", //send it through get method
     data: {
     mtid : mtid

     },
     success: function (response) {
   console.log(response);
   
        $('#sub_type_table').empty()
   
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
   
   
     obj.forEach(function (obj) {
        count = count +1;
$('#sub_type_table').append("<tr><td>"+count+"</td><td>"+obj.subtype_name+"</td><td> <button class='btn btn-sm btn-outline-danger border-0' value='"+obj.msid+"' ><i class='fa fa-trash' aria-hidden='true'></i></button></td></tr>")

     });
   
    
   }
   else{
    $('#sub_type_table').append("<tr><td class = 'text-bg-secondary' colspan='3' scope='col'>No Data</td></tr>");
 
   }
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }


   function insert_jaysan_model_subtype()
   {
    
   
   $.ajax({
     url: "php/insert_jaysan_model_subtype.php",
     type: "get", //send it through get method
     data: {
     mtid : mtid,
subtype_name :  $('#product_sub_type').val()

     },
     success: function (response) {
   
   
   if (response.trim() == "ok") {

    get_jaysan_model_subtype()
    $('#product_sub_type').val("")
    $('#product_sub_type').focus()
    shw_toast("Success","Sub type added","success")
   
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }





   function insert_jaysan_final_product()
{
 

$.ajax({
  url: "php/insert_jaysan_final_product.php",
  type: "get", //send it through get method
  data: {
  product_name :  $('#product_name').val(),
product_model :  $('#product_model').val(),
product_type :  $('#product_type').val()

  },
  success: function (response) {


console.log(response);

if( response.trim() > 0)
 {
//   $('#product_name').val("")
//   $('#product_model').val("")
//   $('#product_type').val("")

mtid = response.trim();

shw_toast("Success","Product Added kindly add sub type","success")


$('#sub_type_div').removeClass("d-none");

$("#add_new_product_form :input").prop("disabled", true);



}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}


   function get_product_autocomplete(request, response,term)
{

    

var product = [];

$.ajax({
url: "php/get_jaysan_product_autocomplete.php",
type: "get", //send it through get method
data: {
product: "%" + request.term + "%",
term : term

},
success: function (data) {
console.log(data);


if (data.trim() != "0 result") {
var obj = JSON.parse(data);




obj.forEach(function (obj) {
product.push({
label: obj.product_name,
value: obj.product_name,

});


});

response(product);
}

// else {
//     product.push({
//         label: "No data",
//         value: "No data",
//         product_id : 0
//         });
//         console.log(product);
        
//         response(product);
// }



},
error: function (xhr) {
//Do Something to handle error

// product.push({
// label: "No data",
// value: "No data",
// product_id : 0
// });
// response(product);
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
      

      console.log(response);
      
      
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


  


  //  get today 

   

   


   
  function shw_toast(title,des,theme)
   {
   
     
         $('.toast-title').text(title);
         $('.toast-description').text(des);
   var toast = new bootstrap.Toast($('#myToast'));
   toast.show();
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