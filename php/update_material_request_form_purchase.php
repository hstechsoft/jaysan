<?php
 include 'db_head.php';

 $mrf_id = test_input($_GET['mrf_id']);

$order_to_id = test_input($_GET['order_to_id']);
$purchase_email = test_input($_GET['purchase_email']);

$delivery_to_id = test_input($_GET['delivery_to_id']);
$uom = test_input($_GET['uom']);
$raw_material_part_id = test_input($_GET['raw_material_part_id']);
$raw_material_stock = test_input($_GET['raw_material_stock']);
$order_qty = test_input($_GET['order_qty']);
// $batch_qty = test_input($_GET['batch_qty']);
$raw_material_rate = test_input($_GET['raw_material_rate']);
// $next_batch_date = test_input($_GET['next_batch_date']);
// $next_po_date = test_input($_GET['next_po_date']);
$raw_material_budget = test_input($_GET['raw_material_budget']);
$purchase_requested_by = test_input($_GET['purchase_requested_by']);
$batch_details = json_decode($_GET['batch_details'], true);
$approx_delivery_days = test_input($_GET['approx_delivery_days']);






 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "UPDATE mrf_purchase SET order_to = $order_to_id,
  delivery_to = $delivery_to_id,
  raw_material_part_id = $raw_material_part_id,
  raw_material_stock = $raw_material_stock,
  order_qty = $order_qty,
  
  raw_material_rate = $raw_material_rate,
  
 
  -- raw_material_budget = $raw_material_budget,
  purchase_requested_by = $purchase_requested_by,
  approx_delivery_days = $approx_delivery_days
WHERE mrf_id = $mrf_id";

  if ($conn->query($sql) === TRUE) {

    $sql_delete =  "DELETE  FROM mrf_batch WHERE mrf_id =  $mrf_id";

  if ($conn->query($sql_delete) === TRUE) {
 
  } else {
    echo "Error: " . $sql_delete . "<br>" . $conn->error;
  }



 foreach ($batch_details as $batch) {

 $batch_date = $batch["order_date"];
 $qty = $batch["qty"];
    $sql_batch = "INSERT INTO mrf_batch (mrf_id, batch_date, batch_qty) VALUES ($mrf_id,  '$batch_date', '$qty')";
    if ($conn->query($sql_batch) === TRUE) {
        // Batch inserted successfully
    } else {
        echo "Error: " . $sql_batch . "<br>" . $conn->error;
    }
  }
   $sql_update_history = "SET time_zone = '+05:30';"; // First query to set the time zone
   $sql_update_history .= "UPDATE material_request_form SET status='purchase_requested',form_history =  CONCAT(form_history ,'<li class = \'list-group-item\'> Purchase Requeste Updated by ', (SELECT emp_name FROM employee WHERE emp_id = $purchase_requested_by), ' on ', DATE_FORMAT(NOW(), '%d-%m-%Y %H:%i') ,' </li>')  where mrf_id = $mrf_id";
   
   if ($conn->multi_query($sql_update_history) === TRUE) {
       echo "ok";
   } else {
       echo "Error: " . $sql_update_history . "<br>" . $conn->error;
   }
   
   

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>



