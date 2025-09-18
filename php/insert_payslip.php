
<?php
 include 'db_head.php';

 $emp_name = test_input($_GET['emp_name']);
 $fathername = test_input($_GET['fathername']);
 $bank_acno = test_input($_GET['bank_acno']);
 $bank = test_input($_GET['bank']);
 $doj = test_input($_GET['doj']);
 $dept = test_input($_GET['dept']);
 $pfno = test_input($_GET['pfno']);
 $dob = test_input($_GET['dob']);
 $des = test_input($_GET['des']);
 $esino = test_input($_GET['esino']);
 $otamt = test_input($_GET['otamt']);
 $grosspay = test_input($_GET['grosspay']);
 $roundoff = test_input($_GET['roundoff']);
 $total_dec = test_input($_GET['total_dec']);
 $no_working_days = test_input($_GET['no_working_days']);
 $total_leave = test_input($_GET['total_leave']);
 $netpay = test_input($_GET['netpay']);
 $attendance_days = test_input($_GET['attendance_days']);
 $salary_leave = test_input($_GET['salary_leave']);
 $ot_days = test_input($_GET['ot_days']);
 $nfh_days = test_input($_GET['nfh_days']);
 $lop = test_input($_GET['lop']);
 $basic = test_input($_GET['basic']);
 $pf = test_input($_GET['pf']);
 $fda = test_input($_GET['fda']);
 $ptax = test_input($_GET['ptax']);
 $vda = test_input($_GET['vda']);
 $esi = test_input($_GET['esi']);
 $hra = test_input($_GET['hra']);
 $otherallow = test_input($_GET['otherallow']);
 $advance = test_input($_GET['advance']);
 $sal_days = test_input($_GET['sal_days']);
 $emp_id = test_input($_GET['emp_id']);
 $pay_month = test_input($_GET['pay_month']);
 

 
  
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "IF NOT EXISTS (
    SELECT * FROM payslip 
    WHERE emp_name = $emp_name AND pay_month = $pay_month
)
THEN
    INSERT INTO payslip (emp_name, fathername, bank_acno, bank, doj, dept, pfno, dob, des, esino, otamt, grosspay, roundoff, total_dec, no_working_days, total_leave, netpay, attendance_days, salary_leave, ot_days, nfh_days, lop, basic, pf, fda, ptax, vda, esi, hra, otherallow, advance, sal_days, emp_id, pay_month) 
    VALUES ($emp_name, $fathername, $bank_acno, $bank, $doj, $dept, $pfno, $dob, $des, $esino, $otamt, $grosspay, $roundoff, $total_dec, $no_working_days, $total_leave, $netpay, $attendance_days, $salary_leave, $ot_days, $nfh_days, $lop, $basic, $pf, $fda, $ptax, $vda, $esi, $hra, $otherallow, $advance, $sal_days, $emp_id, $pay_month);
END IF;";
  
  if ($conn->query($sql) === TRUE) {
   
    echo $emp_name ." - ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





