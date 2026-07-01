<?php
 include 'db_head.php';

 $proces_id = isset($_GET['proces_id']) ? test_input($_GET['proces_id']) : '2796';
 $created_by = isset($_GET['created_by']) ? test_input($_GET['created_by']) : '141';
 $plan_name = isset($_GET['plan_name']) ? test_input($_GET['plan_name']) : 'Plan for Process ID: '.$proces_id;
 $production_qty = isset($_GET['production_qty']) ? test_input($_GET['production_qty']) : '100';

 

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}
 require_once 'buildTree.php';
 require_once 'collectProcessIds.php';
 require_once 'buildPartStock.php';
 require_once 'collectPartIds.php';
 require_once 'buildProcessStock.php';
 require_once 'planTree.php';
$required_qty = $production_qty; // Set the required quantity for the root process
// insert into plan table and get plan_id
$plan_id = 0; // Replace with the actual plan ID
$sql_insert_plan = "INSERT INTO production_planner (plan_name, created_by) VALUES ('$plan_name', $created_by)";
$conn->query($sql_insert_plan);
if ($conn->affected_rows > 0) {
    $plan_id = $conn->insert_id;
    echo "Inserted plan with ID: $plan_id<br>";
} else {
    echo "Error inserting plan: " . $conn->error . "<br>";
}


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
$summary = [];
planTree($tree, $partStock, $processStock, $demandReserve, $demands, $summary);
echo "<hr>";
echo "<h3>Stock Reserve</h3>";
// get array as for each
foreach ($demandReserve as $key => $value) {
    echo "Process ID: " . $value['process_id'] . ", Output Part: " . $value['output_part'] . ", Quantity: " . $value['qty'] . "<br>";
$output_part = $value['output_part'];
    $process_id = $value['process_id'];
    $qty = $value['qty'];
    // get stock  from stock table and reserve that stock until $qty = 0
$sql_get_stock = "SELECT stock_id,available_qty FROM stock_reserve_view WHERE process_id = $process_id AND available_qty > 0 ORDER BY stock_id ASC";
    if($output_part > 0)
        {
            
            $sql_get_stock = "SELECT stock_id,available_qty FROM stock_reserve_view WHERE part_id = $output_part AND available_qty > 0 ORDER BY stock_id ASC";
        }

    
    $result = $conn->query($sql_get_stock);
    while ($row = $result->fetch_assoc()) {
        
        $stock_id = $row['stock_id'];
        $available_qty = $row['available_qty'];

        if ($qty <= 0) {
            break;
        }

        if ($available_qty >= $qty) {
            // Reserve the required quantity from this stock insert on duplicate key update reserved_qty = reserved_qty + $qty
            $sql_reserve_stock = "INSERT INTO stock_reserve (stock_id, reserve_qty,reserve_type) VALUES ($stock_id, $qty, 'demand')
            ON DUPLICATE KEY UPDATE reserve_qty = reserve_qty + $qty";
            $conn->query($sql_reserve_stock);
            echo "Reserved $qty from Stock ID: $stock_id<br>";
            $qty = 0; // All required quantity has been reserved
        } else {
            // Reserve all available quantity from this stock and continue to the next stock
            $sql_reserve_stock = "INSERT INTO stock_reserve (stock_id, reserve_qty,reserve_type) VALUES ($stock_id, $available_qty, 'demand')
            ON DUPLICATE KEY UPDATE reserve_qty = reserve_qty + $available_qty";
            $conn->query($sql_reserve_stock);
            echo "Reserved $available_qty from Stock ID: $stock_id<br>";
            $qty -= $available_qty; // Decrease the remaining required quantity
        }
    }

    if ($qty > 0) {
        echo "Warning: Not enough stock available to reserve the required quantity for Process ID: $process_id. Remaining quantity to reserve: $qty<br>";
    }
}

echo "<br><hr><h3>Demands</h3>";
foreach ($demands as $key => $value) {
    echo "Process ID: " . $value['process_id'] . ", Output Part: " . $value['output_part'] . ", Quantity: " . $value['qty'] . "<br>";
    $process_id = $value['process_id'];
    $qty = $value['qty'];

    // insert into demands table if not exist else update qty = qty + $qty
    $sql_insert_demand = "INSERT INTO demand (process_id, demand_qty,plan_id,created_by) VALUES ($process_id, $qty, $plan_id, $created_by)";
    $conn->query($sql_insert_demand);
    if ($conn->affected_rows > 0) {
        echo "Inserted demand for Process ID: $process_id, Quantity: $qty<br>";
    }
}
    




$conn->close();

 ?>




