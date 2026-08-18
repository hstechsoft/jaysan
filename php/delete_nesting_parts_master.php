<?php
 include 'db_head.php';

$nes_master_id = test_input($_GET['nes_master_id']);
$part_id = test_input($_GET['part_id']);
$qty = test_input($_GET['qty']);

 

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
// insert parts


    // delete parts
    $sql_delete_parts = "DELETE FROM nesting_parts WHERE nesting_id = $nes_master_id AND part_id = $part_id";
    if ($conn->query($sql_delete_parts) === TRUE) {
      echo "ok";
    } else {
      echo "Error: " . $sql_delete_parts . "<br>" . $conn->error;
    }




$conn->close();

 ?>


