var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
$(document).ready(function () {
    check_login();
    $("#upload_btn").click(function()
    {
        Upload()
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

function Upload() {
              
    var fileUpload = document.getElementById("fileUpload");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                var table = document.createElement("table");
                var rows = e.target.result.split("\n");
                
                for (var i = 0; i < rows.length; i++) {
                    var cells = rows[i].split(",");
                    if (cells.length > 1) {
                        var row = table.insertRow(-1);
                        for (var j = 0; j < cells.length; j++) {
                            var cell = row.insertCell(-1);
                          var  str = cells[j].replace(/^"(.*)"$/, '$1');
                            if (str=="BASIC")
                            {
                          var  cells_v=rows[i].split(",");
                          var pay_month = cells_v[3].replace(/^"(.*)"$/, '$1');
                            console.log( pay_month);
                            
                            cells_v=rows[i].split(",");
                            var emp_name = cells_v[6].replace(/^"(.*)"$/, '$1');
                            console.log( emp_name);
                            
                            
                            cells_v=rows[i].split(",");
                            var emp_id = cells_v[10].replace(/^"(.*)"$/, '$1');
                            console.log( emp_id);
                            
                            
                            cells_v=rows[i].split(",");
                            var fathername = cells_v[13].replace(/^"(.*)"$/, '$1');
                            console.log( fathername);
                            
                            cells_v=rows[i].split(",");
                           var bank = cells_v[16].replace(/^"(.*)"$/, '$1');
                            console.log( bank);
                            
                            cells_v=rows[i].split(",");
                            var bank_acno = cells_v[18].replace(/^"(.*)"$/, '$1');
                            console.log( bank_acno);
                            
                            
                            cells_v=rows[i].split(",");
                            var doj = cells_v[21].replace(/^"(.*)"$/, '$1');
                            console.log( doj);
                            
                            cells_v=rows[i].split(",");
                            var dept = cells_v[24].replace(/^"(.*)"$/, '$1');
                            console.log( dept);
                            
                            cells_v=rows[i].split(",");
                            var pfno = cells_v[27].replace(/^"(.*)"$/, '$1');
                            console.log( pfno);
                            
                            cells_v=rows[i].split(",");
                            var dob = cells_v[30].replace(/^"(.*)"$/, '$1');
                            console.log( dob);
                            
                            cells_v=rows[i].split(",");
                            var des = cells_v[33].replace(/^"(.*)"$/, '$1');
                            console.log( des);
                            
                            cells_v=rows[i].split(",");
                            var esino = cells_v[36].replace(/^"(.*)"$/, '$1');
                            console.log( esino);
                            
                            cells_v=rows[i].split(",");
                            var basic = cells_v[42].replace(/^"(.*)"$/, '$1');
                            console.log( basic);
                            
                            cells_v=rows[i].split(",");
                            var pf = cells_v[44].replace(/^"(.*)"$/, '$1');
                            console.log( pf);
                            
                              var cells_v1 = rows[i+1].split(",");
                           var fda = cells_v1[42].replace(/^"(.*)"$/, '$1');
                            console.log( fda);
                            
                            cells_v1 = rows[i+1].split(",");
                            var ptax = cells_v1[44].replace(/^"(.*)"$/, '$1');
                            console.log( ptax);
                            
                            
                            var cells_v2 = rows[i+2].split(",");
                            var vda = cells_v2[42].replace(/^"(.*)"$/, '$1');
                            console.log( vda);
                            
                            cells_v2 = rows[i+2].split(",");
                            var esi = cells_v2[44].replace(/^"(.*)"$/, '$1');
                            console.log( esi);
                            
                            
                            
                            var    cells_v3 = rows[i+3].split(",");
                            var hra = cells_v3[42].replace(/^"(.*)"$/, '$1');
                            console.log( hra);
                            
                            cells_v3 = rows[i+3].split(",");
                            var advance = cells_v3[44].replace(/^"(.*)"$/, '$1');
                            console.log( advance);
                            
                            
                            var   cells_v4 = rows[i+4].split(",");
                            var otherallow = cells_v4[42].replace(/^"(.*)"$/, '$1');
                            console.log( otherallow);
                            
                            
                            
                            cells_v=rows[i].split(",");
                            var esino = cells_v[36].replace(/^"(.*)"$/, '$1');
                            console.log( esino);
                            
                            cells_v=rows[i].split(",");
                            var otamt = cells_v[46].replace(/^"(.*)"$/, '$1');
                            console.log( otamt);
                            
                            cells_v=rows[i].split(",");
                            var grosspay = cells_v[48].replace(/^"(.*)"$/, '$1');
                            console.log( grosspay);
                            
                            cells_v=rows[i].split(",");
                            var roundoff = cells_v[50].replace(/^"(.*)"$/, '$1');
                            console.log( roundoff);
                            
                            cells_v=rows[i].split(",");
                            var total_dec = cells_v[52].replace(/^"(.*)"$/, '$1');
                            console.log( total_dec);
                            
                            cells_v=rows[i].split(",");
                            var no_working_days = cells_v[55].replace(/^"(.*)"$/, '$1');
                            console.log( no_working_days);
                            
                            cells_v=rows[i].split(",");
                            var total_leave = cells_v[58].replace(/^"(.*)"$/, '$1');
                            console.log( total_leave);
                            
                            cells_v=rows[i].split(",");
                            var sal_days = cells_v[61].replace(/^"(.*)"$/, '$1');
                            console.log( sal_days);
                            
                            cells_v=rows[i].split(",");
                            var netpay  = cells_v[63].replace(/^"(.*)"$/, '$1');
                            console.log( netpay );
                            
                            
                            cells_v=rows[i+1].split(",");
                            var attendance_days = cells_v[66].replace(/^"(.*)"$/, '$1');
                            console.log( attendance_days);
                            
                            cells_v=rows[i+1].split(",");
                            var salary_leave = cells_v[69].replace(/^"(.*)"$/, '$1');
                            console.log( salary_leave);
                            
                            cells_v=rows[i+1].split(",");
                            var ot_days = cells_v[72].replace(/^"(.*)"$/, '$1');
                            console.log( ot_days);
                            
                            cells_v=rows[i+1].split(",");
                            var nfh_days = cells_v[75].replace(/^"(.*)"$/, '$1');
                            console.log( nfh_days);
                            
                            cells_v=rows[i+1].split(",");
                            var lop  = cells_v[78].replace(/^"(.*)"$/, '$1');
                            console.log( lop );
                            
                            

                           
                            $.ajax({
                              url: "php/insert_payslip.php",
                              type: "get", //send it through get method
                              data: {
                                emp_name : emp_name,
                                fathername : fathername,
                                bank_acno : bank_acno,
                                bank : bank,
                                doj : doj,
                                dept : dept,
                                pfno : pfno,
                                dob : dob,
                                des : des,
                                esino : esino,
                                otamt : otamt,
                                grosspay : grosspay,
                                roundoff : roundoff,
                                total_dec : total_dec,
                                no_working_days : no_working_days,
                                total_leave : total_leave,
                                netpay : netpay,
                                attendance_days : attendance_days,
                                salary_leave : salary_leave,
                                ot_days : ot_days,
                                nfh_days : nfh_days,
                                lop : lop,
                                basic : basic,
                                pf : pf,
                                fda : fda,
                                ptax : ptax,
                                vda : vda,
                                esi : esi,
                                hra : hra,
                                otherallow : otherallow,
                                advance : advance,
                                sal_days : sal_days,
                                emp_id : emp_id,
                                pay_month : pay_month
                               
                               
                               
                            },
                              success: function (response) {
                            console.log(response)
                          
                         
                            
                            
                                
                              },
                              error: function (xhr) {
                                  //Do Something to handle error
                              }
                            });
        
                            }
                        }
                    }
                }
               
                salert("Uploaded", "File uploaded Sucessfully for ." + pay_month, "success");
            }
            reader.readAsText(fileUpload.files[0]);
            
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
      salert("Error", "Please upload a valid CSV file.", "error");
        
    }

}

function salert(title, text, icon) {
  

    swal({
        title: title,
        text: text,
        icon: icon,
    });
}

