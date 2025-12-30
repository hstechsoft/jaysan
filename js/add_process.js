
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




$("#part_name").on("keyup", function() {
  var value = $(this).val().toLowerCase();
  $("#pa_nxt_prs .card").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});


$("#part_no").on("keyup", function() {
  var value = $(this).val().toLowerCase();
  $("#pa_nxt_prs .card").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});

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

 var editProcessId = sessionStorage.getItem('editProcessId');
 var edit_mode_exit = sessionStorage.getItem('edit_mode_exit');
 var breadcrumb = sessionStorage.getItem('breadcrumb');

console.log(breadcrumb);


 if(editProcessId) {
     // Use the editProcessId as needed
    
     get_implement_process(editProcessId)
     get_implement_input(editProcessId)
     get_implement_output(editProcessId)
     // Optionally, clear the sessionStorage if you no longer need it
    
    if(edit_mode_exit == "yes")
    {
      $('#imp_output').focus()
    }
    else{
      setTimeout(function() {
        $('#edit_imp_btn').click();
      }, 500); 
    }

     sessionStorage.removeItem('editProcessId');
     sessionStorage.removeItem('edit_mode_exit');
     sessionStorage.removeItem('breadcrumb');
     setTimeout(function() {
      $('#out_breadcrumb').html(breadcrumb)
    }, 500); 

 }
    check_login();
    get_title()
 get_ava_process();
 get_sel_imp();
 get_final_imp();
 $('#breadcrumb1').hide()
$('#final_output_btn_grp').removeClass("d-flex").addClass("d-none");
 $('#imp_output').removeClass("d-flex").addClass("d-none");
 $('.cancel_btn').hide()

 $('#edit_input_btn').hide()
 $('#edit_prs_btn').hide()
 $('#edit_output_btn').hide()

 $('#update_btn').hide()
 $('#in_invalid').hide()
// 1-second delay
 $('#out_breadcrumb').on('click', '.breadcrumb-item a', function(event){


  event.preventDefault(); // Prevents the default anchor behavior
  var pid = $(this).data('process-id'); // Retrieve the custom data attribute
  $(this).parent('li').nextAll('li').remove();
  $(this).parent('li').remove();
  get_implement_process(pid)
  get_implement_input(pid)
  get_implement_output(pid)

  // Add your custom action here
});


// $('#prs_title').change(function() {
//   if($('#prs_title').find(':selected').val()==0)
  
//     $('#ap').hide()
// else
// $('#ap').show()
  
//   //$('#prs_title').find(':selected').text()
//   //$('#prs_title').find(':selected').val()
//    });




 $('#output_part_sel').change(function() {
     
  if ($(this).find(":selected").val()!="0")
  {
 get_implement_process($(this).find(":selected").val())
 get_implement_input($(this).find(":selected").val())
 get_implement_output($(this).find(":selected").val())
 $('#out_breadcrumb').empty()

  }
  
   });

   $("#unamed").text(localStorage.getItem("ls_uname"))
   
   $("#add_new_part_btn").click(function() {
    $("#addNewPartModal").modal('show');
  });


  $(".cancel_btn").click(function() {
    sessionStorage.setItem('editProcessId', edit_process_id);

    // Reload the page
    location.reload();
  });
  $("#imp_home_btn").click(function() {
    get_final_imp();
    get_sel_imp()
  });

  $("#add_new_out_part_btn").click(function() {
    $("#addNewPartModal").modal('show');
  });
 
  
  $('#add_new_part_mbtn').on('click', function() {
    insert_new_part()
  });

  


  $('#submit_btn').on('click', function() {


    var input_count =  $('#input_part_tbl .card').length;
var process_count =  $('#process_tbl .card').length;
var output_part = $('#output_part_txt').data('out-part-id')

var title_id = $('#prs_title').val()
console.log(title_id);


 if(input_count>=1 && process_count>=1 && output_part !="")
 {

  var processData = []
var inputPartsData = [];
$('#input_part_tbl .card').each(function(index) {
  

  inputPartsData.push({
    part_id: $(this).data('part-id'),
    pre_process_id: $(this).data('pre-process-id'),
    part_qty: $(this).data('part-qty')
});
});

$('#process_tbl .card').each(function(index) {

  processData.push({
    process_id: $(this).data('process-id'),
    
    output_part:output_part
});

});

var url = ''
if(input_count>=1 && process_count==1)
{
  // one/many input one process
 url = 'php/insert_ass_process.php'

}
else if(input_count==1 && process_count>1)
{
// one input many process
 url = 'php/insert_wel_process.php'
}
$.ajax({
    
  url: url,
  method: 'POST',
  data: {
      processData: processData,
      inputPartsData: inputPartsData,
      title_id : title_id
  },
  success: function(response) {
      console.log(response);
  if(response.trim()=="ok")
  {
    issaved = "yes"
    location.reload()
  }
  }
});
 }
 else
 shw_toast("Enter Required" , "Kindly enter all required ")

  });

  
  $('#part_no_out').on('input',function(){
    //check the value not empty
        if($('#part_no_out').val() !="")
        {
          $('#part_no_out').autocomplete({
            //get data from databse return as array of object which contain label,value
         
            source: function(request, response) {
              $.ajax({
                url: "php/get_part_name_auto.php",
                type: "get", //send it through get method
                data: {
                 term:"no",
                 part : request.term,
                 title_id :$("#prs_title").val()
              
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
              get_part_sts(ui.item.id)
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
                url: "php/get_part_name_auto.php",
                type: "get", //send it through get method
                data: {
                 term:"no",
                 part : request.term,
                 title_id :$("#prs_title").val()
              
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
                    url: "php/get_part_name_auto.php",
                    type: "get", //send it through get method
                    data: {
                     term:"name",
                     part : request.term,
                     title_id :$("#prs_title").val()
                  
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
                 get_part_sts(ui.item.id)
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
                    url: "php/get_part_name_auto.php",
                    type: "get", //send it through get method
                    data: {
                     term:"name",
                     part : request.term,
                     title_id :$("#prs_title").val()
                  
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

$('#add_new_process_btn').on('click', function() {
  $('#addNewProcessModal').modal('show');
});


$('#edit_input_btn').on('click', function() {
  $('#part_name').focus()
  $('#add_part_btn').text('update')
  $('.cancel_btn').hide()
  $('#cancel_part_btn').show()
});

$('#edit_prs_btn').on('click', function() {
  $('#process_name').focus()
  $('#add_process_btn').text('update')
  $('.cancel_btn').hide()
  $('#cancel_process_btn').show()
  $('#edit_output_btn').on('click', function() {
    $('#part_name_out').focus()
    $('#add_out_part_btn').text('update')
    $('#add_part_btn').text('add')
  $('#add_process_btn').text('add')
  
  $(".card").removeClass("selected");
  $('#edit_input_btn').hide()
  $('#edit_prs_btn').hide()
  mode = 'out_change'
  
  $('.cancel_btn').hide()
  $('#cancel_out_part_btn').show()
  
  });
});

$('#edit_output_btn').on('click', function() {
  $('#part_name_out').focus()
  $('#add_out_part_btn').text('update')
  $('#add_part_btn').text('add')
$('#add_process_btn').text('add')

$(".card").removeClass("selected");
$('#edit_input_btn').hide()
$('#edit_prs_btn').hide()
mode = 'out_change'

$('.cancel_btn').hide()
$('#cancel_out_part_btn').show()

});

// Handle form submission
$('#addNewProcessForm').on('submit', function(e) {
  e.preventDefault();
  
  var processName = $('#processName').val();
  var processDes = $('#processDes').val();

  $.ajax({
      url: 'php/insert_new_process.php', // PHP script to handle form submission
      type: 'POST',
      data: {
          process_name: processName,
          process_des: processDes
      },
      success: function(response) {
          // Handle success response
      shw_toast("Success","Successfully Inserted")
          // $('#addNewProcessModal').modal('hide');
          // Optionally, refresh the process table or perform other actions
      $('#processName').val('');
 $('#processDes').val('');
      },
      error: function() {
          // Handle error response
          alert('Error adding process');
      }
  });
});


$("#imp_input_part").on("dblclick",".card", function(event) {

  var partNo = $(this).data('part-no');
  var partName = $(this).data('part-name');
  var process = $(this).data('process');
  var partId = $(this).data('part-id');
  var processId = $(this).data('pre-process-id');
  console.log($(this).html());
  console.log(processId);
  // Set the retrieved data to the corresponding textboxes
if(processId != 0)
{
 get_implement_process(processId)
  get_implement_input(processId)
  get_implement_output(processId)
}
else
{
shw_toast("No Process", "There is No Process for This Part")
}
 
});


$("#imp_final_output").on("dblclick",".card", function(event) {

 
  var processId = $(this).data('process-id');
 console.log(processId);
 
  // Set the retrieved data to the corresponding textboxes
if(processId != 0)
{
 get_implement_process(processId)
  get_implement_input(processId)
  get_implement_output(processId)
}
else
{
shw_toast("No Process", "There is No Process for This Part")
}
 
});



$("#pa_nxt_prs").on("click",".card", function(event) {

  var partNo = $(this).data('part-no');
  var partName = $(this).data('part-name');
  var process = $(this).data('process');
  var partId = $(this).data('part-id');
  var processId = $(this).data('process-id');
  console.log(partNo);
  // Set the retrieved data to the corresponding textboxes
  $('#part_no').val(partNo);
  $('#part_name').val(partName);
  $('#finished_process').text(process);

  // Store the part-id and process-id in the textboxes as data attributes
  $('#part_no').data('selected-part_id', partId);
  $('#part_name').data('selected-part_id', partId);
  $('#finished_process').data('process-id', processId);

 
  $('#qty').val("")
  $('#qty').focus();

});

$("#process_tbl").on("click",".card", function(event) {
  if ($(this).hasClass("selected")) {
    // If it is already selected, remove the 'selected' class (unselect)
    $(this).removeClass("selected");
    $('#edit_input_btn').hide()
    $('#edit_prs_btn').hide()
    change_process_id = ""
    mode = "edit"
} else {
    // Otherwise, unselect all other cards and select this one
    $(".card").removeClass("selected");
    $(this).addClass("selected");
    $('#edit_input_btn').hide()
$('#edit_prs_btn').show()
change_process_id = $(this).data('process-id')
mode = "prs_change"
}
selected_process_tbl = $(this)

$('#add_part_btn').text('add')
$('#add_process_btn').text('add')
$('#add_out_part_btn').text('add')
$('.cancel_btn').hide()
});


$('#tbl').on('click', '#exit_edit_mode', function() {

  // Place your custom logic here
  sessionStorage.setItem('edit_mode_exit', "yes");
   sessionStorage.setItem('editProcessId', edit_process_id);
   sessionStorage.setItem('breadcrumb', $('#out_breadcrumb').html());
  location.reload()
});
$("#input_part_tbl").on("click",".card", function(event) {
  if ($(this).hasClass("selected")) {

    $(this).removeClass("selected");
    $('#edit_input_btn').hide()
    $('#edit_prs_btn').hide()
    change_input_id = ""
    mode = "edit"
} else {
   
    $(".card").removeClass("selected");
    $(this).addClass("selected");

    $('#edit_input_btn').show()
$('#edit_prs_btn').hide()
change_input_id = $(this).data('id')
mode = "in_change"
}
selected_input_part_tbl = $(this)

$('#add_part_btn').text('add')
$('#add_process_btn').text('add')
$('#add_out_part_btn').text('add')
$('.cancel_btn').hide()

$('#process_name').val('')
$('#part_no').val('');
$('#part_name').val('');
$('#finished_process').val('');
$('#finished_process').html('');
$('#part_no').removeData('part-id');
$('#finished_process').removeData('process-id');


});

$("#process_tbl").sortable({
   // Only drag by the cell with class 'sortable-cell'
  placeholder: "ui-state-highlight",
  update: function(event, ui) {
    var updated_process_array = []
    $('#process_tbl .card').each(function(index) {
      updated_process_array.push($(this).data('process'))
     
    
    });

    console.log(updated_process_array);
    

$.ajax({
    
  url : 'php/rearrange_process.php',
  method: 'POST',
  data: {
      updated_process_array: updated_process_array,
      process_id_array: process_id_array
  },
  success: function(response) {
      console.log(response);
  if(response.trim()=="ok")
  {
    issaved = "yes"
     location.reload()
    sessionStorage.setItem('editProcessId', edit_process_id);
    sessionStorage.setItem('breadcrumb', $('#out_breadcrumb').html());
  }
  }
});
  }
}).disableSelection();


$('#add_out_part_btn').on('click', function() {
   issaved = 'no'
  var input_count =  $('#input_part_tbl .card').length;
  var process_count =  $('#process_tbl .card').length;
//  valid_sts == 'valid'
  if(input_count>=1 && process_count >=1 && 1)
{
  if($('#part_no_out').val() && $('#part_name_out').val()  &&  $('#part_name_out').data('selected-part_id') )
    {

      
      var partId = $('#part_name_out').data('selected-part_id');
     
      if(mode == 'out_change')
        {
         
          update_output(edit_process_id,partId)
          $('#out_breadcrumb li:last a').text($('#part_name_out').val());


        }
  
  $('#output_part_txt').data('out-part-id', partId);
  $('#output_part_txt').html( $('#part_name_out').val() + " - " + $('#part_no_out').val())
  
  $('#part_no_out').val('');
  $('#part_name_out').val('');
  $('#part_no_out').removeData('part-id');
  $('#part_name_out').removeData('part-id');
  
  
  }
}
else{
  shw_toast("invalid","Enter input/process or output part already assigned")
}
});

$('#add_part_btn').on('click', function() {


var input_count =  $('#input_part_tbl .card').length;
var process_count =  $('#process_tbl .card').length;

if(input_count >=1 && process_count>1)
{
shw_toast("invalid","multiple input not allowed for multiple process")
}
else{
  
  if($('#part_no').val() && $('#part_name').val()  && $('#qty').val() &&  $('#part_name').data('selected-part_id') )
    {
      issaved = 'no'
      var partId = $('#part_no').data('selected-part_id');
     var qty = $('#qty').val()
      var processId = 0
        var pre_process = "<span class='text-danger h6'> No Previous process</span>"

  if($('#finished_process').text().trim()!== '')
  {
     pre_process = $('#finished_process').html()
    processId = $('#finished_process').data('process-id');
  }
   


    if(mode == 'in_change')
      {
        update_input(partId,processId,change_input_id,qty)
      }
      else if(mode == 'edit')
        {
          insert_new_input(partId,processId,qty)
        }
    else
    {
      $('#input_part_tbl').append(" <div class='card mt-1' data-part-id="+partId+" data-part-qty="+qty+"  data-pre-process-id="+processId+ "> <div class='card-header '> <p class='my-auto'>"+$('#part_no').val()+"-"+  $('#part_name').val()+ " ("+  pre_process +")<br> Qty : "+ qty+ "</p> </div> </div>")
    }

 

  $('#process_name').val('')
  $('#part_no').val('');
  $('#part_name').val('');
  $('#finished_process').val('');
  $('#qty').val('');
  $('#finished_process').html('');
  
  $('#part_no').removeData('part-id');
  $('#finished_process').removeData('process-id');
  
  
  $('#pa_nxt_prs .card').each(function() {
    if ($(this).data('part-id') === partId && $(this).data('process-id') === processId ) {
        $(this).fadeOut(500);
    }
  });
  
 
  }
  else{
    shw_toast("Insert","Kindly insert qty or select part from autocomplete")
  }
}
 
});

$('#edit_imp_btn').on('click', function() {
  
  mode = 'edit'
  $('#edit_output_btn').show()

console.log(edit_process_id);
$('#tbl').focus()
$('#exit_edit_mode').remove();

$('#tbl').append(" <button class='btn  btn-primary w-100 mt-2' id='exit_edit_mode' >Exit Edit Mode</button>")
$('#tbl').addClass('border border-dark ')

$('html, body').animate({
  scrollTop: $('#tbl').offset().top
}, 500);
$('#tbl').focus();
$('#input_part_tbl').empty()
$('#process_tbl').empty()

  $('#update_btn').show()
  $('#submit_btn').hide()


  $('#imp_input_part .card').each(function(index) {

  
    var pre_process = "<span class='text-danger h6'> No Previous process</span>"
   
    if( $(this).data('process') != null)
       pre_process =  $(this).data('process')

    var partId =  $(this).data('part-id')
     var pre_process_id =  $(this).data('pre-process-id')
    var in_id =  $(this).data('id')
  var part_name =  $(this).data('part-name')
    var part_no =  $(this).data('part-no')
    var qty =  $(this).data('part-qty')
    

  $('#input_part_tbl').append(" <div class='card mt-1' data-part-id="+partId+"  data-pre-process-id="+pre_process_id+" data-part-qty="+qty+"  data-id="+in_id+ "> <div class='card-header '> <p class='my-auto'>"+part_no+"-"+ part_name+ " ("+  pre_process +")<br>Qty :" +qty+ "</p> </div> </div>")
  });

  if( $('#input_part_tbl .card').length>1)
    $('#delete_input_btn').show()
   else
   $('#delete_input_btn').hide()


  $('#imp_process .card').each(function(index) {

    var process =  $(this).data('process')
     var process_id =  $(this).data('id')
    var previous_process_id =  $(this).data('previous-process-id')
  var process_name =  $(this).find('h6').html()
 
    console.log(process_id);
    
  $('#process_tbl').append(" <div class='card mt-1' data-previous_process_id="+previous_process_id+ "  data-process-id="+process_id+" data-process="+process+  "> <div class='card-header'> <h6>"+process_name+"</h6> </div> </div>")
  });

    if( $('#process_tbl .card').length>1)
    $('#delete_prs_btn').show()
   else
   $('#delete_prs_btn').hide()
  
  $('#output_part_txt').data('out-part-id', $('#imp_output_part_txt').data('out-part-id'));
  $('#output_part_txt').html( $('#imp_output_part_txt').html())
  

  

  
 console.log($('#imp_output_part_txt').data('out-part-id'));
 

});

$('#add_process_btn').on('click', function() {
 
  var input_count =  $('#input_part_tbl .card').length;
  var process_count =  $('#process_tbl .card').length;

  if(input_count == 0)
  shw_toast("Input","Kindly enter Input part first")
else if(input_count>1 && process_count >=1)
{
  
  if(mode == 'prs_change')
    {
     var  processId =   $('#process_name').data('selected-process_id')
      update_process(processId,change_process_id)
    }
    else
    shw_toast("invalid","multiple input not allowed for multiple process")
}
  
else
{
 if($('#process_name').val() && $('#process_name').data('selected-process_id'))
 {
  issaved = 'no'
console.log(mode);
if(mode == 'prs_change')
  {
   var  processId =   $('#process_name').data('selected-process_id')
    update_process(processId,change_process_id)
  }
  else if(mode == 'edit')
    {
      var  processId =   $('#process_name').data('selected-process_id')
      insert_new_process(processId)
    }
  else
{
  $('#process_tbl').append(" <div class='card mt-1' data-process-id="+$('#process_name').data('selected-process_id')+ "> <div class='card-header'> <h6>"+$('#process_name').val()+"</h6> </div> </div>")
}
 
  $('#process_name').val('')

  $('#process_name').removeData('selected-process_id');
 }
 else{
  shw_toast("Insert","Kindly select Process from autocomplete")
 }
}


});


$('#delete_prs_btn').on('click', function() {
   issaved = 'no'
if(selected_process_tbl != "")
{
  swal({
    title: "Are you sure - delete? ",
    text: "You will not be recover this  again!",
    icon: "warning",
    buttons: [
      'No, cancel it!',
      'Yes, I am sure!'
    ],
    dangerMode: true,
  }).then(function(isConfirm) {
    if (isConfirm) {
      selected_process_tbl.remove();
 
if(change_process_id && mode == 'prs_change')

  {
    if(change_process_id == edit_process_id)
      delete_process('last')
    else
    delete_process('not-last')
  }
console.log(edit_process_id);
  
  
  
    }
  selected_process_tbl=""
  })
}
});


$('#delete_input_btn').on('click', function() {
  issaved = 'no'


  
if(selected_input_part_tbl != "")
{
 swal({
   title: "Are you sure - delete? ",
   text: "You will not be recover this  again!",
   icon: "warning",
   buttons: [
     'No, cancel it!',
     'Yes, I am sure!'
   ],
   dangerMode: true,
 }).then(function(isConfirm) {
   if (isConfirm) {
    $('#pa_nxt_prs .card').each(function() {
      console.log($(this).data('part-id') + " - "  + selected_input_part_tbl.data('part-id') +"<br>" +  $(this).data('process-id') +  " - " +selected_input_part_tbl.data('pre-process-id'));
      
      if ($(this).data('part-id') === selected_input_part_tbl.data('part-id') && $(this).data('process-id') === selected_input_part_tbl.data('pre-process-id') ) {
          $(this).fadeIn(500);
      }
  });
    selected_input_part_tbl.remove();

if(change_input_id && mode == 'in_change')
  delete_input_part(change_input_id)
 
   
  
  console.log(selected_input_part_tbl.data('part-id'));
   }
 selected_input_part_tbl=""

 })
}
});


$('#delete_imp_btn').on('click', function() {
  issaved = 'no'


  
if(edit_process_id != "")
{
 swal({
   title: "Are you sure - delete? ",
   text: "You will not be recover this  again!",
   icon: "warning",
   buttons: [
     'No, cancel it!',
     'Yes, I am sure!'
   ],
   dangerMode: true,
 }).then(function(isConfirm) {
   if (isConfirm) {
 
   
  delete_implement()
 
   
  
 
   }
 

 })
}
});


$("#input_part_tbl").on("click","tr td button", function(event) {
   issaved = 'no'
  //get button value
 var thisrow =  $(this);
swal({
  title: "Are you sure - delete? ",
  text: "You will not be recover this  again!",
  icon: "warning",
  buttons: [
    'No, cancel it!',
    'Yes, I am sure!'
  ],
  dangerMode: true,
}).then(function(isConfirm) {
  if (isConfirm) {
    thisrow.closest('tr').fadeOut(500, function() {
      $(this).remove();
   
    
  });

  $('#pa_nxt_prs .card').each(function() {
    if ($(this).data('part-id') === thisrow.closest('tr').data('part-id') && $(this).data('process-id') === thisrow.closest('tr').data('process-id') ) {
        $(this).fadeIn(500);
    }
});



  }

})


      });

});


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




function delete_implement()
{

$.ajax({
  url: "php/delete_implement.php",
  type: "get", //send it through get method
  data: {
    edit_process_id :  edit_process_id,

  },
  success: function (response) {
console.log(response);


if (response.trim() == "ok") {

  // Reload the page
   location.reload();
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}

function insert_new_process(processId)
{

$.ajax({
  url: "php/insert_nprocess.php",
  type: "get", //send it through get method
  data: {

    process_id : processId,
       edit_process_id : edit_process_id,
       input_part_id : sel_input_part_id,
       output_part_id : sel_output_part_id,
  },
  success: function (response) {
console.log(response);



if (response.trim()) {
  sessionStorage.setItem('editProcessId', response.trim());
  sessionStorage.setItem('breadcrumb', $('#out_breadcrumb').html());
  // Reload the page
   location.reload();
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}

function delete_process(mode)
{

$.ajax({
  url: "php/delete_process.php",
  type: "get", //send it through get method
  data: {
    mode :  mode,
    delete_process_id:change_process_id,
    edit_process_id : edit_process_id,
    input_part_id : sel_input_part_id,
    output_part_id : sel_output_part_id,


  },
  success: function (response) {
console.log(response);


if (response.trim()) {
  sessionStorage.setItem('editProcessId', response.trim());
  sessionStorage.setItem('breadcrumb', $('#out_breadcrumb').html());
  // Reload the page
   location.reload();
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}


function insert_new_input(input_part_id,previous_process_id,qty)
{

$.ajax({
  url: "php/insert_new_input.php",
  type: "get", //send it through get method
  data: {
    input_part_id :  input_part_id,
    previous_process_id :  previous_process_id,
    process_id : edit_process_id

  },
  success: function (response) {
console.log(response);


if (response.trim() == "ok") {
  sessionStorage.setItem('editProcessId', edit_process_id);
  sessionStorage.setItem('breadcrumb', $('#out_breadcrumb').html());
  // Reload the page
   location.reload();
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}


function delete_input_part(change_input_id)
{

$.ajax({
  url: "php/delete_input_part.php",
  type: "get", //send it through get method
  data: {
    change_input_id :  change_input_id,

  },
  success: function (response) {
console.log(response);


if (response.trim() == "ok") {
  sessionStorage.setItem('editProcessId', edit_process_id);
  sessionStorage.setItem('breadcrumb', $('#out_breadcrumb').html());
  // Reload the page
   location.reload();
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}


function update_output(edit_process_id,partId)
{

console.log(edit_process_id);


$.ajax({
  url: "php/update_output_part.php",
  type: "get", //send it through get method
  data: {
    output_part :  partId,
    process_id :  edit_process_id,


  },
  success: function (response) {
console.log(response);


if (response.trim() == "ok") {
  sessionStorage.setItem('editProcessId', edit_process_id);
  sessionStorage.setItem('breadcrumb', $('#out_breadcrumb').html());
  // Reload the page
   location.reload();
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}

function update_process(processId,change_process_id)
{

console.log(change_process_id);

$.ajax({
  url: "php/update_process.php",
  type: "get", //send it through get method
  data: {
    process :  processId,
    process_id :  change_process_id,


  },
  success: function (response) {
console.log(response);


if (response.trim() == "ok") {
  sessionStorage.setItem('editProcessId', edit_process_id);
  sessionStorage.setItem('breadcrumb', $('#out_breadcrumb').html());
  // Reload the page
  location.reload();
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}

function update_input(partId,processId,change_input_id,qty)
{


$.ajax({
  url: "php/update_input_part.php",
  type: "get", //send it through get method
  data: {
    input_part_id :  partId,
    previous_process_id :  processId,
    id :  change_input_id,
    qty : qty

  },
  success: function (response) {
console.log(response);


if (response.trim() == "ok") {
  sessionStorage.setItem('editProcessId', edit_process_id);
  sessionStorage.setItem('breadcrumb', $('#out_breadcrumb').html());
  
  // Reload the page
  location.reload();
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
newPartDes :  $('#newPartDes').val()

  },
  success: function (response) {
console.log(response);


if (response.trim() == "ok") {
  $('#newPartName').val(''),
   $('#newPartNo').val(''),
    $('#newPartDes').val('')
  // $("#addNewPartModal").modal('hide');
shw_toast("Added","Successfully Added")
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}




 
function get_implement_process(process_id){
   
  $.ajax({
    url: "php/get_implement_process.php",
    type: "get", //send it through get method
    data: {
    
      process_id:process_id
   },
    success: function (response) {
     console.log(response)
     
   if (response.trim() != "error") {
    if(response.trim() != "0 result")
{
  $('#imp_process').empty()
    var obj = JSON.parse(response);
   
   
var count =0;
   process_id_array =[]
    obj.forEach(function (obj) {

count = count +1;
$('#imp_process').append(" <div class='card mt-1' data-process="+obj.process+ " data-id="+obj.process_id + " data-previous-process-id="+obj.previous_process_id+  " data-cat="+obj.cat + " > <div class='card-header'> <h6>"+obj.process_name+"</h6> </div> </div>")
process_id_array.push(obj.process_id);
    });
    console.log(process_id_array);
    
    $('#imp_output').removeClass("d-none").addClass("d-flex");
    $('#imp_output').show()
    $('#breadcrumb1').show()
    $('#imp_final_output').removeClass("d-flex").addClass("d-none");
   $('#final_output_btn_grp').removeClass("d-none").addClass("d-flex");
    
  }
   }
   
   
   
   
      
    },
    error: function (xhr) {
        //Do Something to handle error
    }
   });
}


function get_implement_input(process_id){
   
  $.ajax({
    url: "php/get_implement_input.php",
    type: "get", //send it through get method
    data: {
    
      process_id:process_id
   },
    success: function (response) {
     console.log(response)
     
   if (response.trim() != "error") {
    if(response.trim() != "0 result")
{
  $('#imp_input_part').empty()
    var obj = JSON.parse(response);
   console.log(response);
   
var count =0;
   
    obj.forEach(function (obj) {

count = count +1;
$('#imp_input_part').append(" <div class='card av_nxt mt-1' data-pre-process-id="+obj.previous_process_id + " data-part-id="+obj.input_part_id   + " data-part-qty="+obj.qty  +" data-id="+ obj.id + " data-part-no="+obj.part_no + " data-part-name="+obj.part_name+  " data-process="+obj.process_name+ "> <div class='card-header d-flex justify-content-center'>"+ obj.part_name + "-"+ obj.part_no + "<br> Qty : "+obj.qty+"</div> <div class='card-body'> <i class='fa-solid fa-screwdriver-wrench pe-2'></i>"+ obj.process_name +"</div></div>")
sel_input_part_id = obj.input_part_id 
    });
    $('#imp_output').removeClass("d-none").addClass("d-flex");;
    $('#imp_output').show()
    $('#breadcrumb1').show()
    $('#imp_final_output').removeClass("d-flex").addClass("d-none");
   $('#final_output_btn_grp').removeClass("d-none").addClass("d-flex");
  edit_process_id = process_id
    
  }
   }
   
   
   
   
      
    },
    error: function (xhr) {
        //Do Something to handle error
    }
   });
}
  

function get_implement_output(process_id){
   
  $.ajax({
    url: "php/get_implement_output.php",
    type: "get", //send it through get method
    data: {
    
      process_id:process_id
   },
    success: function (response) {
     console.log(response)
     
   if (response.trim() != "error") {
    if(response.trim() != "0 result")
{
    var obj = JSON.parse(response);

   
var count =0;
   
    obj.forEach(function (obj) {

count = count +1;
$('#imp_output_part_txt').data('out-part-id', obj.output_part);
$('#imp_output_part_txt').html( obj.part_name + " - " +obj.part_no)
sel_output_part_id  = obj.output_part
$('#out_breadcrumb').append("<li class='breadcrumb-item'><a href='#' data-process-id='"+obj.process_id+"'>"+obj.part_name+"</a></li>") 

    });
    $('#imp_output').removeClass("d-none").addClass("d-flex");;
    $('#imp_output').show()
    $('#breadcrumb1').show()
   $('#final_output_btn_grp').removeClass("d-none").addClass("d-flex");
    
    $('#imp_final_output').removeClass("d-flex").addClass("d-none");
    
  }
   }
   
   
   
   
      
    },
    error: function (xhr) {
        //Do Something to handle error
    }
   });
}
  
   
  
function get_part_sts(process_id)
{
 

$.ajax({
  url: "php/get_part_sts.php",
  type: "get", //send it through get method
  data: {
  process_id:process_id
  },
  success: function (response) {

console.log(response);
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
valid_sts = obj.status
if (valid_sts == 'invalid')
  shw_toast("Output","Output Part already Assigned")
  });

 
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
  


  

   


function shw_toast(title,des,theme)
{

  
      $('.toast-title').text(title);
      $('.toast-description').text(des);
var toast = new bootstrap.Toast($('#myToast'));
toast.show();
}


function get_sel_imp()
{
 

$.ajax({
  url: "php/get_sel_imp.php",
  type: "get", //send it through get method
  data: {
  
  },
  success: function (response) {

console.log(response);
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {
  $('#output_part_sel').empty();
  $('#output_part_sel').append("<option value=0>Choose Options</option>")
  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;


$('#output_part_sel').append("<option value="+obj.process_id +">"+obj.part_name+"</option>")

  });

 
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

 

 
function get_final_imp()
{
 

$.ajax({
  url: "php/get_sel_process.php",
  type: "get", //send it through get method
  data: {
  
  },
  success: function (response) {

console.log(response);
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {
  $('#breadcrumb1').hide()
  
 $('#final_output_btn_grp').removeClass("d-flex").addClass("d-none");
  $('#imp_final_output').empty()
 $('#final_output_btn_grp').removeClass("d-flex").addClass("d-none");
  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;


$('#imp_final_output').append("<div class='card av_nxt' data-process-id="+obj.process_id + " data-part-id="+obj.output_part  + " data-part-no="+obj.part_no + " data-part-name="+obj.part_name+  " data-process="+obj.process_name+ "> <div class='card-header d-flex justify-content-center'>"+ obj.part_name + "-"+ obj.part_no + "</div> <div class='card-body'> <i class='fa-solid fa-screwdriver-wrench pe-2'></i>"+ obj.process_name +"</div></div>")

$('#imp_output').removeClass("d-flex").addClass("d-none");
$('#imp_final_output').removeClass("d-none").addClass("d-flex");
  });
  $('#out_breadcrumb').empty()

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

function get_ava_process()
{
 

$.ajax({
  url: "php/get_sel_process.php",
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
$('#pa_nxt_prs').append("<div class='card small my-1 av_nxt' data-process-id="+obj.process_id + " data-part-id="+obj.output_part  + " data-part-no='"+obj.part_no + "' data-part-name='"+obj.part_name+  "' data-process='"+obj.process_name+ "'> <div class='card-header d-flex justify-content-center'>"+ obj.part_name + "-"+ obj.part_no + "</div> <div class='card-body'> <i class='fa-solid fa-screwdriver-wrench pe-2'></i>"+ obj.process_name +"</div></div>")




  });

 
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


   
   function get_all_work(){
   
    $.ajax({
      url: "php/get_all_work.php",
      type: "get", //send it through get method
      data: {
      
     
     },
      success: function (response) {
       console.log(response)
       
     if (response.trim() != "error") {
      if(response.trim() != "0 result")
{
      var obj = JSON.parse(response);
     
var count =0;
     
      obj.forEach(function (obj) {

count = count +1;
       $("#work_all_table") .append("<tr><td>" + count + "</td><td>" + obj.work_type_name + "</td><td>"+"<button value='"+obj.work_type_id + "' type='button' class='btn text-danger' > <i class='fa-solid fa-trash-can'></i></button>"+"</td>  </tr> ")
      });
    }
     }
     
     
     
     
        
      },
      error: function (xhr) {
          //Do Something to handle error
      }
     });
  }


   function delete_work_report(work_type_id)
   {
    console.log(work_type_id)
      
       $.ajax({
           url: "php/delete_work_report.php",
           type: "get", //send it through get method
           data: {
            work_type_id: work_type_id
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

   function delete_work(work_type_id)
   {
      
       $.ajax({
           url: "php/delete_work.php",
           type: "get", //send it through get method
           data: {
            work_type_id: work_type_id
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

   function delete_work_type(work_type_id)
   {
      
       $.ajax({
           url: "php/delete_work_type.php",
           type: "get", //send it through get method
           data: {
            work_type_id: work_type_id
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
   function get_rwork_status(work_type)
   {
 $.ajax({
  url: "php/get_wstatus.php",
  type: "get", //send it through get method
  data: {
  work_type : work_type
   
 
 },
  success: function (response) {
 
 
 if (response.trim() != "error") {
  var obj = JSON.parse(response);
 
 var count = 0  
 $("#sel_rsts_in").empty();
 $("#sel_rsts_in").append(" <option value='" + 0 + "'>" + "Select Status..." + "</option>");
 $("#sel_rsts_in").append(" <option value='" +''+ "'>" + "create" + "</option>");
 $("#sel_rsts_in").append(" <option value='" +''+ "'>" + "assign" + "</option>");
 $("#sel_rsts_in").append(" <option value='" +''+ "'>" + "accept" + "</option>");
  obj.forEach(function (obj) {
      count = count + 1
    
     $("#sel_rsts_in").append(" <option value='" + count + "'>" + obj.work_status + "</option>");
 
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


   function get_work_status(work_type)
   {
 $.ajax({
  url: "php/get_wstatus.php",
  type: "get", //send it through get method
  data: {
  work_type : work_type
   
 
 },
  success: function (response) {
 
 
 if (response.trim() != "error") {
  var obj = JSON.parse(response);
 
 var count = 0  
 $("#sel_sts_in").empty();
 $("#sel_sts_in").append(" <option value='" + 0 + "'>" + "Select Status..." + "</option>");
  obj.forEach(function (obj) {
      count = count + 1
    
     $("#sel_sts_in").append(" <option value='" + count + "'>" + obj.work_status + "</option>");
 
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

   function insert_work_type_sql(status,type,work,reload_p)
   {
   

$.ajax({
  url: "php/insert_work_type.php",
  async :false,
  type: "get", //send it through get method
  data: {
 


    work_type_name : work,
    work_status  :status,
    status_type  : type
    

},
  success: function (response) {

   console.log(response);
if(reload_p == "yes")
{
window.location.reload();
}
    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }
  
   function insert_rwork()
   {
   

$.ajax({
  url: "php/insert_rwork.php",
  async :false,
  type: "get", //send it through get method
  data: {
 


    work_type : $('#sel_rwt_in :selected').text(),
    work_status  :$('#sel_rsts_in :selected').text(),
    report_cat  : $('#report_name').val()
    

},
  success: function (response) {

   console.log(response);

//window.location.reload();
get_all_report_type()

  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }

   function insert_pwork()
   {
   

$.ajax({
  url: "php/insert_pwork.php",
  async :false,
  type: "get", //send it through get method
  data: {
 


    work_type_id : $('#sel_wt_in :selected').val(),
    work_status  :$('#sel_sts_in :selected').text(),
    pipeline_work  : $('#sel_pwork_in :selected').text()
    

},
  success: function (response) {

   console.log(response);

window.location.reload();

    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }


   function get_all_work_type(){
   
      $.ajax({
        url: "php/get_all_work_type.php",
        type: "get", //send it through get method
        data: {
        
       
       },
        success: function (response) {
         console.log(response)
         
       if (response.trim() != "error") {
        if(response.trim() != "0 result")
{
        var obj = JSON.parse(response);
       
  var count =0;
       
        obj.forEach(function (obj) {

 count = count +1;
         $("#work_type_all_table") .append("<tr><td>" + count + "</td><td>" + obj.work_type_name + "</td><td>" + obj.work_status + "</td><td>" + obj.status_type + "</td> <td>" + obj.pipeline_work + "</td><td>"+"<button value='"+obj.id + "' type='button' class='btn text-danger' > <i class='fa-solid fa-trash-can'></i></button>"+"</td>  </tr> ")
        });
      }
       }
       
       
       
       
          
        },
        error: function (xhr) {
            //Do Something to handle error
        }
       });
    }

    function get_all_report_type(){
   
      $.ajax({
        url: "php/get_all_report_type.php",
        type: "get", //send it through get method
        data: {
        
       
       },
        success: function (response) {
         console.log(response)
         
       if (response.trim() != "error") {
        $("#report_type_all_table").empty()
        if(response.trim() != "0 result")
{
        var obj = JSON.parse(response);
       
  var count =0;
       
        obj.forEach(function (obj) {

 count = count +1;
         $("#report_type_all_table") .append("<tr><td>" + count + "</td><td>" + obj.report_cat + "</td><td>" + obj.comments + "</td><td>"+"<button value='"+obj.id + "' type='button' class='btn text-danger' > <i class='fa-solid fa-trash-can'></i></button>"+"</td>  </tr> ")
        });
      }
       }
       
       
       
       
          
        },
        error: function (xhr) {
            //Do Something to handle error
        }
       });
    }
   
    function get_work_type()
    {
  $.ajax({
   url: "php/get_work_type.php",
   type: "get", //send it through get method
   data: {
   
    
  
  },
   success: function (response) {
  
  
  if (response.trim() != "error") {
    if (response.trim() != "0 result") {
   var obj = JSON.parse(response);
  
  
  
   obj.forEach(function (obj) {
       
     
      $("#sel_wt_in").append(" <option value='" + obj.work_type_id + "'>" + obj.work_type_name + "</option>");
      $("#sel_pwork_in").append(" <option value='" + obj.work_type_id + "'>" + obj.work_type_name + "</option>");
      $("#sel_rwt_in").append(" <option value='" + obj.work_type_id + "'>" + obj.work_type_name + "</option>");
    
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