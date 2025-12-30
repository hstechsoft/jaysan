
  var cus_id = '0';
  var issaved = 'yes'
  var selected_process_tbl = ""
   var selected_input_part_tbl = ""
  var valid_sts =""
  var edit_process_id = ""
  var mode = 'new'
var change_input_id = ""
var change_process_id = ""
var sel_input_part_id = "0"
var sel_output_part_id = "0"
var process_id_array = [];
$(document).ready(function(){
//   $('[id]').each(function(){
  
//     var elementId = $(this).attr('id');
//     console.log(elementId);
// });

//   $(window).on('beforeunload', function(e) {

//     if(issaved == 'no')
//      {
//       var message = "You have unsaved changes in jaysan process. Are you sure you want to leave?";
//       e.returnValue = message; // Standard way to display the message in modern browsers
//       return message; // For older browsers
//     }
// });




  $("#menu_bar").load('menu.html',
    function() { 
      var lo = (window.location.pathname.split("/").pop());
      var web_addr = "#"+ (lo.substring(0, lo.indexOf(".")))
 
    
     if($(web_addr).find("a").hasClass('nav-link'))
     {
      $(web_addr).find("a").toggleClass('active')
     }
     else if($(web_addr).find("a").hasClass('dropdown-item'))
{
$(web_addr).parent().parent().find("a").eq(0).toggleClass('active')
}
      
     
    }
 );






    check_login();

get_bom_recent()






   $("#unamed").text(localStorage.getItem("ls_uname"))
   
   $("#add_new_part_btn").click(function() {
    $("#addNewPartModal").modal('show');
  });


 

  $("#add_new_out_part_btn").click(function() {
    $("#addNewPartModal").modal('show');
  });
 


  



  
  $('#part_no_out').on('input',function(){
    //check the value not empty
        if($('#part_no_out').val() !="")
        {
          $('#part_no_out').autocomplete({
            //get data from databse return as array of object which contain label,value
         
            source: function(request, response) {
              $.ajax({
                url: "php/get_part_name_auto_wel.php",
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
              $("#outpart_txt").text(ui.item.part_name) 

  get_bom_list(ui.item.id)
            } ,
     
          }).autocomplete("instance")._renderItem = function(ul, item) {
            return $("<li>")
                .append("<div><strong>" + item.part_name + "</strong> - " + item.value + "</div>")
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
                url: "php/get_part_name_auto_wel.php",
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
              $('#qty').focus()
            } ,
     
          }).autocomplete("instance")._renderItem = function(ul, item) {
            return $("<li>")
                .append("<div><strong>" + item.part_name + "</strong> - " + item.value + "</div>")
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
                    url: "php/get_part_name_auto_wel.php",
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
             get_bom_list(ui.item.id)
                  
                $("#outpart_txt").text(ui.item.value)                
                } ,
         
              }).autocomplete("instance")._renderItem = function(ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.value + "</strong> - " + item.part_no + "</div>")
                    .appendTo(ul);
            };
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
                    url: "php/get_part_name_auto_wel.php",
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
                  $('#qty').focus()
                } ,
         
              }).autocomplete("instance")._renderItem = function(ul, item) {
                return $("<li>")
                    .append("<div><strong>" + item.value + "</strong> - " + item.part_no + "</div>")
                    .appendTo(ul);
            };
            }
           
           });

























// $('#add_part_btn').on('click', function() {


// var input_count =  $('#input_part_tbl .card').length;
// var process_count =  $('#process_tbl .card').length;

// if(input_count >=1 && process_count>1)
// {
// shw_toast("invalid","multiple input not allowed for multiple process")
// }
// else{
  
//   if($('#part_no').val() && $('#part_name').val()  && $('#qty').val() &&  $('#part_name').data('selected-part_id') )
//     {
//       issaved = 'no'
//       var partId = $('#part_no').data('selected-part_id');
//      var qty = $('#qty').val()
//       var processId = 0
//         var pre_process = "<span class='text-danger h6'> No Previous process</span>"

//   if($('#finished_process').text().trim()!== '')
//   {
//      pre_process = $('#finished_process').html()
//     processId = $('#finished_process').data('process-id');
//   }
   


//     if(mode == 'in_change')
//       {
//         update_input(partId,processId,change_input_id,qty)
//       }
//       else if(mode == 'edit')
//         {
//           insert_new_input(partId,processId,qty)
//         }
//     else
//     {
//       $('#input_part_tbl').append(" <div class='card mt-1' data-part-id="+partId+" data-part-qty="+qty+"  data-pre-process-id="+processId+ "> <div class='card-header '> <p class='my-auto'>"+$('#part_no').val()+"-"+  $('#part_name').val()+ " ("+  pre_process +")<br> Qty : "+ qty+ "</p> </div> </div>")
//     }

 

//   $('#process_name').val('')
//   $('#part_no').val('');
//   $('#part_name').val('');
//   $('#finished_process').val('');
//   $('#qty').val('');
//   $('#finished_process').html('');
  
//   $('#part_no').removeData('part-id');
//   $('#finished_process').removeData('process-id');
  
  
//   $('#pa_nxt_prs .card').each(function() {
//     if ($(this).data('part-id') === partId && $(this).data('process-id') === processId ) {
//         $(this).fadeOut(500);
//     }
//   });
  
 
//   }
//   else{
//     shw_toast("Insert","Kindly insert qty or select part from autocomplete")
//   }
// }
 
// });


$('#add_part_btn').on('click', function() {

{
    
    if($('#part_no').val() && $('#part_name').val()  && $('#qty').val() &&  $('#part_name').data('selected-part_id') )
      {
        
        var partId = $('#part_no').data('selected-part_id');
       var qty = $('#qty').val()
        
         
  
    var count = 1 + $('#bom_table tr').length;
  
  
  
    
      {
    

        $('#bom_table').append("<tr class='small'> <td>"+ count + "</td> <td data-part-id="+partId+">"+ $('#part_name').val()+ " </td> <td contenteditable='true' class='qty-editable'>"+qty +  "</td> <td><button class='btn btn-outline-danger border-0'><i class='fa fa-trash ' aria-hidden='true'></i></button></td> </tr>") 
      }
      
   
    
  
    $('#process_name').val('')
    $('#part_no').val('');
    $('#part_name').val('');
    
    $('#qty').val('');
   
    
    $('#part_no').removeData('part-id');
   
    
    
    }
    else{
      shw_toast("Insert","Kindly insert qty or select part from autocomplete")
    }
  }
   
  });



  $('#bom_table').on('click', 'button', function() {

    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this imaginary file!",
        icon: "warning",
        buttons: true,
        dangerMode: true,

        })
        .then((willDelete) => {
        if (willDelete) {
       
                
    // Get the closest row (tr) to the clicked button
    var row = $(this).closest('tr');
    // Remove the row from the table
    row.remove();
        } else {
            swal("Your imaginary file is safe!");
        }
        });
    

  });


  $('#submit_btn').on('click', function() {


if($('#part_no_out').data('selected-part_id')  && $("#bom_list_select").val()  )
 {

 
var inputPartsData = [];
$('#bom_table tr').each(function(index) {
  

  inputPartsData.push({
    part_id: $(this).find("td").eq(1).data('part-id'),
    part_qty: $(this).find("td").eq(2).text().trim(),
});
});



$.ajax({
    
  url: 'php/insert_bom.php',
  method: 'POST',
  data: {
      
      inputPartsData: inputPartsData,
      output_part : $('#part_no_out').data('selected-part_id'),
      bom_list : $('#bom_list_select').val()
  },
  success: function(response) {
      console.log(response);
  if(response.trim()=="ok")
  {
    
    location.reload()
  }
  }
});
 }
 else{
    shw_toast("Insert","Kindly select output part from autocomplete")
 }


  });


  $('#update_btn').on('click', function() {


    if($('#part_no_out').data('selected-part_id') && $("#bom_list_select").val()  )
     {
    
     
    var inputPartsData = [];
    $('#bom_table tr').each(function(index) {
      
    
      inputPartsData.push({
        part_id: $(this).find("td").eq(1).data('part-id'),
        part_qty: $(this).find("td").eq(2).text().trim(),
    });
    });
    
    
    
    $.ajax({
        
      url: 'php/update_bom.php',
      method: 'POST',
      data: {
          
          inputPartsData: inputPartsData,
          output_part : $('#part_no_out').data('selected-part_id'),
          bom_id : $('#update_btn').val(),
          bom_list : $('#bom_list_select').val()
      },
      success: function(response) {
          console.log(response);
      if(response.trim()=="ok")
      {
        
     get_bom($('#part_no_out').data('selected-part_id'),$('#bom_list_select').val())
    console.log($('#bom_list_select').val());
    
     shw_toast("Updated","Successfully Updated")
      }
      }
    });
     }
     else{
        shw_toast("Insert","Kindly select output part from autocomplete")
     }
    
    
      });

  
$("#bom_table").on("blur", ".qty-editable", function() {
    let newQty = $(this).text().trim();
    if (isNaN(newQty) || newQty <= 0) {
      shw_toast("Warning","Please enter a valid quantity.");
      $(this).text("1"); // Reset to default value
    } 
  });
  $("#bom_recent_list").on("click", "li", function() {
    var part_id = $(this).data('part_id')
var component_cat = $(this).data('cat');
    $('#part_no_out').val($(this).data('part_no'))
    $('#part_no_out').data('selected-part_id', part_id) 
    $('#part_name_out').val($(this).text())
    $('#part_name_out').data('selected-part_id', part_id)
 
    $("#outpart_txt").text($(this).text())

     selectAutocompleteByPartId(part_id);
     get_bom(part_id,component_cat)
  } );

  $('#bom_list_select').change(function() {


 get_bom($('#bom_list_select').find(':selected').data('part_id'),$('#bom_list_select').find(':selected').val())


});

   $("#search_list").on("keyup", function() {
          var value = $(this).val().toLowerCase();
          $("#bom_recent_list li").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
          });
        });


          $('#addNewPartForm').on('submit', function (event) {
          event.preventDefault();
        
          if (!this.checkValidity()) {
            event.stopPropagation();
            $(this).addClass('was-validated');
            return;
          }
        
          $(this).addClass('was-validated');
        
        insert_new_part()


        });



        $('#newPartName').on('input',function(){
           //check the value not empty
               if($('#newPartName').val() !="")
               {
                 $('#newPartName').autocomplete({
                   //get data from databse return as array of object which contain label,value
        
                   source: function(request, response) {
                     $.ajax({
                       url: "php/get_part_name_auto_wel.php",
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
                        part_no: item.part_no,
                        part_name : item.part_name

                          
                       };
                   }));
        
                       }
        
                     });
                   },
                   minLength: 2,
                   cacheLength: 0,
                   select: function(event, ui) {
        
                  
                     $('#newPartNo').val(ui.item.part_no)
                  
        
        
                   } ,
        
                 }).autocomplete("instance")._renderItem = function(ul, item) {
                   return $("<li>")
                       .append("<div><strong>" + item.part_name + "</strong> - " + item.part_no + "</div>")
                       .appendTo(ul);
               };
               }
        
              });



              $('#newPartNo').on('input',function(){
                 //check the value not empty
                     if($('#newPartNo').val() !="")
                     {
                       $('#newPartNo').autocomplete({
                         //get data from databse return as array of object which contain label,value
              
                         source: function(request, response) {
                           $.ajax({
                             url: "php/get_part_name_auto_wel.php",
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
              
                        
                      $('#newPartName').val(ui.item.part_name)
                        
              
              
                         } ,
              
                       }).autocomplete("instance")._renderItem = function(ul, item) {
                         return $("<li>")
                             .append("<div><strong>" + item.part_name + "</strong> - " + item.value + "</div>")
                             .appendTo(ul);
                     };
                     }
              
                    });
$("#add_bom_list_btn").on("click", function(event) {
  event.preventDefault();
  // TODO: handle click here

  let userInput = prompt("Enter BOM List Name:");
  if (userInput && userInput.trim() !== "") {
    // You can now use userInput for further processing, e.g., send to server or add to list
    console.log("User entered:", userInput);
    // Example: Add to a select or list
    $("#bom_list_select").append(`<option value="${userInput}">${userInput}</option>`);
    $("#bom_list_select").val(userInput); // Select the newly added option
  } else {
    shw_toast("Input Required", "Please enter a BOM List Name.");
  }

   if($("#update_btn").hasClass('d-none') == false)
        {
          $("#update_btn").addClass('d-none')
        }
        if($("#submit_btn").hasClass('d-none'))
        {
          $("#submit_btn").removeClass('d-none')
        }
});


              
});

function selectAutocompleteByPartId(partId) {
  let input = $('#part_name_out');

  // Trigger input to initiate autocomplete search
  input.val('').trigger('input');

  // Wait a short time to ensure the autocomplete source is triggered
  setTimeout(function () {
    $.ajax({
      url: "php/get_part_name_auto_wel.php",
      type: "get",
      data: {
        term: "name",
        part: "" // You can pass a specific search term if needed
      },
      dataType: "json",
      success: function (data) {
        let item = data.find(i => i.part_id == partId);
        if (item) {
          let uiItem = {
            label: item.part_name + "-" + item.part_no,
            value: item.part_name,
            id: item.part_id,
            part_no: item.part_no
          };

          // Set the value and trigger the select
          input.val(uiItem.value);
          input.data("selected-part_id", uiItem.id);
          $('#part_no_out').data("selected-part_id", uiItem.id);
          $('#part_no_out').val(uiItem.part_no);
          get_bom_list(uiItem.id);
            
          $('#part_no_out').attr("disabled", true); // Enable the input field if needed
          $('#part_name_out').attr("disabled", true); 
        } else {
          console.warn("Part ID not found in autocomplete data.");
        }
      }
    });
  }, 200); // Adjust timeout if needed
}

function get_bom_list(part_id)
{
 

$.ajax({
  url: "php/get_bom_list.php",
  type: "get", //send it through get method
  data: {
  part_id : part_id

  },
  success: function (response) {
console.log(response);

$('#bom_list_select').empty()

if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

   
    $("#bom_list_select").empty()
$("#bom_list_select").append("<option  value='0' disabled selected>Bom  List</option>")

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
    //  $("#bom_list_item").append("<li  data-bom_id='"+ obj.bom_id+"' data-part_id='"+obj.part_id+" ' class=' list-group-item'>"+obj.component_cat + "</li>")
    $("#bom_list_select").append("<option value='"+ obj.component_cat+"' data-part_id='"+obj.part_id+"'>"+obj.component_cat+"</option>")

// $('#bom_table').append("<tr class='small'> <td>"+ count + "</td> <td data-part-id="+obj.part_id+">"+ obj.part_name+ " </td> <td contenteditable='true' class='qty-editable'>"+obj.qty +  "</td> <td><button class='btn btn-outline-danger border-0'><i class='fa fa-trash ' aria-hidden='true'></i></button></td> </tr>") 


  });


      


}
else{
  $('#bom_list_item').append("<li class='list-group-item'>No BOM Found</li>")
   
}
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}

function get_bom_recent()
{
 

$.ajax({
  url: "php/get_bom_recent.php",
  type: "get", //send it through get method
  data: {
  
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
 var sub_ass=""
      if(obj.sub_ass == 1)
    {
sub_ass = "<span class='text-bg-secondary rounded-pill px-2 py-1 ms-2 small'>sub</span>"
    }
    else
    {
       sub_ass = ""
    }

     
$("#bom_recent_list").append("<li data-part_id='"+ obj.part_id+"' data-part_no='"+ obj.part_no+"' data-cat='"+ obj.component_cat+"'  class='list-group-item'>"+obj.part_name+"("+ obj.component_cat+ ")" +sub_ass+"</li>")
  });

 console.log($("#bom_recent_list").html());
 
}
else{
// $("#@id@") .append("<td colspan='0' scope='col'>No Data</td>");

}
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}


function get_bom(part_id, component_cat)
{
 

$.ajax({
  url: "php/get_bom.php",
  type: "get", //send it through get method
  data: {
  part_id : part_id,
  component_cat : component_cat

  },
  success: function (response) {
console.log(response);
$('#bom_table').empty()

if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

    if($("#update_btn").hasClass('d-none'))
    {
      $("#update_btn").removeClass('d-none')
    }
    if($("#submit_btn").hasClass('d-none')== false)
    {
      $("#submit_btn").addClass('d-none')
    }

    


  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
var sub_ass=""
      if(obj.sub_ass == 1)
    {
sub_ass = "<span class='text-bg-secondary rounded-pill px-2 py-1 ms-2 small'>sub</span>"
    }
    else
    {
       sub_ass = ""
    }

     $("#update_btn").val(obj.bom_id)

$('#bom_table').append("<tr class='small'> <td>"+ count + "</td> <td data-part-id="+obj.part_id+">"+ obj.part_name  + sub_ass +  "</td> <td contenteditable='true' class='qty-editable'>"+obj.qty+ "</td> <td><button class='btn btn-outline-danger border-0'><i class='fa fa-trash ' aria-hidden='true'></i></button></td> </tr>") 


  });

$('#bom_table').get(0).scrollIntoView({ behavior: 'smooth', block: 'center' });
}
else{
    if($("#update_btn").hasClass('d-none') == false)
        {
          $("#update_btn").addClass('d-none')
        }
        if($("#submit_btn").hasClass('d-none'))
        {
          $("#submit_btn").removeClass('d-none')
        }
    


}
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}


function get_title()
{
 

$.ajax({
  url: "php/get_titles.php",
  type: "get", //send it through get method
  data: {
  
  },
  success: function (response) {
console.log(response);
if (response.trim() != "error") {
  var obj = JSON.parse(response);

if (response.trim() != "0 result") {
  obj.forEach(function (obj) {

  $('#prs_title').append("<option value='"+ obj.id+"' >"+ obj.name+"</option>")

});
}



}
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}




















function insert_new_part()
{
 

$.ajax({
  url: "php/insert_new_part.php",
  type: "get", //send it through get method
  data: {
newPartName :  $('#newPartName').val(),
newPartNo :  $('#newPartNo').val(),
newPartDes :  $('#newPartDes').val(),
reorder_qty: $('#reorder_qty').val(),
min_order_qty: $('#min_order_qty').val(),
Parent:$('#Parent').val(),
category:$('#category').val(),
baseunits:$('#baseunits').val(),
gstrate:$('#gstrate').val(),
  },
  success: function (response) {
console.log(response);


if (response.trim() == "ok") {
  $('#newPartName').val(''),
   $('#newPartNo').val(''),
    $('#newPartDes').val('')
    $('#reorder_qty').val('')
    $('#min_order_qty').val('')
    $('#Parent').val('')
    $('#category').val('')
    $('#baseunits').val('')
    $('#gstrate').val('')
    
  // $("#addNewPartModal").modal('hide');
shw_toast("Added","Successfully Added")
}




    
  },
  error: function (xhr) {
    console.log(xhr.responseText);
    
      //Do Something to handle error
      shw_toast("Error",xhr.responseText,"danger")
  }
});



   
}





  

   


function shw_toast(title,des,theme)
{

  
      $('.toast-title').text(title);
      $('.toast-description').text(des);
var toast = new bootstrap.Toast($('#myToast'));
toast.show();
}


   function check_login()
   {
    
    if (localStorage.getItem("logemail") == null) {
      window.location.replace("login.html");
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