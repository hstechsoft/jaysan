
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 
 var physical_stock_array = [];
 var mrf_id_g = 0;
 var tally_mrf_id_g = 0;
 var uom1 = " Nos";
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

 $("#material_requset_form_table").closest("table").hide();

 $("#print_container").load('material_request_form_report.html',
  function() { 
  $("#mrf_print_btn").on("click", function(event) {
  event.preventDefault();
  // TODO: handle click here


    $('#mrf_report_table').printThis({
        
      

});
});
 

  });

    check_login();
    get_all_internal_godown()
    
    
  $("#unamed").text(localStorage.getItem("ls_uname"))



 physical_stock_array = [];


// insert_material_request_form();

$('#part_no').on('input',function(){
   //check the value not empty
       if($('#part_no').val() !="")
       {
         $('#part_no').autocomplete({
           //get data from databse return as array of object which contain label,value

           source: function(request, response) {
             $.ajax({
               url: "php/mrf_partname_autocomplete.php",
               type: "get", //send it through get method
               data: {
               part_name : $("#part_no").val()


             },
             dataType: "json", 
               success: function (data) {

             console.log(data);
             response($.map(data, function(item) {
               return {

                   label: item.part_name + "-" + item.part_no + "(" + item.total_count + ")", // label show in input field when select
                   value: item.part_name,
                   id: item.part_id,
                   part_name: item.part_name,
                   reorder_qty: item.reorder_qty,
                   min_order_qty : item.min_order_qty
               };
           }));

               }

             });
           },
           minLength: 2,
           cacheLength: 0,
           select: function(event, ui) {

             $(this).data("selected-part_id", ui.item.id);
            $("#minimum_order_qty").val(ui.item.min_order_qty);
            $("#reorder_quantity").val(ui.item.reorder_qty);


           } ,

         }).autocomplete("instance")._renderItem = function(ul, item) {
           return $("<li>")
               .append("<div><strong>" + item.part_name + "</strong> - " + item.value + "</div>")
               .appendTo(ul);
       };
       }

      });

$("#tally_stock_update_btn").on("click", function(event) {
  event.preventDefault();
  // TODO: handle click here
      $("#tally_stock_update_btn").prop("disabled", true);
update_material_request_form_tally();
  $("#tally_stock_update_btn").addClass("d-none");
});


      $("#add_btn").on("click", function(event) {
        event.preventDefault();
        // TODO: handle click here


        if($("#godown_select").val()==null || $("#tally_stock_input").val() == "")
      shw_toast("Invalid","Enter All Details","")
    else
    {
      var godown_name = $("#godown_select option:selected").text();
      var godown_id = $("#godown_select").val();

    $("#stock_table_body").append("<tr data-godown-id='"+godown_id+"'> <td>"+godown_name+"</td> <td>"+$("#tally_stock_input").val() + uom1 +"</td> <td><button type='button' class='btn btn-outline-danger border-0 ' id=''><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>");
    }
    $("#godown_select").val("");
    $("#tally_stock_input").val("");
    
      });

$("#stock_table_body").on("click", "tr td button",function(event) {
  event.preventDefault();
  // TODO: handle click here
  var thisrow= $(this).closest("tr")
  
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
  
         thisrow.remove()
  
  
        });
      } else {
        swal("Cancelled", "This is safe :)", "error");
      }
    })
    }
});
var sts_array = ["tally_stock_approved"];
get_material_request_form_list(sts_array,current_user_id,"tally_stock_approved");

var sts_array_tally = ["created"];
get_material_request_form_list_tally(sts_array_tally,'all');

$("#material_requset_form_tally_table").on("click", "tr", function(event) {
    event.preventDefault();
    $("#material_requset_form_tally_table").find("tr").removeClass("table-active");
    $(this).addClass("table-active");
  tally_mrf_id_g = $(this).find("button.print").val();
  
  $('#details').text(" part Name : "+ $(this).data("part_name"))
  get_phy_stock_details(tally_mrf_id_g);
    });

    $("#material_requset_form_tally_table").on("click", "tr td button", function(event) {
  // var mrf_id = $(this).val();
  // get_material_request_form_details_print(mrf_id);

     if ($(this).hasClass("print")) {
      var mrf_id = $(this).val();
      
    $(this).closest("tr").siblings().hide();
  $(this).closest("tr").show();
  $(this).addClass("d-none");
  $(this).siblings().removeClass("d-none");
  get_material_request_form_details_print(mrf_id);

    }
if ($(this).hasClass("view_hide")) {
  var mrf_id = $(this).val();
  $(this).closest("tr").siblings().show();
  $(this).closest("tr").show();
     $(this).addClass("d-none");
  $(this).siblings().removeClass("d-none");

  $("#mrf_report_card").addClass("d-none");
}
  
    });

$("#material_requset_form_table").on("click", "tr td button", function(event) {
  event.preventDefault();
  if ($(this).hasClass("edit")) {
    var mrf_id = $(this).val();
    
    if($("#tally_stock_update_btn").hasClass("d-none") == true)

      {
        $("#tally_stock_update_btn").removeClass("d-none");
        $("#tally_stock_add_btn").addClass("d-none");
     
      }

   $('html, body').animate({
          scrollTop: 0
        }, 500);

        // Remove highlight from all rows
        $("#material_requset_form_table tr").removeClass("table-active");
        // Highlight the selected row
        $(this).closest("tr").addClass("table-active");

        get_tally_stock_details(mrf_id);
  }


     if ($(this).hasClass("print")) {
      var mrf_id = $(this).val();
      
    $(this).closest("tr").siblings().hide();
  $(this).closest("tr").show();
  $(this).addClass("d-none");
  $(this).siblings().removeClass("d-none");
  get_material_request_form_details_print(mrf_id);

    }
if ($(this).hasClass("view_hide")) {
  var mrf_id = $(this).val();
  $(this).closest("tr").siblings().show();
  $(this).closest("tr").show();
     $(this).addClass("d-none");
  $(this).siblings().removeClass("d-none");

  $("#mrf_report_card").addClass("d-none");
}
});

$("#tally_stock_add_btn").on("click", function(event) {
  event.preventDefault();
  // TODO: handle click here
  if(tally_mrf_id_g > 0 && $("#stock_table_body tr").length > 0)
  {
    $("#tally_stock_add_btn").prop("disabled", true);
insert_internal_godown_stock_tally();

  }

  else
  {
    shw_toast("Invalid","Select Material Request Form and Add Stock","")
  }
});

$("#switch_view").on("change", function(event) {

 $("#material_requset_form_table").closest("table").toggle();
 $("#material_requset_form_tally_table").closest("table").toggle();
});
});



function update_material_request_form_tally()
{
  $("#stock_table_body tr").each(function() {
    var godown_id = $(this).data("godown-id");    
    var qty = parseInt($(this).find("td").eq(1).text());
    physical_stock_array.push({
      godown_id: godown_id,
      qty: qty
    });
  });
  // your logic here
 
  $.ajax({
    url: "php/update_material_request_form_tally.php",
    type: "get", //send it through get method

    data: {
   tally_stock_approved_by :  current_user_id,
mrf_id : mrf_id_g,
root_cause : $("#root_cause_text").val(),
preventive_action : $("#preventive_action_text").val(), 
corrective_action : $("#corrective_action_text").val(),
tally_stock_array : JSON.stringify(physical_stock_array),

    },
    success: function (response) {
      console.log(response);
      if (response.trim() == "ok") {
       location.reload();
      } else {
        salert("Error", "Failed to update material request form", "error");
      }
    },
    error: function (xhr) {
      //Do Something to handle error
      salert("Error", "An error occurred while updating material request form", "error");
    }
  });
}



  function get_phy_stock_details(mrf_id)
   {
    
   
   $.ajax({
     url: "php/get_phy_stock_details.php",
     type: "get", //send it through get method
     data: {
     mrf_id : mrf_id

     },
     success: function (response) {
   console.log(response);
  
   $('#physical_stock_info').empty();
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 

   var receive_sts = "<i class='fa fa-thumbs-o-up text-success h6' aria-hidden='true'></i>"
     obj.forEach(function (obj) {
        count = count +1;
        
if( obj.uom != "")
{
uom1 = " " + obj.uom;
}





$("#details").text( $("#details").text() + uom1);
$('#physical_stock_info').append("<tr><td>"+count+"</td><td>"+obj.godown_name+"</td><td>"+obj.qty+"</td></tr>")
$("#last_purchase_date").text("last Purchase  : " + obj.last_purchase_date + " (Qty :" + obj.last_purchase_qty + ")");
if(obj.material_receipt_status == 1)
$("#material_receive_sts").html(receive_sts);

else
  receive_sts = "<i class='fa fa-thumbs-o-down text-danger h6' aria-hidden='true'></i>"
  $("#material_receive_sts").html(receive_sts);

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

  function get_tally_stock_details(mrf_id)
   {
    
   
   $.ajax({
     url: "php/get_internal_godown_stock_tally.php",
     type: "get", //send it through get method
     data: {
     mrf_id : mrf_id

     },
     success: function (response) {
   console.log(response);
   mrf_id_g = mrf_id;
   
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
  
   
     obj.forEach(function (obj) {
        count = count +1;
$('#stock_table_body').append("<tr  data-godown-id='"+obj.godown_id+"'><td>"+obj.godown_name+"</td><td>"+obj.qty+"</td><td><button type='button' class='btn btn-outline-danger border-0 ' id=''><i class='fa fa-trash' aria-hidden='true'></i></button></td></tr>")

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

 function get_material_request_form_list_tally(sts_array, emp_id)
   {
    
   
   $.ajax({
     url: "php/get_material_request_form_list_tally.php",
     type: "POST", //send it through get method
     data: {
     status : JSON.stringify(sts_array),
    emp_id : emp_id

     },
     success: function (response) {
console.log(response);

   
   
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
 
 
     obj.forEach(function (obj) {
      console.log(obj.status);
    

var emp_invalved_list = [];
emp_invalved_list.push("Created by " + obj.emp_name);

if (obj.tally_stock_approved_by != null && obj.tally_stock_approved_by != "" && obj.tally_stock_approved_by != "0") {
  emp_invalved_list.push("Tally Stock Approved by " + obj.tally_stock_approved_by_name);
}
if (obj.purchase_requested_by != null && obj.purchase_requested_by != "" && obj.purchase_requested_by != "0") {
  emp_invalved_list.push("Purchase Requested by " + obj.purchase_requested_by);
}
if (obj.purchase_verified_by != null && obj.purchase_verified_by != "" && obj.purchase_verified_by != "0") {
  emp_invalved_list.push("Purchase Verified by " + obj.purchase_verified_by);
}
if (obj.purchase_approved_by != null && obj.purchase_approved_by != "" && obj.purchase_approved_by != "0") {
  emp_invalved_list.push("Purchase Approved by " + obj.purchase_approved_by);
}
var emp_invalved = "<ul class='list-group small'><li class='list-group-item small m-0 p-0'>" + emp_invalved_list.join("</li><li class='list-group-item  m-0 p-0 small'>") + "</li></ul>";


   
var order_type_badge = "";

if(obj.order_type == "Regular")
{
order_type_badge =   "<span class='ms-1 badge bg-success'>R</span>"
}
else if(obj.order_type == "Emergency")
{
  order_type_badge =   "<span class='ms-1 blink badge bg-danger'>E</span>"
}

var commitment_sts = "";
if(obj.commitment_date != null && obj.commitment_date != "" && obj.commitment_date != "0" && obj.commitment_date != "undefined")
{
  commitment_sts = "<i class='fa-solid fa-hourglass-start'></i>"
}
else
{
  commitment_sts = "<i class='fa-solid fa-hourglass-start'></i>"
  // commitment_sts = obj.commitment_date
} 


        count = count +1;
// $('#material_requset_form_tally_table').append(
//   "<tr><td>"+count+"</td><td>"+obj.part_name+"</td><td>"+obj.req_date_format+"</td><td><div class='accordion' id='acc1_"+obj.mrf_id+"'> <div class='accordion-item'> <h2 class='accordion-header'> <button class='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#collapse1_"+obj.mrf_id+"' aria-expanded='false' aria-controls='collapse1_"+obj.mrf_id+"'> History </button> </h2> <div id='collapse1_"+obj.mrf_id+"' class='accordion-collapse collapse' data-bs-parent='#acc1_"+obj.mrf_id+"'> <div class='accordion-body'><ul class='list-group'> "+obj.form_history+"</ul> </div> </div> </div></div></td><td>"+obj.dated_format+"</td><td><button type='button'  value='"+obj.mrf_id+"' class='btn btn-outline-danger border-0 print btn-animate' id=''><i class='fa fa-print' aria-hidden='true'></i></button></td></tr>"
// );
$('#material_requset_form_tally_table').append(
  "<tr data-part_name = '" +obj.part_name+  "'><td style='max-width:30px'>"+count+"</td><td><ul class='list-group ' ><li class='list-group-item '> <div class='d-flex justify-content-between align-content-around'> <div class = 'small'><span class='text-bg-light fw-bold'>  "+obj.mrf_id + ". </span>"+ obj.part_name+order_type_badge+"<span class='ms-1 small  badge bg-primary '>"+obj.total_part_count+"</span></div> <div> <button class='btn btn-outline-danger btn-sm border-0 history_btn' " +
"data-bs-toggle='popover' data-bs-html='true' data-bs-placement='left' " +
"data-history=\"" + obj.form_history.replace(/"/g, '&quot;') + "\" title='History'>" +
"<i class='fa fa-clock-o' aria-hidden='true'></i></button></div></div></li><li class='list-group-item '><div class='d-flex justify-content-between align-content-around'> <div class='small'>"+obj.req_date_format+" </div> <div class='small'>"+commitment_sts+"  </div></div></li></ul></td><td class = 'd-flex'><button type='button'  value='"+obj.mrf_id+"' class='btn btn-outline-danger btn-sm border-0 print btn-animate ' id=''><i class='fa-solid fa-receipt' aria-hidden='true'></i></button><button type='button'  value='"+obj.mrf_id+"' class='btn btn-outline-secondary btn-sm border-0 view_hide btn-animate d-none' id=''><i class='fa-solid fa-eye-slash' aria-hidden='true'></i></button></td></tr>");

     });
   
    
   }
   else{
   // $("#@id@") .append("<td colspan='7' scope='col'>No Data</td>");
 
   }
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }


  function get_material_request_form_list(sts_array, emp_id, field_name)
   {
    
   console.log(emp_id, JSON.stringify(sts_array)  );
   
   $.ajax({
     url: "php/get_material_request_form_list.php",
     type: "POST", //send it through get method
     data: {
     status : JSON.stringify(sts_array),
    tally_emp_id : emp_id

     },
     success: function (response) {
console.log(response);

   
   
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
 
 
     obj.forEach(function (obj) {
      console.log(obj.tally_stock_approved_by);
        var edit_btn = "disabled";
  if(field_name == "tally_stock_approved")
   {
    if(obj.tally_stock_approved_by == current_user_id && obj.status == "tally_stock_approved")
    {
      edit_btn = "";
    }
    else
    {
      edit_btn = "disabled";
    }

   }
  else if(field_name == "created" && obj.status == "created")
   {
   
    if(obj.emp_id == current_user_id)
    {
      edit_btn = "";
    }
    else
    {
      edit_btn = "disabled";

    }


   }
     else if(field_name == "purchase_requested_by" && obj.status == "purchase_requested")
   {
    if(obj.purchase_requested_by == current_user_id)
    {
      edit_btn = "";
    }
    else
    {
      edit_btn = "disabled";

    }
   }
    else if(field_name == "purchase_verified_by" )
   {
    if(obj.purchase_verified_by == current_user_id)
    {
      edit_btn = "";
    }
    else
    {
      edit_btn = "disabled";

    }
   }
       else if(field_name == "purchase_approved_by")
   {
    if(obj.purchase_approved_by == current_user_id)
    {
      edit_btn = "";
    }
    else
    {
      edit_btn = "disabled";

    }
   }

var emp_invalved_list = [];
emp_invalved_list.push("Created by " + obj.emp_name);

if (obj.tally_stock_approved_by != null && obj.tally_stock_approved_by != "" && obj.tally_stock_approved_by != "0") {
  emp_invalved_list.push("Tally Stock Approved by " + obj.tally_stock_approved_by_name);
}
if (obj.purchase_requested_by != null && obj.purchase_requested_by != "" && obj.purchase_requested_by != "0") {
  emp_invalved_list.push("Purchase Requested by " + obj.purchase_requested_by);
}
if (obj.purchase_verified_by != null && obj.purchase_verified_by != "" && obj.purchase_verified_by != "0") {
  emp_invalved_list.push("Purchase Verified by " + obj.purchase_verified_by);
}
if (obj.purchase_approved_by != null && obj.purchase_approved_by != "" && obj.purchase_approved_by != "0") {
  emp_invalved_list.push("Purchase Approved by " + obj.purchase_approved_by);
}
var emp_invalved = "<ul class='list-group small'><li class='list-group-item small m-0 p-0'>" + emp_invalved_list.join("</li><li class='list-group-item  m-0 p-0 small'>") + "</li></ul>";

var order_type_badge = "";

if(obj.order_type == "Regular")
{
order_type_badge =   "<span class='ms-1 badge bg-success'>R</span>"
}
else if(obj.order_type == "Emergency")
{
  order_type_badge =   "<span class='ms-1 blink badge bg-danger'>E</span>"
}

var commitment_sts = "";
if(obj.commitment_date != null && obj.commitment_date != "" && obj.commitment_date != "0" && obj.commitment_date != "undefined")
{
  commitment_sts = "<i class='fa-solid fa-hourglass-start'></i>"
}
else
{
  commitment_sts = "<i class='fa-solid fa-hourglass-start'></i>"
  // commitment_sts = obj.commitment_date
} 

   


        count = count +1;
// $('#material_requset_form_table').append(
//   "<tr><td>"+count+"</td><td>"+obj.part_name+"</td><td>"+obj.req_date_format+"</td><td><div class='accordion' id='acc_"+obj.mrf_id+"'> <div class='accordion-item'> <h2 class='accordion-header'> <button class='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#collapse_"+obj.mrf_id+"' aria-expanded='false' aria-controls='collapse_"+obj.mrf_id+"'> History </button> </h2> <div id='collapse_"+obj.mrf_id+"' class='accordion-collapse collapse' data-bs-parent='#acc_"+obj.mrf_id+"'> <div class='accordion-body'><ul class='list-group'> "+obj.form_history+"</ul> </div> </div> </div></div></td><td>"+obj.dated_format+"</td><td>"+obj.status+"</td> \
//   <td><button "+edit_btn+" type='button' value='"+obj.mrf_id+"'  class='btn btn-outline-danger border-0 edit btn-animate' id=''><i class='fa fa-pencil'  aria-hidden='true'></i></button></td>\
//   <td><button type='button'  value='"+obj.mrf_id+"' class='btn btn-outline-danger border-0 print btn-animate' id=''><i class='fa fa-print' aria-hidden='true'></i></button></td></tr>"
// );

$('#material_requset_form_table').append(
  "<tr><td style='max-width:30px'>"+count+"</td><td><ul class='list-group ' ><li class='list-group-item '> <div class='d-flex justify-content-between align-content-around'> <div class = 'small'><span class='text-bg-light fw-bold'>  "+obj.mrf_id + ". </span>"+ obj.part_name+order_type_badge+"<span class='ms-1 small  badge bg-primary'>"+obj.total_part_count+"</span></div> <div> <button class='btn btn-outline-danger btn-sm border-0 history_btn' " +
"data-bs-toggle='popover' data-bs-html='true' data-bs-placement='left' " +
"data-history=\"" + obj.form_history.replace(/"/g, '&quot;') + "\" title='History'>" +
"<i class='fa fa-clock-o' aria-hidden='true'></i></button></div></div></li><li class='list-group-item '><div class='d-flex justify-content-between align-content-around'> <div class='small'>"+obj.req_date_format+" </div> <div class='small'>"+commitment_sts+"  </div></div></li></ul></td><td class = 'd-flex'><button "+edit_btn+" type='button' value='"+obj.mrf_id+"'  class='btn btn-outline-danger border-0 edit btn-animate btn-sm' id=''><i class='fa fa-pencil'  aria-hidden='true'></i></button> <button type='button'  value='"+obj.mrf_id+"' class='btn btn-outline-danger btn-sm border-0 print btn-animate ' id=''><i class='fa-solid fa-receipt' aria-hidden='true'></i></button><button type='button'  value='"+obj.mrf_id+"' class='btn btn-outline-secondary btn-sm border-0 view_hide btn-animate d-none' id=''><i class='fa-solid fa-eye-slash' aria-hidden='true'></i></button></td></tr>"
);


     });
   
    
   }
   else{
   // $("#@id@") .append("<td colspan='7' scope='col'>No Data</td>");
 
   }
  }
   
  
   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   
   
   
      
   }

  function get_all_internal_godown()
   {
    
   
   $.ajax({
     url: "php/select_all_internal_godown.php",
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
        
$('#godown_select').append("<option value = '"+obj.internal_godown_id+"'>"+obj.godown_name+"</option>")

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





     function insert_internal_godown_stock_tally()
   {
$("#stock_table_body tr").each(function() {
  var godown_id = $(this).data("godown-id");
  var qty = $(this).find("td").eq(1).text();
  physical_stock_array.push({
    godown_id: godown_id,
    qty: qty
  });
});
  // your logic here


    
   
   $.ajax({
     url: "php/insert_internal_godown_stock_tally.php",
     type: "get", //send it through get method
     data: {
     tally_stock_approved_by :  current_user_id,
mrf_id : tally_mrf_id_g,
root_cause : $("#root_cause_text").val(),
preventive_action : $("#preventive_action_text").val(), 
corrective_action : $("#corrective_action_text").val(),



tally_stock_array : JSON.stringify(physical_stock_array),

     },
     success: function (response) {
      console.log(response);
   
   if (response.trim() == "ok") {
    
location.reload();
   
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
      
    //    get_sales_order()
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