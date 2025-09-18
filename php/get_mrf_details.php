<?php
 include 'db_head.php';

 $mrf_id = test_input($_GET['mrf_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT * 
FROM (
    SELECT 
        parts_tbl.part_name,
        DATE_FORMAT(mrf.dated, '%d-%m-%Y') AS dated,
         DATE_FORMAT(mrf.last_purchase_date, '%d-%m-%Y') AS last_purchase_date,
        employee.emp_name,
        DATE_FORMAT(mrf.req_date, '%d-%m-%Y') AS req_date,
        mrf.req_qty,
        mrf.uom,

        mrf.stock_for_sufficent_days,
        mrf.shortfall_qty,
        mrf.order_type,
        mrf.part_id
    FROM material_request_form mrf
    INNER JOIN parts_tbl ON mrf.part_id = parts_tbl.part_id
        INNER JOIN employee ON mrf.prepared_by = employee.emp_id
        
    WHERE mrf.mrf_id =  $mrf_id 
) AS mrfd

LEFT JOIN (
SELECT
    mrf_purchase.*,
    (SELECT creditors.creditor_name from creditors WHERE creditors.creditor_id = mrf_purchase.order_to) as order_to_name,
        (SELECT creditors.creditor_name from creditors WHERE creditors.creditor_id = mrf_purchase.delivery_to) as deliver_to_name,
        (SELECT parts_tbl.part_name from parts_tbl WHERE parts_tbl.part_id = mrf_purchase.raw_material_part_id) as raw_material
FROM
    mrf_purchase 
WHERE
    mrf_id IN(
    SELECT
        mrf_id
    FROM
        material_request_form
    WHERE
        part_id IN(
        SELECT
            part_id
        FROM
            material_request_form
        WHERE
            mrf_id = $mrf_id 
    )
)
ORDER BY
    order_to
LIMIT 1
) AS f ON 1 = 1
";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
  echo "0 result";
}
$conn->close();

 ?>


