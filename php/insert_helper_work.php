<?php
 include 'db_head.php';

$wid = test_input($_GET['wid']);
 $emp_id = test_input($_GET['emp_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

// Set the time zone
$time_zone_sql = "SET time_zone = '+05:30';";
$conn->query($time_zone_sql);

// Insert into emp_work
$insert_work_employee = "INSERT INTO  work_employee (wid, emp_id,cat) VALUES ( $wid,  $emp_id,'helper')";

if ($conn->query($insert_work_employee) === TRUE) {
    // Retrieve the last inserted ID
  echo "ok";

} else {
    echo "Error: " . $insert_emp_work . "<br>" . $conn->error;
}
$conn->close();

 ?>


