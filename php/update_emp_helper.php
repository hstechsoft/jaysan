<?php
 include 'db_head.php';

 $weid = test_input($_GET['weid']);




 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';"; 
$sql .= "UPDATE work_employee
SET work_employee.sts = 'finish', end_time = NOW()
WHERE work_employee.weid = $weid;
";


if ($conn->multi_query($sql) === TRUE) {
  echo "ok";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}
$conn->close();

 ?>


