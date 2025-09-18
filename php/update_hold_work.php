<?php
 include 'db_head.php';

 $wid = test_input($_GET['wid']);

 $qty = test_input($_GET['qty']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';"; 
$sql .= "UPDATE emp_work
SET emp_work.sts = 'finish',qty = $qty, end_time = NOW()
WHERE emp_work.wid = $wid;
";


if ($conn->multi_query($sql) === TRUE) {
  echo "ok";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}
$conn->close();

 ?>


