<?php
 include 'db_head.php';

 $bid = test_input($_GET['bid']);



 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';"; 
$sql .= "UPDATE emp_break
SET emp_break.end_time = NOW()
WHERE bid = $bid ;
";


if ($conn->multi_query($sql) === TRUE) {
  echo "ok";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}
$conn->close();

 ?>


