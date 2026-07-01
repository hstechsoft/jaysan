<?php
function buildPartStock($conn, $node)
{

$part_ids_str = $node; // Assuming $node is a comma-separated string of part IDs
// get stock from stock_reserve_view table

$sql_stock = "select stock_reserve_view.part_id,part_name, qty,stock_id,godown,dep,sec from stock_reserve_view
inner join parts_tbl on stock_reserve_view.part_id = parts_tbl.part_id
where stock_reserve_view.part_id in ($part_ids_str)";
// get result as $partStock = [

    // 16298 => [

    //     'total_qty' => 15,

    //     'rows' => [

    //         [
    //             'stock_id' => 1,
    //             'qty' => 5,
    //             'batch_id' => 'B001'
    //         ],

    //         [
    //             'stock_id' => 2,
    //             'qty' => 10,
    //             'batch_id' => 'B002'
    //         ]



    $partStock = [];
    $result_stock = mysqli_query($conn, $sql_stock);
    $total_qty = 0;
    while ($row = mysqli_fetch_assoc($result_stock)) {
        $part_id = $row['part_id'];
        $stock_qty = $row['qty'];
        $stock_id = $row['stock_id'];
        $godown = $row['godown'];
        $dep = $row['dep'];
        $sec = $row['sec'];

        if (!isset($partStock[$part_id])) {
            $partStock[$part_id] = [
                'total_qty' => 0,
                'stock_location' => []
            ];
        }
  $partStock[$part_id]['part_name'] = $row['part_name'];
        $partStock[$part_id]['total_qty'] += $stock_qty;
      
        $partStock[$part_id]['stock_location'][] = [
            'stock_id' => $stock_id,
            'qty' => $stock_qty,
            'godown' => $godown,
            'dep' => $dep,
            'sec' => $sec
        ];
    }

    return $partStock;
}



 ?>