<?php
 include 'db_head.php';

 $map_loc = test_input($_GET['map_loc']);
$work_assign_notify = test_input($_GET['work_assign_notify']);
$work_alarm = test_input($_GET['work_alarm']);
$call_end_notify = test_input($_GET['call_end_notify']);
$call_history = test_input($_GET['call_history']);
$emp_id = test_input($_GET['emp_id']);
$version = test_input($_GET['version']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "INSERT INTO emp_features (map_loc, work_assign_notify, work_alarm,call_end_notify,call_history,emp_id,version) VALUES($map_loc,$work_assign_notify, $work_alarm,$call_end_notify,$call_history,$emp_id,1) ON DUPLICATE KEY UPDATE    
map_loc = $map_loc, work_assign_notify = $work_assign_notify, work_alarm = $work_alarm,call_end_notify = $call_end_notify,call_history = $call_history,emp_id = $emp_id,version = emp_features.version+1";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


