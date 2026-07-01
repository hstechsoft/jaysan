<?php
function buildProcessStock($conn, $node)
{

$process_ids_str = $node; // Assuming $node is a comma-separated string of process IDs
// get stock from stock_reserve_view table

$sql_stock = "select stock_reserve_view.part_id,stock_reserve_view.process_id,if(stock_reserve_view.part_id is null, concat('semi finished part of','(',part_name,')'),parts_tbl.part_name) as part_name, qty,stock_id,godown,dep,sec from stock_reserve_view
left join process_wel_tbl pwt on stock_reserve_view.process_id <=> pwt.process_id
left join process_wel_tbl pwt_final on pwt.final_process_id <=> pwt_final.process_id
left join parts_tbl on pwt_final.output_part <=> parts_tbl.part_id
where stock_reserve_view.process_id in ($process_ids_str)";
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



    $processStock = [];
    $result_stock = mysqli_query($conn, $sql_stock);
    $total_qty = 0;
    while ($row = mysqli_fetch_assoc($result_stock)) {
        $process_id = $row['process_id'];
        $stock_qty = $row['qty'];
        $stock_id = $row['stock_id'];
        $godown = $row['godown'];
        $dep = $row['dep'];
        $sec = $row['sec'];

        if (!isset($processStock[$process_id])) {
            $processStock[$process_id] = [
                'total_qty' => 0,
                'stock_location' => []
            ];
        }
  $processStock[$process_id]['part_name'] = $row['part_name'];
        $processStock[$process_id]['total_qty'] += $stock_qty;
      
        $processStock[$process_id]['stock_location'][] = [
            'stock_id' => $stock_id,
            'qty' => $stock_qty,
            'godown' => $godown,
            'dep' => $dep,
            'sec' => $sec
        ];
    }

    return $processStock;
}



 ?>