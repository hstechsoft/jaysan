<?php
 include 'db_head.php';

$machine_id = test_input($_GET['machine_id']);
$shift = test_input($_GET['shift']);
$assign_date = test_input($_GET['assign_date']);
$assigned_by = test_input($_GET['assigned_by']);

$nesting_id = test_input($_GET['nesting_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO laser_job_card ( machine_id,shift,assign_date,assigned_by,status,nesting_id) VALUES ($machine_id,$shift,$assign_date,$assigned_by,'created',$nesting_id)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


