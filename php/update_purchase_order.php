<?php
 include 'db_head.php';

 $po_order_to = ($_POST['po_order_to']);
$po_delivery_to = ($_POST['po_delivery_to']);
$po_terms = ($_POST['po_terms']);
$po_email = ($_POST['po_email']);
$po_path = ($_POST['po_path']);
$po_id = ($_POST['po_id']);

$po_materials = ($_POST['po_materials']);

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';"; // First query to set the time zone
$sql .= "update jaysan_po set jaysan_po.po_terms = '$po_terms',jaysan_po.email_sent = '$po_email',jaysan_po.po_path = '$po_path' WHERE jaysan_po.po_id = '$po_id'";

if ($conn->multi_query($sql)) {
    // Process the first result set (e.g., time zone set)
    do {
        // Empty the result set
        if ($result = $conn->store_result()) {
            // Process results here if needed
            $result->free();
        }
    } while ($conn->next_result());

$sql_delete =  "DELETE  FROM jaysan_po_material WHERE jaysan_po_id =  $po_id";

  if ($conn->query($sql_delete) === TRUE) {
 
  } else {
    echo "Error: " . $sql_delete . "<br>" . $conn->error;
  }

    foreach ($po_materials as $po_materials)
    {
      $material_rate = $po_materials['material_rate'];
      $po_material_id = $po_materials['po_material_id'];
      $qty = $po_materials['qty']; 
      $batch_id = $po_materials['batch_id'];
      $is_approved = $po_materials['is_approved']; 
      $disc = $po_materials['disc'];
       $due_on = $po_materials['due_on'];
      
              
  echo   $batch_id."\n";
            $batch_id = sql_nullable( $batch_id );
       echo "batch".   $batch_id."\n"; 

      $sql_insert_subtype = "INSERT INTO jaysan_po_material ( material_rate,jaysan_po_id,po_material_id,qty,batch_id,is_approved,disc,due_on) VALUES ('$material_rate','$po_id','$po_material_id','$qty','$batch_id','$is_approved','$disc','$due_on');";

      if ($conn->query($sql_insert_subtype) === TRUE) {
          
      } else {
          echo "Error: " . $sql_insert_subtype . "<br>" . $conn->error;
      }
    }

  echo "ok";
}  else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();

 ?>


