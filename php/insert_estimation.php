
<?php
 include 'db_head.php';

 $eno =test_input($_GET['eno']);
 $cus_name =test_input($_GET['cus_name']);
 $cus_addr =test_input($_GET['cus_addr']);
 $dated =test_input($_GET['dated']);
 $shipping =test_input($_GET['shipping']);
 $total_value =test_input($_GET['total_value']);
 $emp_id =test_input($_GET['emp_id']);
 $cus_id =test_input($_GET['cus_id']);
 $cus_gst =test_input($_GET['cus_gst']);
 $enquiry_through =test_input($_GET['enquiry_through']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT  INTO  estimation (eno,cus_name,cus_addr,dated,shipping,total_value,emp_id,cus_id,cus_gst,enquiry_through)
 VALUES ($eno,$cus_name,$cus_addr,$dated,$shipping,$total_value,$emp_id,$cus_id,$cus_gst,$enquiry_through)";
  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





