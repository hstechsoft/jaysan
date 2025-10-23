<?php
 include 'db_head.php';

 
$part_id = test_input(($_GET['part_id']));

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';";
$sql .= "SELECT
COUNT(mrf.mrf_id) as freq,
sum(mrf.req_qty) as total_req_qty,
    mrf_purchase.mrf_id,
    creditors.creditor_name,
    creditors.creditor_id
    
FROM
    mrf_purchase
    INNER JOIN creditors ON mrf_purchase.po_order_to = creditors.creditor_id
inner join material_request_form mrf on mrf_purchase.mrf_id = mrf.mrf_id 
WHERE
    mrf.part_id = $part_id
GROUP by mrf_purchase.po_order_to";

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


