<?php
include 'db_head.php';
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$emp_id = isset($_GET['emp_id']) ? test_input($_GET['emp_id']) : '';
$process_id = isset($_GET['process_id']) ? test_input($_GET['process_id']) : '';
$machine_id  = isset($_GET['machine_id']) ? test_input($_GET['machine_id']) : '';

if ($emp_id == '' || $process_id == '') {
    echo "Missing values";
    exit;
}

// Check if already exists
$check_sql = "SELECT id FROM employee_process WHERE emp_id = $emp_id AND process_id = $process_id";
$check_result = $conn->query($check_sql);

if ($check_result->num_rows > 0) {
    echo "Already assigned";
    exit;
}

$sql = "INSERT INTO employee_process (emp_id, process_id,machine_id) VALUES ($emp_id, $process_id, $machine_id)";
if ($conn->query($sql) === TRUE) {
    echo "ok";
} else {
    echo $conn->error;
}

$conn->close();
?>
