
<?php
 include 'db_head.php';

 $emp_phone_id =test_input($_GET['emp_phone_id']);
    $emp_email =test_input($_GET['emp_email']);
    $emp_name =test_input($_GET['emp_name']);
    $emp_phone =test_input($_GET['emp_phone']);


 
  
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT  INTO  employee (emp_phone_id, emp_email, emp_name, emp_phone,emp_approve,emp_role,firebase_uid,emp_code,emp_user_id)
 VALUES ( $emp_phone_id, $emp_email, $emp_name, $emp_phone, 'no','','','','')";
  
  if ($conn->query($sql) === TRUE) {
    
  
    echo "success";
 



  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





