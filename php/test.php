<?php

include "db_head.php";

include "loadStock.php";
include "loadBom.php";
include "ProductionPlanner.php";

$stock = loadStock($conn);





 
$bom = loadBom($conn);

$planner = new ProductionPlanner($stock, $bom);

$planner->plan(2796,100);

$planner->buildSummary();
$summary = $planner->getSummary();

foreach($summary as $process)
{
    echo "Process : ".$process['process_id']."<br>";
    echo "Required Qty : ".$process['required_qty']."<br>";
    echo "Stock Used : ".$process['stock_qty']."<br>";
    echo "Manufacture Qty : ".$process['manufacture_qty']."<br>";
    echo "Remaining Stock : ".$process['remaining_stock']."<br>";
    echo "<hr>";
}

