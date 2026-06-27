<?php
function loadStock(mysqli $conn)
{
    $stock = [];

    $sql = "SELECT process_id, SUM(qty) AS qty
            FROM jaysan_stock
            GROUP BY process_id";

    $result = $conn->query($sql);

    while($row = $result->fetch_assoc())
    {
        $stock[(int)$row['process_id']] = (float)$row['qty'];
    }

    return $stock;
}
 ?>