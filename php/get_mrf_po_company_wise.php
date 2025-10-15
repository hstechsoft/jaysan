<?php
 include 'db_head.php';

//  demo text 12345

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
 (select (select ifnull(sum(batch_qty),0) from mrf_batch batch1  where batch1.batch_id = mrf_batch.batch_id) - ifnull(sum(qty),0)  from jaysan_po_material jpm1 where jpm1.batch_id = mrf_batch.batch_id ) as bal_qty,
    parts_tbl.gstrate,
    parts_tbl.part_name as raw_material_part_id,
     parts_tbl.part_id as material_part_id,
parts_tbl.gstrate,
    mrf_batch.batch_date,
    mrf_batch.batch_qty,
   concat(mrf_batch.batch_qty,' ',   mrf_purchase.uom ) as batch_qty_with_uom,
     mrf_purchase.uom,
    mrf_purchase.po_order_to,
    mrf_purchase.raw_material_rate,

    mrf_purchase.po_delivery_to,
      date_only((SELECT DATE_ADD(mb.po_date, INTERVAL ifnull(mrf_purchase.approx_delivery_days,0) DAY) from mrf_batch mb WHERE mb.mrf_id = mrf_purchase.mrf_id and mb.po_date > '0000-00-00' order by mb.batch_id DESC LIMIT  1)) as approx_del_date,
         ( SELECT DATE_ADD(current_date, INTERVAL  mrf_purchase.approx_delivery_days DAY)) as approx_due_date
   
FROM
    `mrf_purchase`
INNER JOIN mrf_batch ON mrf_purchase.mrf_id = mrf_batch.mrf_id
left join parts_tbl on mrf_purchase.raw_material_part_id = parts_tbl.part_id
 WHERE mrf_batch.sts = 'create' and mrf_batch.batch_date<= CURRENT_DATE() and mrf_purchase.po_order_to =  $order_to_id";

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


