<?php
 include 'db_head.php';

$wid = test_input($_GET['wid']);
 $part_id = test_input($_GET['part_id']);
 $batch = test_input($_GET['batch']);
 $qty = test_input($_GET['qty']);


 
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
$insert_work_input = "INSERT INTO   work_input (wid, part_id,qty,batchno) VALUES ( $wid,  $part_id, $qty, $batch)";

if ($conn->query($insert_work_input) === TRUE) {
    // Retrieve the last inserted ID
  echo "ok";

} else {
    echo "Error: " . $insert_emp_work . "<br>" . $conn->error;
}
$conn->close();

 ?>


