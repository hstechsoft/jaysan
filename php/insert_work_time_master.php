<?php
 include 'db_head.php';

 $min_time = test_input($_GET['min_time']);
$max_time = test_input($_GET['max_time']);
$process_id = test_input($_GET['process_id']);
$machine_id = test_input($_GET['machine_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO work_time_master ( min_time,max_time,process_id,machine_id) VALUES ($min_time,$max_time,$process_id,$machine_id)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


