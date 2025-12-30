
var dname = localStorage.getItem("dname")
var did = localStorage.getItem("did")

var object
// console.log(role)

$(document).ready(function(){
    $("#role_name_txt").text(dname)
  
check_login()
get_today_review()
$('#dealer_name').val(dname)
// $('#dealer_name').on('input',function(e){

//   if($('#dealer_name').val() !="")
//   {
//     $('#dealer_name').autocomplete({
      
//       source: get_dealer_autocomplete(),
//       minLength: 2,
//       cacheLength: 0,
//       select: function(event, ui) {
       
     
//       } ,
//       //display no result 
//       response: function(event, ui) {
       
//     }
//     });
//   }
 
//  });


 $('#service_person_name').on('input',function(e){

  if($('#service_person_name').val() !="")
  {
    $('#service_person_name').autocomplete({
      
      source: get_employee_autocomplete(),
      minLength: 2,
      cacheLength: 0,
      select: function(event, ui) {
       
     
      } ,
      //display no result 
      response: function(event, ui) {
     
    }
    });
  }
 
 });

 
 $('#cus_place').on('input',function(e){

  if($('#cus_place').val() !="")
  {
    $('#cus_place').autocomplete({
      
      source: get_cus_place_autocomplete(),
      minLength: 2,
      cacheLength: 0,
      select: function(event, ui) {
       
     
      } ,
      //display no result 
      response: function(event, ui) {
     
    }
    });
  }
 
 });

 
 $("#rating_service").bind('rated', function (event, value) { 

      
  $("#service_rno").text(value)
});



$("#rating_dealer").bind('rated', function (event, value) { 

 
   $("#dealer_rno").text(value)
});



$('#pname_txt').on('input',function(e){

  if($('#pname_txt').val() !="")
  {
    $('#pname_txt').autocomplete({
      
      source: get_product_autocomplete(),
      minLength: 2,
      cacheLength: 0,
      select: function(event, ui) {
       
      cus_id = ui.item.cus_id;
    
      } ,
      //display no result 
   
    });
  }
 
 });

 $("#review_form").submit(function(){
  $('#review_submit_btn').prop("disabled",true)
});


$("#review_submit_btn").on("click", function()
{
 

if($('#review_form')[0].checkValidity())
{
 
insert_review_sql()
}

else
{
salert("Mandatory","kindly fill mandatory Fields","warning")
return
}


});
  
$('#topbar_logout_btn').on('click', function()
{
  


  swal({
    title: "Are you sure? ",
    text: "You will logout",
    icon: "warning",
    buttons: [
      'No, cancel it!',
      'Yes, I am sure!'
    ],
    dangerMode: true,
  }).then(function(isConfirm) {
    if (isConfirm) {
      localStorage.clear();
      location.reload()
    } else {
      swal("Cancelled", "", "error");
    }
  })
});

   });
   //
   function get_today_review()
   {
    
   
   $.ajax({
     url: "php/get_today_review.php",
     type: "get", //send it through get method
     data: {
     did : did

     },
     success: function (response) {
   
   console.log(response);
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
   
   
     obj.forEach(function (obj) {
        count = count +1;
$('#service_table').append("<tr><td>"+count+"</td><td>"+obj.cus_name+"</td><td>"+obj.service_person_name+"</td><td>"+obj.chasis_no+"</td><td>"+obj.ddate+"</td></tr>")

     });
   
    
   }
   else{
    $("#service_table") .append("<td colspan='5' scope='col'>No Data</td>");
 
   }
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }
   //
  
//    function get_dealer_autocomplete()
//    {
     
//         var dealer_name =  $('#dealer_name').val() + '%';
//         var customer = [];
//      $.ajax({
//        url: "php/get_dealer_autocomplete.php",
//        type: "get", //send it through get method
//        data: {
//          dealer_name:dealer_name,
        
     
//      },
//        success: function (response) {
   
//      console.log(response)
//      if (response.trim() != "0 result") {
//        var obj = JSON.parse(response);
   
   
     
   
//        obj.forEach(function (obj) {
   
//           object = {
        
//            label:obj.dealer_name ,
        
          
//            value : obj.dealer_name
   
          
           
//        };
        
//        customer.push(object);
         
//        });
      
     
//      }
     
    
     
     
         
//        },
//        error: function (xhr) {
          
           
//        }
//      });
   
//      return customer;
     
    
//    }
   
   
   
   function get_employee_autocomplete()
   {
     
        var service_person_name =  $('#service_person_name').val() + '%';
        var customer = [];
     $.ajax({
       url: "php/get_employee_autocomplete.php",
       type: "get", //send it through get method
       data: {
         service_person_name:service_person_name,
        
     
     },
       success: function (response) {
   
     console.log(response)
     if (response.trim() != "0 result") {
       var obj = JSON.parse(response);
   
   
     
   
       obj.forEach(function (obj) {
   
          object = {
        
           label:obj.service_person_name ,
        
          
           value : obj.service_person_name
   
          
           
       };
        
       customer.push(object);
         
       });
      
     
     }
     
    
     
     
         
       },
       error: function (xhr) {
          
           
       }
     });
   
     return customer;
     
    
   }
   
   function get_cus_place_autocomplete()
   {
     
        var cus_place =  $('#cus_place').val() + '%';
        var customer = [];
     $.ajax({
       url: "php/get_place_autocomplete.php",
       type: "get", //send it through get method
       data: {
         cus_place:cus_place,
        
     
     },
       success: function (response) {
   
     console.log(response)
     if (response.trim() != "0 result") {
       var obj = JSON.parse(response);
   
   
     
   
       obj.forEach(function (obj) {
   
          object = {
        
           label:obj.cus_place ,
        
          
           value : obj.cus_place
   
          
           
       };
        
       customer.push(object);
         
       });
      
     
     }
     
    
     
     
         
       },
       error: function (xhr) {
          
           
       }
     });
   
     return customer;
     
    
   }
   
   
    
    
     
   
   
   
      function insert_review_sql()
      {
       console.log( $('#rating_service').rateit('value'))
      $.ajax({
        url: "php/insert_review.php",
        type: "get", //send it through get method
        data: {
           cus_name :  $('#cus_name').val(),
           cus_phone :  $('#cus_phone').val(),
           cus_place :  $('#cus_place').val(),
           cus_addr :  $('#cus_addr').val(),
           chasis_no :  $('#chasis_no').val(),
           implement :  $('#implement').val(),
           dealer_name :  $('#dealer_name').val(),
           service_person_name :  $('#service_person_name').val(),
           rating_service :  $('#rating_service').rateit('value'),
           rating_dealer	 :  $('#rating_dealer	').rateit('value'),
           did : did
           
         
      },
        success: function (response) {
      console.log(response.trim())
     
      
      // salert("Result",response.trim(),"success")
    
      {
        swal({
          title: "success",
          text: response.trim(),
          icon: "success",
          buttons: {
            confirm: {
              text: "OK",
              value: true,
              visible: true,
              className: "",
              closeModal: true
            }
          },
          dangerMode: true,
        }).then(function(isConfirm) {
          if (isConfirm) {
            location.reload()
          } 
        })
        }
      
      
          
        },
        error: function (xhr) {
            //Do Something to handle error
        }
      });
      }
   
   
     
      function get_product_autocomplete()
      {
        
           var product =  $('#pname_txt').val() + '%';
       var customer = [];
       var obj = {};
        $.ajax({
          url: "php/get_product_autocomplete.php",
          type: "get", //send it through get method
          data: {
           product:product,
           
        
        },
          success: function (response) {
    
        
        if (response.trim() != "0 result") {
          var obj = JSON.parse(response);
      
    
        
      
          obj.forEach(function (obj) {
    
             object = {
           
              label:obj.pname ,
             
              value : obj.pname
    
             
              
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




  
   function check_login()
   {
    
    if (localStorage.getItem("dname") == null) {
      window.location.replace("dealer_login.html");
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