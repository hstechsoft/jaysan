<?php
include 'db_head.php';

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  $data = "'".$data."'";
  return $data;
}

$process_id = isset($_GET['process_id']) ? test_input($_GET['process_id']) : '';
$machine_id = isset($_GET['machine_id']) ? test_input($_GET['machine_id']) : '';

$sql = "SELECT wtid,min_time, max_time FROM work_time_master 
        WHERE process_id = $process_id AND machine_id = $machine_id LIMIT 1";

$result = $conn->query($sql);
$row = $result->fetch_assoc();

$conn->close();
header('Content-Type: application/json');
echo json_encode($row);
?>
