<?php
 include 'db_head.php';

 $emp_id = test_input($_POST['emp_id']);
$qr_code = test_input($_POST['qr_code']);
$sec_id = test_input($_POST['sec_id']);



 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO qr_work_entry (emp_id, production_id, sec_id) VALUES ($emp_id, $qr_code, $sec_id)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


