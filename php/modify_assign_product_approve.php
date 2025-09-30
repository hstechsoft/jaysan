<?php
include 'db_head.php';

$opid = test_input($_GET['opid']);
$dated = ($_GET['dated']);
$qty = test_input($_GET['qty']);
$emp_id = test_input($_GET['emp_id']);
$ins_date = ($_GET['ins_date']);

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

$sql = "SET time_zone = '+05:30';"; // First query to set the time zone
$sql .= "INSERT INTO production_modify_approval ( emp_id,opid,qty,actual_date,modify_date) VALUES ($emp_id,$opid,$qty,'$dated','$ins_date')";

if ($conn->multi_query($sql) === TRUE) {
    echo "ok";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}


$conn->close();


?>
