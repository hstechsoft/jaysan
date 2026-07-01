<?php
 include 'db_head.php';

 $proces_id = isset($_GET['proces_id']) ? test_input($_GET['proces_id']) : '2796';

 

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
 require_once 'buildTree.php';
 require_once 'collectProcessIds.php';
 require_once 'buildPartStock.php';
 require_once 'collectPartIds.php';
 require_once 'buildProcessStock.php';
 require_once 'planTree.php';
$required_qty = 1; // Set the required quantity for the root process
$tree = buildTree($conn, $proces_id, $required_qty);
$partIds = [];
$processIds = [];
collectPartIds($tree, $partIds);
collectProcessIds($tree, $processIds);

// Convert keys to normal array
$partIds = array_keys($partIds);


// if partid null do not add in comma separated string
$part_ids = [];
$process_ids = [];
foreach ($partIds as $key => $partId) {
    
   if (!is_null($partId) && $partId !== '' && $partId !== '0' && $partId !== 'NULL' && $partId > 0) {
        $part_ids[] = $partId;
    }
 
}
$part_ids_str = implode(',', $part_ids);



$processIds = array_keys($processIds);

foreach ($processIds as $key => $processId) {
    
   if (!is_null($processId) && $processId !== '' && $processId !== '0' && $processId !== 'NULL' && $processId > 0) {
        $process_ids[] = $processId;
    }
 
}
$process_ids_str = implode(',', $process_ids);

$partStock = buildPartStock($conn, $part_ids_str);
$processStock = buildProcessStock($conn, $process_ids_str);

$demandReserve = [];
$demands = [];
planTree($tree, $partStock, $processStock, $demandReserve, $demands);
echo "<hr>";
echo "<h3>Stock Reserve</h3>";
// get array as for each
foreach ($demandReserve as $key => $value) {
    echo "Process ID: " . $value['process_id'] . ", Output Part: " . $value['output_part'] . ", Quantity: " . $value['qty'] . "<br>";
}

echo "<br><hr><h3>Demands</h3>";
foreach ($demands as $key => $value) {
    echo "Process ID: " . $value['process_id'] . ", Output Part: " . $value['output_part'] . ", Quantity: " . $value['qty'] . "<br>";
}

$conn->close();

 ?>


