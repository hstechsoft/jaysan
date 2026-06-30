<?php

include "db_head.php";
require_once "stock_reserve.php";
require_once "stock_distribution.php";
// include "loadStock.php";
// include "loadBom.php";
// include "ProductionPlanner.php";

// $stock = loadStock($conn);





 
// $bom = loadBom($conn);

// $planner = new ProductionPlanner($stock, $bom);

// $planner->plan(2796,100);

// $planner->buildSummary();
// $summary = $planner->getSummary();

// foreach($summary as $process)
// {
//     echo "Process : ".$process['process_id']."<br>";
//     echo "Required Qty : ".$process['required_qty']."<br>";
//     echo "Stock Used : ".$process['stock_qty']."<br>";
//     echo "Manufacture Qty : ".$process['manufacture_qty']."<br>";
//     echo "Remaining Stock : ".$process['remaining_stock']."<br>";
//     echo "<hr>";
// }


// send array of stock_id, qty and owner to stock_reserve function and get the result
// $stock_info = array(
//     array(
//         'stock_id' => 1576,
//         'qty' => 1,
//         'owner' => 'dc'
//     ),
//       array(
//         'stock_id' => 1576,
//         'qty' => 2,
//         'owner' => 'dc'
//     )
// );

// echo stock_reserve($conn, $stock_info,'transport');

echo stock_distribution($conn, 1620, 500, 2768);