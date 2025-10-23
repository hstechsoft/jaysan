<?php
 include 'db_head.php';

 $mrf_id = test_input($_GET['mrf_id']);
$part_id = test_input($_GET['part_id']);

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = <<<SQL
SELECT
    mrf.*,
    pur.*,
  (SELECT creditors.creditor_name from creditors WHERE creditors.creditor_id = pur.po_order_to) as creditors_name,
       (SELECT parts_tbl.part_name from parts_tbl WHERE parts_tbl.part_id = pur.raw_material_part_id) as raw_material_name,
     (SELECT creditors.creditor_name from creditors WHERE creditors.creditor_id = pur.po_delivery_to) as deliver_name,
    if(pur.mrf_id = $mrf_id,'yes','no') as pur_available,
    (SELECT 
   JSON_ARRAYAGG(
            JSON_OBJECT(
                'batch_id', batch_id,
                'batch_date', batch_date,
                'batch_qty', batch_qty,
                'po_date', po_date,
                'sts', sts
            )
        )
    AS result_json
FROM mrf_batch
WHERE mrf_id =  $mrf_id
GROUP BY mrf_id) AS batch_materials
    
FROM
    material_request_form mrf
LEFT JOIN mrf_purchase pur ON
    mrf.mrf_id = pur.mrf_id
WHERE
    mrf.mrf_id = (SELECT 
    IF(EXISTS(SELECT 1 FROM mrf_purchase WHERE mrf_id =  $mrf_id), $mrf_id, ifnull((SELECT pur.mrf_id from material_request_form mrf LEFT join mrf_purchase pur on  mrf.mrf_id = pur.mrf_id WHERE mrf.part_id = $part_id ORDER by mrf_id DESC LIMIT 1),0)))  group by mrf.mrf_id
SQL;


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


