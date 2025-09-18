<?php

 include 'db_head.php';

 $mrf_id = test_input($_GET['mrf_id']);
$tally_stock_array = json_decode($_GET['tally_stock_array'],true);
$tally_stock_approved_by = test_input($_GET['tally_stock_approved_by']);

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
// Set time zone and insert in a single query using multi_query
$sql = "SET time_zone = '+05:30';";
$sql .= "UPDATE material_request_form SET  status='tally_stock_approved' , 	tally_stock_approved_by = $tally_stock_approved_by,form_history =  CONCAT(form_history ,'<li class = \'list-group-item\'> tally stock Modified by ', (SELECT emp_name FROM employee WHERE emp_id = $tally_stock_approved_by), ' on ', DATE_FORMAT(NOW(), '%d-%m-%Y %H:%i'),' </li>') WHERE mrf_id=$mrf_id;";

if ($conn->multi_query($sql)) {
    // Advance through all results to reach the insert
    do {
        if ($result = $conn->store_result()) {
            $result->free();
        }
    } while ($conn->more_results() && $conn->next_result());
    // Delete existing records for this mrf_id in internal_godown_stock_physical
    $sql_delete_physical_stock = "DELETE FROM internal_godown_stock_tally WHERE mrf_id=$mrf_id";
    if ($conn->query($sql_delete_physical_stock) !== TRUE) {
        echo "Error deleting physical stock: " . $conn->error;
        $conn->close();
        exit;
    }
  
  
   foreach ($tally_stock_array as $tally_stock)
{ 
   $godown_id = $tally_stock['godown_id']; 
  $qty = $tally_stock['qty']; 


 $sql = "INSERT INTO internal_godown_stock_tally ( mrf_id,godown_id,qty) VALUES ($mrf_id,'$godown_id','$qty')";

  if ($conn->query($sql) === TRUE) {

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}
    echo "ok";
  
} else {
    echo "Error: " . $conn->error;
}


$conn->close();


 ?>


