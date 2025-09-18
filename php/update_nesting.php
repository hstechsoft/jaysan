<?php
 include 'db_head.php';

  $material_name = test_input($_GET['material_name']);
  $material_type = test_input($_GET['material_type']);
  $material_length = test_input($_GET['material_length']);
  $material_width = test_input($_GET['material_width']);
  $material_thickness = test_input($_GET['material_thickness']);
  $material_weight = test_input($_GET['material_weight']);
  $material_innerdia = test_input($_GET['material_innerdia']);
  $material_outterdia = test_input($_GET['material_outterdia']);
  $material_dia = test_input($_GET['material_dia']);

  $nesting_name = test_input($_GET['nesting_name']);
  $attachment = test_input($_GET['attachment']);
  $material_qty = test_input($_GET['material_qty']);
  $machine_id = test_input($_GET['machine_id']);
  $run_time = test_input($_GET['run_time']);
  $buffer_time = test_input($_GET['buffer_time']);
  $nsid = test_input($_GET['nsid']);






 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql_update_rm = "UPDATE jaysan_raw_material SET material_name = $material_name, material_type = $material_type, material_length = $material_length, material_width = $material_width, material_thickness = $material_thickness, material_innerdia = $material_innerdia, material_outterdia = $material_outterdia, material_dia = $material_dia, material_weight = $material_weight WHERE rmid = (select rmid from nesting_details where nsid = $nsid) ";

  if ($conn->query($sql_update_rm) === TRUE) {
       $rmid = $conn->insert_id;
  } else {
    echo "Error: " . $sql_update_rm . "<br>" . $conn->error;
  }


$sql_update_nesting = "UPDATE nesting_details SET nesting_name = $nesting_name, material_qty = $material_qty, machine_id = $machine_id, run_time = $run_time, buffer_time = $buffer_time, attachment = $attachment WHERE nsid = $nsid";

  if ($conn->query($sql_update_nesting) === TRUE) {
echo "ok";
  } else {
    echo "Error: " . $sql_update_nesting . "<br>" . $conn->error;
  }


$conn->close();

 ?>


