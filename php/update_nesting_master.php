<?php
 include 'db_head.php';

 $created_by = test_input($_POST['created_by']);

$nesting_name = test_input($_POST['nesting_name']);
$material_id = test_input($_POST['material_id']);
$nesting_type = test_input($_POST['nesting_type']);
$std_length = test_input($_POST['std_length']);
$run_time = test_input($_POST['run_time']);
 $nes_master_id = test_input($_POST['nes_master_id']);

 

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
try {
 $sql_insert_master = "UPDATE nesting_master SET created_by = $created_by, nesting_name = $nesting_name, material_id = $material_id, nesting_type = $nesting_type, std_length = $std_length, run_time = $run_time WHERE nes_master_id = $nes_master_id";

  if ($conn->query($sql_insert_master) === TRUE) {

  } else {
    throw new Exception("Error: " . $sql_insert_master . "<br>" . $conn->error);  
  }

  $conn->commit();
      echo "ok";
} catch (Exception $e) {
  echo 'Message: ' .$e->getMessage();
  // rollback transaction
  $conn->rollback();
}




$conn->close();

 ?>


