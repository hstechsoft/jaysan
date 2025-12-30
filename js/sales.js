
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
var conv_type = urlParams.get('conv_type');
var conv_no = urlParams.get('conv_no');
var advance_payment =0
console.log(conv_type)
$("#enq_no").val(conv_no)
if(conv_type == null)
{
  $("#pro_table_conv_card").hide()

}
else{
  if(conv_type == "estimation")
  get_quotion_single(conv_no,"get_estimation_single.php")
  else if(conv_type == "quotation")
  get_quotion_single(conv_no,"get_quotation_single.php")
  else if(conv_type == "proforma")
  get_quotion_single(conv_no,"get_proforma_single.php")

  get_advance_payment()
}




var total_amount = 0;
var taxable_amount = 0;
var total_qty = 0;
var table_count = 0;
var coupen_dis = 0
var reminder = [];
var ino = ""
var sqno = ""
var customer = ""
var cus_id = '0';
var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 
var cus_id = urlParams.get('cus_id');
if(cus_id != null)
{
 
  
get_cus_info(cus_id)
}



$(document).ready(function(){
  

 check_login();
 $("#pro_table1").hide();
 $("#submit_block").hide();
 $("#print_area").hide();
 $('#print_btn').hide();
 
 get_invoice_details()
 
 
   $("#unamed").text(localStorage.getItem("ls_uname"))
  // $("#tlead_att_on").text(localStorage.getItem("ls_uname"))

 
  $("#pro_table_conv").on("click","tr td button", function(event) {
    //get button value
    $(this).parent().parent().remove()
        });
  
  $("#pro_table_conv").on("focusout","tr td", function(event) {
    //get button value
    var tr = $(this).closest('tr').children('td').eq(5).html();
    // var myRow = $tr.index();
    console.log(tr);
  // $(this).parent().parent().find("td").eq(1).html("hi");
var qty = parseFloat($(this).closest('tr').children('td').eq(4).html())
var price = parseFloat($(this).closest('tr').children('td').eq(3).html())
var gst = parseFloat($(this).closest('tr').children('td').eq(2).html())
var tax = parseFloat( parseInt(gst)/100)
    tax = parseFloat(tax);
    tax = 1 + tax;

    
var amount = (qty * price)
amount = (amount*tax).toFixed(2)
console.log(amount)
$(this).closest('tr').children('td').eq(5).html(amount)
  
  //$(this).parent().empty()
        });
 
   $('#pname_txt').on('input',function(e){

    if($('#pname_txt').val() !="")
    {
      $('#pname_txt').autocomplete({
        
        source: get_product_autocomplete(),
        minLength: 2,
        cacheLength: 0,
        select: function(event, ui) {
         
        console.log( ui.item.pid);
        get_product( ui.item.pid);
       
        $("#qty_txt").focus();
        } ,
        //display no result 
        response: function(event, ui) {
          if (!ui.content.length) {
              var noResult = { value:"",label:"No results found" };
              ui.content.push(noResult);
          }
      }
      });
    }
   
   });

   $("#apply_coupen_btn").on("click", function()
   {
    check_coupen_no($("#coupen_txt").val());
   });

   $("#add_conv_btn").on("click", function()
   {
    $("#pro_table1").show();
    $("#submit_block").show();
    $("#print_area").show();
    $('#pro_table_conv > tr').each(function() { 
      //table content
      var product =  $(this).find("td").eq(0).html()
      var qty =  $(this).find("td").eq(4).html()
      var hsn =  $(this).find("td").eq(1).html()
      var price =  $(this).find("td").eq(3).html()


      console.log( $(this).find("td").eq(3).html());

      var tax = parseFloat($(this).find("td").eq(2).html())/100
      tax = parseFloat(tax);
      tax = 1 + tax;
  
     console.log(product)
      
      
      table_count = table_count + 1;
  
      $("#pro_table").append(" <tr> <td>"+ table_count + "</td> <td>"+ product + "</td><td contenteditable='true'>"+hsn+ "</td> <td>"+  $(this).find("td").eq(2).html() + " %" + "</td> <td contenteditable='true' class='text-end text-nowrap'>"+ price + "</td><td contenteditable='true'>" +  qty + "</td> <td class='text-end text-nowrap'>&#x20B9 "+  (parseFloat( price)* tax * parseInt(qty)).toFixed(2) + "</td><td> <button class='btn btn-outline-danger border-0'> <i class='fa-solid fa-trash-can'></i> </button> </td></tr>")
  
  
   });
   update_print_area()
   });
   
   $("#add_product_btn").on("click", function()
   {
    console.log($('#quotation_form')[0].checkValidity())
    if($('#quotation_form')[0].checkValidity())
    {
      $("#pro_table1").show();
      $("#submit_block").show();
      $("#print_area").show();
    
    }
   
  else
  {
    salert("Mandatory","kindly fill mandatory Fields","warning")
    return
  }
  var tax = parseFloat( $('#tax_rate_txt').find(":selected").text())/100
  tax = parseFloat(tax);
  tax = 1 + tax;

  
  table_count = table_count + 1;


  var des1  =($("#des_txt").val()).replace(/\n/g, "<br />")

  $("#pro_table").append(" <tr><td>"+ table_count + "</td><td><span class = 'fw-bold'>"+ $("#pname_txt").val() + "</span><br>" + des1 + "</td><td contenteditable='true'>"+$("#hsn_txt").val()+ "</td> <td>"+ $('#tax_rate_txt').find(":selected").val() + "</td> <td contenteditable='true' class='text-end text-nowrap'>"+ $("#price_txt").val() + "</td><td contenteditable='true'>" +  $("#qty_txt").val() + "</td> <td  class='text-end text-nowrap'>&#x20B9 "+  (parseFloat( $("#price_txt").val())* tax * parseInt($("#qty_txt").val())).toFixed(2) + "</td><td> <button class='btn btn-outline-danger border-0'> <i class='fa-solid fa-trash-can'></i> </button> </td></tr>")

  

  update_print_area()
  $('#pname_txt').val("");
  $('#hsn_txt').val("");
  $('#price_txt').val("");
  $('#qty_txt').val("");
  $('#des_txt').val("");
  $('#pname_txt').focus()

    

   });

   $('#cus_name_txt').on('input',function(e){

    if($('#cus_name_txt').val() !="")
    {
      $('#cus_name_txt').autocomplete({
        
        source: get_customer_autocomplete(),
        minLength: 2,
        cacheLength: 0,
        select: function(event, ui) {
         
        cus_id = ui.item.cus_id;
        $('#cus_addr_txt').val(ui.item.cus_addr)
        $('#pname_txt').focus();
        } ,
        //display no result 
        response: function(event, ui) {
          if (!ui.content.length) {
              var noResult = { value:"",label:"No results found" };
              ui.content.push(noResult);
          }
      }
      });
    }
   
   });


   $('#submit_btn').on("click", function()
   {
    $("#submit_btn").prop("disabled",true)
    insert_invoice()
   
    update_print_area()
   });



   $("#pro_table").on("click","tr td button", function(event) {
    //get button value
 
    $(this).parent().parent().remove()
   
    
  var count = 0
    $('#pro_table1 tr:gt(1)').each(function () {
      count =count+1
        var this_row = $(this);
       
        (this_row.find('td:eq(0)').html(count))

     });


    if(  $("#pro_table tr").length <=0)
    {
      $("#pro_table1").hide();
      $("#submit_block").hide();
      $("#print_area").hide();
    }
    update_print_area()
        });

   $("#print_btn").on("click", function()
   {
    
   
      print();
     // getPDF();
   });



   $('#apply_coupen').change(function() {
    if(this.checked) {
      $('#coupen_entry_modal').modal('show'); 
    }
    
    });

    $("#coupen_entry_btn").click(function()
    {
     if($('#coupen_type :selected').val() == 0) 
     {
      salert("Select","kindly Select Type","warning")
      return
     }
      
    if($('#coupen_entry_form')[0].checkValidity())
    {
      insert_coupen(); 
    
    }
    else{
      salert("Mandatory","kindly fill mandatory Fields","warning")
    return
    }
      
      
    });
    

    $('#print_preview').change(function() {
      if(this.checked) {
        $("#print_area").show();
      }
      else
      {
        $("#print_area").hide();
      }
      
      });

      $("#pro_table").on("focusout","tr td", function(event) {
  
        var qty = parseFloat($(this).closest('tr').children('td').eq(5).html())
        var price = parseFloat($(this).closest('tr').children('td').eq(4).html())
        var gst = parseFloat($(this).closest('tr').children('td').eq(3).html())
        var tax = parseFloat( parseInt(gst)/100)
            tax = parseFloat(tax);
            tax = 1 + tax;
        
            
        var amount = (qty * price)
        amount = (amount*tax).toFixed(2)
        console.log(amount)
        $(this).closest('tr').children('td').eq(6).html("&#x20B9 " + amount)
          
          //$(this).parent().empty()
          update_print_area()
                });


                $('#cur_no').change(function() {
 
                  $("#print_qno").text($("#scur_no").text()+  $("#cur_no").val()) 
                });
    
   });

   function insert_coupen()
   {  

$.ajax({
  url: "php/insert_coupen.php",
  type: "get", //send it through get method
  data: {
    coupen_code :  $('#coupen_code').val(),
    validity : get_millis($('#validity').val()),
    used_sts : "new",
    discount :  $('#discount').val(),
    cus_id : cus_id,
    coupen_type :  $('#coupen_type :selected').val()


},
  success: function (response) {
  salert("Added",response,"success")

  $('#discount').val("")
  $('#coupen_code').val("")


    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }


   function get_advance_payment()
   {
   
   
   
   $.ajax({
     url: "php/get_advance_payment.php",
     type: "get", //send it through get method
     data: {
       invoice_id: conv_no,
      
   },
     success: function (response) {
   console.log(response)
   
   if (response.trim() != "error") {
     var obj = JSON.parse(response);
   
     obj.forEach(function (obj) {
    
       advance_payment = parseFloat(obj.amount)
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

   
   function check_coupen_no(coupen_no)
   {  

$.ajax({
  url: "php/check_coupen.php",
  type: "get", //send it through get method
  data: {
    coupen_no:coupen_no
},
  success: function (response) {
    
    if (response.trim() != "0 result") {
   
      var obj = JSON.parse(response);
     

      obj.forEach(function (obj) {
        if(obj.used_sts == "new" && (parseFloat(obj.validity) > get_cur_millis()))
        {
        
        swal({
              title: "Are you sure? " + "Discount : " + obj.discount + "%",
              text: "You will not be reuse this code again!",
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
                  text: 'successfully Applied!',
                  icon: 'success'
                }).then(function() {
                  update_coupen(coupen_no); // <--- submit form programmatically
                  coupen_dis = obj.discount
                 
                });
              } else {
                swal("Cancelled", "Your imaginary file is safe :)", "error");
                $("#coupen_txt").val("")
              }
            })
          }
          else{
            salert("Used","Coupen Already Used/Expired" ,"error")
            $("#coupen_txt").val("")
          }
      });
     
  
    }
    else
    {
      salert("Not Valid","Coupen Not Valid" ,"error")
$("#coupen_txt").val("")
    }
   

},
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }

   function update_coupen(coupen_no)
   {  

$.ajax({
  url: "php/update_coupen.php",
  type: "get", //send it through get method
  data: {
    coupen_code :  coupen_no,
  
},
  success: function (response) {
    console.log(response)

  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }

   function get_quotion_single(conv_no,url)
   {
   
    $.ajax({
        url: "php/"+ url,
        type: "get", //send it through get method
        data: {
            qno : conv_no
          
         
      },
        success: function (response) {
      console.log(response)
      if (response.trim() != "error") {
   
   
   
        if((response.trim() != "0 result"))
        {
      
        
        
          var obj = JSON.parse(response.trim());
      
          var count = 0;
        
          obj.forEach(function (obj) {
            var des = obj.des
            var total = obj.total
            var price = obj.price
            var gst = obj.gst


            count =count + 1
            var des = conv_html(obj.des)
            price =price.replace(/₹/g, "")
            total =total.replace(/₹/g, "")
            gst =gst.replace(/%/g, "")

            $("#pro_table_conv").append(" <tr>  <td>"+ des +  "</td><td>"+obj.hsn+ "</td> <td>"+ gst +  "</td> <td contenteditable='true' class='text-end text-nowrap'> "+ price + "</td><td contenteditable='true' class= 'text-center'>" + obj.qty + "</td> <td class='text-end text-nowrap'>"+ total + "</td> <td> <button class='btn btn-outline-danger border-0'> <i class='fa-solid fa-trash-can'></i> </button> </td></tr>")
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

   
   function get_cus_info(cus_id)
{



$.ajax({
  url: "php/get_cus_info_all.php",
  type: "get", //send it through get method
  data: {
    cus_id: cus_id,
   
},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {
  var obj = JSON.parse(response);

  obj.forEach(function (obj) {
    $("#cus_name_txt").val(obj.cus_name);
    $("#cus_addr_txt").val(obj.cus_address);
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

   function insert_reminder(remind_date,description,repeat_sts,remind_ino)
   {
     
    

   $.ajax({
     url: "php/insert_invoice_reminder.php",
     type: "get", //send it through get method
     data: {
      description : description,
      remind_date : remind_date ,
      repeat_sts :repeat_sts,
      cus_id : cus_id,
      ino :  remind_ino
      
   },
     success: function (response) {
   console.log(response)
  
    
  

   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   }
   

   function insert_invoice()
   {
     
    var shipping =0
    if($("#shipping_txt").val()!="")
    {
      shipping= parseFloat($("#shipping_txt").val())
    }
     
    var gt = shipping + total_amount
console.log(gt)
   $.ajax({
     url: "php/insert_innvoice.php",
     type: "get", //send it through get method
     data: {
      qno : ino,
      sino : $("#cur_no").val(),
      inos :    $("#print_qno").text(),
      cus_name :$("#cus_name_txt").val(),
      cus_addr :$("#cus_addr_txt").val(),
      dated : get_today_start_millis(),
      shipping :$("#shipping_txt").val(), 
      total_value : gt,
      cus_id : cus_id,
      emp_id : current_user_id,
      place_of_supply: $("#pos").val(),
      valid_until: $("#valid_upto").val(),
      enq_no : $("#enq_no").val(),
     
      taxable_amount:taxable_amount
        
      
   
   },
     success: function (response) {
      console.log(response)
      if(response.trim() == "Successfully created")
      {
        salert("success","Created Successfully","success")
      }
      else{
        salert("Error","No already Available","error")
        return;
      }

      reminder.forEach(function (obj)
      {
        console.log(obj.remind_ino)
        insert_reminder(obj.reminder_days_p,obj.des_p,obj.repeat_sts_p,obj.remind_ino)
      });
      
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
         insert_invoice_product(des,hsn,gst,price,qty,total,reload_p)
       
       
        
  });
  

   
   
       
     },
     error: function (xhr) {
         //Do Something to handle error
     }
   });
   }


   function insert_invoice_product(des,hsn,gst,price,qty,total,reload_p)
   {
     
    des =des.replace("<br>","\n")
console.log(des)
   $.ajax({
     url: "php/insert_invoice_product.php",
     type: "get", //send it through get method
     data: {
      qno : ino,
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
   

   function get_invoice_details()
   {
   
    $.ajax({
        url: "php/get_invoice_details.php",
        type: "get", //send it through get method
        data: {
            
          
         
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
            $("#print_logo_preview").attr("src","/jaysan_12-08/"+obj.company_logo);
            $("#print_logo_preview1").attr("src", "/jaysan_12-08/"+ obj.company_logo1);
            $("#cur_company_terms").val(obj.company_terms)
            $("#cur_no").val(obj.sino) 
            $("#scur_no").text(obj.ino_seq) 
            $("#print_qno").text($("#scur_no").text()+  $("#cur_no").val()) 
            ino = obj.ino
            console.log(ino)
            $("#print_bank").html(obj.company_bank.replace(/\n/g, "<br />"))
            $("#print_terms").html((obj.company_terms).replace(/\n/g, "<br />"))
            $("#print_com_name").text(obj.company_name)
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
  

   function print()
   {
 

     $('#print').printThis({
      
      
      
     
   });
   
   
   }  


   function update_print_area()
   {
    $("#print_terms").html(($("#cur_company_terms").val()).replace(/\n/g, "<br />"))
    var total_amount1 =0;
    var taxable_amount1 =0;
    var total_qty =0;
      
    var shipping =0
  if($("#shipping_txt").val()!="")
  {
    shipping= parseFloat($("#shipping_txt").val())
  }
   
 

 
    $("#print_date").text(get_today_date_only())

    $("#print_cus_name").text($("#cus_name_txt").val())
    $("#print_cus_addr").html(($("#cus_addr_txt").val()).replace(/\n/g, "<br />")  + " <br/> GST No : " +$("#cus_gst_txt").val().toUpperCase())
    if($("#valid_upto").val() != "")
    $("#print_valid_upto").text( $("#valid_upto").val())
    else
    $("#print_valid_upto").text( '-')

    if($("#enq_no").val() != "")
    $("#print_enq_no").text( $("#enq_no").val())
    else
    $("#print_enq_no").text( '-')
    if( $("#pos").val() != "")
    $("#print_pos").text( $("#pos").val())
  else
  $("#print_pos").text(" - ")
    $("#print_pro_table").empty()
    var count =0
    $('#pro_table1 tr:gt(1)').each(function () {
      count =count+1
      var this_row = $(this);
      var des = $.trim(this_row.find('td:eq(1)').html())
      var hsn = $.trim(this_row.find('td:eq(2)').html())
      var gst = $.trim(this_row.find('td:eq(3)').html())
      var price = $.trim(this_row.find('td:eq(4)').html())
       var qty = $.trim(this_row.find('td:eq(5)').html())
       var total = $.trim(this_row.find('td:eq(6)').html())
     

      $("#print_pro_table").append(" <tr> <td>"+ count + "</td> <td>"+ des +  "</td><td>"+hsn+ "</td> <td>"+ gst +  "</td> <td class='text-end text-nowrap'>&#x20B9 "+ price + "</td><td class= 'text-center'>" +  qty + "</td> <td class='text-end text-nowrap'>"+ total + "</td></tr>")
        
      var tax = parseFloat( gst)/100
      tax = parseFloat(tax);
      tax = 1 + tax;
  
      total_amount1 = parseFloat(total_amount1)  + parseFloat(price)* tax * parseInt(qty)
      taxable_amount1 = parseFloat(taxable_amount1)  + parseFloat((price)* parseInt(qty))
  
  
  total_qty = parseInt(qty) + total_qty;
      $("#total_amt").text(total_amount1.toFixed(2))
      total_amount = Math.round(total_amount1)
        taxable_amount = taxable_amount1
  });


  


  
     
  
 
  $("#print_pro_table").append("<tr> <th colspan='5' class='text-center'>" + "Total" + "</th> <th class='text-center'>" + total_qty + "</th> <th class='text-end text-nowrap'  >&#x20B9 " + total_amount.toFixed(2) + "</th> </tr>")
var discount_amount =  (coupen_dis/100)*total_amount.toFixed(2);
if(discount_amount >1000)
discount_amount = 1000

var gt = shipping + (total_amount.toFixed(2) - discount_amount)
var tax_amount = gt - (taxable_amount + parseInt(shipping) )

$("#print_amount_word").text("Rupess "  + numberToWords(parseInt(gt)) + " Only")
 

  $("#print_pro_table").append("<tr><td colspan='7'> <div> <div class='d-flex justify-content-end gap-5 '> <p class='p-0 m-0'> Total Taxable Value: </p> <p class='p-0 m-0'> &#x20B9 "+ taxable_amount.toFixed(2) +   "</p> </div> <div class='d-flex justify-content-end gap-5 '> <p class='p-0 m-0'> Total Tax Amount: </p> <p class='p-0 m-0'> &#x20B9 " + tax_amount.toFixed(2) +"</p> </div><div class='d-flex justify-content-end gap-5 '> <p class='p-0 m-0'> Discount("+$('#coupen_txt').val()+"):"+" </p> <p class='p-0 m-0'> &#x20B9 " + discount_amount.toFixed(2) +"</p> </div> <div class='d-flex justify-content-end gap-5 '> <p class='p-0 m-0'> Shipping & Packaging Amount: </p> <p class='p-0 m-0'> &#x20B9 "+ shipping.toFixed(2) +"</p> </div> <div class='d-flex justify-content-end gap-5 '> <p class='p-0 m-0'> Total Value: </p> <p class='p-0 m-0'> &#x20B9 " + gt.toFixed(2) + "</p> </div> </div> </td></tr>")
 
var adue = gt.toFixed(2) - advance_payment
$("#print_advance_amount").text( " ₹ " + advance_payment)
  $("#amount_due").text(  " ₹ " + adue)
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
   console.log("res - " + response)
     
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
          var restamp = ""
        
          obj.forEach(function (obj) {
           
           
            $("#pname_txt").val(obj.pname) 
           $("#des_txt").val(obj.des)  
             $("#price_txt").val(parseFloat(obj.price))
           $("#hsn_txt").val(obj.hsn_code)
           $('#tax_rate_txt').val(obj.tax_rate).change();

           restamp = obj.restamping
            

          });
        
          get_reminder(product_id,restamp)
      
       
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
  
   function get_reminder(product_id,restamp)
   {
   
    $.ajax({
        url: "php/get_reminder_invoice.php",
        type: "get", //send it through get method
        data: {
            pid : product_id,
          
         
      },
        success: function (response) {
      console.log(response)
      var d = new Date()
var re_date =""
var d_date = ""
    var n = d.getMonth()+1
    console.log(n)
    if(n <= 3)
    { 
     
     re_date = "01/02/" + (parseInt(d.getFullYear())+ parseInt(1))
d_date = "30/03/" + (parseInt(d.getFullYear())+ parseInt(1))
    }
    else if(n<=6 && n>3)
    {
      re_date = "01/05/" + (parseInt(d.getFullYear())+ parseInt(1))
      d_date = "30/06/" + (parseInt(d.getFullYear())+ parseInt(1))
    }
    else if(n<=9 && n>6)
    {
      re_date = "01/08/" +  (parseInt(d.getFullYear())+ parseInt(1))
      d_date = "30/09/" + (parseInt(d.getFullYear())+ parseInt(1))
    }
    else if(n<=12 && n>9)
    {
      re_date = "1/11/" +  (parseInt(d.getFullYear())+ parseInt(1))
      d_date = "30/12/" + (parseInt(d.getFullYear())+ parseInt(1))
    }
    d.getFullYear
    console.log(re_date)
      if(restamp=="yes")
      {
        var des = "Restamping Reminder" +  " for invoice no -  " + ino + " Dated - " + get_today_date_only() + " and customer - " +  $("#cus_name_txt").val() + " Due Date - " + d_date
          
        var remind_obj = {reminder_days_p : get_millis(re_date),des_p : des,repeat_sts_p : "yes"}

        reminder.push(remind_obj);
      }
      if (response.trim() != "error") {
   
   
   
        if((response.trim() != "0 result"))
        {
      
        
        
          var obj = JSON.parse(response);
      
          var count = 0;
        var one_day_millis = 86400000
          obj.forEach(function (obj) {
            var reminder_days = (one_day_millis * (parseInt(obj.reminder_days) - parseInt(obj.remind_before))  + get_today_start_millis()) 

            console.log(obj.repeat_sts)
            // var  img_a = {image1_addr:image1_add, image2_addr:image2_add,image3_addr:image3_add}
            // img_addr.push(img_a)

           var des = obj.remind_name +  " for invoice no -  " + $("#print_qno").text() + " Dated - " + get_today_date_only() + " and customer - " +  $("#cus_name_txt").val() + " Due Date - " + millis_to_date(one_day_millis * (parseInt(obj.reminder_days) )   + get_today_start_millis())
          
            var remind_obj = {reminder_days_p : reminder_days,des_p : des,repeat_sts_p : obj.repeat_sts,remind_ino : ino}

            reminder.push(remind_obj);

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
 
    var today = day + "-" + month + "-" + year ; 
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