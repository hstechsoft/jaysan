

var selected_role_id =""
var selected_rule =""

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
get_assign_no()
get_assigned_role_list('0')
get_role_name()
get_role_name_unassigned()
    





    // Ensure form submission includes partId
  
    // Load titles into the table and dropdown
   
    // // Recursive rule manager
    // $("#addRule").click(function() {
    //     var selectedTitle = $("#ruleManagerSelect").val();
    //     var selectedText = $("#ruleManagerSelect option:selected").text();
    //     // $("#ruleList").append('<li class="list-group-item" data-id="' + selectedTitle + '">' + selectedText + '</li>');
    //     $("#ruleList").append("<li class='list-group-item d-flex justify-content-between align-items-start rule' data-id='"+selectedTitle+"'> <span> </span>"+selectedText+"<span> <button type='button' class='btn btn-danger btn-sm removeRule'><i class='bi bi-trash'></i></button></span> </li>");
    // });

    $("#addRule").click(function() {
      var selectedTitle = $("#ruleManagerSelect").val();
      var selectedText = $("#ruleManagerSelect option:selected").text();
      // $("#ruleList").append('<li class="list-group-item" data-id="' + selectedTitle + '">' + selectedText + '</li>');
      // $("#rule_table").append("<tr><li class='list-group-item d-flex justify-content-between align-items-start rule'  data-id='"+selectedTitle+"'> "+selectedText+" </li><li  data-id='"+selectedTitle+"'> "+selectedText+" </li></tr>");

      if(selected_rule == "")
//  $("#rule_table").append(" <tr> <td>"+   ($("#rule_table tr").length+1)  + "</td> <td> <ol class='list-group list-group-numbered '> <li class='list-group-item ' data-id='"+selectedTitle+"'>"+selectedText+"</li> </ol> </td> </tr>")
{
  $("#rule_table").append(" <tr>  <td><ol class='list-group '> <li class='list-group-item d-flex justify-content-between align-items-center' data-id='"+selectedTitle+"'> <span class='d-flex align-items-center flex-grow-1'> "+selectedText+" </span>  <button type='button' class='btn btn-outline-danger border-0'><i class='fa fa-trash' aria-hidden='true'></i></button></li> </ol></td> </tr>")

 

}
     

else
{
  selected_rule.find("ol").append(" <li class='list-group-item d-flex justify-content-between align-items-center' data-id='"+selectedTitle+"'> <span class='d-flex align-items-center flex-grow-1'> "+selectedText+" </span>  <button type='button' class='btn btn-outline-danger border-0'><i class='fa fa-trash' aria-hidden='true'></i></button></li> ")

}

  });

  $("#assigned_role_list").on("dblclick","tr", function(event) {
console.log($(this).find("td").data('role-id'));
selected_role_id = $(this).find("td").data('role-id')

$('#emp_role').append("<option value="+selected_role_id +">"+$(this).find("td").text()+"</option>")
$('#emp_role').val(selected_role_id);

$('#emp_role').prop("disabled",true)


 get_part_rules()
$("#formSubmitButton").text("Update")



  });

  $("#rule_table").on("click","button", function(event) {
    var li_len = $(this).closest("ol").find("li").length;
    if(li_len == 1)
    {
      $(this).closest("tr").remove()
      
     console.log($("#rule_table").html());
     
    }
    else
    {
      $(this).closest("li").remove();
      // renumbering
    
    }
   
 
  });
  $("#rule_table").on("click","tr", function(event) {
    // console.log( $(this).find("ol").append("<li class='list-group-item ' data-id='"+1+"'>"+1+"</li>"));
       
       
     selected_rule = ""
   
    if ($(this).hasClass("selected")) {
    $(this).removeClass("selected");    
     selected_rule = ""
  } else {
      // Otherwise, unselect all other cards and select this one
      $(this).parent().find('tr').each(function() {
        $(this).removeClass("selected");
    
      });
      $(this).addClass("selected");
      selected_rule = $(this)
  }
  
  
 
  });

    $("#ruleList").on("click", ".removeRule", function() {
        $(this).closest('.rule').remove();
    });
    $("#partsForm").submit(function(event) {
        event.preventDefault();  // Prevent default form submission
    
        var emp_role = $('#emp_role').val();
        if (!emp_role) {
            alert('Please select a valid Role from the autocomplete list.');
            return;  // Stop further execution if partId is not set
        }
    
       
   
    });
    

        // Load unique parts into the right sidebar
      


         // Handle click event on unique parts to load data into the form
         $("#search_up").on("keyup", function() {
          var value = $(this).val().toLowerCase();
          $("#assigned_role_list tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
          });
        });

        $("#formSubmitButton").on("click", function() {
  
          let rule_array= []

      

        $("#rule_table tr").each(function() {
          let rule_array_value = []
         if($("#rule_table tr").length >=1) 
         {
           $(this).find("ol").find("li").each(function() {
                       rule_array_value.push($(this).data("id"))
           });

           rule_array.push(rule_array_value)

    
          }
          console.log(rule_array);
          
        });

       if( $("#emp_role").val() != "0")
       {
         $.ajax({
        url: "php/store_att_rules.php",
        type: "POST", //send it through get method
        data: {
   
            role_id :  $('#emp_role').val(),
      rule_array : rule_array,
      update : $("#formSubmitButton").text()
      
        },
        success: function (response) {
      console.log(response);
      
      
      if (response.trim() == "done") {
       
 location.reload()
      }
      
      
      
      
          
        },
        error: function (xhr) {
            //Do Something to handle error
        }
      });
    }
    else
    {
       alert("Select part from table")
    }
       


        });


        $('#search_title').change(function() {
          //$('#search_title').find(':selected').text()
          get_assigned_role_list($('#search_title').find(':selected').val())
           });
  
});

function get_assigned_role_list(title_id)
{
 

$.ajax({
  url: "php/get_assigned_role_list.php",
  type: "get", //send it through get method
  data: {
  title_id : title_id
  },
  success: function (response) {
    console.log(response);

if (response.trim() != "error") {
  $('#assigned_role_list').empty()
 if (response.trim() != "0 result")
 {
  
  var obj = JSON.parse(response);
var count =0 
console.log(response);


  obj.forEach(function (obj) {
     count = count +1;
$('#assigned_role_list').append("<tr><td data-role-id='"+obj.menu_id+"'>"+obj.role+"</td></tr>")

  });

 $("#tsv").html(count)
}
else{
  $('#assigned_role_list') .append("<td colspan='2' scope='col'>No Data</td>");
  $("#tsv").html(0)
}
}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}

function get_unassigned_parts(){
   
  $.ajax({
    url: "php/get_unassigned_parts.php",
    type: "get", //send it through get method
    data: {
    
      part_id:selected_role_id
   },
    success: function (response) {
     console.log(response)
     
   if (response.trim() != "error") {
    if(response.trim() != "0 result")
{
 
    var obj = JSON.parse(response);
    $('#titleList tr').find('input[type="checkbox"]').prop('checked', false);
   
var count =0;
  
    obj.forEach(function (obj) {
      
      $("#titleList tr").each(function() {
        var rule_chk = false
        var multiple_chk = false
        if(obj.need_rule == 1)
          rule_chk = true
        if(obj.multiple == 1)
          multiple_chk = true
        
        var row =  $(this).find("td")
        var sel_chkbox = row.eq(0).find('input[type="checkbox"]')
        var rule_chkbox = row.eq(2).find('input[type="checkbox"]')
        var multiple_chkbox = row.eq(3).find('input[type="checkbox"]')
        if(sel_chkbox.val() == obj.title_id)
        {
          sel_chkbox.prop("checked", true);
          rule_chkbox.prop("checked", rule_chk);
          multiple_chkbox.prop("checked", multiple_chk);
        }
         
        // else
        // {
        //   sel_chkbox.prop("checked", false);
        //   rule_chkbox.prop("checked", false);
        //   multiple_chkbox.prop("checked", false);
        // }
        
   
      })

    });
   
    
   
    
  }
   }
   
   
   
   
      
    },
    error: function (xhr) {
        //Do Something to handle error
    }
   });
}


function get_role_name()
{
 

$.ajax({
  url: "php/get_role_name.php",
  type: "get", //send it through get method
  data: {
  
  },
  success: function (response) {


if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;

$('#ruleManagerSelect').append(
    '<option value="' + obj.menu_id + '">' +obj.role + '</option>'
);
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

function get_role_name_unassigned()
{
 

$.ajax({
  url: "php/get_un_role_name.php",
  type: "get", //send it through get method
  data: {
  
  },
  success: function (response) {


if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;

$('#emp_role').append("<option value="+obj.menu_id +">"+obj.role+"</option>")

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

function get_part_rules(){
   
  $.ajax({
    url: "php/get_att_rules.php",
    type: "get", //send it through get method
    data: {
    
      role_id:selected_role_id
   },
    success: function (response) {
     console.log(response)
     $('#rule_table').empty()
   if (response.trim() != "error") {
    if(response.trim() != "0 result")
{
 
    var obj = JSON.parse(response);
    
   
var count =0;
  
    obj.forEach(function (obj) {
      $("#rule_table").append(" <tr>  <td><ol class='list-group '>"+ obj.rules + " </ol></td> </tr>")

    
    });
   
    
   
    
  }
   }
   
   
   
   
      
    },
    error: function (xhr) {
        //Do Something to handle error
    }
   });
}
 
function get_assign_no(){
   
    $.ajax({
      url: "php/get_assign_no.php",
      type: "get", //send it through get method
      data: {
      
       
     },
      success: function (response) {
       console.log(response)
       
     if (response.trim() != "error") {
      if(response.trim() != "0 result")
  {
  
      var obj = JSON.parse(response);
     
     
 
      obj.forEach(function (obj) {
        $('#assign_no').html(" ("+ obj.assigned_parts + "/" + obj.total_parts + ")" )
        $('#unassign_no').html(" ("+ obj.unassigned_parts + "/" + obj.total_parts + ")" )
  
      });
     
      
     
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