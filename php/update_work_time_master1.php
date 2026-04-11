<?php
 include 'db_head.php';

 $min_time = test_input($_POST['min_time']);
$max_time = test_input($_POST['max_time']);
$process_id = test_input($_POST['process_id']);
$machine_id = test_input($_POST['machine_id']);
$dep_id = test_input($_POST['dep_id']);
$dep_sec_id = test_input($_POST['dep_sec_id']);
$cost = test_input($_POST['cost']);
$godown_id = test_input($_POST['godown_id']);
$ori_process_id = test_input($_POST['ori_process_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  work_time_master SET min_time =  $min_time,max_time =  $max_time,process_id =  $process_id,machine_id =  $machine_id,dep_id =  $dep_id,dep_sec_id =  $dep_sec_id,cost =  $cost,godown_id =  $godown_id,ori_process_id =  $ori_process_id WHERE wtid =  $wtid";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


