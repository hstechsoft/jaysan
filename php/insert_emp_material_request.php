<?php
 include 'db_head.php';

 $emp_id = test_input($_GET['emp_id']);
$store_id = test_input($_GET['store_id']);
$store_type = test_input($_GET['store_type']);
$dated = test_input($_GET['dated']);
$part_id = test_input($_GET['part_id']);
$qty = test_input($_GET['qty']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SET time_zone = '+05:30';"; // First query to set the time zone
$sql .= "INSERT INTO emp_material_request ( emp_id,store_id,store_type,dated,part_id,qty) VALUES ($emp_id,$store_id,$store_type,$dated,$part_id,$qty)";

if ($conn->multi_query($sql) === TRUE) {
    echo "ok";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}


$conn->close();


 ?>


