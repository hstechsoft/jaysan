<?php
include 'db_head.php';

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  $data = "'".$data."'"; // wraps in quotes
  return $data;
}

$emp_id = isset($_GET['emp_id']) ? test_input($_GET['emp_id']) : '';

$data = [];

if ($emp_id != '') {
    $sql = "SELECT jp.process_name,jp.process_id
            FROM employee_process ep
            INNER JOIN jaysan_process jp ON ep.process_id = jp.process_id
            WHERE ep.emp_id = $emp_id
            ORDER BY jp.process_name";
    
    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($data);
?>
