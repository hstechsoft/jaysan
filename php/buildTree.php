<?php
function buildTree($conn, $process_id, $required_qty, $bom_qty = 1)
{
    static $nodeId = 1;
// get the output part form process_wel_tbl
$sql_output_part = "
        SELECT output_part
        FROM process_wel_tbl
        WHERE process_id = $process_id";
        $result_output_part = mysqli_query($conn, $sql_output_part);
        $output_part = mysqli_fetch_assoc($result_output_part);

    $node = [
        'node_id' => $nodeId++,
        'process_id'   => $process_id,
        'required_qty' => $required_qty,
 'bom_qty' => $bom_qty, 
         'output_part'   => $output_part['output_part'],
    // 'stock_qty'     => 0,
    // 'consume_qty'   => 0,
    // 'produce_qty'   => 0,
        'children'     => []
    ];




    // Get direct children
    $sql = "
        SELECT
            previous_process_id,
            qty
        FROM input_wel_parts
        WHERE process_id = $process_id
    ";

    $result = mysqli_query($conn, $sql);

    while ($row = mysqli_fetch_assoc($result)) {
        if (empty($row['previous_process_id']))
            continue;

       
     // get node children index
      
  
      $node['children'][] = buildTree(
    $conn,
    $row['previous_process_id'],
    $required_qty * $row['qty'],
    $row['qty']                // <-- BOM quantity
);

   
    }
      
    return $node;
}
 ?>