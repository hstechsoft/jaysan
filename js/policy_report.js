
  var thismonth = 'UNIX_TIMESTAMP(DATE_FORMAT(NOW() ,"%Y-%m-01"))*1000'
  var thisweek = 'UNIX_TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL(-WEEKDAY(CURDATE())) DAY))*1000'
  var thisyear ='UNIX_TIMESTAMP(DATE_FORMAT(NOW() ,"%Y-01-01"))*1000'
  var last3months = 'UNIX_TIMESTAMP(DATE_SUB(DATE_FORMAT(NOW() ,"%Y-%m-01"), INTERVAL 3 month))*1000'

  var date_query_start = 'UNIX_TIMESTAMP(CURDATE())*1000'
var date_query_end = 'UNIX_TIMESTAMP( NOW())*1000'
var dater = "today"
var query = "";
var report_head = ""
$(document).ready(function(){

  

  check_login();
  
 
get_policy_head();
 
   $("#unamed").text(localStorage.getItem("ls_uname"))
  
   $('select').change(function() {
    // alert($(this).find('option:selected').text())
    // console.log($(this).parent().parent().find('textarea').val("hi"))
if($(this).parent().parent().find('textarea').val()=="")
{
  $(this).parent().parent().find('textarea').val($(this).find('option:selected').text())
}
else
{
  $(this).parent().parent().find('textarea').val($(this).parent().parent().find('textarea').val() + "," + $(this).find('option:selected').text())
}

});
  

$("#report_search_btn").click(function()
{
  if( $("#text_department").val()!="")
  {
  var  text_department = $("#text_department").val().split(',');
  var q = ""
  var temp = ""
  text_department.forEach(function (obj, index) {
    if (index === text_department.length - 1) {
        // This is the last iteration
        // q = q+ "department = '"+ obj + "'" ;
        temp = temp +"department = '"+ obj + "'"
    }
    else
    {
      // q = q +"department = '"+ obj  + "'"+ " OR ";
      temp = temp + "department = '"+ obj  + "'"+ " OR "
    }
});
q= q+  "( "+ temp + ")";
report_head = "<br>department = "  +  $("#text_department").val() 
}
else
{
q= "1"
}


if( $("#text_policy_type").val()!="")
  {
  var  text_policy_type = $("#text_policy_type").val().split(',');
  var temp = ""
  text_policy_type.forEach(function (obj, index) {
    if (index === text_policy_type.length - 1) {
        // This is the last iteration
        // q = q+ " AND policy_type = '"+ obj + "'" ;
        temp = temp +"policy_type = '"+ obj + "'"
    }
    else
    {
      // q = q +" AND policy_type = '"+ obj  + "'"+ " OR ";
      temp = temp + "policy_type = '"+ obj  + "'"+ " OR "
    }
});
report_head =report_head +  "<br>policy_type = "  +  $("#text_policy_type").val() 
q= q+  " AND ( "+ temp + ")";
}
else
{
q= q+ " AND 1"
}

if( $("#text_company_details").val()!="")
  {
  var  text_company_details = $("#text_company_details").val().split(',');
  var temp = ""
  text_company_details.forEach(function (obj, index) {
    if (index === text_company_details.length - 1) {
        // This is the last iteration
        // q = q+ " AND company_details = '"+ obj + "'" ;
        temp = temp +"company_details = '"+ obj + "'"
    }
    else
    {
      // q = q +"  company_details = '"+ obj  + "'"+ " OR ";
      temp = temp + "company_details = '"+ obj  + "'"+ " OR "
    }

});
q= q+  " AND ( "+ temp + ")";



report_head =report_head +  "<br>company_details = "  +  $("#text_company_details").val() 
}
else
{
q= q+ " AND 1"
}


if( $("#text_business_source").val()!="")
  {
  var  text_business_source = $("#text_business_source").val().split(',');
  var temp = ""
  text_business_source.forEach(function (obj, index) {
    if (index === text_business_source.length - 1) {
        // This is the last iteration
        // q = q+ " AND business_source = '"+ obj + "'" ;
        temp = temp +"policy.business_source = '"+ obj + "'"
    }
    else
    {
      // q = q +" AND business_source = '"+ obj  + "'"+ " OR ";
      temp = temp + "policy.business_source = '"+ obj  + "'"+ " OR "
    }
});
q= q+  " AND ( "+ temp + ")";
report_head =report_head +  "<br>business_source = "  +  $("#text_business_source").val() 
}
else
{
q= q+ " AND 1"
}


if( $("#text_rm").val()!="")
  {
  var  text_rm = $("#text_rm").val().split(',');
  var temp = ""
  text_rm.forEach(function (obj, index) {
    if (index === text_rm.length - 1) {
        // This is the last iteration
        // q = q+ " AND policy.rm = '"+ obj + "'" ;
        temp = temp +"policy.rm = '"+ obj + "'"
    }
    else
    {
      // q = q +" AND policy.rm = '"+ obj  + "'"+ " OR ";
      temp = temp + "policy.rm = '"+ obj  + "'"+ " OR "
    }
});
q= q+  " AND ( "+ temp + ")";
report_head =report_head +  "<br>rm = "  +  $("#text_rm").val() 
}
else
{
q= q+ " AND 1"
}

if( $("#text_insurance_type").val()!="")
  {
  var  text_insurance_type = $("#text_insurance_type").val().split(',');
  var temp = ""
  text_insurance_type.forEach(function (obj, index) {
    if (index === text_insurance_type.length - 1) {
        // This is the last iteration
        // q = q+ " AND insurance_type = '"+ obj + "'" ;
        temp = temp +"insurance_type = '"+ obj + "'"
    }
    else
    {
      // q = q +" AND insurance_type = '"+ obj  + "'"+ " OR ";
      temp = temp + "insurance_type= '"+ obj  + "'"+ " OR "
    }
});
report_head =report_head +  "<br>insurance_type = "  +  $("#text_insurance_type").val() 
q= q+  " AND ( "+ temp + ")";
}
else
{
q= q+ " AND 1"
}


if( $("#search_start_date").val()!= "" && $("#search_end_date").val()!= ""  )
  {
    if($("#sel_ptype option:selected").text() == "New")
    q = q+ " AND (policy_start_date BETWEEN "+ get_millis($('#search_start_date').val()) + " AND " + + get_millis($('#search_end_date').val())  + " AND policy_cat = 'new')"
    else if  ($("#sel_ptype option:selected").text() == "Expired")
    q = q+ " AND( policy_expiry_date BETWEEN "+ get_millis($('#search_start_date').val()) + " AND " + get_millis($('#search_end_date').val())  + ")"
    else if  ($("#sel_ptype option:selected").text() == "Renew")
    q = q+ " AND ( policy_start_date BETWEEN "+ get_millis($('#search_start_date').val()) + " AND " + + get_millis($('#search_end_date').val())  + " AND policy_cat = 'renew')"
else
q = q+ " AND ( policy_start_date BETWEEN "+ get_millis($('#search_start_date').val()) + " AND "  + get_millis($('#search_end_date').val() )  + " OR policy_expiry_date BETWEEN "+  get_millis($('#search_start_date').val()) + " AND "  + get_millis($('#search_end_date').val()) + ")"

    report_head =report_head +  "<br>Date between "  + $("#search_start_date").val() + " and " + $("#search_end_date").val()
     
    report_head =report_head +  "<br>Report type = "  +$("#sel_ptype option:selected").text()+ " Policy " 
}
else
{
q= q+ " AND 1"
}


if($("#policy_exp_chk").prop('checked') == true){

 q= q+ " AND 1"
}
else
{
  q= q+  " AND ( policy.policy_exp = 'live')";
}

if(q == "1 AND 1 AND 1 AND 1 AND 1 AND 1 AND 1")
{
 
salert("Enter Value","Please Input Some Value","warning")
}
else
{
query = "select if(policy.policy_expiry_date > UNIX_TIMESTAMP( NOW())*1000,if(policy.policy_cat = 'new','Live/New','Live/Renew'),if(policy.policy_cat = 'renew','Expired/Renew','Expired/Old')) as policy_sts, policy.vehicle_no,policy.policy_no, policy.cus_id, policy.policy_no,policy.policy_holder_name,policy.business_source,policy.rm,policy.company_details,policy.department,policy.insurance_type,policy.policy_type,policy.premium_without_gst,policy.policy_expiry_date,policy.attachment,policy.policy_start_date,customer.cus_name,customer.cus_phone from policy  INNER join customer on policy.cus_id = customer.cus_id where " + q 
console.log(query)
get_policy_search()
}



});

$("#download_xl_btn").on('click',function()
{
  $("#remind_table1").table2excel({
    
             exclude: ".noExl",
							name: "Excel Document Name",
							filename: "policy_report" + new Date().toLocaleDateString().replace(/[\-\:\.]/g, "_") + ".xls",
							fileext: ".xls",
							exclude_img: true,
							exclude_links: true,
							exclude_inputs: true,
							
    })

});

   });


 

   function get_policy_search()
   {
   
   
   $.ajax({
     url: "php/policy_search.php",
     type: "get", //send it through get method
     data: {
      query:query,
      
   
   },
     success: function (response) {
      $("#remind_table").empty()
      console.log(response)
      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
      var obj = JSON.parse(response);
      var  attach=""
     
    
    var count =0 
      obj.forEach(function (obj) {
        if(obj.attachment != "")
        {
         
         var pn = obj.policy_no.replace(/\//g, '%23@%23')
         attach = "<div><a target = '_blank' href='attachment/policy/"+ obj.cus_id + "/" +  pn+      ".pdf' class='link-primary'><i class='fa-solid fa-file-pdf h6'></i></a></div>"
       
        }
      
       count  = count + 1;
    
    
        $("#remind_table").append(" <tr> <td>"+ count + "</td> <td>"+ obj.cus_name + "</td> <td>"+ obj.cus_phone + "</td> <td>"+ obj.policy_no + "</td> <td>"+ obj.policy_holder_name + "</td> <td>"+ obj.business_source + "</td> <td>"+ obj.rm + "</td><td>"+ obj.company_details + "</td><td>"+ obj.department + "</td><td>"+ obj.insurance_type + "</td><td>"+ obj.policy_type + "</td><td>"+ obj.premium_without_gst + "</td><td>"+ millis_to_date(parseFloat(obj.policy_start_date)) + "</td><td>"+ millis_to_date(parseFloat(obj.policy_expiry_date)) + "</td><td>"+ obj.vehicle_no + "</td><td>"+ obj.policy_sts + "</td><td  class='noExl'>"+attach+"</td></tr>")
    
    
      });
    
     $("#total_list").html(count + "(As On - " +(new Date()).toISOString().split('T')[0]+ ")" + report_head)
     report_head = ""
    }
    else{
    
        $("#remind_table").append(" <tr><td colspan='20' scope='col' class='text-bg-danger h6'>Sorry no data!</td></tr>")
        $("#total_list").html(0 + "(As On - " +(new Date()).toISOString().split('T')[0]+ ")" + report_head)
        report_head = ""
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


   function get_policy_head()
   {
    
   
   $.ajax({
     url: "php/get_policy_head.php",
     type: "get", //send it through get method
    
     success: function (response) {
   
   
   if (response.trim() != "error") {
   
     var obj = JSON.parse(response);
   
   var count =0 

      obj.departments.forEach(function (obj) {
count = count +1       
       $("#sel_department").append(" <option value='" + count + "'>" + obj.department + "</option>");
   
   
   
     });


     count =0 

      obj.insurance_types.forEach(function (obj) {
count = count +1       
       $("#sel_insurance_type").append(" <option value='" + count + "'>" + obj.insurance_type + "</option>");
   
     });
   

     count =0 

     obj.company_detail.forEach(function (obj) {
count = count +1       
      $("#sel_company_details").append(" <option value='" + count + "'>" + obj.company_details + "</option>");
  
    });

    
    count =0 
    obj.policy_types.forEach(function (obj) {
count = count +1       
     $("#sel_policy_type").append(" <option value='" + count + "'>" + obj.policy_type + "</option>");
 
   });


   count =0 
   obj.business_sources.forEach(function (obj) {
count = count +1       
    $("#sel_business_source").append(" <option value='" + count + "'>" + obj.business_source + "</option>");

  });

  
  count =0 
  obj.rms.forEach(function (obj) {
count = count +1       
   $("#sel_rm").append(" <option value='" + count + "'>" + obj.rm + "</option>");

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