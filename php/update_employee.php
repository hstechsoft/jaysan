<?php
 include 'db_head.php';


 $emp_name =test_input($_GET['emp_name']);
 $emp_code =test_input($_GET['emp_code']);
 $emp_phone =test_input($_GET['emp_phone']);
 $emp_email =test_input($_GET['emp_email']);
 $emp_acode =test_input($_GET['emp_acode']);
 $emp_approve =test_input($_GET['emp_approve']);
 $emp_id =test_input($_GET['emp_id']);
 $emp_role =test_input($_GET['emp_role']);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



$sql = "UPDATE employee SET  emp_name = $emp_name,emp_code = $emp_code,emp_phone = $emp_phone, emp_email = $emp_email,emp_phone_id =  $emp_acode,emp_approve = $emp_approve,emp_role = $emp_role WHERE emp_id= $emp_id";
  if ( $conn->query($sql) === TRUE) {
  } 
   else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

$conn->close();

 ?>


