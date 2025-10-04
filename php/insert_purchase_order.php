<?php
 include 'db_head.php';

 $po_order_to = ($_POST['po_order_to']);
$po_delivery_to = ($_POST['po_delivery_to']);
$po_terms = ($_POST['po_terms']);




$po_materials = ($_POST['po_materials']);

 

echo "terms" .$po_terms;


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';"; // First query to set the time zone
$sql .= "INSERT INTO jaysan_po ( po_order_to,po_delivery_to,po_terms) VALUES ('$po_order_to','$po_delivery_to','$po_terms')";

if ($conn->multi_query($sql)) {
    // Process the first result set (e.g., time zone set)
    do {
        // Empty the result set
        if ($result = $conn->store_result()) {
            // Process results here if needed
            $result->free();
        }
    } while ($conn->next_result());

    // Now insert the payment data
    $po_id = $conn->insert_id;  // Get the ID of the inserted sales order


    foreach ($po_materials as $po_materials)
    {
      $material_rate = $po_materials['material_rate'];
      $po_material_id = $po_materials['po_material_id'];
      $qty = $po_materials['qty']; 
      $batch_id = $po_materials['batch_id']; 
  
      $sql_insert_subtype = "INSERT INTO jaysan_po_material ( material_rate,jaysan_po_id,po_material_id,qty,batch_id) VALUES ('$material_rate','$po_id','$po_material_id','$qty','$batch_id');";

      if ($conn->query($sql_insert_subtype) === TRUE) {
          
      } else {
          echo "Error: " . $sql_insert_subtype . "<br>" . $conn->error;
      }
    }

  echo "ok";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();

 ?>


