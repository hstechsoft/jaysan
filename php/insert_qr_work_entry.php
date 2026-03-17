<?php
 include 'db_head.php';

 $emp_id = test_input($_POST['emp_id']);
$qr_code = test_input($_POST['qr_code']);
$sec_id = test_input($_POST['sec_id']);
$work_done_id = test_input($_POST['work_done_id']);

if(!$emp_id || !$work_done_id) {
    echo "Error: Missing required fields.";
    $conn->close();
    exit;
    
}

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO qr_work_entry (emp_id, production_id, sec_id,work_done_id,work_sts) VALUES ($emp_id, $qr_code, $sec_id,$work_done_id,'in-process')";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


