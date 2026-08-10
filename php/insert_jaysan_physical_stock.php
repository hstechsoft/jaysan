<?php
 include 'db_head.php';

 $godown = test_input($_POST['godown']);
$dep = test_input($_POST['dep']);
$sec = test_input($_POST['sec']);
$qty = test_input($_POST['qty']);
$part_id = test_input($_POST['part_id']);
$emp_id = test_input($_POST['emp_id']);
$process_id = test_input($_POST['process_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO jaysan_physical_stock ( godown,dep,sec,qty,part_id,emp_id,process_id) VALUES ($godown,$dep,$sec,$qty,$part_id,$emp_id,$process_id) on duplicate key update qty = $qty, emp_id = $emp_id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


