var org_data =[];
  
  var cus_id = '0';
$(document).ready(function(){
 google.charts.load('current', {packages:["orgchart"]});
  check_login();
  
get_role_type();
get_organization()


   $("#unamed").text(localStorage.getItem("ls_uname"))

   $("#role_update_btn").hide()
   $("#role_submit_btn").show()
  
  
  

   $("#submit_btn").click(function()
   {
  
  insert_organization()
    
   });

   
 


  

   
   $("#menu_all_table").on("click","tr td button", function(event) {
    //get button value
   
    $("#role_update_btn").show()
    $("#role_submit_btn").hide()
  console.log($(this).parent().parent().find("td").eq(2).html())
  $("#menu_text").val($(this).parent().parent().find("td").eq(2).html())
  $("#role_name").val($(this).parent().parent().find("td").eq(1).html())
        });

        $("#organization_table").on("click","tr td button", function(event) {
          //get button value
         var org_id =$(this).val()
         {
          swal({
            title: "Are you sure - Delete? ",
            text: "You will not be recover this lead again!",
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
                
                delete_organization(org_id) // <--- submit form programmatically
                
               
              });
            } else {
              swal("Cancelled", "safe :)", "error");
            }
          })
          }
   
              });


   });
   //

   function get_organization(){
   
    $.ajax({
      url: "php/get_organization.php",
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
org_data =[];

      obj.forEach(function (obj) {

count = count +1;
       $("#organization_table") .append("<tr><td>" + count + "</td><td>" + obj.owner_role + "</td><td>" + obj.employee_role + "</td><td>"+"<button  type='button' value = '"+ obj.id +  "' class='btn  btn-lg text-danger' ><i class='fa-solid fa-trash-can'></i></button>"+"</td>  </tr> ")
       org_data.push([obj.employee_role ,obj.owner_role,obj.emp])
      });

      google.charts.setOnLoadCallback(draw_org);
    }
     }
     

     
     
        
      },
      error: function (xhr) {
          //Do Something to handle error
      }
     });
  }


  function draw_org() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Name');
    data.addColumn('string', 'Manager');
    data.addColumn('string', 'ToolTip');

    data.addRows(org_data);

   

    var chart = new google.visualization.OrgChart(document.getElementById('chart_org'));
        // Draw the chart, setting the allowHtml option to true for the tooltips.
        chart.draw(data, {'allowHtml':true});
    
   
  }


   function get_role_type()
   {
   
   $.ajax({
     url: "php/get_all_role.php",
     type: "get", //send it through get method
     data: {
      
      
   },
     success: function (response) {
   
console.log(response)
$("#manager_role").empty();
$("#emp_role").empty();
   if (response.trim() != "error") {
     
     if(response.trim() !="0 result")
     {
       var obj = JSON.parse(response);
     
      
       $("#manager_role").append( "<option value ='0' selected>Choose menu...</option>")
       $("#emp_role").append( "<option value ='0' selected>Choose menu...</option>")
       obj.forEach(function (obj) {
       
      
   
        $("#manager_role").append(" <option value='"+ obj.role + "'>"+ obj.role +"</option>")
        
        $("#emp_role").append(" <option value='"+ obj.role + "'>"+ obj.role +"</option>")
       });
   
       
     }
     else{
    
       $("#manager_role").append("<option value ='0' selected>No menu...</option>");
       $("#emp_role").append("<option value ='0' selected>No menu...</option>");
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


   function update_role()
   {
   

$.ajax({
  url: "php/update_role.php",
  async :false,
  type: "get", //send it through get method
  data: {
 


    role :  $("#role_name").val(),
    menu  : $("#menu_text").val(),
   

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
 

   function insert_organization()
   {
   

$.ajax({
  url: "php/insert_organization.php",
  async :false,
  type: "get", //send it through get method
  data: {
 


    manager :   $("#manager_role option:selected").val(),
    employee  :  $("#emp_role option:selected").val(),
   

},
  success: function (response) {

   console.log(response);

location.reload()

    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }
  

  

   

  

   
    function delete_organization(id)
    {
    
 
 $.ajax({
   url: "php/delete_organization.php",
   async :false,
   type: "get", //send it through get method
   data: {
  
 
 
    org_id :  id

    
 
 },
   success: function (response) {
 
    console.log(response);
  location.reload()
 
 
     
   },
   error: function (xhr) {
       //Do Something to handle error
   }
 });
 
    }


    function delete_app_all(menu_name)
    {
    
 
 $.ajax({
   url: "php/delete_app_all.php",
   async :false,
   type: "get", //send it through get method
   data: {
  
 
 
    app_menu :  menu_name,
   
    
 
 },
   success: function (response) {
 
    console.log(response);
 get_all_app_role();
 
 
     
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