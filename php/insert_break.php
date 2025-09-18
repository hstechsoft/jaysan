<?php
 include 'db_head.php';


 $brtype = test_input($_GET['brtype']);
 $wid = test_input($_GET['emp_work_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';"; 
$sql .= "INSERT INTO emp_break ( start_time, wid, brtype) VALUES ( NOW(),  $wid, $brtype)";


if ($conn->multi_query($sql) === TRUE) {
  echo "ok";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}
$conn->close();

 ?>


