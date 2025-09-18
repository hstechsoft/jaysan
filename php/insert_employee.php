<?php
 include 'db_head.php';

 $emp_name =test_input($_GET['emp_name']);
 $emp_phone =test_input($_GET['emp_phone']);
 $emp_email =test_input($_GET['emp_email']);
 $emp_approve =test_input($_GET['emp_approve']);
 $emp_role =test_input($_GET['emp_role']);
 $firebase_uid =test_input($_GET['firebase_uid']);
 $emp_code =test_input($_GET['emp_code']);
 $emp_phone_id =test_input($_GET['emp_phone_id']);
 $emp_user_id =test_input($_GET['emp_user_id']);
 

  
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}




$sql = "INSERT INTO employee (emp_name,emp_phone,emp_email,emp_approve,emp_role,firebase_uid,emp_code,emp_phone_id,emp_user_id)
 VALUES (  '$emp_name','$emp_phone','$emp_email','$emp_approve','$emp_role','$firebase_uid','$emp_code','$emp_phone_id','$emp_user_id')";
  
  if ($conn->query($sql) === TRUE) {
    echo "success";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>


