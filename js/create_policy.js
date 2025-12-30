

 
  var urlParams = new URLSearchParams(window.location.search);
var policy_id = urlParams.get('policy_id');
var current_user_id =  localStorage.getItem("ls_uid") ;
var emp_name = localStorage.getItem("ls_uname")
var phone_id = urlParams.get('phone_id');
var cus_id = urlParams.get('cus_id');
var old_policy = 0;
console.log(policy_id)
var filePath = ""
if(policy_id != null)
{
    
    $("#create_policy").hide()
$("#update_policy").show()
get_policy_single()
}
else
{
    $("#create_policy").show()
    $("#update_policy").hide()
}
$(document).ready(function(){
  check_login();
 
  $('#type').on('change', function()
  {
   
   console.log($('#type :selected').text()) 
   if($('#type :selected').text() == "motor" || $('#type :selected').text() == "4w" ){
    $('#vehicle_no').prop("disabled", false)
    $('#make').prop("disabled", false)
    $('#model').prop("disabled", false)
    $('#mfy').prop("disabled", false)
    $('#cc').prop("disabled", false)
    $('#engine_no').prop("disabled", false)
    $('#chassis_no').prop("disabled", false)

   }
   else{
    $('#vehicle_no').prop("disabled", true)
    $('#make').prop("disabled", true)
    $('#model').prop("disabled", true)
    $('#mfy').prop("disabled", true)
    $('#cc').prop("disabled", true)
    $('#engine_no').prop("disabled", true)
    $('#chassis_no').prop("disabled", true)
   }
  });

 
  $('#policy_form').submit(function(e){
   
    e.preventDefault()
   });


   
    
    $('#update_policy').on('click', function()
    {
     
    update_policy();
    });
    
   

    $('#create_policy').on('click', function()
    {

      if($('#policy_form')[0].checkValidity())
     create_policy();
    
    });

    $('#policy_attachment').on('click',function (e)
  {
    if($('#policy_no').val() == "")
    {
        salert("Policy No","Enter Policy No","warning")
    e.preventDefault()
    e.stopPropagation();
    }
  });

    $('#policy_attachment').on('change',function ()
    {
       
       
      var filename= $(this).val();
      var property =this.files[0];
  
      var file_name = property.name;
      var file_extension = file_name.split('.').pop().toLowerCase();
  {
          var form_data = new FormData();
          form_data.append("file",property);form_data.append("file_name", $('#policy_no').val().replace(/\//g, '#@#') + "." + file_extension);
          form_data.append("cus_id",cus_id);
          $.ajax({
              url:'upload_policy_attachment.php',
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
               salert("Upload Result",data,"success")
           filePath =     "attachment/policy/"+cus_id+"/"+ $('#policy_no').val() +".pdf" 
              }
            });
          
      }
  
         
    });
   
  
    $("#policy_table").on("click","tr td button", function(event) {
      //get button value
      var po_id = $(this).parent().parent().find("td").eq(3).html()
   console.log( $(this).html())
   if($(this).html() == "View")
   get_policy_single(po_id)
   if($(this).html() == "delete")
   {
    swal({
      title: "Are you sure? ",
      text: "You will not be recover this policy again!",
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
          
   delete_policy_single(po_id) // <--- submit form programmatically
          
         
        });
      } else {
        swal("Cancelled", "Your imaginary file is safe :)", "error");
      }
    })
   }

          });

   });

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


   function get_policy_single()
   {
       
       $.ajax({
           url: "php/get_policy_single.php",
           type: "get", //send it through get method
           data: {
            policy_id : policy_id
          },
           success: function (response) {
          console.log(response);
          
          if (response.trim() != "error") {
    
            if (response.trim() != "0 results") {
           var obj = JSON.parse(response);
          
           var count = 0;
           
           obj.forEach(function (obj) {
           old_policy = obj.policy_no;
           console.log(old_policy)
            count = count + 1;
            $('#policy_hname').val(obj.policy_holder_name)
            $('#business_source').val(obj.business_source)
            $('#rm').val(obj.rm)
            $('#remarks').val(obj.remarks)
            $('#policy_start_date').val(millis_to_date_only(parseFloat(obj.policy_start_date)) )
            $('#policy_expiry_date').val( millis_to_date_only (parseFloat(obj.policy_expiry_date)))
 $('#department').val(obj.department)
 $('#vehicle_no').val(obj.vehicle_no)
 $('#make').val(obj.make)
 $('#model').val(obj.model)
 $('#mfy').val(obj.mfy)
 $('#cc').val(obj.cc)
 $('#engine_no').val(obj.engine_no)
 $('#chassis_no').val(obj.chassis_no)
 $('#policy_no').val(obj.policy_no)
 $('#company_details').val(obj.company_details)
 $('#sum_insured').val(obj.sum_insured)
 $('#premium_without_gst').val(obj.premium_without_gst)
 $('#policy_type').val(obj.policy_type)
  $("#create_policy").hide()
 $("#update_policy").show()
 $("#type").find('option:contains('+obj.insurance_type+')').attr("selected",true);

    filePath = obj.attachment
                  });
          
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

   function delete_policy_single(policy_id1)
   {
       console.log(policy_id1)
       $.ajax({
           url: "php/delete_policy_single.php",
           type: "get", //send it through get method
           data: {
            policy_id : policy_id1
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

   function get_policy()
   {
     
       $.ajax({
           url: "php/get_policy.php",
           type: "get", //send it through get method
           data: {
            cus_id : cus_id
          },
           success: function (response) {
          console.log(response);
          
          if (response.trim() != "error") {
            
            if (response.trim() != "0 results") {
           var obj = JSON.parse(response);
           

           var count = 0;
           $('#policy_table').empty()
           obj.forEach(function (obj) {
            count = count +1
            var  attach=""
            if(obj.attachment != "")
            {
             
             var pn = obj.policy_no.replace(/\//g, '%23@%23')
             attach = "<div><a target = '_blank' href='attachment/policy/"+ obj.cus_id + "/" +  pn+      ".pdf' class='link-primary'><i class='fa-solid fa-file-pdf h6'></i></a></div>"
              count = count + 1;
            }
            else{
            
            }
           
            $('#policy_table').append("<tr><td>"+count+"</td><td>"+obj.customer_name+"</td><td>"+obj.mobile_no+"</td><td>"+obj.policy_no+"</td><td>"+millis_to_date_only(parseFloat(obj.policy_start_date))+"</td><td>"+millis_to_date_only(parseFloat(obj.policy_expiry_date))+"</td><td>"+attach+"</td></td><td>"+"<button type='button' class='btn btn-sm btn-primary' >View</button>"+"</td><td>"+"<button type='button' class='btn btn-sm btn-primary' >delete</button>"+"</td></tr>")
    
                  });
              
            }
            
            else{
              $("#policy_table") .append("<tr><td colspan='8' scope='col'>No Data</td></tr>");
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
   
  //----
 
  // -----

// -------
  function update_policy()
  {

    $.ajax({
        url: "php/update_policy.php",
        type: "get", //send it through get method
        data: {
          policy_hname :  $('#policy_hname').val(),
          business_source :  $('#business_source').val(),
          rm :  $('#rm').val(),
          remarks :  $('#remarks').val(),
          company_details :  $('#company_details').val(),
          department :  $('#department').val(),
          vehicle_no :  $('#vehicle_no').val(),
          make :  $('#make').val(),
          model :  $('#model').val(),
          mfy :  $('#mfy').val(),
          cc :  $('#cc').val(),
          engine_no :  $('#engine_no').val(),
          chassis_no :  $('#chassis_no').val(),
          policy_no :  $('#policy_no').val(),
          policy_type :  $('#policy_type').val(),
          sum_insured :  $('#sum_insured').val(),
          premium_without_gst :  $('#premium_without_gst').val(),
          policy_start_date :  get_millis(formatDate($('#policy_start_date').val())),
          policy_expiry_date :  get_millis(formatDate($('#policy_expiry_date').val())),
          cus_id : cus_id,
          attachment :filePath,
          policy_id : policy_id,
          insurance_type :  $('#type :selected').text(),
          emp_name : current_user_id,
          dated : get_cur_millis(),
          old_policy: old_policy
         
        
       
       },
        success: function (response) {
       console.log(response);
       
       if (response.trim() != "error") {
       
        location.reload()
       
       
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
// ------
  function create_policy()
  {
    $.ajax({
        url: "php/insert_policy.php",
        type: "get", //send it through get method
        data: {
          policy_hname :  $('#policy_hname').val(),
          business_source :  $('#business_source').val(),
          rm :  $('#rm').val(),
          remarks :  $('#remarks').val(),
          company_details :  $('#company_details').val(),
          department :  $('#department').val(),
          vehicle_no :  $('#vehicle_no').val(),
          make :  $('#make').val(),
          model :  $('#model').val(),
          mfy :  $('#mfy').val(),
          cc :  $('#cc').val(),
          engine_no :  $('#engine_no').val(),
          chassis_no :  $('#chassis_no').val(),
          policy_no :  $('#policy_no').val(),
          policy_type :  $('#policy_type').val(),
          sum_insured :  $('#sum_insured').val(),
          premium_without_gst :  $('#premium_without_gst').val(),
          policy_start_date :  get_millis(formatDate($('#policy_start_date').val())),
          policy_expiry_date :  get_millis(formatDate($('#policy_expiry_date').val())),
          cus_id : cus_id,
          attachment :filePath,
          insurance_type :  $('#type :selected').text(),
          emp_name : current_user_id,
          dated : get_cur_millis()
         
         
       
       },
        success: function (response) {
       console.log(response);
       
       if (response.trim() != "error") {
       
        salert("success", "policy Created Succesfully ", "success");
        get_policy();
        $('#policy_form')[0].reset();
        filePath = ""
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
  // ----



function formatDate (input) {
   
   if(input == '')
   {
return null;
   }
   else{
    input = input.replace(/\-/g, "/");
    var datePart = input.match(/\d+/g),
    day = datePart[0], // get only two digits
    month = datePart[1], 
    year = datePart[2];
  
  
    console.log( get_millis(year+"/"+month+"/"+day))
    return year+"/"+month+"/"+day;
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
  var d = new Date(millis); // Parameter should be long valu
  
return d.toLocaleString('en-GB');

}

function millis_to_date_only( millis)
{

  if(millis != 0)
  {
    var d = new Date(millis); // Parameter should be long valu
  
    return d.toLocaleDateString('en-GB');
  }
  else
  {
    return ''
  }
  

}