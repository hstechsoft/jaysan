
// 
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 
 var machine_id = 0;
 var part_id = 0;
 var part_image_addr = ""
 var nesting_array = []
 var pgid = 0;
 var nsid = 0
$(document).ready(function(){

 


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


 get_jaysan_final_product()

    check_login();
    get_jaysan_machine()
 
    
   $("#unamed").text(localStorage.getItem("ls_uname"))
$("#requirement_type").addClass("d-none")
$('.pipe :input').prop('disabled', true);
$('.rod :input').prop('disabled', true);
$('.sheet :input').prop('disabled', true);
      // $(".pipe").hide()
      // $(".rod").hide()
      // $(".sheet").hide()
  
      

      $('#create_machine').on('click', function()
      {
       
       $("#machine_modal").modal('show');
      
      });
   
      $('#create_group').on('click', function()
      {
       
       $("#group_modal").modal('show');
      
      });

      $('#material_type').change(function() {
     
     
      
        if($('#material_type').find(':selected').val() == "Sheet")
        {
        
            $('.pipe :input').prop('disabled', true);
            $('.rod :input').prop('disabled', true);
            $('.sheet :input').prop('disabled', false);
        }else if($('#material_type').find(':selected').val() == "Rod")
            {
            
                $('.pipe :input').prop('disabled', true);
                $('.rod :input').prop('disabled', false);
               $('.sheet :input').prop('disabled', true);
            }
            else if($('#material_type').find(':selected').val() == "Pipe")
                {
                
                  $('.pipe :input').prop('disabled', false);
                    $('.rod :input').prop('disabled', true);
                   $('.sheet :input').prop('disabled', true);
                }
         });
   

         $('#sample_btn').on('click', function()
         {
          
          $("#sample_modal").modal('show');
         
         });

         $('#product').change(function() {
          get_jaysan_final_productmodel()
           });

           $('#pmodel').change(function() {
            get_jaysan_final_producttype()
             });

             $('#ptype').change(function() {
               get_process_group()
               });

               $('#group_type').change(function() {
                get_sample_sts()
                });
 

             $('#add_group_btn').on('click', function()
              {
           
              
                if ($('#group_name').val() == "" || $('#group_name').val() == null) {
                  shw_toast("Error", "Please Enter Group Name", "error");
                  return;
                }
                else
                {
                  $('#group_type').append("<option value = '"+$('#group_name').val()+"'>"+$('#group_name').val()+"</option>")
                  $("#group_modal").modal('hide');
                   
                }
        
              
              });
             
 $('#add_machine_btn').on('click', function()
  {
    
    
    if($("#machine_add_form")[0].checkValidity())
      {
        insert_jaysan_machine()
      }
      else
      shw_toast("Error", "Please Fill All Fields", "error");
  
  });


  $('#machine_modal').on('shown.bs.modal', function () {
    get_jaysan_machine()
});

$('#machine_table').on('click', 'button', function() {
  var val = $(this).attr('val');
  var name = $(this).attr('name');
  var running_cost = $(this).closest('tr').find('td').eq(2).text()
  var machine_name = $(this).closest('tr').find('td').eq(1).text()
  if (name == "edit") {

    update_jaysan_machine(machine_name,running_cost,val)
  } else if (name == "delete") {

    {
      swal({
        title: "Are you sure - Delete? ",
        text: "You will not be recover this  again!",
        icon: "warning",
        buttons: [
          'No, cancel it!',
          'Yes, I am sure!'
        ],
        dangerMode: true,
      }).then(function(isConfirm) {
        if (isConfirm) {
          swal({
            title: 'Applied!',
            text: 'successfully Deleted!',
            icon: 'success'
          }).then(function() {
            
            delete_jaysan_machine(val) // <--- submit form programmatically
            
           
          });
        } else {
          swal("Cancelled", "lead is safe :)", "error");
        }
      })
      }
  }
});
$('#output_add_btn').on('click', function()
{
  if($("#output_part_form")[0].checkValidity() && part_id != 0)
  {
    console.log( $('#nesting_part_table').find("tr").length);
    var count = $('#nesting_part_table').find("tr").length + 1;
    $('#nesting_part_table').append(" <tr> <td>"+ count+"</td> <td data-part-id='"+part_id+"'>"+$('#part_name').val() + " - " + $('#part_no').val() +  "</td> <td contenteditable='true'>"+$('#rack').val() + "</td> <td contenteditable='true'>"+$('#bin').val() + "</td> <td contenteditable='true'>2</td> <td contenteditable='true'>"+$('#output_qty').val() + "</td> <td><button class='btn btn-outline-danger border-0'> <i class='fa fa-trash-o' aria-hidden='true'></i> </button></td> </tr>")

   
    part_id = 0;
  }
  else
  shw_toast("Error", "Please Fill All Fields", "error");

});

$("#output_part_form").on("submit", function (e) {


  // Reset the form after submission
  e.preventDefault(); // Prevent the default form submission
        $(this)[0].reset(); // Reset the form
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
                  part_no: item.part_no,
                  img_addr: item.part_image
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
            $('#spec_itemacc').show();
            part_id = ui.item.id;
            part_image_addr = ui.item.img_addr
            if(part_image_addr != "")
            {
              console.log(part_image_addr);
              
              var timestamp = new Date().getTime(); // Get current timestamp
               $('#part_photo_preview').attr("src", "attachment/parts/" + part_id  + "/" + part_image_addr + "?" + timestamp);
              
            }
$('#output_qty').focus()
          
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
                      part_name: item.part_name,
                      img_addr: item.part_image
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
                $('#spec_itemacc').show(); 
                part_id = ui.item.id;
                part_image_addr = ui.item.img_addr
                if(part_image_addr != "")
                  {
                    var timestamp = new Date().getTime(); // Get current timestamp
                     $('#part_photo_preview').attr("src", "attachment/parts/" + part_id  + "/" + part_image_addr + "?" + timestamp);
                  }
                  $('#output_qty').focus()
              } ,
       
            }).autocomplete("instance")._renderItem = function(ul, item) {
              return $("<li>")
                  .append("<div><strong>" + item.part_name + "</strong> - " + item.value + "</div>")
                  .appendTo(ul);
          };
          }
         
         });


         $('#part_photo_preview').click(function () {
  
          if(part_id != 0 && part_image_addr =="" )
             $("#part_photo_up").trigger("click");
         
             
            });


            $('#part_photo_up').on('change',function ()
           {
           var property =this.files[0];
           
           
           part_image_addr = upload_sv(property,"delivery_photo","#part_photo_preview"); 
           
           });


         
  
          $('#nesting_upload').on('change',function (e)
          {
           
            {
              var property =this.files[0];
              upload_nesting(property,"nesting"); 
              // $(this).prop("disabled", true);
            }
           
          })


          $('#add_nesting_btn').on('click', function()  
          {
if($('#nesting_part_table').find("tr").length == 0)
{
  shw_toast("Error", "Please Add Parts", "error");
  return;
}
else if(pgid == 0)
{
  shw_toast("Error", "Please Create process group", "error");
  $('#add_process_group_btn').focus()
  $('#add_process_group_btn').addClass("blink")
  return;
}

else
{

   if($('#pmodel').val() != '' && $('#ptype').val() != '' && $('#material_name').val() != '' && $('#material_type').val() != '' && $('#nesting_name').val() != '')
  {
     nesting_array = []
    $('#nesting_part_table tr').each(function(row, tr){
      let nesting_array_parts ={
          "part_id" : $(tr).find('td:eq(1)').data('part-id'),
          "rack" : $(tr).find('td:eq(2)').text(),
          "bin" : $(tr).find('td:eq(3)').text(),
          "qty" : $(tr).find('td:eq(5)').text()
      }

   nesting_array.push(nesting_array_parts);
  });
  console.log(nesting_array);
  insert_nesting_output_part()
  }
   else
  {
    shw_toast("Error", "Please Fill All Required Fields", "error");
    return;
  }

        }

});

$('#add_process_group_btn').on('click', function()
{

    if($("#process_group_form")[0].checkValidity())
      {
        insert_process_group()
      }
});

$('#update_sample_btn').on('click', function()    
{
  update_process_group()
});

$('#process_group_tbl').on('click', 'button', function() { 
   console.log($(this).attr('name'));
   if($(this).attr('name') == "edit")
   {
 nsid = $(this).val()
 $('#output_add_btn').addClass("d-none")
 $('#output_update_btn').removeClass("d-none")
 $('#add_nesting_btn').addClass("d-none")
 $('#update_nesting_btn').removeClass("d-none")
   get_nesting_output()
   get_jaysan_nesting()
   }
});
$('#nesting_part_table').on('click', 'button', function() { 
  
  if($(this).attr('name') == "delete_nes")
  {
var nsoid = $(this).val()
    {
      swal({
        title: "Are you sure - Delete? ",
        text: "You will not be recover this  again!",
        icon: "warning",
        buttons: [
          'No, cancel it!',
          'Yes, I am sure!'
        ],
        dangerMode: true,
      }).then(function(isConfirm) {
        if (isConfirm) {
          swal({
            title: 'Applied!',
            text: 'successfully Deleted!',
            icon: 'success'
          }).then(function() {
            
            delete_nesting_output( nsoid) // <--- submit form programmatically

            
           
          });
        } else {
          swal("Cancelled", "lead is safe :)", "error");
        }
      })
      }
  }
});

$("#output_update_btn").on('click', function()
{
  if(part_id != 0 && $('#output_qty').val() != "" )
  {
    insert_nesting_output_part_single()
 
  }
  else
  shw_toast("Error", "Please Fill Required Fields", "error");

})


$('#update_nesting_btn').on('click', function()  
{
  

    if($('#pmodel').val() != '' && $('#ptype').val() != '' && $('#material_name').val() != '' && $('#material_type').val() != '' && $('#nesting_name').val() != '')
   {
     
  
   update_nesting()
   }
    else
   {
     shw_toast("Error", "Please Fill All Required Fields", "error");
     return;
   }
 
         
})
})

function get_jaysan_nesting()
{
 

$.ajax({
  url: "php/get_jaysan_nesting.php",
  type: "get", //send it through get method
  data: {
  nsid : nsid

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
$('#nesting_name').val(obj.nesting_name)
$('#material_qty').val(obj.material_qty)
$('#machine').val(obj.machine_id)
$('#run_time').val(obj.run_time)
$('#buffer_time').val(obj.buffer_time)
$('#material_name').val(obj.material_name)
$('#material_type').val(obj.material_type).trigger('change');

$('#material_length').val(obj.material_length)
$('#material_width').val(obj.material_width)
$('#material_thickness').val(obj.material_thickness)
$('#material_innerdia').val(obj.material_innerdia)
$('#material_outterdia').val(obj.material_outterdia)
$('#material_dia').val(obj.material_dia)
$('#material_weight').val(obj.material_weight)
$('#material_name').focus()

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
function update_nesting()
{
 
 

$.ajax({
  url: "php/update_nesting.php",
  type: "get", //send it through get method
  data: {
  
nsid : nsid,
material_name : $('#material_name').val(),
material_type : $('#material_type').val(),
material_length : $('#material_length').val(),
material_width : $('#material_width').val(),
material_thickness : $('#material_thickness').val(),
material_weight : $('#material_weight').val(),
material_innerdia : $('#material_innerdia').val(),
material_outterdia : $('#material_outter_dia').val(),
material_dia : $('#material_dia').val(),

nesting_name : $('#nesting_name').val(),
attachment : "nesting.pdf",
material_qty : $('#material_qty').val(),
machine_id : $('#machine').val(),
run_time : $('#run_time').val(),
buffer_time : $('#buffer_time').val(),
created_by : current_user_id,







  },
  success: function (response) {
console.log(response);


if (response.trim() == "ok") {

// location.reload()
// Clear all input fields
$('#material_name').val('');
$('#material_type').val('');
$('#material_length').val('');
$('#material_width').val('');
$('#material_thickness').val('');
$('#material_weight').val('');
$('#material_innerdia').val('');
$('#material_outterdia').val('');
$('#material_dia').val('');
$('#nesting_name').val('');
$('#material_qty').val('');
$('#machine').val('');
$('#run_time').val('');
$('#buffer_time').val('');
nsid = 0
$('#nesting_part_table').empty()
// location.reload()

get_process_group_all()
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}


function insert_nesting_output_part_single()
{
 

$.ajax({
  url: "php/insert_nesting_output_part_single.php",
  type: "get", //send it through get method
  data: {
  nsid : nsid,
part_id : part_id,
qty :  $('#output_qty').val(),
rack :  $('#rack').val(),
bin :  $('#bin').val()

  },
  success: function (response) {

console.log(response);

if (response.trim() == "ok") {

  get_nesting_output()
  shw_toast("Success", "Addes", "success");

}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}



function delete_nesting_output(nsoid)
{
 

$.ajax({
  url: "php/delete_nesting_output.php",
  type: "get", //send it through get method
  data: {
  nopid : nsoid
  },
  success: function (response) {

console.log(response);

if (response.trim() != "error") {

 if (response.trim() == "ok")
 {

 get_nesting_output()
 shw_toast("Success", "Deleted", "success");

 
}
else{
// $("#@id@") .append("<td colspan='3' scope='col'>No Data</td>");

}
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}


function get_nesting_output()
{
 

$.ajax({
  url: "php/get_nesting_output.php",
  type: "get", //send it through get method
  data: {
  nsid : nsid
  },
  success: function (response) {



    $('#nesting_part_table').empty()
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
    
var process_qty = $('#process_qty').val() || 1;
var tc = process_qty * obj.qty;
$('#nesting_part_table').append(" <tr> <td>"+count+"</td> <td> "+obj.part_no+"</td> <td> "+obj.rack+"</td> <td> "+obj.bin+" <td> "+obj.qty+"</td><td>"+tc+"</td><td><button value = ' "+obj.nopid+"' name='delete_nes' class='btn btn-outline-danger border-0'><i class='fa-solid fa-trash-can'></i></button></td> </tr>")



  });

 
}
else{
// $("#@id@") .append("<td colspan='3' scope='col'>No Data</td>");

}
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}

function get_process_group_all()
{
 

$.ajax({
  url: "php/get_process_group_all.php",
  type: "get", //send it through get method
  data: {
  pgid : pgid
  },
  success: function (response) {

console.log(response);

    $('#process_group_tbl').empty()
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
     var run_time = Number(obj.run_time)*Number(obj.material_qty)
     var buffer_time = Number(obj.buffer_time)*Number(obj.material_qty)
     var total = Number(run_time) + Number(buffer_time) 
     console.log(run_time);

$('#process_group_tbl').append(" <tr> <td>"+count+"</td> <td> "+obj.raw_material+"</td> <td> "+obj.nesting_name+"</td> <td> "+obj.part+" </td> <td><a href='attachment/nesting/"+obj.nsid+"/nesting.pdf' target='_blank' class='btn btn-outline-danger border-0'><i class='fa-solid fa-file-pdf'></i></a></td> <td> "+formatTime(obj.run_time)+"</td> <td> "+formatTime(obj.buffer_time)+"</td> <td> "+obj.material_qty+"</td><td>"+formatTime(total)+"</td> <td><button value = ' "+obj.nsid+"' name='edit' class='btn btn-outline-secondary border-0'><i class='fa-solid fa-pen-to-square'></i></button></td> <td><button value = ' "+obj.nsid+"' name='delete' class='btn btn-outline-danger border-0'><i class='fa-solid fa-trash-can'></i></button></td> </tr>")



  });

 
}
else{
// $("#@id@") .append("<td colspan='3' scope='col'>No Data</td>");

}
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}

function formatTime(minutes) {
  const days = Math.floor(minutes / 1440);
  minutes %= 1440;
  const hours = Math.floor(minutes / 60);
  minutes %= 60;

  let result = [];
  if (days > 0) result.push(`${days} day${days > 1 ? 's' : ''}`);
  if (hours > 0) result.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0) result.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);

  return result.length ? result.join(' ') : '0 minutes';
}

// Example usage:
let formattedTime = formatTime(1500); // For 1525 minutes
console.log(formattedTime); // Output: "1 day 1 hour 5 minutes"



function update_process_group()
{
 

$.ajax({
  url: "php/update_process_group.php",
  type: "get", //send it through get method
  data: {
  sample_sts :  $('#sample_sts').val(),
pgid : pgid

  },
  success: function (response) {
console.log(response);


if (response.trim() == "ok") {

  $('#sample_txt').text($('#sample_sts').val())
  $("#sample_modal").modal('hide');

}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}



function get_sample_sts()
{
 console.log($('#group_type').val());


$.ajax({
  url: "php/get_sample_sts.php",
  type: "get", //send it through get method
  data: {
  pgid :  $('#group_type').val()

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
$('#sample_txt').closest(".col").removeClass("d-none")
$('#sample_txt').text(obj.sample_sts)
pgid =  $('#group_type').val()
  get_process_group_all()
$('#add_process_group_btn').attr("disabled", true);
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

function get_process_group()
{
 

$.ajax({
  url: "php/get_process_group.php",
  type: "get", //send it through get method
  data: {
  type_id :  $('#ptype').val(),
model_id :  $('#pmodel').val()

  },
  success: function (response) {

console.log(response);
$('#group_type').empty()
$('#group_type').append("<option value='' selected disabled>Choose Options...</option>")
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
$('#group_type').append("<option value = '"+obj.pgid +"'>"+obj.group_name+"</option>")

console.log($('#sample_txt').closest(".col").html());


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

function insert_process_group()
{
 

$.ajax({
  url: "php/insert_process_group.php",
  type: "get", //send it through get method
  data: {
  type_id :  $('#ptype').val(),
group_name :  $('#group_type').val(),
sample_sts :  $('#sample_txt').text(),
process_qty :  $('#process_qty').val(),
model_id :  $('#pmodel').val()

  },
  success: function (response) {
console.log(response);


if (response.trim() != "error") {
pgid = response.trim()
$("#process_group_form :input").prop("disabled", false);
get_process_group()
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}




function insert_nesting_output_part()
{
 console.log(nesting_array);
 

$.ajax({
  url: "php/insert_nesting_output_part.php",
  type: "get", //send it through get method
  data: {
    ptype : $('#ptype').val(),
pmodel : $('#pmodel').val(),
    process_qty: $('#process_qty').val(), 
    group_name: $('#group_type').val(), 
    sample_sts : $('#sample_txt').text(),
nesting_array : nesting_array,

material_name : $('#material_name').val(),
material_type : $('#material_type').val(),
material_length : $('#material_length').val(),
material_width : $('#material_width').val(),
material_thickness : $('#material_thickness').val(),
material_weight : $('#material_weight').val(),
material_innerdia : $('#material_innerdia').val(),
material_outterdia : $('#material_outter_dia').val(),
material_dia : $('#material_dia').val(),

nesting_name : $('#nesting_name').val(),
attachment : "nesting.pdf",
material_qty : $('#material_qty').val(),
machine_id : $('#machine').val(),
run_time : $('#run_time').val(),
buffer_time : $('#buffer_time').val(),
created_by : current_user_id,
pgid : pgid






  },
  success: function (response) {
console.log(response);


if (response.trim() == "ok") {

nesting_array = []
get_process_group_all()
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}





function upload_nesting(property,upload_type)
{



 
  {
    var file_name = property.name;
    var file_extension = file_name.split('.').pop().toLowerCase();


    var form_data = new FormData();
    form_data.append("file",property);
    form_data.append("nsid",nsid);
  

    $.ajax({
     xhr: function() {
         var xhr = new window.XMLHttpRequest();
     
         xhr.upload.addEventListener("progress", function(evt) {
           if (evt.lengthComputable) {
             var percentComplete = evt.loaded / evt.total;
             percentComplete = parseInt(percentComplete * 100);
             console.log(percentComplete);
            
             if (percentComplete === 100) {
             
               shw_toast("Done","Uploaded Done")
             }
     
           }
         }, false);
     
         return xhr;
       },
        url:'upload_nesting.php',
        method:'POST',
        data: form_data,
     
        contentType:false,
        cache:false,
        processData:false,
        beforeSend:function(){
       
        },
        success:function(response){
    console.log(response)
       
      
     

    
   
        }
        
      });
    
}

}

function upload_sv(property,fname,preview)
{
  if (!property) {
    return; // No file selected
}
  var file_name = property.name;
  var file_extension = file_name.split('.').pop().toLowerCase();
{
 var form_data = new FormData();
 form_data.append("file",property);
 form_data.append("part_id",part_id);
 form_data.append("part_no",  $('#part_no').val());
 form_data.append("file_name",part_id + "." + file_extension);

   
     // Show the overlay and reset progress bar
    
 
      $.ajax({
          url:'upload_part_image.php',
          method:'POST',
          data:form_data,
          contentType:false,
          cache:false,
          processData:false,
          beforeSend:function(){
          //  $('#msg').html('Loading......');
          console.log('Loading......');
         
          },
         
          success:function(data){
          
         
           console.log(data);
           // $('#msg').html(data);
           var timestamp = new Date().getTime(); // Get current timestamp
          
           $(preview).attr("src", "attachment/parts/" + part_id  + "/" + part_id + "." + file_extension + "?" + timestamp);
         
           $('#add_part_submit').hide();
        
          }
        });
      
  }
return  "attachment/parts/"+ part_id + "/" + part_id+ "." + file_extension
}

function delete_jaysan_machine(jmid)
{
 

$.ajax({
  url: "php/delete_jaysan_machine.php",
  type: "get", //send it through get method
  data: {
 
jmid : jmid	

  },
  success: function (response) {


if (response.trim() == "ok") {
shw_toast("Success", "Machine Deleted", "success");
  get_jaysan_machine()

}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}

function update_jaysan_machine(machine_name,running_cost,jmid)
{
 

$.ajax({
  url: "php/update_jaysan_machine.php",
  type: "get", //send it through get method
  data: {
  machine_name : machine_name,
running_cost : running_cost,
jmid : jmid	

  },
  success: function (response) {


if (response.trim() == "ok") {
shw_toast("Success", "Machine Updated", "success");
  get_jaysan_machine()

}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}






function get_jaysan_machine()
{
 

$.ajax({
  url: "php/get_jaysan_machine.php",
  type: "get", //send it through get method
  data: {
  
  },
  success: function (response) {


    $('#machine_table').empty()
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
$('#machine_table').append("<tr><td>"+count+"</td><td contenteditable='true'>"+obj.machine_name+"</td><td contenteditable='true'>"+obj.running_cost+"</td> <td><button type = 'button' name = 'edit' val= '"+obj.jmid+"' class='btn btn-outline-secondary border-0 btn-sm'><i class='fa fa-pencil' aria-hidden='true'></i></button></td> <td><button type = 'button' name ='delete' val= '"+obj.jmid+"' class='btn btn-outline-danger border-0 btn-sm'><i class='fa fa-trash' aria-hidden='true'></i></button></td></tr>")

$('#machine').append("<option value = '"+obj.jmid+"'>"+obj.machine_name+"</option>")

  });

 
}
else{
// $("#@id@") .append("<td colspan='3' scope='col'>No Data</td>");

}
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}

function insert_jaysan_machine()
{
 

$.ajax({
  url: "php/insert_jaysan_machine.php",
  type: "get", //send it through get method
  data: {
  machine_name :  $('#machine_name').val(),
running_cost :  $('#running_cost').val()

  },
  success: function (response) {


if (response.trim() == "ok") {
shw_toast("Success", "Machine Added", "success");
  get_jaysan_machine()

}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}




function get_jaysan_final_producttype()
{
 
$.ajax({
  url: "php/get_jaysan_final_producttype.php",
  type: "get", //send it through get method
  data: {
  model_id :   $('#pmodel').val()
 

  },
  success: function (response) {
    $('#ptype').removeAttr('disabled')
    $('#ptype').empty()
    $('#ptype').append("<option value='' selected disabled>Choose Options...</option>")
console.log(response);

if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
$('#ptype').append("<option value = '"+obj.mtid+"'>"+obj.type_name+"</option>")

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


function get_jaysan_final_productmodel()
{
 
console.log( $('#product').val());

$.ajax({
  url: "php/get_jaysan_final_productmodel.php",
  type: "get", //send it through get method
  data: {
  product_id :   $('#product').val()
 

  },
  success: function (response) {
    $('#pmodel').removeAttr('disabled')
    $('#pmodel').empty()
    $('#pmodel').append("<option value='' selected disabled>Choose Options...</option>")
console.log(response);

if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
$('#pmodel').append("<option value = '"+obj.model_id+"'>"+obj.model_name+"</option>")

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



function get_jaysan_final_product()
{
 

$.ajax({
  url: "php/get_jaysan_final_product.php",
  type: "get", //send it through get method
  data: {
  
  },
  success: function (response) {

    $('#product').empty()
    $('#product').append("<option value='' selected disabled>Choose Options...</option>")
if (response.trim() != "error") {
console.log(response);

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
$('#product').append("<option  value = '"+obj.product_id+"'>"+obj.product_name+"</option>")

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