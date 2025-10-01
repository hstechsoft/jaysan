<?php
 include 'db_head.php';

//  demo text

  $order_to_id = test_input($_GET['order_to_id']);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';";
$sql .= "SELECT
    mrf_purchase.mrf_id,
     mrf_batch.batch_id,
    mrf_purchase.mrf_purchase_id,
    mrf_purchase.raw_material_part_id,
    mrf_batch.batch_date,
    mrf_batch.batch_qty,
    mrf_purchase.po_order_to,
    mrf_purchase.po_delivery_to
   
FROM
    `mrf_purchase`
INNER JOIN mrf_batch ON mrf_purchase.mrf_id = mrf_batch.mrf_id WHERE mrf_batch.sts = 'create' and mrf_batch.batch_date<= CURRENT_DATE() and mrf_purchase.po_order_to =  $order_to_id";

if ($conn->multi_query($sql)) {
    do {
        if ($result = $conn->store_result()) {
            if ($result->num_rows > 0) {
                $rows = array();
                while ($r = $result->fetch_assoc()) {
                    $rows[] = $r;
                }
                echo json_encode($rows);
            } else {
                echo "0 result";
            }
            $result->free();
        }
    } while ($conn->more_results() && $conn->next_result());
} else {
    echo "Error: " . $conn->error;
}
$conn->close();


 ?>


