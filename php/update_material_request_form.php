<?php

 include 'db_head.php';
 $mrf_id = test_input($_GET['mrf_id']);
 $emp_id = test_input($_GET['emp_id']);
$part_id = test_input($_GET['part_id']);
$bom_production = test_input($_GET['bom_production']);
$order_type = test_input($_GET['order_type']);
$shortfall_qty = test_input($_GET['shortfall_qty']);
$stock_for_sufficent_days = test_input($_GET['stock_for_sufficent_days']);
$req_qty = test_input($_GET['req_qty']);
$req_date = test_input($_GET['req_date']);
$last_purchase_date = test_input($_GET['last_purchase_date']);
$last_purchase_qty = test_input($_GET['last_purchase_qty']);
$material_receipt_status = test_input($_GET['material_receipt_status']);
$prepared_by = test_input($_GET['prepared_by']);

$physical_stock_array = json_decode($_GET['physical_stock_array'], true);
$uom = test_input($_GET['uom']);
    
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
// Set time zone and insert in a single query using multi_query
$sql = "SET time_zone = '+05:30';";
$sql .= "UPDATE material_request_form SET uom = $uom, emp_id=$emp_id, part_id=$part_id, bom_production=$bom_production, order_type=$order_type, shortfall_qty=$shortfall_qty, stock_for_sufficent_days=$stock_for_sufficent_days, req_qty=$req_qty, req_date=$req_date, last_purchase_date=$last_purchase_date, last_purchase_qty=$last_purchase_qty, material_receipt_status=$material_receipt_status, prepared_by=$prepared_by,form_history =  CONCAT(form_history ,'<li class = \'list-group-item\'> form Modified by ', (SELECT emp_name FROM employee WHERE emp_id = $emp_id), ' on ', DATE_FORMAT(NOW(), '%d-%m-%Y %H:%i'),' </li>') WHERE mrf_id=$mrf_id;";

if ($conn->multi_query($sql)) {
    // Advance through all results to reach the insert
    do {
        if ($result = $conn->store_result()) {
            $result->free();
        }
    } while ($conn->more_results() && $conn->next_result());
    // Delete existing records for this mrf_id in internal_godown_stock_physical
    $sql_delete_physical_stock = "DELETE FROM internal_godown_stock_physical WHERE mrf_id=$mrf_id";
    if ($conn->query($sql_delete_physical_stock) !== TRUE) {
        echo "Error deleting physical stock: " . $conn->error;
        $conn->close();
        exit;
    }
  
  
    foreach ($physical_stock_array as $physical_stock) { 
        $godown_id = $physical_stock['godown_id']; 
        $qty = $physical_stock['qty']; 
        $sql_insert_physical_stock = "INSERT INTO internal_godown_stock_physical (mrf_id,godown_id,qty) VALUES ($mrf_id,'$godown_id','$qty')";
        if ($conn->query($sql_insert_physical_stock) !== TRUE) {
            echo "Error: " . $sql_insert_physical_stock . "<br>" . $conn->error;
            $conn->close();
            exit;
        }
    }
    echo "ok";
  
} else {
    echo "Error: " . $conn->error;
}


$conn->close();


 ?>


