

var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');

var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ;  
var dealer_id = 0

$("#unamed").text(localStorage.getItem("ls_uname"))
var phone_no = urlParams.get('phone_no');

var thismonth = 'DATE_FORMAT(NOW() ,"%Y-%m-01")'
var thisweek = 'DATE_ADD(CURDATE(), INTERVAL(-WEEKDAY(CURDATE())) DAY)'
var thisyear ='DATE_FORMAT(NOW() ,"%Y-01-01")'
var last3months = 'DATE_SUB(DATE_FORMAT(NOW() ,"%Y-%m-01"), INTERVAL 3 month)'

var date_query_start = 'CURDATE()'
var date_query_end = ' NOW()'


$(document).ready(function(){
   
 check_login();
 
 $("#delivery_photo_preview").hide()
 $('#detail').hide()


 $("#delivery_table").on("click","tr td button", function(event) {
 $('#chasis_no').val( $(this).val())
 $("#wchk_btn").trigger("click")
 $("html, body").animate({ scrollTop: $(document).height() }, 500);
 });
get_deler_report()
 $('#today_radio').change(function() {
  if(this.checked) {
  date_query_start = 'CURDATE()'
  }
  get_deler_report()
  });

  
  $('#thisweek_radio').change(function() {
    if(this.checked) {
      date_query_start = thisweek
    }
    get_deler_report()
    });

    $('#thismonth_radio').change(function() {
      if(this.checked) {
        date_query_start = thismonth
      }
      get_deler_report()
      });
      $('#l3months_radio').change(function() {
        if(this.checked) {
          date_query_start = last3months
        }
        get_deler_report()
        });


        $('#thisyear_radio').change(function() {
          if(this.checked) {
            date_query_start = thisyear
          }
          get_deler_report()
          });


          
          $('#report_search_btn').on('click', function()
          {
            console.log($('#search_start_date').val())
            if($('#search_form')[0].checkValidity())
            {
              date_query_start = "'"+  ($('#search_start_date').val()) + "'"
              date_query_end = "'"+  ($('#search_end_date').val())+ "'"
              // get_deler_report()
          
              console.log(date_query_start)
            }
           
          
          });
 $('#wchk_btn').on('click', function()
 {
   if($('#warranty_form')[0].checkValidity())
   
  {
     if( $('#chasis_no').val().length >= 4)
get_chk_warranty();

  }
 
 });



 $('#dealer_table1').on('click', 'tbody tr td', function(event) {
  $('#dealer_table1').find('.text-bg-primary').removeClass('text-bg-primary')
  $(this).parent().toggleClass('text-bg-primary')
console.log($(this).parent().find('input').val())
dealer_id = $(this).parent().find('input').val()
if($(this).parent().find('td').eq(2).html() >0)
  {
    get_delivery_report($(this).parent().find('input').val())
  }
 })

  




       
   });

   function get_delivery_report(did)
   {
     $.ajax({
       url: "php/get_delivery_report.php",
       type: "get", //send it through get method
       data: {
       did : did,
        date_query_start : date_query_start,
        date_query_end : date_query_end
       
      
      },
       success: function (response) {
console.log(response)
        $("#delivery_table").empty();
      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
       var obj = JSON.parse(response);
      
      var count = 0;
      console.log(obj)
      obj.forEach(function (obj) {
        

      count = count + 1;

      $('#delivery_table').append("<tr><td>"+count+"</td><td style='max-width: 120px;'>"+obj.cus_name+"</td><td style='max-width: 120px;'>"+obj.cus_phone+"</td><td>"+obj.implement+"</td><td style='max-width: 120px;'>"+obj.model+"</td><td style='min-width: 120px;'>"+obj.ddate+"</td><td>"+obj.ext_warranty+"</td><td>"+"<button value='"+obj.chasis_no + "' type='button' class='btn btn-sm btn-primary' > View </button></tr>")
        
       });
      
       
      
      }
      else{
        $("#delivery_table") .append("<tr class = 'text-bg-danger'><td colspan='9' scope='col'>No Data</td></tr>");
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
 

   function get_deler_report()
   {
    console.log(date_query_end);
     date_query_start
     $.ajax({
       url: "php/get_dealer_report.php",
       type: "get", //send it through get method
       data: {
       
        date_query_start : date_query_start,
        date_query_end : date_query_end
       
      
      },
       success: function (response) {
console.log(response)
        $("#dealer_table").empty();
        $("#delivery_table").empty()
      if (response.trim() != "error") {
        if (response.trim() != "0 result") {
       var obj = JSON.parse(response);
      
      var count = 0;
      console.log(obj)
      obj.forEach(function (obj) {
        

      count = count + 1;

      $('#dealer_table').append("<tr><td>"+count+"</td><td>"+obj.dname+"<input type='text' hidden value='"+obj.did+"'>"+"</td><td>"+obj.sale+"</td></tr>")
        
       });
      
       
      
      }
      else{
        $("#dealer_table") .append("<tr class = 'text-bg-danger'><td colspan='9' scope='col'>No Data</td></tr>");
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
   





   function get_chk_warranty()
   {
    
   
   $.ajax({
     url: "php/get_warranty_chk.php",
     type: "get", //send it through get method
     data: {
     chasis_no :  $('#chasis_no').val()
    

     },
     success: function (response) {
   
   console.log(response)
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
   
   
     obj.forEach(function (obj) {
      var  attach=""
   if(obj.dimage != "")
   {
    var extension = obj.dimage.split('.').pop()
    var pn = (obj.chasis_no).replace(/\//g, '%23@%23')
     attach = "attachment/delivery/"+ dealer_id + "/" +  pn+      "." + extension
    
  
   }
   
   
        count = count +1;
 $('#detail').val("Delivery Date - " +  obj.ddate + "\n" + "Customer Name - " + obj.cus_name + "\n"+ "Customer Phone - " + obj.cus_phone + "\n"+ "Customer Address - " + obj.cus_addr + "\n"+ "Implement - " + obj.implement + "\n"+ "Model - " + obj.model + "\n"+ "Chasis No - " + obj.chasis_no + "\n"+ "Ext Warranty - " + obj.ext_warranty + "\n\n"+  obj.wterms + "\n" )
 $("#delivery_photo_preview").attr("src", attach);
     });
   
     $("#delivery_photo_preview").show()
 $('#detail').show()
   }
   else{
  salert("No Data","No Valid Data found kindly Enter Details Manually","warning")
  $("#delivery_photo_preview").attr("src", "");
  $('#detail').val("")
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
  }

   }

   



  


  //  get today 

   

   


   
  


   


   





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


   function get_date_only_start(dates){
    var date = new Date(dates);

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
   
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
 
    var today_start = year + "-" + month + "-" + day +"T00:00"; 
    
    return get_millis(today_start);
   
   }


   function get_date_only_end(dates){
    var date = new Date(dates);

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
   
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
 
    var today_start = year + "-" + month + "-" + day +"T23:59:59"; 
    
    return get_millis(today_start);
   
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