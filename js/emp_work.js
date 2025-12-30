

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
  var emp_id_array = [];

  var cus_id = '0';
  var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ;  
var breakStartTime ;
var total_notify_no = 0 
var emp_work_id = ""
var bid = 0;
  console.log(current_user_id)
 
 // Convert break start time to a Date object using 'DD-MM-YYYY hh:mm a' format
   

$(document).ready(function(){

 
   check_login();

   $('#qty').on('input', function() {
    if ($(this).val() < 0) {
        $(this).val(0);
    }
});
   $("#unamed").text(localStorage.getItem("ls_uname"))
   $('#sub_fi').hide()
   $('#work_break_btn').hide()
   $('#work_hold_btn').hide()
   $('#work_start_btn').on('click', function()
   {
    
    if( $('#process_name').data('selected-process_id') )
    {
       
    insert_emp_work();
    }

else
shw_toast("Insert","Kindly insert process or select part from autocomplete")
   });

   
   $('#emp_name').on('input',function(){
    //check the value not empty
        if($('#emp_name').val() !="")
        {
          $('#emp_name').autocomplete({
            //get data from databse return as array of object which contain label,value
            source: get_employee_autocomplete(),
            minLength: 2,
            cacheLength: 0,
            select: function(event, ui) {
             
              insert_helper_work(ui.item.sel_emp_id)
          
          $('#emp_name').val(''); // Clear the textbox after selection
          return false; // 
          
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


    $('#work_break_btn').on('click', function() {
      
        // startTimer(); // Start the timer

insert_break("break")
    });

    $('#work_hold_btn').on('click', function() {
      
      // startTimer(); // Start the timer

    
        {
          swal({
            title: "Are you sure - Hold? ",
            text: "You will   recover this  again!",
            icon: "warning",
            buttons: [
              'No, cancel it!',
              'Yes, I am sure!'
            ],
            dangerMode: true,
          }).then(function(isConfirm) {
            if (isConfirm) {
              update_hold_work()
insert_break("hold")
         
          
          
          
            }
         
          })
        }
     

  });

    $('#end_break_btn').on('click', function() {
        // $('#break_mode_overlay').fadeOut(); // Hide break mode overlay
        // $('#work_entry_content, #work_start_btn').css('opacity', '1'); // Restore other elements
        // stopTimer(); // Stop the timer
        insert_break_end()
    });

    $('#work_submit_btn').on('click', function() {
      update_emp_work_finish()
    });

    $('#output_add_btn').on('click', function() {
      console.log();
      
      if($('#part_no_out').data("selected-part_id") != null && $('#qty').val()>0)
      
        {
          insert_output_work()
        }

        else
        shw_toast("Output","Add Atleast 1 Output")
    });


    $('#batch_no_btn').on('click', function() {
    $('#batch_no_table tr').each(function(index) {
      var row =  $(this).find("td")
      var qty =  row.eq(3).find('input[type="number"]').val()
      console.log( qty);
      if(qty > 0)
      {
     
      var batch = row.eq(1).html()
     
      if(batch == "No Batch")
        batch = ""
       
      var partid = $('#part_no').data("selected-part_id")
     
      insert_input_work(partid,batch,qty)
}
    });
  });
   $('#process_name').on('input',function(){
    //check the value not empty
        if($('#process_name').val() !="")
        {
          $('#process_name').autocomplete({
            //get data from databse return as array of object which contain label,value
         
            source: function(request, response) {
              $.ajax({
                url: "php/get_process_auto.php",
                type: "get", //send it through get method
                data: {
                
                  process : request.term
              
              },
              dataType: "json", 
                success: function (data) {
         
              console.log(data);
              response($.map(data, function(item) {
                return {
                    label: item.process_name ,
                    value: item.process_name,
                    
                    process_id: item.process_id
                };
            }));
                  
                }
            
              });
            },
            minLength: 2,
            cacheLength: 0,
            select: function(event, ui) {
             
              $(this).data("selected-process_id", ui.item.process_id);
          
            } ,
     
          })
        }
       
       });


       $('#part_name').on('input',function(){
        //check the value not empty
            if($('#part_name').val() !="")
            {
              $('#part_name').autocomplete({
                //get data from databse return as array of object which contain label,value
             
                source: function(request, response) {
                  $.ajax({
                    url: "php/get_part_name_auto1.php",
                    type: "get", //send it through get method
                    data: {
                     term:"name",
                     part : request.term,
               
                  
                  },
                  dataType: "json", 
                    success: function (data) {
             
                  console.log(data);
                  response($.map(data, function(item) {
                    return {
                        label: item.part_name + "-" + item.part_no,
                        value: item.part_name,
                        id: item.part_id,
                        part_no: item.part_no
                    };
                }));
                      
                    }
                
                  });
                },
                minLength: 2,
                cacheLength: 0,
                select: function(event, ui) {
                 
                  $(this).data("selected-part_id", ui.item.id);
                  $('#part_no').data("selected-part_id", ui.item.id);
                  $('#part_no').val(ui.item.part_no)
                  $('#batch_no_model').modal('show'); 
                  get_batch_parts(ui.item.id)
                  $(this).blur();
                } ,
         
              }).autocomplete("instance")._renderItem = function(ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.value + "</strong> - " + item.part_no + "</div>")
                    .appendTo(ul);
            };
            }
           
           });

           $('#part_name_out').on('input',function(){
            //check the value not empty
                if($('#part_name_out').val() !="")
                {
                  $('#part_name_out').autocomplete({
                    //get data from databse return as array of object which contain label,value
                 
                    source: function(request, response) {
                      $.ajax({
                        url: "php/get_part_name_auto1.php",
                        type: "get", //send it through get method
                        data: {
                         term:"name",
                         part : request.term,
                   
                      
                      },
                      dataType: "json", 
                        success: function (data) {
                 
                      console.log(data);
                      response($.map(data, function(item) {
                        return {
                            label: item.part_name + "-" + item.part_no,
                            value: item.part_name,
                            id: item.part_id,
                            part_no: item.part_no
                        };
                    }));
                          
                        }
                    
                      });
                    },
                    minLength: 2,
                    cacheLength: 0,
                    select: function(event, ui) {
                     
                      $(this).data("selected-part_id", ui.item.id);
                      $('#part_no_out').data("selected-part_id", ui.item.id);
                      $('#part_no_out').val(ui.item.part_no)
                      $('#qty').focus()
                     
                    } ,
             
                  }).autocomplete("instance")._renderItem = function(ul, item) {
                    return $("<li>")
                        .append("<div><strong>" + item.value + "</strong> - " + item.part_no + "</div>")
                        .appendTo(ul);
                };
                }
               
               });
     
 
           $('#part_no').on('input',function(){
            //check the value not empty
                if($('#part_no').val() !="")
                {
                  $('#part_no').autocomplete({
                    //get data from databse return as array of object which contain label,value
                 
                    source: function(request, response) {
                      $.ajax({
                        url: "php/get_part_name_auto1.php",
                        type: "get", //send it through get method
                        data: {
                         term:"no",
                         part : request.term,
                        
                      
                      },
                      dataType: "json", 
                        success: function (data) {
                 
                      console.log(data);
                      response($.map(data, function(item) {
                        return {
                            label: item.part_name + "-" + item.part_no,
                            value: item.part_no,
                            id: item.part_id,
                            part_name: item.part_name
                        };
                    }));
                          
                        }
                    
                      });
                    },
                    minLength: 2,
                    cacheLength: 0,
                    select: function(event, ui) {
                     
                      $(this).data("selected-part_id", ui.item.id);
                      $('#part_name').data("selected-part_id", ui.item.id);
                      $('#part_name').val(ui.item.part_name)
                      $('#batch_no_model').modal('show'); 
                      get_batch_parts(ui.item.id)
                      $(this).blur();
                    } ,
             
                  }).autocomplete("instance")._renderItem = function(ul, item) {
                    return $("<li>")
                        .append("<div><strong>" + item.part_name + "</strong> - " + item.value + "</div>")
                        .appendTo(ul);
                };
                }
               
               });
               $('#part_no_out').on('input',function(){
                //check the value not empty
                    if($('#part_no_out').val() !="")
                    {
                      $('#part_no_out').autocomplete({
                        //get data from databse return as array of object which contain label,value
                     
                        source: function(request, response) {
                          $.ajax({
                            url: "php/get_part_name_auto1.php",
                            type: "get", //send it through get method
                            data: {
                             term:"no",
                             part : request.term,
                            
                          
                          },
                          dataType: "json", 
                            success: function (data) {
                     
                          console.log(data);
                          response($.map(data, function(item) {
                            return {
                                label: item.part_name + "-" + item.part_no,
                                value: item.part_no,
                                id: item.part_id,
                                part_name: item.part_name
                            };
                        }));
                              
                            }
                        
                          });
                        },
                        minLength: 2,
                        cacheLength: 0,
                        select: function(event, ui) {
                         
                          $(this).data("selected-part_id", ui.item.id);
                          $('#part_name_out').data("selected-part_id", ui.item.id);
                          $('#part_name_out').val(ui.item.part_name)
                          $('#qty').focus()
                     
                        } ,
                 
                      }).autocomplete("instance")._renderItem = function(ul, item) {
                        return $("<li>")
                            .append("<div><strong>" + item.part_name + "</strong> - " + item.value + "</div>")
                            .appendTo(ul);
                    };
                    }
                   
                   });
   
               $("#helper_table").on("click","button", function(event) {
   
              console.log($(this).val());
              var weid = $(this).val()
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
                
                    update_emp_helper(weid)
               
                
                
                
                  }
               
                })
              }
           
             
              });


           
              
   });
   //
   function get_batch_parts(partid)
{
 

$.ajax({
  url: "php/get_batch_parts.php",
  type: "get", //send it through get method
  data: {
   partid : partid
  
},
  success: function (response) {
console.log(response);

$("#batch_no_table").empty()

$("#batch_no_table").append(" <tr class='small'> <td style='max-width: 20px;'>1</td> <td >No Batch</td> <td style='max-width: 50px;'>-</td> <td> <input type='number' class='form-control' style='max-width: 50px; border: soild; text-align: center;' oninput='this.value = this.value.replace(/[^0-9]/g, '')' /></td> </tr>")

if (response.trim() != "error") {
 if (response.trim() != "0 result" )
     {
  var obj = JSON.parse(response);



  obj.forEach(function (obj) {
   
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

function update_emp_work_finish()
{
 

$.ajax({
  url: "php/update_emp_work.php",
  type: "get", //send it through get method
  data: {

   wid : emp_work_id,


 


  },
  success: function (response) {
console.log(response);


if (response.trim() == "ok") {
  
 location.reload()

}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}
   function update_emp_helper(weid)
   {
    
   
   $.ajax({
     url: "php/update_emp_helper.php",
     type: "get", //send it through get method
     data: {
   
      weid : weid,
  

    


     },
     success: function (response) {
   console.log(response);
   
   
   if (response.trim() == "ok") {
     
    get_helper_emp()
    shw_toast("Helper Removed","Helper successfully removed")
   
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }
   function get_employee_autocomplete()
   {
     
        var empname =  $('#emp_name').val() + '%';
    var emp = [];
    var obj = {};
     $.ajax({
       url: "php/get_employee_autocomplete1.php",
       type: "get", //send it through get method
       data: {
         emp_name:empname,
         wid :emp_work_id
        
     
     },
       success: function (response) {

     
     if (response.trim() != "0 result") {
       var obj = JSON.parse(response);
   
 
     
   
       obj.forEach(function (obj) {
 
          object = {
        
           label:obj.emp_name,
        sel_emp_id : obj.emp_id,
           value : obj.emp_name
 
          
           
       };
        emp.push(object);
      
         
       });
      
     
     }
     
     else {
       emp = [];
       var object = {
       
         value:"No data",
         cus_id : "",
         cus_addr : ""
          
     };
      emp.push(object);
     
    
     }
     
     
         
       },
       error: function (xhr) {
           //Do Something to handle error
 
           emp = [];
           var object = {
       
             value:"No data",
             cus_id : "",
             cus_addr : ""
              
         };
          emp.push(object);
           
       }
     });
 
    
     console.log(emp)
    
    
     return emp;
    
   }
   function startTimer() {
    let breakTimer;
    let elapsedSeconds = 0;
    const breakStartDate = moment(breakStartTime, 'DD-MM-YYYY hh:mm a');
    
    // Calculate elapsed time since breakStartDate
    const now = moment();
    const duration = moment.duration(now.diff(breakStartDate));
    elapsedSeconds = Math.floor(duration.asSeconds()); // initial seconds for timer

    breakTimer = setInterval(function() {
        elapsedSeconds++;
        let mins = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
        let secs = (elapsedSeconds % 60).toString().padStart(2, '0');
        $('#timer').text(`${mins}:${secs}`);
    }, 1000);
}

function get_emp_wel_work()
{
 

$.ajax({
  url: "php/get_emp_wel_work.php",
  type: "get", //send it through get method
  data: {
   emp_id : current_user_id
  
},
  success: function (response) {
console.log(response);



if (response.trim() != "error") {
 if (response.trim() != "0 result" )
     {
  var obj = JSON.parse(response);



  obj.forEach(function (obj) {
  
    
emp_work_id = obj.wid
    // $('#part_name').data("selected-part_id", obj.part_id);
    // $('#part_name').val(obj.part_name)   
    // $('#part_name').prop("disabled",true)

    
    // $('#part_no').data("selected-part_id", obj.part_id);
    // $('#part_no').val(obj.part_no)   
    // $('#part_no').prop("disabled",true)

    $('#process_name').data("selected-process_id", obj.part_id);
    $('#process_name').val(obj.process_name)   
    $('#process_name').prop("disabled",true)

    $('#start_time').val(obj.start_time_f) 
    
    get_helper_emp(emp_work_id)
    get_input_work()
    get_output_work()
  });
  $('#work_break_btn').show()
  $('#work_hold_btn').show()
  $('#work_start_btn').hide()

  $('#sub_fi').show()
  
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
   function get_emp_break()
   {
    
   
   $.ajax({
     url: "php/get_emp_break.php",
     type: "get", //send it through get method
     data: {
      emp_id : current_user_id
     
   },
     success: function (response) {
   console.log(response);
   
var st = ""
   
   if (response.trim() != "error") {

    if (response.trim() != "0 result" )
        {
     var obj = JSON.parse(response);
   
   
   
     obj.forEach(function (obj) {
     
       

      st = obj.start_time     
        
   bid = obj.bid 
     });
     $('#work_entry_content, #work_start_btn').css('opacity', '0.3'); // Semi-hide other elements
        $('#break_mode_overlay').fadeIn(); // Show break mode overlay
        // startTimer()
        setInterval(function() {
      
    
          var startTime = new Date(st).getTime();
         let now = new Date().getTime();
       
         let elapsed = now - startTime;
    
         if (elapsed < 0) {
          elapsed = 0;
      }
         // Calculate time components
         let days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
         let hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
         let minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
         let seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
     
         // Display the result in the HTML element
        
         $('#timer').text(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }, 1000);
        // setInterval(updateTimer(st), 1000);
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

  function insert_helper_work(helper_id)
  {
   
  
  $.ajax({
    url: "php/insert_helper_work.php",
    type: "get", //send it through get method
    data: {
    emp_id : helper_id,
wid : emp_work_id,
// part_id : $('#part_name').data('selected-part_id')

    },
    success: function (response) {
  console.log(response);
  
  
  if (response.trim() == "ok") {

get_helper_emp()
  
 }
  
 
  
  
      
    },
    error: function (xhr) {
        //Do Something to handle error
    }
  });
  
  
  
     
  } 

  function insert_output_work()
  {
   
  
  $.ajax({
    url: "php/insert_output_work.php",
    type: "get", //send it through get method
    data: {
      part_id : $('#part_no_out').data("selected-part_id"),

    wid : emp_work_id,
    qty :$('#qty').val()


    },
    success: function (response) {
  console.log(response);
  
  
  if (response.trim() == "ok") {

    $('#batch_no_model').modal('hide');
get_output_work()
 }
  
 
  
  
      
    },
    error: function (xhr) {
        //Do Something to handle error
    }
  });
  
  
  
     
  }
  
  function insert_input_work(part_id,batch,qty)
  {
   
  
  $.ajax({
    url: "php/insert_input_work.php",
    type: "get", //send it through get method
    data: {
      part_id : part_id,
    batch : batch,
    wid : emp_work_id,
    qty :qty


    },
    success: function (response) {
  console.log(response);
  
  
  if (response.trim() == "ok") {

    $('#batch_no_model').modal('hide');
get_input_work()
 }
  
 
  
  
      
    },
    error: function (xhr) {
        //Do Something to handle error
    }
  });
  
  
  
     
  } 
  

  function get_input_work()
  {
   
  
  $.ajax({
    url: "php/get_input_work.php",
    type: "get", //send it through get method
    data: {
     wid : emp_work_id
    
  },
    success: function (response) {
  console.log(response);
  $("#input_table").empty()
  
  var count = 0
  if (response.trim() != "error") {
   if (response.trim() != "0 result" )
       {
    var obj = JSON.parse(response);
  
  
    obj.forEach(function (obj) {
    count = count+1;
    $("#input_table").append(" <tr class='small'> <td>"+obj.part_no+"</td> <td style='max-width: 50px;'>"+obj.batchno+"</td> <td contenteditable='true' style='max-width: 25px;'>"+obj.qty+"</td> <td style='max-width: 15px;'> <button class='btn btn-outline-danger border-0 btn-sm'><i class='fa-regular fa-trash-can'></i></button> </td> </tr>")
  
    });
   
  
  }
  $("#input_no").text(count)
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

  function get_output_work()
  {
   
  
  $.ajax({
    url: "php/get_output_work.php",
    type: "get", //send it through get method
    data: {
     wid : emp_work_id
    
  },
    success: function (response) {
  console.log(response);
  $("#output_table").empty()
  
  var count = 0
  if (response.trim() != "error") {
   if (response.trim() != "0 result" )
       {
    var obj = JSON.parse(response);
  
  
    obj.forEach(function (obj) {
    count = count+1;
    $("#output_table").append(" <tr class='small'> <td>"+obj.part_no+"</td> <td contenteditable='true' style='max-width: 25px;'>"+obj.qty+"</td> <td style='max-width: 15px;'> <button class='btn btn-outline-danger border-0 btn-sm'><i class='fa-regular fa-trash-can'></i></button> </td> </tr>")
  
    });
   
  
  }
  $("#output_no").text(count)
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
  function get_helper_emp()
{
 

$.ajax({
  url: "php/get_helper_emp.php",
  type: "get", //send it through get method
  data: {
   wid : emp_work_id
  
},
  success: function (response) {
console.log(response);
$("#helper_table").empty()

var count = 0
if (response.trim() != "error") {
 if (response.trim() != "0 result" )
     {
  var obj = JSON.parse(response);


  obj.forEach(function (obj) {
  count = count+1;
  $("#helper_table").append("  <tr><td > " + count + " </td><td>" + obj.emp_name + "</td> <td style='max-width: 15px;'> <button value='"+obj.weid+"' class='btn btn-outline-danger border-0 btn-sm'><i class='fa-regular fa-trash-can'></i></button> </td> </tr>")

  });
 

}
$("#emp_no").text(count)
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
   
   function insert_emp_work()
   {
    
   
   $.ajax({
     url: "php/insert_emp_work.php",
     type: "get", //send it through get method
     data: {
     emp_id : current_user_id,
process_id : $('#process_name').data('selected-process_id'),
// part_id : $('#part_name').data('selected-part_id')

     },
     success: function (response) {
   console.log(response);
   
   
   if (response.trim() == "ok") {

 location.reload()
   
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }

  function insert_break(brtype)
   {
    
   
   $.ajax({
     url: "php/insert_break.php",
     type: "get", //send it through get method
     data: {
     emp_id : current_user_id,
     brtype : brtype,
     emp_work_id:emp_work_id


     },
     success: function (response) {
   console.log(response);
   
   
   if (response.trim() == "ok") {
    if(brtype == "break")
location.reload()
 
   
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }

   function insert_break_end()
   {
    
   
   $.ajax({
     url: "php/insert_break_end.php",
     type: "get", //send it through get method
     data: {
     bid : bid,
    
    


     },
     success: function (response) {
   console.log(response);
   
   
   if (response.trim() == "ok") {
location.reload()
 
   
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }
   function update_emp_work()
   {
    
   
   $.ajax({
     url: "php/update_hold_work.php",
     type: "get", //send it through get method
     data: {
   
     wid : emp_work_id,
     qty :  $('#qty').val()

    


     },
     success: function (response) {
   console.log(response);
   
   
   if (response.trim() == "ok") {
      location.reload()
 
   
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }
   function update_hold_work()
   {
    
   
   $.ajax({
     url: "php/update_hold_work.php",
     type: "get", //send it through get method
     data: {
   
     wid : emp_work_id,

    


     },
     success: function (response) {
   console.log(response);
   
   
   if (response.trim() == "ok") {
     location.reload()
 
   
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
  $('#menu_bar').hide()
    }

    else
    {
        // get_today_cstatus_sql();
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
       
 get_emp_break()
 get_emp_wel_work()
 
    //    get_today_cstatus_sql()
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

  
   function get_today_cstatus_sql()
   {
$.ajax({
  url: "php/get_employee_cur_sts_phone.php",
  type: "get", //send it through get method
  data: {
   
  emp_id : current_user_id
},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {
 

  if (response.trim() != "0 result") {
    var obj = JSON.parse(response);
var count =0 
  obj.forEach(function (obj) {
  
   count  = count + 1;
   var att_sts = ""
       if(obj.status == 'present')
   var att_sts =  "<h6 class='m-0 mt-2 text-center text-success p-0 small'>"+obj.status+"</h6>"
else if(obj.status == 'logout')
  var att_sts =  "<h6 class='m-0 mt-2 text-center text-info p-0 small'>"+obj.status+"</h6>"
else if(obj.status == 'absent')
  var att_sts =  "<h6 class='m-0 mt-2 text-center text-danger p-0 small'>"+obj.status+"</h6>"
//  $("#user_status_table").append(" <tr class = 'text-bg-primary' > <td>" + count + "</td> <td>" + obj.emp_name + "</td> <td>" + obj.emp_phone + "</td> <td>" + obj.status + "</td> <td> <a target='_blank' href='work_summary_report.html?emp_id=" + obj.emp_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td><td> <a target='_blank' href='map_ref1.html?phone_id=" + obj.emp_phone_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td></tr>")
// else if(obj.status == 'logout')
// $("#user_status_table").append(" <tr class = 'text-bg-warning' > <td>" + count + "</td> <td>" + obj.emp_name + "</td> <td>" + obj.emp_phone + "</td> <td>" + obj.status + "</td> <td> <a target='_blank' href='work_summary_report.html?emp_id=" + obj.emp_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td><td> <a target='_blank' href='map_ref1.html?phone_id=" + obj.emp_phone_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td></tr>")
// else
// $("#user_status_table").append(" <tr > <td>" + count + "</td> <td>" + obj.emp_name + "</td> <td>" + obj.emp_phone + "</td> <td>" + obj.status + "</td> <td> <a target='_blank' href='work_summary_report.html?emp_id=" + obj.emp_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td><td> <a target='_blank' href='map_ref1.html?phone_id=" + obj.emp_phone_id + "' class='btn btn-primary btn-sm' role='button'>View</a></td></tr>")
emp_id_array.push(obj.emp_id)
$("#emp_details").append(" <div class='card p-0 m-0' data-emp_id="+obj.emp_id+" ><div class='card-header text-bg-light text-center p-1 m-0'> <p class='m-0 p-1 text-truncate text-muted small'>"+obj.emp_name +  "</p></div><div class='card-body px-3 m-0'> <div class='d-flex justify-content-between'> <div> <p class='text-muted m-0 p-0 small'>&#8377 "+ obj.amount + "</p> </div> <div> <i class='fa-regular fa-bell position-relative' style='font-size: 20px;'> <span id = '"+obj.emp_id + "_notify' class='position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-warning' style='font-size: 10px; padding: 3px 6px;'> 0 </span> </i> </div> </div> <div class='d-flex justify-content-between mt-1 p-0'> <div>"+ att_sts +  "</div> <div> <button onclick=\"window.location.href='tel:+91"+ obj.emp_phone + "'\" class='btn btn-light btn-sm m-0 mt-1 text-center'><i class='fa fa-phone text-secondary' aria-hidden='true'></i></button> </div></div> </div> <div class='card-footer m-0 p-0'> <button  onclick=\"window.location.href='admin_emp_single_detail.html?emp_id="+obj.emp_id+"&phone_id="+phone_id+"'\" class='w-100 btn btn-secondary'>view</button> </div> </div>")
  });

  $("#total_emp").text(count)
}
console.log(emp_id_array);
$.each(emp_id_array, function(index, emp_id) {
  
  get_employee_notification(emp_id,current_user_id)
  console.log(total_notify_no);

})

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


   
   function get_employee_notification(emp_id_p,admin_id_p)
   {

  

$.ajax({
  url: "php/get_employee_notification.php",
  type: "get", //send it through get method
  data: {
   
  emp_id : emp_id_p,
  admin_id : admin_id_p
},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {
  
  if (response.trim() != "0 result") {
  var obj = JSON.parse(response);


var count =0 
  obj.forEach(function (obj) {
  
  
   if(obj.emp_id !=null)
   {
    total_notify_no  = total_notify_no + Number(obj.count);
   console.log(total_notify_no);
     
$("#total_notification").text(total_notify_no)
  var id_sel = "#" + obj.emp_id + "_notify"

$(id_sel).text(obj.count)
$(id_sel).addClass("blink");
   }
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


function shw_toast(title,des,theme)
{

  
      $('.toast-title').text(title);
      $('.toast-description').text(des);
var toast = new bootstrap.Toast($('#myToast'));
toast.show();
}
