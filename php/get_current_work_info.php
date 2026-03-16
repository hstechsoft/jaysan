<?php
 include 'db_head.php';

$work_done_id = test_input($_POST['work_done_id']);




function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SET time_zone = '+05:30';"; // First query to set the time zone
$sql .= "SELECT if(count(*) > 0, qr.start_time, (SELECT if(count(*) > 0, qr.end_time, (SELECT start_date FROM work_done_table WHERE work_id = 1860)) from  qr_work_entry qr where qr.work_done_id = 1860 and qr.work_sts = 'finished' and qr.production_id is null ORDER BY qr.qr_work_id DESC limit 1
)) as in_process_exists from  qr_work_entry qr where qr.work_done_id = 1860 and production_id is null ORDER BY qr.qr_work_id DESC limit 1";

$result = $conn->multi_query($sql);


$conn->close();


 ?>


