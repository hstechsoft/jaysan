
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
  var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ; 
 var cus_id = 0
 var sales_oid = 0
 var sub_type_id = []
 var model_id = []
 var type_id = []
  var subtype_name = []
  var oid= ""




$(document).ready(function(){



  let autocompleteTimer;
  $('#update_order_btn').hide()
  
 
  let now = new Date();
  // Convert to IST (UTC + 5:30)
  now.setMinutes(now.getMinutes() + 330); // Add 330 minutes (5 hours 30 minutes)
  // Format the date and time for 'datetime-local' input (YYYY-MM-DDTHH:mm)
  let formattedDateTime = now.toISOString().slice(0, 16);
  $("#dated").val(formattedDateTime);

  
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


$("#add_new_product_modal").modal("show");
    check_login();
    
  $("#unamed").text(localStorage.getItem("ls_uname"))
get_jaysan_final_product()
$('#advance_payment').prop("disabled",true)
$('#add_product_btn').on('click', function()
{
 
    $("#add_new_product_modal").modal("show");
});


$('#product').change(function() {
    //$('#product').find(':selected').text()
    //$('#product').find(':selected').val()
     });



$("#requirement_type").addClass("d-none")
      $("#color_choice_des").hide()
   $('#custom_color_chk').change(function() {
    if(this.checked) {
        $("#color_choice_des").show()
    }
   
   });

   $('#regular_clr_chk').change(function() {
    if(this.checked) {
        $("#color_choice_des").hide()
    }
   
   });


   $("#chasis_choice_des").hide()
   $('#custom_chasis_chk').change(function() {
    if(this.checked) {
        $("#chasis_choice_des").show()
    }
   
   });

   $('#regular_chasis_chk').change(function() {
    if(this.checked) {
        $("#chasis_choice_des").hide()
    }
   
   });

   $('#requirement_order').change(function() {
    if(this.checked) {
        $("#order_no").empty()
        $("#order_no").append(" <option value='0' selected>Choose Options...</option> <option value='vishnu'>10</option> <option value='murugan'>11</option> ")

        $("#requirement_type").removeClass("d-none")
    }
   
   });


   
   $('#sale_order').change(function() {
    if(this.checked) {
        $("#requirement_type").addClass("d-none")
        $("#order_no").empty()
        $("#order_no").append(" <option value='0' selected>Choose Options...</option> <option value='vishnu'>121</option> <option value='murugan'>122</option> ")
    }
   
   });

   $('#product').change(function() {
    get_jaysan_final_productmodel()
     });
     $('#pmodel').change(function() {
      get_jaysan_final_producttype()
       });

       $('#ptype').change(function() {
        get_jaysan_model_subtype()
         });
     
$('#cus_name').on('input',function(){

  if ($(this).val().trim() !== "") {
    $("label[for='cus_name']").fadeOut(300);
} else {
    $("label[for='cus_name']").fadeIn(300);
}
  //check the value not empty
      if($('#cus_name').val() !="")
      {
        $('#cus_name').autocomplete({
          //get data from databse return as array of object which contain label,value
 
          source: function(request, response) {
            get_customer_autocomplete(request, response, "pname");
        },
          minLength: 2,
          cacheLength: 0,
          select: function(event, ui) {
           
          cus_id = ui.item.cus_id;
          $('#cus_phone').val(ui.item.cus_phone)
          $('#delivery_address').val(ui.item.cus_addr)
          } ,
          //display no result 
          response: function(event, ui) {
            // if (!ui.content.length) {
            //     var noResult = { value:"",label:"No results found" };
            //     ui.content.push(noResult);
            // }
        }
        });
      }
     
     });

     $('#cus_phone').on('input',function(){
      //check the value not empty
      if ($(this).val().trim() !== "") {
        $("label[for='cus_phone']").fadeOut(300);
    } else {
        $("label[for='cus_phone']").fadeIn(300);
    }
          if($('#cus_phone').val() !="")
          {
            $('#cus_phone').autocomplete({
              
              source: function(request, response) {
                get_phone_autocomplete(request, response, "pname");
            },
              minLength: 2,
              cacheLength: 0,
              select: function(event, ui) {
               
              cus_id = ui.item.cus_id;
              $('#cus_name').val(ui.item.cus_name)
            $('#delivery_address').val(ui.item.cus_addr)
            
              } ,
              //display no result 
              response: function(event, ui) {
                // if (!ui.content.length) {
                //     var noResult = { value:"",label:"No results found" };
                //     ui.content.push(noResult);
                // }
            }
            });
          }
         
         });


       

         $('#insert_order_btn').on('click', function()
         {
       
          $('#sub_type_div input[type="checkbox"]:checked').each(function() {
              sub_type_id.push($(this).val());
          });
          console.log(sub_type_id); 
          
          

 {
  if($("#sales_order_form1")[0].checkValidity())
    if($('#sales_product tr').length > 0)
    {
      console.log($('#order_category :selected').val());
      
      if($('#order_category :selected').val() == "Sales") 
        {
         if($('#payment_table tr').length > 0)
         {
          insert_sales_order_form()
         }
         else
         shw_toast("Error","Please add payment details","error")
          
        }
    
   
  else
  insert_sales_order_form()
      }
else
shw_toast("Error","Please select the subtype","error")
  else
  shw_toast("Error","Please fill all the fields","error")
 }

         });


         $('#update_order_btn').on('click', function()
         {

          sub_type_id = []
          $('#sub_type_div input[type="checkbox"]:checked').each(function() {
            sub_type_id.push($(this).val());
        });
//  {
//   if($("#sales_order_form1")[0].checkValidity())
//   update_sales_order_form()
//  }

 
 {
  if($("#sales_order_form1")[0].checkValidity())
    if( $('#sales_product tr').length > 0)
      update_sales_order_form()
else
shw_toast("Error","Please select the subtype","error")
  else
  shw_toast("Error","Please fill all the fields","error")
 }

         });

         $('#order_table').on("click","button",function(){
   console.log($(this).hasClass('delete_btn'));
     var order_no = $(this).val();
          if($(this).hasClass('download'))
            {
              get_order_details(order_no)   
           
            }
          else if($(this).hasClass('edit_btn'))
          {
            get_sales_order_single($(this).val())
          }
         
          else  if($(this).hasClass('delete_btn'))
       {
        var btn_val = $(this).val()
        
        



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
    delete_sales_order(btn_val)
 
   }

 })
}

       }
else if($(this).hasClass('pay_btn'))  
{
   oid = $(this).val()
   get_jaysan_sales_payment_m(oid)
  $('#sales_pay').modal('show')
 
}

         
          

         })

         
         $('#req_table').on("click","button",function(){
          console.log($(this).hasClass('delete_btn'));
          
                 if($(this).hasClass('edit_btn'))
                 {
                   get_sales_order_single($(this).val())
                 }
                
                 else  if($(this).hasClass('delete_btn'))
              {
               var btn_val = $(this).val()
               
               
       
       
       
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
           delete_sales_order(btn_val)
        
          }
       
        })
       }
       
              }
       else if($(this).hasClass('sale_btn'))  
       {
          oid = $(this).val()
        get_req_order_single($(this).val())
        
       }
       
                
                 
       
                })


         $('#app_order_table').on("click","button",function(){
          var order_no = $(this).val();
          if($(this).hasClass('download'))
            {
              get_order_details(order_no)   
           
            }
            else if($(this).hasClass('dcf_btn'))
            {
              get_dispatch_count(order_no, function(count) {
             if(count > 0)
           {
           
           
            window.open("dispatch_clearance_form.html?phone_id="+phone_id+"&oid=" + order_no, "_blank");
                
           }
              else
        shw_toast("Machine","No Product ready to Dispatch","")
            });
                 
                 
            } 
          else if($(this).hasClass('pay_btn'))  
            {
               oid = $(this).val()
              $('#sales_pay').modal('show')
              oid = $(this).val()
              get_jaysan_sales_payment_m(oid)
            } 
         })

         
         
       

       $('#add_sale_product_btn').on('click', function()
       {
       if($('#product').val() != "" && $('#pmodel').val() != "" && $('#ptype').val() != "" && $('#qty').val() != ""  && $('#billing_price').val() != ""  && $('#machine_price').val() != "")

        {
          var count = 0
          var sub_type = ""
          $('#sub_type_div input[type="checkbox"]:checked').each(function() {
            count = count +1;
           console.log($(this).parent().text());
           
            sub_type = sub_type + $(this).parent().text().trim() + ","
           
        });

        sub_type = sub_type.slice(0, -1); // Remove the last comma
     
        
        if(count >= 1)
        {

          var len = $('#sales_product tr').length +1
          $('#sales_product').append(" <tr class='small'> <td>"+len + "</td> <td>"+$('#product :selected').text()+"</td> <td data-model_id='"+$('#pmodel').val()+"'>"+$('#pmodel :selected').text()+"</td> <td data-type_id='"+$('#ptype').val()+"'>"+$('#ptype :selected').text()+"</td> <td>"+sub_type+"</td> <td>"+$('#qty').val()+"</td><td>"+$('#machine_price').val()+"</td><td>"+$('#billing_price').val()+"</td> <td> <button type = 'button' class='btn btn-outline-danger border-0 btn-sm'><i class='fa fa-trash' aria-hidden='true'></i></button> </td> </tr")
          console.log("ok");
          console.log($('#product :selected').text());
 
          // $('#sel_usr_in :selected').text()

          $('#product').val("")
          $('#pmodel').val("")
          $('#pmodel').attr('disabled',true)
          $('#ptype').val("")
          $('#ptype').attr('disabled',true)
          $('#qty').val("")
          $('#product_sub_type_card').addClass('d-none')
          $('#sub_type_div').empty()
          $('#required_qty').val("") 
var qty = 0
var amount = 0
var total_amount = 0
var total_qty = 0
          $('#sales_product').find('tr').each(function(){
         qty =   parseFloat( $(this).find("td").eq(5).html())
            amount =   parseFloat( $(this).find("td").eq(6).html())
total_amount = total_amount+ (parseFloat(qty *  amount))
total_qty = total_qty + parseFloat(qty)
                      });
                      
            $('#required_qty').val(total_qty)
            $('#total_payment').val(total_amount)
        }
        
          
          else
          shw_toast("Error","Please select the subtype","error")
        }
       
        else
        shw_toast("Error","Please fill all mandatory Fields","error")
       });

       $('#sales_product').on('blur', '.editable-qty, .editable-price',function(){
        var btn_val = $(this).html()
        console.log(btn_val);
var qty = 0
var amount = 0
var total_amount = 0
var total_qty = 0
            $('#sales_product').find('tr').each(function(){
         qty =   parseFloat( $(this).find("td").eq(5).html())
            amount =   parseFloat( $(this).find("td").eq(6).html())
total_amount = total_amount+ (parseFloat(qty *  amount))
total_qty = total_qty + parseFloat(qty)
                      });
                      
            $('#required_qty').val(total_qty)
            $('#total_payment').val(total_amount)

            if($('#price_word_div').hasClass('d-none')== false)
              $('#price_word_div').addClass('d-none')
  });


  $('#sales_product').on('input', '.editable-qty, .editable-price', function () {
   console.log($(this).html());
   
    if ($(this).html().trim() !== "") {
    
      if(   $('#price_word_div').hasClass('d-none'))
        $('#price_word_div').removeClass('d-none')
        $('#price_word').text(convertToRupeesWords($(this).html().trim()))

     
    }
  });

       $('#sales_product').on("click","button",function(){
        var btn_val = $(this).val()
        console.log(btn_val);
        
        swal({  
          title: "Are you sure?",  
          text: "Once deleted, you will not be able to recover this data!", 
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            if($(this).attr('name') == "db_delete")
            {
delete_sales_product(btn_val)

            }
            else
            {
              $(this).closest('tr').remove();
              $('#sales_product tr').each(function(i) {
                console.log($(this).find('td:first').html());
                
                $(this).find('td:first').html(i + 1);
              })
            }
       
          } 
        });

  

          
       });

       $('#payment_table').on("click","button",function(){
        var btn_val = $(this).val()
        console.log(btn_val);
        
        swal({  
          title: "Are you sure?",  
          text: "Once deleted, you will not be able to recover this data!", 
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
         
            {
              $(this).closest('tr').remove();
              $('#payment_table tr').each(function(i) {
                console.log($(this).find('td:first').html());
                
                $(this).find('td:first').html(i + 1);
              })
              total_amount  = 0
              $('#payment_table').find('tr').each(function(){
                total_amount = total_amount +   Number( $(this).find("td").eq(2).html())
                          });

                $('#total_amount').text(total_amount)
            }
       
          } 
        });

  

    
          
       });


       $('#payment_add_btn').on('click', function(){
        if($('#amount').val() != "" && $('#payment_date').val() != "" && $('#ref_no').val() != "" && $('#utr_no').val() != "")
        {
          var len = $('#payment_table tr').length +1
          $('#payment_table').append("<tr class='small'> <td>"+len+"</td> <td>"+$('#ref_no').val()+"</td> <td>"+$('#utr_no').val()+"</td> <td>"+$('#amount').val()+"</td> <td>"+$('#payment_date').val()+"</td> <td><button class='btn btn-outline-danger btn-sm border-0' type='button'><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>")

          $('#ref_no').val("")
          $('#utr_no').val("")
          $('#amount').val("")
          $('#payment_date').val("")
          var total_amount = 0
          $('#payment_table').find('tr').each(function(){
total_amount = total_amount +   Number( $(this).find("td").eq(2).html())
          });
$('#total_amount').text(total_amount)
        }
        else
        shw_toast("Error","Please fill all details ","error")
        
        
        
             });

             $('#update_pay_btn').on('click', function(){
              update_sales_pay_date()
             });
             
             $('#payment_add_btn_m').on('click', function(){
            insert_sales_pay()
             });
             
             $('#payment_table_m').on("click","button",function(){
              var btn_val = $(this).val()
              console.log(btn_val);
              
              swal({  
                title: "Are you sure?",  
                text: "Once deleted, you will not be able to recover this data!", 
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
              .then((willDelete) => {
                if (willDelete) {
               
                  {
                    delete_sales_pay(btn_val)
                  }
             
                } 
              });
      
        
      
          
                
             });


           $('#billing_price').on('input',function(){
  
$("#credit_amount").text(Number($("#billing_price").val())-Number($("#machine_price").val()))  
});


$('#machine_price').on('input',function(){
  if ($(this).val().trim() !== "") {
    if(   $('#price_word_div').hasClass('d-none'))
    $('#price_word_div').removeClass('d-none')
    $('#price_word').text(convertToRupeesWords($(this).val()))


} else {
  $('#price_word').text("")
  if($('#price_word_div').hasClass('d-none')== false)
    $('#price_word_div').addClass('d-none')
}  
$("#credit_amount").text(Number($("#billing_price").val())-Number($("#machine_price").val()))  
});

$('#machine_price').on('blur',function(){
  if($('#price_word_div').hasClass('d-none')== false)
    $('#price_word_div').addClass('d-none')
});

});


function get_dispatch_count(oid,callback)
{
 

$.ajax({
  url: "php/get_dispatch_count.php",
  type: "get", //send it through get method
  data: {
  oid : oid

  },
  success: function (response) {

console.log(response);

if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 

  obj.forEach(function (obj) {
     count = obj.count

  });
callback (count);
 
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



function print()
{


  $('#order_form').printThis({
   
   
   
  
});


}
function delete_sales_pay(payment_id)
{
 



$.ajax({
  url: "php/delete_sales_pay.php",
  type: "get", //send it through get method
  data: {
    payment_id :  payment_id,
    

  },
  success: function (response) {

console.log(response);

if (response.trim() == "ok") {

  shw_toast("Success", "Payment Deleted ", "success")
  get_jaysan_sales_payment_m(oid)

}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}


function insert_sales_pay()
{

  
$.ajax({
  url: "php/insert_sales_payment.php",
  type: "get", //send it through get method
  data: {
    oid :  oid,
    ref_no :  $('#ref_no_m').val(),
      utr_no :  $('#utr_no_m').val(),
    amount :  $('#amount_m').val(),
    payment_date :  $('#payment_date_m').val()


  },
  success: function (response) {

console.log(response);

if (response.trim() == "ok") {
  
    shw_toast("Success", "Payment Added", "success")
    get_jaysan_sales_payment_m(oid)

}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}



function update_sales_pay_date()
{
 



$.ajax({
  url: "php/update_sales_pay_date.php",
  type: "get", //send it through get method
  data: {
    oid :  oid,
    pay_date :  $('#nex_payment_date_m').val(),
 

  },
  success: function (response) {

console.log(response);

if (response.trim() == "ok") {

  shw_toast("Success", "Payment Date Updated", "success")
  get_jaysan_sales_payment_m(oid)

}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}




function get_order_details(ass_id)
{
 

$.ajax({
  url: "php/get_sales_order_details_approved.php",
  type: "get", //send it through get method
  data: {

    order_id : ass_id

  },
  success: function (response) {
console.log(response);

   
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {
  if($('#order_form_div').hasClass("d-none"))
$('#order_form_div').removeClass("d-none")
  if($('#dispatch_form_div').hasClass("d-none") == false)
$('#dispatch_form_div').addClass("d-none")
  var obj = JSON.parse(response);
var count =0 
$('html, body').animate({
  scrollTop: $('#order_form').offset().top
}, 500);


  obj.forEach(function (obj) {
     count = count +1;


 
     
     $('#order_category_tbl').text(obj.order_category + " Order")
      
      $('#cus_name_tbl').html(obj.cus_name)
      $('#cus_phone_tbl').html(obj.cus_phone)
      $('#order_type_tbl').html(obj.order_type)
      
      if(obj.oe_supply == "1")
      {
        $('#oe_supply_tbl').html("Yes")
      }
        else
        {
          $('#oe_supply_tbl').html("No")
        }
        var nex_pay_date = " nil"
        if(obj.nex_payment_date == '0000-00-00 00:00:00')
nex_pay_date = " nil "
        else
        nex_pay_date = obj.nex_payment_date
        
        $('#nex_payment_date_tbl').html(nex_pay_date)
        $('#desigi_tbl').html(obj.emp_role)
        $('#commitment_date_tbl').html(obj.commitment_date)
      $('#document_date_tbl').html(obj.dated)
      $('#required_qty_tbl').html(obj.required_qty)
      $('#color_choice_des_tbl').html(obj.color_choice_des)
      $('#chasis_choice_des_tbl').html(obj.chasis_choice_des)
      $('#any_other_spec_tbl').html(obj.any_other_spec)
      $('#loading_type_tbl').html(obj.loading_type)
      $('#delivery_address_tbl').html(obj.delivery_addr + "</br>" + obj.pincode)
      const paid_amount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(obj.paid);
    
      $('#advance_payment_tbl').html(paid_amount)
      const total_amount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(obj.total_payment);
      $('#total_payment_tbl').html(total_amount)
   
      $('#order_no_tbl').html(obj.order_no)
      $('#emp_name_tbl').html(obj.emp_name)
      
$('#production_untill_tbl').html(obj.production_untill)
    
     
      const balancePayment = obj.total_payment - obj.paid;
      const bal_percent = (balancePayment / obj.total_payment) * 100;
      const bal_amount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(balancePayment);
      $('#balance_payment_tbl').html(bal_amount + " (" + bal_percent.toFixed(2) + "%)");
      $('#regular_clr_chk_tbl').html(obj.color_choice)
      $('#regular_chasis_chk_tbl').html(obj.chasis_choice)
      if(obj.payment_details != null)
      {
        $('.pay').remove();


        $('#payment_details_tr').after(obj.payment_details)
      
      }
      $('.product').remove();
      
      $('#app_product_details').after(obj.product_details)
      console.log( $('#payment_details_tr').html());

   
 })

 get_assign_sts(ass_id)

//  html2canvas(document.querySelector("#order_form")).then(canvas => {
//   let imgData = canvas.toDataURL("image/png");
//   let { jsPDF } = window.jspdf;
//   let pdf = new jsPDF();

//   // Set page size based on the canvas size
//   let imgWidth = 190;
//   let imgHeight = (canvas.height * imgWidth) / canvas.width;
//   let pageHeight = imgHeight + 20; // Adding some space at the bottom
//   pdf.internal.pageSize.height = pageHeight;

//   // Add the image to the PDF
//   pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

//   // Save the PDF
//   pdf.save("document.pdf");
// });

print()

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


function get_assign_sts(order_id)
{
 

$.ajax({
  url: "php/get_pro_assign_sts.php",
  type: "get", //send it through get method
  data: {

    order_id : order_id

  },
  success: function (response) {
console.log(response);

   
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 
$('.product_sts').remove();


  obj.forEach(function (obj) {
     count = count +1;


 
    
 
      
      $('#product_status_tr').after( obj.product)
     ;
 })



//  html2canvas(document.querySelector("#order_form")).then(canvas => {
//   let imgData = canvas.toDataURL("image/png");
//   let { jsPDF } = window.jspdf;
//   let pdf = new jsPDF();

//   // Set page size based on the canvas size
//   let imgWidth = 190;
//   let imgHeight = (canvas.height * imgWidth) / canvas.width;
//   let pageHeight = imgHeight + 20; // Adding some space at the bottom
//   pdf.internal.pageSize.height = pageHeight;

//   // Add the image to the PDF
//   pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

//   // Save the PDF
//   pdf.save("document.pdf");
// });

//  print()

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

function get_jaysan_model_subtype()
{
 

$.ajax({
  url: "php/get_jaysan_model_subtype1.php",
  type: "get", //send it through get method
  data: {
  mtid :  $('#ptype').val()

  },
  success: function (response) {
console.log(response);
$('#sub_type_div').empty()
$('#product_sub_type_card').removeClass('d-none')
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 
$('#sub_type_div input[type="checkbox"]').prop('disabled', false);

  obj.forEach(function (obj) {
$('#sub_type_div').append(" <div class='col'> <div class='form-check'> <input class='form-check-input' type='checkbox' value='"+obj.msid+"'> <label class='form-check-label' for='option2'> "+obj.subtype_name+" </label> </div> </div>")
$('#qty').focus()
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

function delete_sales_product(opid)
{
  

      
       $.ajax({
           url: "php/delete_sales_product.php",
           type: "get", //send it through get method
           data: {
            opid: opid
          },
           success: function (response) {
          console.log(response);
          
          if (response.trim() != "error") {
    
            if (response.trim() == "ok") {
           shw_toast("Success", "Product Deleted", "success")
         get_jaysan_sales_product(sales_oid)
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


function delete_sales_order(oid)
{
  

      
       $.ajax({
           url: "php/delete_sales_order.php",
           type: "get", //send it through get method
           data: {
            oid: oid
          },
           success: function (response) {
          console.log(response);
          
          if (response.trim() != "error") {
    
            if (response.trim() == "ok") {
           
          
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

function get_sales_order(approve_sts)
{
 

$.ajax({
  
  url: "php/get_sales_report_emp.php",
  type: "get", //send it through get method
  data: {
  emp_id : current_user_id,
  approve_sts : approve_sts,
  order_cat : "Sales"
  },
  success: function (response) {
console.log(response);


    $('#order_table').empty()
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
    var bd = ""
     count = count +1;
    //  $('#order_table').append("<tr><td>"+count+"</td><td>"+obj.order_no+"</td><td>"+obj.order_category+"</td><td>"+obj.product+"</td><td>"+obj.customer+"</td><td>"+obj.so_date+"</td><td><button type = 'button' value='"+obj.oid+"'  class='edit_btn btn btn-outline-primary border-0'><i class='fa-solid fa-edit'></i> </button></td><td><button  type = 'button' value='"+obj.oid+"' class='delete_btn btn btn-outline-danger border-0'><i class='fa-solid fa-trash-can'></i></button></td><td><button  type = 'button'  value='"+obj.oid+"' class='pay_btn btn btn-success btn-sm border-0'>Pay</td></tr>")
if(obj.pay_sts == "na")
bd = "disabled"

console.log(obj.pay_sts);


     $('#order_table').append("<tr class = ''><td>"+count+"</td><td class = 'small' style='max-width: 50px;'>"+obj.order_no+"</td>><td class = 'small' style='max-width: 100px;'>"+obj.dated+"</td> <td class = 'small'>"+obj.emp+"</td><td class = 'small ' style='max-width: 250px;'>"+obj.pay_details+"</td> <td class = 'small ' style='max-width: 100px;'>"+obj.cus+"</td><td style='max-width: 250px;'><div>"+obj.pro+"</div></td> <td style='max-width: 50px;'><button type ='button' value='"+obj.oid+"' class='btn btn-outline-primary edit_btn border-0'><i class='fa-solid fa-edit'></i></button></td><td style='max-width: 50px;'><button type ='button' value='"+obj.oid+"' class='delete_btn btn btn-outline-danger border-0'><i class='fa-solid fa-trash-can'></i></button></td><td><button  type = 'button'  value='"+obj.oid+"' class='pay_btn btn btn-success btn-sm border-0'>Pay</td><td style='max-width: 50px;'><button  "+bd+" type ='button' value='"+obj.oid+"' class='btn btn-outline-primary download border-0'><i class='fa-solid fa-download'></i></button></td></tr>")
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



function get_sales_order_approval(approve_sts)
{
 

$.ajax({
  url: "php/get_sales_report_emp.php",
  type: "get", //send it through get method
  data: {
  emp_id : current_user_id,
  approve_sts : approve_sts,
    order_cat : "Sales"
  },
  success: function (response) {
console.log(response);


    $('#app_order_table').empty()
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
    //  $('#app_order_table').append("<tr><td>"+count+"</td><td>"+obj.order_no+"</td><td>"+obj.order_category+"</td><td>"+obj.product+"</td><td>"+obj.customer+"</td><td>"+obj.required_qty+"</td><td><button type ='button' value='"+obj.oid+"' class=' download_btn btn btn-outline-primary border-0'><i class='fa-solid fa-download'></i></button></td><td><button  type ='button' value='"+obj.oid+"' class='pay_btn btn btn-success btn-sm border-0'>Pay</td></tr>")


     
     $('#app_order_table').append("<tr class = ''><td>"+count+"</td><td class = 'small' style='max-width: 50px;'>"+obj.order_no+"</td>><td class = 'small' style='max-width: 100px;'>"+obj.dated+"</td> <td class = 'small'>"+obj.emp+"</td><td class = 'small ' style='max-width: 250px;'>"+obj.pay_details+"</td> <td class = 'small ' style='max-width: 100px;'>"+obj.cus+"</td><td style='max-width: 250px;'><div>"+obj.pro+"</div></td> <td style='max-width: 50px;'><button type ='button' value='"+obj.oid+"' class='btn btn-outline-primary download border-0'><i class='fa-solid fa-download'></i></button></td><td style='max-width: 50px;'><button type ='button' value='"+obj.oid+"' class='dcf_btn btn btn-outline-primary border-0'><i class='fa-regular fa-file'></i></button></td><td><button  type = 'button'  value='"+obj.oid+"' class='pay_btn btn btn-success btn-sm border-0'>Pay</td></tr>")
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

function get_req_order(approve_sts)
{
 

$.ajax({
  
  url: "php/get_sales_report_emp.php",
  type: "get", //send it through get method
  data: {
  emp_id : current_user_id,
  approve_sts : approve_sts,
  order_cat : "Requirement"
  },
  success: function (response) {
console.log(response);


    $('#req_table').empty()
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
    //  $('#order_table').append("<tr><td>"+count+"</td><td>"+obj.order_no+"</td><td>"+obj.order_category+"</td><td>"+obj.product+"</td><td>"+obj.customer+"</td><td>"+obj.so_date+"</td><td><button type = 'button' value='"+obj.oid+"'  class='edit_btn btn btn-outline-primary border-0'><i class='fa-solid fa-edit'></i> </button></td><td><button  type = 'button' value='"+obj.oid+"' class='delete_btn btn btn-outline-danger border-0'><i class='fa-solid fa-trash-can'></i></button></td><td><button  type = 'button'  value='"+obj.oid+"' class='pay_btn btn btn-success btn-sm border-0'>Pay</td></tr>")



     $('#req_table').append("<tr class = ''><td>"+count+"</td><td class = 'small' style='max-width: 50px;'>"+obj.order_no+"</td>><td class = 'small' style='max-width: 100px;'>"+obj.dated+"</td> <td class = 'small'>"+obj.emp+"</td><td class = 'small ' style='max-width: 250px;'>"+obj.pay_details+"</td> <td class = 'small ' style='max-width: 100px;'>"+obj.cus+"</td><td style='max-width: 250px;'><div>"+obj.pro+"</div></td> <td style='max-width: 50px;'><button type ='button' value='"+obj.oid+"' class='btn btn-outline-primary edit_btn border-0'><i class='fa-solid fa-edit'></i></button></td><td style='max-width: 50px;'><button type ='button' value='"+obj.oid+"' class='delete_btn btn btn-outline-danger border-0'><i class='fa-solid fa-trash-can'></i></button></td><td><button  type = 'button'  value='"+obj.oid+"' class='sale_btn btn btn-success btn-sm border-0'><i class='fa-solid fa-diamond-turn-right'></i></td></tr>")
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

function get_sales_order_single(oid)
{
 

$.ajax({
  url: "php/get_sales_order_single.php",
  type: "get", //send it through get method
  data: {

  oid : oid

  },
  success: function (response) {
console.log(response);

   
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 

$('#order_category').focus()
  obj.forEach(function (obj) {
     count = count +1;
     
    //  $('#pmodel').removeAttr('selected')
    //  $('#pmodel').append("<option selected value = '"+obj.product_id+"'>"+obj.model_name+"</option>")
    //  $('#pmodel').attr('disabled',true)

    //  $('#ptype').removeAttr('selected')
    //  $('#ptype').append("<option selected value = '"+obj.type_id+"'>"+obj.type_name+"</option>")
    //  $('#ptype').attr('disabled',true)

 
     
     $('#order_category').val(obj.order_category)
     $('#order_category').attr('disabled',true)
     
      //  $('#product').val(obj.pid)
      //  $('#pmodel').val(obj.product_id)

      $('#cus_name').val(obj.cus_name)
      $('#cus_phone').val(obj.cus_phone)
      $('#order_type').val(obj.order_type)
      $('#oe_supply').val(obj.oe_supply)
      $('#commitment_date').val(obj.commitment_date)
      $('#nex_payment_date').val(obj.nex_payment_date)
      $('#required_qty').val(obj.required_qty)
      $('#color_choice_des').val(obj.color_choice_des)
      $('#chasis_choice_des').val(obj.chasis_choice_des)
      $('#any_other_spec').val(obj.any_other_spec)
      $('#loading_type').val(obj.loading_type)
      $('#delivery_address').val(obj.delivery_addr)
      $('#advance_payment').val(obj.advance_payment)
      $('#total_payment').val(obj.total_payment)
      $('#pincode').val(obj.pincode)
    
$('#production_untill').val(obj.production_untill)
      $('#insert_order_btn').hide()
      $('#update_order_btn').show()
      cus_id = obj.customer_id


      $('#balance_payment').val(obj.total_payment - obj.advance_payment)
      if(obj.color_choice == "Regular")
        $('#regular_clr_chk').prop('checked',true).trigger('change');
      else
        $('#custom_color_chk').prop('checked',true).trigger('change');

        if(obj.chasis_choice == "Regular")
        $('#regular_chasis_chk').prop('checked',true).trigger('change');
      else
        $('#custom_chasis_chk').prop('checked',true).trigger('change');
      sales_oid = obj.oid
 })

 get_jaysan_sales_product(oid)
  get_jaysan_sales_payment(oid)
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

function get_req_order_single(oid)
{
 

$.ajax({
  url: "php/get_sales_order_single.php",
  type: "get", //send it through get method
  data: {

  oid : oid

  },
  success: function (response) {
console.log(response);

   
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 

$('#order_category').focus()
  obj.forEach(function (obj) {
     count = count +1;
     
    //  $('#pmodel').removeAttr('selected')
    //  $('#pmodel').append("<option selected value = '"+obj.product_id+"'>"+obj.model_name+"</option>")
    //  $('#pmodel').attr('disabled',true)

    //  $('#ptype').removeAttr('selected')
    //  $('#ptype').append("<option selected value = '"+obj.type_id+"'>"+obj.type_name+"</option>")
    //  $('#ptype').attr('disabled',true)

 
     
     $('#order_category').val("Sales")
     $('#order_category').attr('disabled',true)
     
      //  $('#product').val(obj.pid)
      //  $('#pmodel').val(obj.product_id)

      $('#cus_name').val(obj.cus_name)
      $('#cus_phone').val(obj.cus_phone)
      $('#order_type').val(obj.order_type)
      $('#oe_supply').val(obj.oe_supply)
      $('#commitment_date').val(obj.commitment_date)
      $('#nex_payment_date').val(obj.nex_payment_date)
      $('#required_qty').val(obj.required_qty)
      $('#color_choice_des').val(obj.color_choice_des)
      $('#chasis_choice_des').val(obj.chasis_choice_des)
      $('#any_other_spec').val(obj.any_other_spec)
      $('#loading_type').val(obj.loading_type)
      $('#delivery_address').val(obj.delivery_addr)
      $('#advance_payment').val(obj.advance_payment)
      $('#total_payment').val(obj.total_payment)
      $('#pincode').val(obj.pincode)
    
$('#production_untill').val(obj.production_untill)
      $('#insert_order_btn').show()
      $('#update_order_btn').hide()
      cus_id = obj.customer_id


      $('#balance_payment').val(obj.total_payment - obj.advance_payment)
      if(obj.color_choice == "Regular")
        $('#regular_clr_chk').prop('checked',true).trigger('change');
      else
        $('#custom_color_chk').prop('checked',true).trigger('change');

        if(obj.chasis_choice == "Regular")
        $('#regular_chasis_chk').prop('checked',true).trigger('change');
      else
        $('#custom_chasis_chk').prop('checked',true).trigger('change');
      sales_oid = obj.oid
 })

 get_jaysan_sales_product(oid)
  get_jaysan_sales_payment(oid)
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


function get_jaysan_sales_payment(oid)
{
 

$.ajax({
  url: "php/get_sales_payment1.php",
  type: "get", //send it through get method
  data: {

  oid : oid

  },
  success: function (response) {
console.log(response);

$('#payment_table').empty()
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 

var total_amount = 0
  obj.forEach(function (obj) {
     count = count +1;
     $('#payment_table').append("<tr class='small'> <td>"+count+"</td> <td  contenteditable=\"true\">"+obj.ref_no+"</td><td contenteditable=\"true\">"+obj.utr_no+"</td> <td>"+obj.amount+"</td> <td>"+obj.formatted_datetime +"</td> <td><button class='btn btn-outline-danger btn-sm border-0' type='button'><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>")
total_amount = total_amount +   Number(obj.amount)

  // $('#sub_type_div input[type="checkbox"]').prop('disabled', true);
 })
 $('#total_amount').text(total_amount)

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

function get_jaysan_sales_payment_m(oid)
{
 

$.ajax({
  url: "php/get_sales_payment_m.php",
  type: "get", //send it through get method
  data: {

  oid : oid

  },
  success: function (response) {
console.log(response);

$('#payment_table_m').empty()
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 

var total_amount = 0
var sts = ""
  obj.forEach(function (obj) {
    if(obj.sts == "approved")
    {
sts = "<i class='fa-solid fa-thumbs-up'></i>"
    }
    else
    sts = "<i class='fa-solid fa-hourglass-half'></i>"

    $('#total_payment_m').val(obj.total_payment)
     count = count +1;
     $('#payment_table_m').append("<tr class='small'> <td>"+count+"</td> <td  contenteditable=\"true\">"+obj.ref_no+"</td> <td  contenteditable=\"true\">"+obj.utr_no+"</td> <td>"+obj.amount+"</td> <td>"+obj.formatted_datetime +"</td><td>"+sts + "</td><td><button value  = '"+obj.payment_id+"' class='btn btn-outline-danger btn-sm border-0' type='button'><i class='fa fa-trash' aria-hidden='true'></i></button></td> </tr>")
total_amount = total_amount +   Number(obj.amount)

  // $('#sub_type_div input[type="checkbox"]').prop('disabled', true);
  $('#total_amount_m').text(total_amount)
 $('#nex_payment_date_m').val(obj.next_payment_date)
 })
 
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

function get_jaysan_sales_product(oid)
{
 

$.ajax({
  url: "php/get_sales_product1.php",
  type: "get", //send it through get method
  data: {

  oid : oid

  },
  success: function (response) {
console.log(response);

$('#sales_product').empty()
if (response.trim() != "error") {

 if (response.trim() != "0 result")
 {

  var obj = JSON.parse(response);
var count =0 


  obj.forEach(function (obj) {
     count = count +1;
     $('#sales_product').append(" <tr class='small'> <td>"+count + "</td> <td>"+obj.produt+"</td> <td data-model_id='"+obj.model_id+"'>"+obj.model_name+"</td> <td data-type_id='"+obj.type_id+"'>"+obj.type_name+"</td> <td>"+obj.sub_type+"</td> <td contenteditable='true'  class='editable-qty'>"+obj.required_qty+"</td> <td contenteditable='true' class='editable-price'>"+obj.price+"</td>   <td contenteditable='true' class='editable-price'>"+obj.billing_amount+"</td> <td> <button name='db_delete' value ='"+ obj.opid+"' type = 'button' class='btn btn-outline-danger border-0 btn-sm'><i class='fa fa-trash' aria-hidden='true'></i></button> </td> </tr")
        
  // $('#sub_type_div input[type="checkbox"]').prop('disabled', true);
 })
 
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


function get_sales_order_sub_type(oid)
{
 

$.ajax({
  url: "php/get_sales_order_subtype.php",
  type: "get", //send it through get method
  data: {

  oid : oid

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
   
     $('#sub_type_div input[type="checkbox"]').each(function() {
      if ($(this).val() === obj.msid) {
          $(this).prop('checked', true);
      }
  })
  // $('#sub_type_div input[type="checkbox"]').prop('disabled', true);
 })
 
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

function insert_sales_order_form()
{
  
$('#insert_order_btn').attr('disabled', true)

  // $('#sales_product').find('tr').each(function() {
  //   model_id.push($(this).find('td:eq(2)').attr('data-model_id'))
  //   type_id.push($(this).find('td:eq(3)').attr('data-type_id'))
  //   subtype_name.push($(this).find('td:eq(4)').text())
  // });
var productDetails = [];
$('#sales_product').find('tr').each(function() {
  var model = $(this).find('td:eq(2)').attr('data-model_id');
  var type = $(this).find('td:eq(3)').attr('data-type_id');
  var subtype = $(this).find('td:eq(4)').text();
  var qty = $(this).find('td:eq(5)').text();
  var price = $(this).find('td:eq(6)').text();
    var billing_amount = $(this).find('td:eq(7)').text();
  productDetails.push({ model: model, type: type, subtype: subtype , qty: qty,price : price,billing_amount : billing_amount });
});


var paymentDetails = [];
$('#payment_table').find('tr').each(function() {
  var ref_no = $(this).find('td:eq(1)').text();
   var utr_no = $(this).find('td:eq(2)').text();
  var amount = $(this).find('td:eq(3)').text();
  var payment_date = $(this).find('td:eq(4)').text();
  paymentDetails.push({ ref_no: ref_no, amount: amount, payment_date: payment_date,utr_no : utr_no });

});

console.log(productDetails);
 var chasis_choice = "Custom"
 var color_choice = "Custom"

 var production_untill = $('#production_untill').length > 0 ? $('#production_untill').val() : '';

if($('#regular_chasis_chk').is(":checked"))
  chasis_choice = "Regular"


  if($('#regular_clr_chk').is(":checked"))
  color_choice = "Regular"


$.ajax({
  url: "php/insert_sales_order_form.php",
  type: "get", //send it through get method
  data: {
    paymentDetails :  paymentDetails,
    productDetails :  productDetails,
  order_category :  $('#order_category :selected').val(),
product_id :  $('#pmodel :selected').val(),
customer_name :  $('#cus_name').val(),
customer_phone :  $('#cus_phone').val(),
customer_id : cus_id,
order_type :  $('#order_type :selected').val(),
oe_supply :  $('#oe_supply :selected').val(),
commitment_date :  $('#commitment_date').val(),
required_qty :  $('#required_qty').val(),
color_choice : color_choice,
color_choice_des :  $('#color_choice_des').val(),
chasis_choice : chasis_choice,
chasis_choice_des :  $('#chasis_choice_des').val(),
any_other_spec :  $('#any_other_spec').val(),
loading_type :  $('#loading_type').val(),
delivery_addr :  $('#delivery_address').val(),
advance_payment :  $('#advance_payment').val(),
total_payment :  $('#total_payment').val(),

pincode :  $('#pincode').val(),
emp_id : current_user_id,
production_untill: production_untill,
sub_type_id : sub_type_id,
type_id : $('#ptype').val(),
nex_payment_date :  $('#nex_payment_date').val(),

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

function update_sales_order_form()
{
$('#update_order_btn').attr('disabled', true)
  var productDetails = [];
$('#sales_product').find('tr').each(function() {
  var model = $(this).find('td:eq(2)').attr('data-model_id');
  var type = $(this).find('td:eq(3)').attr('data-type_id');
  var subtype = $(this).find('td:eq(4)').text();
  var qty = $(this).find('td:eq(5)').text();
  var price = $(this).find('td:eq(6)').text();
   var billing_amount = $(this).find('td:eq(7)').text();
  productDetails.push({ model: model, type: type, subtype: subtype , qty: qty,price : price,billing_amount : billing_amount });
  
});

var paymentDetails = [];
$('#payment_table').find('tr').each(function() {
  var ref_no = $(this).find('td:eq(1)').text();
     var utr_no = $(this).find('td:eq(2)').text();
  var amount = $(this).find('td:eq(3)').text();
  var payment_date = $(this).find('td:eq(3)').text();
  paymentDetails.push({ ref_no: ref_no, amount: amount, payment_date: payment_date,utr_no: utr_no });

});

 var chasis_choice = "Custom"
 var color_choice = "Custom"


 var production_untill = $('#production_untill').length > 0 ? $('#production_untill').val() : '';


if($('#regular_chasis_chk').is(":checked"))
  chasis_choice = "Regular"


  if($('#regular_clr_chk').is(":checked"))
  color_choice = "Regular"


$.ajax({
  url: "php/update_sales_order_form.php",
  type: "get", //send it through get method
  data: {
    paymentDetails :  paymentDetails,
    productDetails :  productDetails,
  order_category :  $('#order_category :selected').val(),
product_id :  $('#pmodel :selected').val(),
customer_name :  $('#cus_name').val(),
customer_phone :  $('#cus_phone').val(),
customer_id : cus_id,
order_type :  $('#order_type :selected').val(),
oe_supply :  $('#oe_supply :selected').val(),
commitment_date :  $('#commitment_date').val(),
required_qty :  $('#required_qty').val(),
color_choice : color_choice,
color_choice_des :  $('#color_choice_des').val(),
chasis_choice : chasis_choice,
chasis_choice_des :  $('#chasis_choice_des').val(),
any_other_spec :  $('#any_other_spec').val(),
loading_type :  $('#loading_type').val(),
delivery_addr :  $('#delivery_address').val(),
advance_payment :  $('#advance_payment').val(),
total_payment :  $('#total_payment').val(),
pincode :  $('#pincode').val(),
emp_id : current_user_id,
sales_oid : sales_oid,
production_untill : production_untill,
sub_type_id : sub_type_id,
type_id : $('#ptype').val(),
nex_payment_date :  $('#nex_payment_date').val(),

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






function get_customer_autocomplete(request,response)
{
  
     var cusname =  $('#cus_name').val() + '%';
 var customer = [];
 var object = {};
  $.ajax({
    url: "php/get_customer_autocomplete.php",
    type: "get", //send it through get method
    data: {
      cus_name:cusname,
     
  
  },
    success: function (data) {

  
  if (data.trim() != "0 result") {
    var obj = JSON.parse(data);


  

    obj.forEach(function (obj) {

       object = {
     
        label:obj.cus_name + " - " +  obj.cus_phone,
        cus_id : obj.cus_id,
        cus_addr : obj.cus_address,
        value : obj.cus_name,
        cus_name : obj.cus_name,
        cus_phone : obj.cus_phone

       
        
    };
     customer.push(object);
   
      
    });
   
    response(customer);
  }
  
  // else {
  //   customer = [];
  //   var object = {
    
  //     value:"No data",
  //     cus_id : "",
  //     cus_addr : ""
       
  // };
  //  customer.push(object);
  
 
  // }
  
  
      
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

 
  // console.log(customer)
 
 
  // return customer;
 
}

function get_phone_autocomplete(request,response)
{
  
     var cus_phone =  $('#cus_phone').val() + '%';
 var customer = [];
 var object = {};
  $.ajax({
    url: "php/get_phone_autocomplete.php",
    type: "get", //send it through get method
    data: {
     cus_phone:cus_phone,
     
  
  },
    success: function (data) {

  
  if (data.trim() != "0 result") {
    var obj = JSON.parse(data);


  

    obj.forEach(function (obj) {

       object = {
     
        label: +  obj.cus_phone +" - "+obj.cus_name,
        cus_id : obj.cus_id,
        cus_addr : obj.cus_address,
        value : obj.cus_phone,
        cus_name : obj.cus_name,
        cus_phone : obj.cus_phone

       
        
    };
     customer.push(object);
   
      
    });
   
  response(customer);
  }
  
  // else {
  //   customer = [];
  //   var object = {
    
  //     value:"No data",
  //     cus_id : "",
  //     cus_addr : ""
       
  // };
  //  customer.push(object);
  
 
  // }
  
  
      
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






function convertToRupeesWords(num) {
  if (num === 0) return "Zero Rupees Only";

  var ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  var teens = ["Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  var tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  var suffixes = ["", "Thousand", "Lakh", "Crore"];

  function convertChunk(n) {
      let str = "";
      if (n >= 100) {
          str += ones[Math.floor(n / 100)] + " Hundred ";
          n %= 100;
      }
      if (n >= 11 && n <= 19) {
          str += teens[n - 11] + " ";
      } else {
          str += tens[Math.floor(n / 10)] + " ";
          str += ones[n % 10] + " ";
      }
      return str.trim();
  }

  let str = "";
  let crore = Math.floor(num / 10000000);
  num %= 10000000;
  let lakh = Math.floor(num / 100000);
  num %= 100000;
  let thousand = Math.floor(num / 1000);
  num %= 1000;
  let hundred = Math.floor(num / 100);
  num %= 100;

  if (crore) str += convertChunk(crore) + " Crore ";
  if (lakh) str += convertChunk(lakh) + " Lakh ";
  if (thousand) str += convertChunk(thousand) + " Thousand ";
  if (hundred) str += convertChunk(hundred) + " Hundred ";
  if (num > 0) str += convertChunk(num) + " ";

  return "₹ " +  str.trim();
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
     get_sales_order(0)
     get_sales_order_approval(1)
     get_req_order(0)
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
      
       get_sales_order(0)
       get_sales_order_approval(1)
       get_req_order(0)
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