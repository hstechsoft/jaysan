<?php
 include 'db_head.php';

$nesting_id = test_input($_POST['nesting_id']);
$part_id = test_input($_POST['part_id']);
$quantity = test_input($_POST['quantity']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
 $sql_part = "INSERT INTO nesting_parts (nesting_id, part_id, qty) VALUES ($nesting_id, $part_id, $quantity) on duplicate key update qty =  $quantity";
 
if ($conn->query($sql_part) === TRUE) {
    echo "ok";
  
  } else {
    echo "Error: " . $sql_part . "<br>" . $conn->error;
  }

$conn->close();

 ?>


