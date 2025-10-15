<?php
 include 'db_head.php';

 

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';";
$sql .= <<<SQL
SELECT
    mrf_purchase.mrf_id,
    mrf_purchase.mrf_purchase_id,
(SELECT max(po_id)+1 from jaysan_po ) as max_po_no,
    parts_tbl.gstrate,
    parts_tbl.part_name as raw_material_part_id,
    mrf_batch.batch_date,
    mrf_batch.batch_qty,
    mrf_purchase.po_order_to,
    mrf_purchase.po_delivery_to,
    (SELECT parts_tbl.part_name from parts_tbl WHERE parts_tbl.part_id = mrf.part_id) as part_name,
     (select count(material_request_form.mrf_id) from material_request_form where material_request_form.part_id = mrf.part_id) as total_part_count,
     (SELECT mb.po_date from mrf_batch mb WHERE mb.mrf_id = mrf.mrf_id and mb.po_date > '0000-00-00' order by mb.batch_id DESC LIMIT  1) as latest_po_date,
      (SELECT mb.batch_date from mrf_batch mb WHERE mb.mrf_id = mrf.mrf_id and mb.po_date > '0000-00-00' order by mb.batch_id DESC LIMIT  1) as latest_po_batch_date,
          date_only((SELECT DATE_ADD(mb.po_date, INTERVAL ifnull(mrf_purchase.approx_delivery_days,0) DAY) from mrf_batch mb WHERE mb.mrf_id = mrf.mrf_id and mb.po_date > '0000-00-00' order by mb.batch_id DESC LIMIT  1)) as approx_del_date,
         ( SELECT DATE_ADD(current_date, INTERVAL  mrf_purchase.approx_delivery_days DAY)) as approx_due_date,
   mrf.form_history,
   date_only(mrf.req_date) as req_date_format,
 mrf_purchase.approx_delivery_days,
   concat(mrf_batch.batch_qty,' ',   mrf_purchase.uom ) as batch_qty_with_uom,
     mrf_purchase.uom,
    (
    SELECT
        creditors.creditor_name
    FROM
        creditors
    WHERE
        creditors.creditor_id = mrf_purchase.po_order_to
) AS order_to,
(
    SELECT
        creditors.creditor_name
    FROM
        creditors
    WHERE
        creditors.creditor_id = mrf_purchase.po_delivery_to
) AS delivery_to,
(SELECT ifnull(sum(qty),0) from jaysan_po_material WHERE batch_id = mrf_batch.batch_id GROUP by batch_id) as pre_po_qty
FROM
    `mrf_purchase`
INNER JOIN mrf_batch ON mrf_purchase.mrf_id = mrf_batch.mrf_id
inner join material_request_form mrf on mrf_purchase.mrf_id = mrf.mrf_id
left join parts_tbl on mrf_purchase.raw_material_part_id = parts_tbl.part_id
WHERE
    mrf_batch.sts = 'create' AND mrf_batch.batch_date <= CURRENT_DATE() and mrf_batch.batch_id not in (select ifnull(batch_id,0) from jaysan_po_material where batch_id not in(SELECT
    IF(
        IFNULL(SUM(qty),
        0) >= mb.batch_qty,
        mb.batch_id,
        0
    )
FROM
    jaysan_po_material inner join mrf_batch mb on jaysan_po_material.batch_id = mrf_batch.batch_id

GROUP BY
    mb.batch_id)    group by batch_id);
SQL;
// $sql .= "SELECT
//     mrf_purchase.mrf_id,
//     mrf_purchase.mrf_purchase_id,
   
//     parts_tbl.gstrate,
//     parts_tbl.part_name as raw_material_part_id,
//     mrf_batch.batch_date,
//     mrf_batch.batch_qty,
//     mrf_purchase.po_order_to,
//     mrf_purchase.po_delivery_to,
//     (SELECT parts_tbl.part_name from parts_tbl WHERE parts_tbl.part_id = mrf.part_id) as part_name,
//      (select count(material_request_form.mrf_id) from material_request_form where material_request_form.part_id = mrf.part_id) as total_part_count,
//      (SELECT mb.po_date from mrf_batch mb WHERE mb.mrf_id = mrf.mrf_id and mb.po_date > '0000-00-00' order by mb.batch_id DESC LIMIT  1) as latest_po_date,
//       (SELECT mb.batch_date from mrf_batch mb WHERE mb.mrf_id = mrf.mrf_id and mb.po_date > '0000-00-00' order by mb.batch_id DESC LIMIT  1) as latest_po_batch_date,
//           date_only((SELECT DATE_ADD(mb.po_date, INTERVAL ifnull(mrf_purchase.approx_delivery_days,0) DAY) from mrf_batch mb WHERE mb.mrf_id = mrf.mrf_id and mb.po_date > '0000-00-00' order by mb.batch_id DESC LIMIT  1)) as approx_del_date,
//          ( SELECT DATE_ADD(current_date, INTERVAL  mrf_purchase.approx_delivery_days DAY)) as approx_due_date,
//    mrf.form_history,
//    date_only(mrf.req_date) as req_date_format,
//  mrf_purchase.approx_delivery_days,
//    concat(mrf_batch.batch_qty,' ',   mrf_purchase.uom ) as batch_qty_with_uom,
//      mrf_purchase.uom,
//     (
//     SELECT
//         creditors.creditor_name
//     FROM
//         creditors
//     WHERE
//         creditors.creditor_id = mrf_purchase.po_order_to
// ) AS order_to,
// (
//     SELECT
//         creditors.creditor_name
//     FROM
//         creditors
//     WHERE
//         creditors.creditor_id = mrf_purchase.po_delivery_to
// ) AS delivery_to
// FROM
//     `mrf_purchase`
// INNER JOIN mrf_batch ON mrf_purchase.mrf_id = mrf_batch.mrf_id
// inner join material_request_form mrf on mrf_purchase.mrf_id = mrf.mrf_id
// left join parts_tbl on mrf_purchase.raw_material_part_id = parts_tbl.part_id
// WHERE
//     mrf_batch.sts = 'create' AND mrf_batch.batch_date <= CURRENT_DATE();";

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


