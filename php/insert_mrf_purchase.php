<?php
 include 'db_head.php';

 $mrf_id = test_input($_GET['mrf_id']);
$order_to = test_input($_GET['order_to']);
$delivery_to = test_input($_GET['delivery_to']);
$raw_material_part_id = test_input($_GET['raw_material_part_id']);
$raw_material_stock = test_input($_GET['raw_material_stock']);
$order_qty = test_input($_GET['order_qty']);
$batch_qty = test_input($_GET['batch_qty']);
$indiviual_mixed_material = test_input($_GET['indiviual_mixed_material']);
$raw_material_rate = test_input($_GET['raw_material_rate']);
$po_date = test_input($_GET['po_date']);
$next_batch_date = test_input($_GET['next_batch_date']);
$next_po_date = test_input($_GET['next_po_date']);
$scarp_end_bit = test_input($_GET['scarp_end_bit']);
$raw_material_budget = test_input($_GET['raw_material_budget']);
$purchase_requested_by = test_input($_GET['purchase_requested_by']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO mrf_purchase ( mrf_id,order_to,delivery_to,raw_material_part_id,raw_material_stock,order_qty,batch_qty,indiviual_mixed_material,raw_material_rate,po_date,next_batch_date,next_po_date,scarp_end_bit,raw_material_budget,purchase_requested_by) VALUES ($mrf_id,$order_to,$delivery_to,$raw_material_part_id,$raw_material_stock,$order_qty,$batch_qty,$indiviual_mixed_material,$raw_material_rate,$po_date,$next_batch_date,$next_po_date,$scarp_end_bit,$raw_material_budget,$purchase_requested_by)";

  if ($conn->query($sql) === TRUE) {
  $sql_update = "UPDATE material_request_form SET status='purchase_requested' where mrf_id = $mrf_id";

if ( $conn->query($sql_update) === TRUE) {


} else {
  echo "Error: " . $sql_update . "<br>" .  $conn->error;
}
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


