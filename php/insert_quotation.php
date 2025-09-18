
<?php
 include 'db_head.php';

 $qno =test_input($_GET['qno']);
 $qnos =test_input($_GET['qnos']);
 $sqno =test_input($_GET['sqno']);
 $cus_name =test_input($_GET['cus_name']);
 $cus_addr =test_input($_GET['cus_addr']);
 $dated =test_input($_GET['dated']);
 $shipping =test_input($_GET['shipping']);
 $total_value =test_input($_GET['total_value']);
 $emp_id =test_input($_GET['emp_id']);
 $cus_id =test_input($_GET['cus_id']);
 $place_of_supply =test_input($_GET['place_of_supply']);
 $valid_until =test_input($_GET['valid_until']);
 $enq_no =test_input($_GET['enq_no']);
 $taxable_amount =test_input($_GET['taxable_amount']);
 $cus_gst =test_input($_GET['cus_gst']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT  INTO  quotation (sqno,qno,qnos,cus_name,cus_addr,dated,shipping,total_value,emp_id,cus_id,place_of_supply,valid_until,enq_no,taxable_amount,cus_gst)
 VALUES ($sqno,$qno,$qnos,$cus_name,$cus_addr,$dated,$shipping,$total_value,$emp_id,$cus_id,$place_of_supply,$valid_until,$enq_no,$taxable_amount,$cus_gst)";
  
  if ($conn->query($sql) === TRUE) {
   echo "Successfully created" ; 
  } else {
    echo "error";
  }
  
 



$conn->close();

 ?>





