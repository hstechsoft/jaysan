<?php
 include 'db_head.php';

 $created_by = test_input($_POST['created_by']);


$material_id = test_input($_POST['material_id']);
$material_qty = test_input($_POST['material_qty']);
$run_time = test_input($_POST['run_time']);
$product = test_input($_POST['product']);
$nesting_id = test_input($_POST['nesting_id']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

 $sql = "UPDATE nesting_details SET created_by = $created_by,  material_id = $material_id, material_qty = $material_qty, run_time = $run_time, product = $product WHERE nesting_id = $nesting_id";
 
  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

$conn->close();

 ?>


