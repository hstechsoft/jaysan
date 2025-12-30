var emp_month=[];
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
$(document).ready(function () {
    get_month();

     
   $("#view_report_btn").click(function()
   {
    get_payslip_report()
   });
   
});

function get_payslip_report(){
   console.log($("#cname").val())
    $.ajax({
      url: "php/get_payslip_report.php",
      type: "get", //send it through get method
      data: {
       phone_id:phone_id,
       pay_month : $("#cname").val()
     
     },
      success: function (response) {
       console.log(response)
       
     if (response.trim() != "error") {
      if(response.trim() != "0 result")
{
    
    var obj = JSON.parse(response);
       
    var count =0;
         
          obj.forEach(function (obj) {
            var basic_table = document.getElementById("basic");
var earning_table = document.getElementById("earning");
var summary_table = document.getElementById("summary");

  
            basic_table.rows[0].cells[0].innerHTML = "Month & Year : " + obj.pay_month;
 basic_table.rows[0].cells[1].innerHTML = "Employee Name : " + obj.emp_name;
  basic_table.rows[1].cells[0].innerHTML = "Reg No : " + obj.phoneid;
  basic_table.rows[1].cells[1].innerHTML = "Father Name : " + obj.fathername;
   basic_table.rows[1].cells[2].innerHTML = "Bank : " + obj.bank;
   
   basic_table.rows[2].cells[0].innerHTML = "Date of Join : " + obj.doj;
   basic_table.rows[2].cells[1].innerHTML = "Department : " + obj.dept;
   basic_table.rows[2].cells[2].innerHTML = "PF No : " + obj.pfno;
   
   
   basic_table.rows[3].cells[0].innerHTML = "Date of Birth : " + obj.dob;
   basic_table.rows[3].cells[1].innerHTML = "Designation : " + obj.des;
   basic_table.rows[3].cells[2].innerHTML = "Esi No : " + obj.esino;
   
   
   earning_table.rows[1].cells[1].innerHTML =  obj.basic;
   
  earning_table.rows[1].cells[3].innerHTML =  obj.pf;
  earning_table.rows[2].cells[1].innerHTML =  obj.fda;
  earning_table.rows[2].cells[3].innerHTML =  obj.ptax;
  earning_table.rows[3].cells[1].innerHTML =  obj.vda;
  earning_table.rows[3].cells[3].innerHTML =  obj.esi;
  earning_table.rows[4].cells[1].innerHTML =  obj.hra;
  earning_table.rows[4].cells[3].innerHTML =  obj.advance;
  earning_table.rows[5].cells[1].innerHTML =  obj.otherallow;
  
  
  earning_table.rows[6].cells[0].innerHTML = "O.T Amount : " + obj.otamt;
  earning_table.rows[6].cells[1].innerHTML =  "Gross Pay : " + obj.grosspay;
  earning_table.rows[6].cells[2].innerHTML =  "Round Off : " + obj.roundoff;
  earning_table.rows[6].cells[3].innerHTML =  "Total Deduction : " + obj.total_dec;
  
  
   earning_table.rows[7].cells[1].innerHTML =  "Net Pay : " + obj.netpay;
   
   
    summary_table.rows[0].cells[1].innerHTML =  obj.no_working_days;
	summary_table.rows[0].cells[3].innerHTML =  obj.total_leave;
    summary_table.rows[0].cells[5].innerHTML =  obj.sal_days;
  
  
  summary_table.rows[1].cells[1].innerHTML =  obj.attendance_days;
	summary_table.rows[1].cells[3].innerHTML =  obj.salary_leave;
    summary_table.rows[1].cells[5].innerHTML =  obj.ot_days;
	
	summary_table.rows[2].cells[1].innerHTML =  obj.nfh_days;
    summary_table.rows[2].cells[3].innerHTML =  obj.lop;
          });
   

          

    }
     }
     
     
     
     
        
      },
      error: function (xhr) {
          //Do Something to handle error
      }
     });
  }

function get_month(){
   
    $.ajax({
      url: "php/get_payslip_month.php",
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
         
          obj.forEach(function (obj) {
  
            emp_month.push( obj.pay_month);
          });
   

          
$( "#cname" ).autocomplete({
    source: emp_month,
  select: function( event, ui ) {
                 var indx = emp_month.indexOf(ui.item.label);
        
       document.getElementById('cname').value = emp_month[indx];
         
                return false;
             }
  
          
              
  });
    }
     }
     
     
     
     
        
      },
      error: function (xhr) {
          //Do Something to handle error
      }
     });
  }


function salert(title, text, icon) {
  

    swal({
        title: title,
        text: text,
        icon: icon,
    });
}

