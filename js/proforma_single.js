
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
  import { getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword  } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js'
  import { getDatabase, ref, set ,onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
  const app = initializeApp(firebaseConfig);

  var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var qno = urlParams.get('qno');
var cus_id =  urlParams.get("cus_id") ; 
var total_amount = 0;
var taxable_amount = 0;
var total_qty = 0;
var table_count = 0;

var shipping = 0
 var gt = 0
 var total_value = 0
var customer = ""

var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 




$(document).ready(function(){
  

 check_login();
 

 
 get_quote_details()
 

 
   $("#unamed").text(localStorage.getItem("ls_uname"))
  // $("#tlead_att_on").text(localStorage.getItem("ls_uname"))

 
  $("#invoice_conv").attr("onclick"," window.location.href = 'sales.html?cus_id=" + cus_id+ "&conv_type=proforma&conv_no=" + qno+ "';")
  
   
  
  


  


   $("#print_btn").on("click", function()
   {
    
   
    $('#print').printThis({
     
    });
   });

   });


   function insert_quotation()
   {
     
    var shipping =0
    if($("#shipping_txt").val()!="")
    {
      shipping= parseFloat($("#shipping_txt").val())
    }
     
    var gt = shipping + total_amount

   $.ajax({
     url: "php/insert_quotation.php",
     type: "get", //send it through get method
     data: {
      qno : qno,
      cus_name :$("#cus_name_txt").val(),
      cus_addr :$("#cus_addr_txt").val(),
      dated : get_today_start_millis(),
      shipping :$("#shipping_txt").val(), 
      total_value : gt
        
      
   
   },
     success: function (response) {
      console.log(response)
      var count =0;
      var rowCount = $('#pro_table1 tr').length-2;
      console.log(rowCount)
      $('#pro_table1 tr:gt(1)').each(function () {
        count = count+1;
        var this_row = $(this);
        var count = $.trim(this_row.find('td:eq(0)').html());
        var des = $.trim(this_row.find('td:eq(1)').html())
        var hsn = $.trim(this_row.find('td:eq(2)').html())
        var gst = $.trim(this_row.find('td:eq(3)').html())
        var price = $.trim(this_row.find('td:eq(4)').html())
         var qty = $.trim(this_row.find('td:eq(5)').html())
         var total = $.trim(this_row.find('td:eq(6)').html())


         var reload_p="";

if (count >= rowCount)
{
  reload_p="yes";
}
else{
  reload_p="no";
}
         insert_quotation_product(des,hsn,gst,price,qty,total,reload_p)
       
       
        
  });
  

   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   }


   function insert_quotation_product(des,hsn,gst,price,qty,total,reload_p)
   {
     
    des =des.replace("<br>","\n")
console.log(des)
   $.ajax({
     url: "php/insert_quotation_product.php",
     type: "get", //send it through get method
     data: {
      qno : qno,
      des : des ,
      hsn :hsn ,
      gst : gst,
      price : price,
      qty :qty,
      total : total
        
      
   
   },
     success: function (response) {
   console.log(response)
   if(reload_p =="yes")
    {
      $('#print_btn').show();
  
   $('#submit_btn').hide();
    }
    
  

   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   }
   

   function get_quote_details()
   {
   
    $.ajax({
        url: "php/get_proforma_details_single.php",
        type: "get", //send it through get method
        data: {
            qno : qno
          
         
      },
        success: function (response) {
      console.log(response)
      if (response.trim() != "error") {
   
   
   
        if((response.trim() != "0 result"))
        {
      
        
        
          var obj = JSON.parse(response);
      
          var count = 0;
        
          obj.forEach(function (obj) {
            var addr = obj.company_address
            console.log(addr)
            
            addr =addr.replace(/\n/g, "<br />")
             
           
            
            $("#print_company_name").text(obj.company_name)
          
            $("#print_company_addr").html(addr)
            $("#print_logo_preview").attr("src","/swen/"+obj.company_logo);
            $("#print_logo_preview1").attr("src", "/swen/"+ obj.company_logo1);
            $("#print_qno").text(obj.pinos) 
          
        
            $("#print_bank").html(obj.company_bank.replace(/\n/g, "<br />"))
            $("#print_terms").html((obj.company_terms).replace(/\n/g, "<br />"))
            $("#print_com_name").text(obj.company_name)

            
    $("#print_amount_word").text("Rupess "  + numberToWords(parseInt(obj.total_value)) + " Only")

    $("#print_date").text(millis_to_date(parseFloat(obj.dated)))

    $("#print_cus_name").text(obj.cus_name)
    $("#print_cus_addr").text(obj.cus_addr)
    if(obj.valid_until != "")
    $("#print_valid_upto").text( obj.valid_until)
    else
    $("#print_valid_upto").text( '-')

    if(obj.enq_no != "")
    $("#print_enq_no").text(obj.enq_no)
    else
    $("#print_enq_no").text( '-')
    $("#print_pos").text( obj.place_of_supply)
    $("#amount_due").text( "₹ " + parseInt(obj.total_value).toFixed(2))
total_value = obj.total_value
    taxable_amount = parseFloat(obj.taxable_amount)
    if(obj.shipping !="")
    {
      shipping= parseFloat(obj.shipping)
    }
     
     gt =  parseFloat(obj.total_value)
   
   
          });
        
          get_quotion_single()
      
       
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
  


   function get_quotion_single()
   {
   
    $.ajax({
        url: "php/get_proforma_single.php",
        type: "get", //send it through get method
        data: {
            qno : qno
          
         
      },
        success: function (response) {
      console.log(response)
      if (response.trim() != "error") {
   
   
   
        if((response.trim() != "0 result"))
        {
      
          var qty = 0
        
          var obj = JSON.parse(response);
      
          var count = 0;
        
          obj.forEach(function (obj) {
            qty =  qty + parseInt(obj.qty)
            
            count =count + 1
            var des = conv_html(obj.des)
            
             
            $("#print_pro_table").append(" <tr> <td>"+ count + "</td> <td>"+ des +  "</td><td>"+obj.hsn+ "</td> <td>"+ obj.gst +  "</td> <td class='text-end text-nowrap'> "+ obj.price + "</td><td class= 'text-center'>" +  obj.qty + "</td> <td class='text-end text-nowrap'>"+ obj.total + "</td></tr>")
          });

          var tax_amount = gt - (taxable_amount + parseInt(shipping) )
        
          $("#print_pro_table").append("<tr> <th colspan='5' class='text-center'>" + "Total" + "</th> <th class='text-center'>" + qty + "</th> <th class='text-end text-nowrap'  >&#x20B9 " +(parseInt(total_value) - parseInt(shipping) ).toFixed(2) + "</th> </tr>")
  
    
      

    $("#print_pro_table").append("<tr><td colspan='7'> <div> <div class='d-flex justify-content-end gap-5 '> <p class='p-0 m-0'> Total Taxable Value: </p> <p class='p-0 m-0'> &#x20B9 "+ taxable_amount.toFixed(2) +   "</p> </div> <div class='d-flex justify-content-end gap-5 '> <p class='p-0 m-0'> Total Tax Amount: </p> <p class='p-0 m-0'> &#x20B9 " + tax_amount.toFixed(2) +"</p> </div> <div class='d-flex justify-content-end gap-5 '> <p class='p-0 m-0'> Shipping & Packaging Amount: </p> <p class='p-0 m-0'> &#x20B9 "+ shipping.toFixed(2) +"</p> </div> <div class='d-flex justify-content-end gap-5 '> <p class='p-0 m-0'> Total Value: </p> <p class='p-0 m-0'> &#x20B9 " + gt.toFixed(2) + "</p> </div> </div> </td></tr>")
       
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
  

   function print()
   {
   
   
    $("#print_amount_word").text("Rupess "  + numberToWords(parseInt(total_amount)) + " Only")

    $("#print_date").text(get_today_date_only())

    $("#print_cus_name").text($("#cus_name_txt").val())
    $("#print_cus_addr").text($("#cus_addr_txt").val())
   
    $('#pro_table1 tr:gt(1)').each(function () {
        var this_row = $(this);
        var count = $.trim(this_row.find('td:eq(0)').html());
        var des = $.trim(this_row.find('td:eq(1)').html())
        var hsn = $.trim(this_row.find('td:eq(2)').html())
        var gst = $.trim(this_row.find('td:eq(3)').html())
        var price = $.trim(this_row.find('td:eq(4)').html())
         var qty = $.trim(this_row.find('td:eq(5)').html())
         var total = $.trim(this_row.find('td:eq(6)').html())
       

        $("#print_pro_table").append(" <tr> <td>"+ count + "</td> <td>"+ des +  "</td><td>"+hsn+ "</td> <td>"+ gst +  "</td> <td class='text-end text-nowrap'> "+ price + "</td><td class= 'text-center'>" +  qty + "</td> <td class='text-end text-nowrap'>"+ total + "</td></tr>")
       
        
  });
  var shipping =0
  if($("#shipping_txt").val()!="")
  {
    shipping= parseFloat($("#shipping_txt").val())
  }
   
  var gt = shipping + total_amount
  $("#print_pro_table").append("<tr> <th colspan='5' class='text-center'>" + "Total" + "</th> <th class='text-center'>" + total_qty + "</th> <th class='text-end text-nowrap'  >&#x20B9 " + total_amount.toFixed(2) + "</th> </tr>")

  $("#print_pro_table").append("<tr> <th colspan='6' class='text-center'>" + "Shipping and Package Charges" + "</th><th class='text-end text-nowrap'  >&#x20B9 " + shipping.toFixed(2) + "</th> </tr>")

  $("#print_pro_table").append("<tr> <th colspan='6' class='text-center'>" + "Grand Total" + "</th><th class='text-end text-nowrap'  >&#x20B9 " +  gt.toFixed(2) + "</th> </tr>")
 
     $('#print').printThis({
      
      
      
     
   });
   
   
   }  
   
  function get_customer_autocomplete()
  {
    
       var cusname =  $('#cus_name_txt').val() + '%';
   var customer = [];
   var obj = {};
    $.ajax({
      url: "php/get_customer_autocomplete.php",
      type: "get", //send it through get method
      data: {
        cus_name:cusname,
       
    
    },
      success: function (response) {
  console.log("res - " + response)
    
    if (response.trim() != "0 result") {
      var obj = JSON.parse(response);
  

    
  
      obj.forEach(function (obj) {

         object = {
       
          label:obj.cus_name + " - " +  obj.cus_address,
          cus_id : obj.cus_id,
          cus_addr : obj.cus_address,
          value : obj.cus_name

         
          
      };
       customer.push(object);
     
        
      });
     
    
    }
    
    else {
      customer = [];
      var object = {
      
        value:"No data",
        cus_id : "",
        cus_addr : ""
         
    };
     customer.push(object);
     console.log(customer)
   
    }
    
    
        
      },
      error: function (xhr) {
          //Do Something to handle error

          customer = [];
          var object = {
      
            value:"No data",
            cus_id : "",
            cus_addr : ""
             
        };
         customer.push(object);
          
      }
    });

   
    console.log(customer)
   
   
    return customer;
   
  }
  

   function get_product_autocomplete()
   {
     
        var product =  $('#pname_txt').val() + '%';
    var customer = [];
    var obj = {};
     $.ajax({
       url: "php/get_product_autocomplete.php",
       type: "get", //send it through get method
       data: {
        product:product,
        
     
     },
       success: function (response) {
 
     
     if (response.trim() != "0 result") {
       var obj = JSON.parse(response);
   
 
     
   
       obj.forEach(function (obj) {
 
          object = {
        
           label:obj.pname ,
           pid : obj.pid,
          
           value : obj.pname
 
          
           
       };
        customer.push(object);
      
         
       });
      
     
     }
     
     else {
       customer = [];
       var object = {
       
         value:"No data",
         cus_id : "",
         cus_addr : ""
          
     };
      customer.push(object);
      console.log(customer)
    
     }
     
     
         
       },
       error: function (xhr) {
           //Do Something to handle error
 
           customer = [];
           var object = {
       
             value:"No data",
             cus_id : "",
             cus_addr : ""
              
         };
          customer.push(object);
           
       }
     });
 
    
     console.log(customer)
    
    
     return customer;
    
   }


   function get_product(product_id)
   {
   
    $.ajax({
        url: "php/get_product.php",
        type: "get", //send it through get method
        data: {
            pid : product_id,
          
         
      },
        success: function (response) {
      console.log(response)
      if (response.trim() != "error") {
   
   
   
        if((response.trim() != "0 result"))
        {
      
        
        
          var obj = JSON.parse(response);
      
          var count = 0;
        
          obj.forEach(function (obj) {
           
           
            $("#pname_txt").val(obj.pname) 
           $("#des_txt").val(obj.des)  
             $("#price_txt").val(parseFloat(obj.price))
           $("#hsn_txt").val(obj.hsn_code)
             $('#tax_rate_txt').find(":selected").text(obj.tax_rate)
           
            

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
  
   
   
  
   function numberToWords(number) {  
    var digit = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];  
    var elevenSeries = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];  
    var countingByTens = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];  
    var shortScale = ['', 'thousand', 'million', 'billion', 'trillion'];  

    number = number.toString(); number = number.replace(/[\, ]/g, ''); if (number != parseFloat(number)) return 'not a number'; var x = number.indexOf('.'); if (x == -1) x = number.length; if (x > 15) return 'too big'; var n = number.split(''); var str = ''; var sk = 0; for (var i = 0; i < x; i++) { if ((x - i) % 3 == 2) { if (n[i] == '1') { str += elevenSeries[Number(n[i + 1])] + ' '; i++; sk = 1; } else if (n[i] != 0) { str += countingByTens[n[i] - 2] + ' '; sk = 1; } } else if (n[i] != 0) { str += digit[n[i]] + ' '; if ((x - i) % 3 == 0) str += 'hundred '; sk = 1; } if ((x - i) % 3 == 1) { if (sk) str += shortScale[(x - i - 1) / 3] + ' '; sk = 0; } } if (x != number.length) { var y = number.length; str += 'point '; for (var i = x + 1; i < y; i++) str += digit[n[i]] + ' '; } str = str.replace(/\number+/g, ' '); return str.trim() + ".";  

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

   

   

  function conv_html(txt)
  {
    txt = txt.trim()
    console.log(txt)
    var ref = txt
    $("#mysql_conv_txt").empty()
    $("#mysql_plain_txt").html("")
   var con_result = ""
   ref =txt.replace(/\n/g, "<br />")
   $("#mysql_plain_txt").html(ref)
   $("#mysql_conv_txt").append(    $("#mysql_plain_txt").val() )
   con_result =  $("#mysql_conv_txt").html()
   console.log(con_result)
   return con_result
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

   function get_today_date_only(){
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    var hour = date.getHours();
    var mins = date.getMinutes();
  
console.log(mins)

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
 
    var today = year + "-" + month + "-" + day ; 
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