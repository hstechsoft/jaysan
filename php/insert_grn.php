<?php
 include 'db_head.php';

 $jaysan_po_material_id = test_input($_GET['jaysan_po_material_id']);
$qty = test_input($_GET['qty']);
$received_by = test_input($_GET['received_by']);
$dc_no = test_input($_GET['dc_no']);
$dc_date = test_input($_GET['dc_date']);
$batch_details = json_decode($_POST['batch_details'], true);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO grn ( jaysan_po_material_id,qty,received_by,dc_no,dc_date) VALUES ($jaysan_po_material_id,$qty,$received_by,$dc_no,$dc_date)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


