<?php
 include 'db_head.php';

$nes_part_id = test_input($_POST['nes_part_id']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



$sql_delete = "DELETE FROM nesting_parts WHERE nes_part_id = $nes_part_id";
if ($conn->query($sql_delete) === TRUE) {
  echo "ok";
} else {
    echo "Error deleting record: " . $conn->error;
}

$conn->close();

 ?>


