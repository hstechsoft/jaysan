<?php
 include 'db_head.php';

//  demo text 12345

  $material_query = ($_GET['material_query']);
  $date_query = ($_GET['date_query']);
  $order_to_query = ($_GET['order_to_query']);
   $emp_query = ($_GET['emp_query']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';";
// $sql .= "SELECT
//     jp.po_no,
//     jp.po_date,
//     (SELECT creditors.creditor_name from  creditors WHERE creditors.creditor_id = jp.po_order_to) order_to,
//     sum(jmat.qty) as total_po_qty,
//        sum(jaysan_inward.qty) as inward_qty
 
// FROM
//     jaysan_po jp
// INNER JOIN jaysan_po_material jmat ON  jmat.jaysan_po_id = jp.po_id
// left join jaysan_inward on jp.po_id = jaysan_inward.ref_id and jaysan_inward.inward_cat = 'po'

$sql .= "WITH
    mrf_cte AS(
    SELECT
        mrf.mrf_id,
        mrf.part_id,
        mrf.dated,
        mrf.emp_id,
        mrf.req_qty,
        mrf.req_date,
        mrf_batch.batch_date,
        mrf.status,
        mrf.uom AS mrf_uom,
        mrf_batch.batch_id,
        mrf_batch.batch_qty,
        mrf_purchase.mrf_purchase_id,
        mrf_purchase.po_order_to,
        mrf_purchase.order_qty,
        mrf_purchase.raw_material_rate,
        mrf_purchase.approx_delivery_days,
        mrf_purchase.uom,
        mrf_purchase.raw_material_part_id,
        (select emp_name from employee where emp_id = mrf_purchase.purchase_requested_by) as purchase_req_by,
        (
        SELECT
            parts_tbl.part_name
        FROM
            parts_tbl
        WHERE
            parts_tbl.part_id = mrf_purchase.raw_material_part_id
    ) AS raw_material_name,
    create_emp.emp_name
FROM
    material_request_form mrf
LEFT JOIN employee create_emp ON mrf.emp_id = create_emp.emp_id
LEFT JOIN mrf_purchase ON mrf.mrf_id = mrf_purchase.mrf_id
LEFT JOIN mrf_batch ON mrf.mrf_id = mrf_batch.mrf_id
WHERE mrf.mrf_id = 209 and $emp_query and  $date_query and $material_query order by mrf_id DESC
   -- mrf.mrf_id = 209
   --   create_emp.emp_id = 5
   --      mrf.part_id = 2
   -- mrf.dated between 
   
),
po_cte AS(
    SELECT
        mrf_cte.*,
        jpm.jaysan_po_id,
        (select po_date from jaysan_po where po_id =   jpm.jaysan_po_id) as po_date,
        jpm.qty AS po_batch_qty,
        jpm.due_on,
        jpm.jaysan_po_material_id
    FROM
        mrf_cte
    LEFT JOIN jaysan_po_material jpm ON
        mrf_cte.batch_id = jpm.batch_id
),
final_cte AS(
    SELECT
        po_cte.*,
        grn.qty AS received_qty,
        grn.received_by,
        grn.dc_no,
        grn.dc_date,
        SUM(batch_qty) OVER(
    PARTITION BY mrf_id
    ) AS rm_order_qty_total,
    SUM(grn.qty) AS rm_receive_qty_total,
    IF(
        grn.grn_id IS NULL,
        'No Material Received',
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'received_by',
                (
                SELECT
                    employee.emp_name
                FROM
                    employee
                WHERE
                    employee.emp_id = grn.received_by
            ),
            'grn_dc_no',
            grn.dc_no,
            'grn_dc_date',
            grn.dc_date,
            'grn_receive_qty',
            grn.qty
            )
        )
    ) AS rd
FROM
    po_cte
LEFT JOIN grn ON po_cte.jaysan_po_material_id = grn.jaysan_po_material_id
GROUP BY
    mrf_id,
    batch_id
)
SELECT
    final_cte.*,
    if(mrf_purchase_id is null ,'no purchase entry',JSON_ARRAYAGG(
            JSON_OBJECT('po_date',po_date,'batch_date',batch_date,'batch_id',batch_id,'batch_qty',batch_qty,'po_no',jaysan_po_id,'total received',rm_receive_qty_total,'due_date',due_on,'due_sts',if(due_on is null , 'no_sts',if(CURDATE() > due_on,'expire','active')),'receive_details',rd)) )as batch
    
    
FROM
    final_cte
GROUP BY
    mrf_id order by mrf_id desc";
    // jmat.po_material_id = '' AND jp.po_order_to = 1";

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
