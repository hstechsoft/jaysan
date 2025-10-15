<?php
 include 'db_head.php';

 

$received_by = test_input($_GET['received_by']);
$dc_no = test_input($_GET['dc_no']);
$dc_date = test_input($_GET['dc_date']);
$receive_details = json_decode($_POST['receive_details'], true);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

foreach ($receive_details as $detail) 
{ 
  
    $qty = $details['qty']; 
    $jaysan_po_material_id = $details['jaysan_po_material_id']; 
  
 $sql = "INSERT INTO grn ( jaysan_po_material_id,qty,received_by,dc_no,dc_date) VALUES ('$jaysan_po_material_id','$qty',$received_by,$dc_no,$dc_date)";

  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}
echo "ok";

$conn->close();

 ?>


