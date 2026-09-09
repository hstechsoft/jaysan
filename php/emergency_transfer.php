<?php
 include 'db_head.php';
$allocation_id = test_input($_POST['allocation_id']);



function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

// get stock allocation details
$sql = "SELECT  part_id, qty, from_godown, from_dep, from_sec, to_godown, to_dep, to_sec, process_id FROM stock_allocation WHERE allocation_id = $allocation_id";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
    $stock_allocation = $result->fetch_assoc();
    $part_id = $stock_allocation['part_id'];
    $qty = $stock_allocation['qty'];
    $from_godown = $stock_allocation['from_godown'];
    $from_dep = $stock_allocation['from_dep'];
    $from_sec = $stock_allocation['from_sec'];
    $to_godown = $stock_allocation['to_godown'];
    $to_dep = $stock_allocation['to_dep'];
    $to_sec = $stock_allocation['to_sec'];
    $process_id = $stock_allocation['process_id'];

    echo "Stock allocation details: ";
    print_r($stock_allocation);
    // require_once 'stock_transfer.php'; // include the stock_transfer function file
    // if($qty > 0)
    //     stock_transfer($conn, $part_id,  $process_id,$from_godown, $from_dep, $from_sec, $to_godown, $to_dep, $to_sec, $qty);
} else {
    throw new Exception("Stock allocation not found for ID $allocation_id");
}

$conn->close();

 ?>


