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

$sql = "SELECT DISTINCT jm.jmid, jm.machine_name
        FROM work_time_master wm
        JOIN jaysan_machine jm ON wm.machine_id = jm.jmid
        WHERE wm.process_id = $process_id
        ORDER BY jm.machine_name";

$result = $conn->query($sql);
$data = [];

while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($data);
?>
