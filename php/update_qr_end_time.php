<?php
 include 'db_head.php';

$qr_work_id = test_input($_POST['qr_work_id']);
$work_sts    = test_input($_POST['work_sts']);



function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SET time_zone = '+05:30';"; // First query to set the time zone
$sql .= "UPDATE qr_work_entry SET end_time = NOW(), work_sts = $work_sts WHERE qr_work_id = $qr_work_id";

if ($conn->multi_query($sql) === TRUE) {
    echo "ok";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}


$conn->close();


 ?>


