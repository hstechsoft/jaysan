<?php
include 'db_head.php';
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$id = isset($_GET['id']) ? test_input($_GET['id']) : '';

if ($id == "''") {
    echo "Invalid ID";
    exit;
}

$sql = "DELETE FROM employee_process WHERE id = $id";
if ($conn->query($sql) === TRUE) {
    echo "ok";
} else {
    echo $conn->error;
}

$conn->close();
?>
