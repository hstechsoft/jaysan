<?php
 include 'db_head.php';

$nes_master_id = test_input($_GET['nes_master_id']);
$part_id = test_input($_GET['part_id']);
$qty = test_input($_GET['qty']);
$weight = test_input($_GET['weight']);
$scarp_weight = test_input($_GET['scarp_weight']);


 

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
// insert parts


      $sql_insert_parts = "INSERT INTO nesting_parts (nesting_id, part_id, qty, weight, scarp_weight) VALUES ($nes_master_id, $part_id, $qty, $weight, $scarp_weight)";
      if ($conn->query($sql_insert_parts) === TRUE) {
        echo "ok";
      } else {
        echo "Error: " . $sql_insert_parts . "<br>" . $conn->error;
      }




$conn->close();

 ?>


