<?php
 include 'db_head.php';

//  demo text 12345

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';";
$sql .= "SELECT
    po.*,
  (SELECT creditors.creditor_name from creditors WHERE creditors.creditor_id = po.po_order_to) as order_to_name,
    0 AS approve_sts
FROM
    `jaysan_po` po
INNER JOIN jaysan_po_material pom ON
    po.po_id = pom.jaysan_po_id
WHERE
    pom.is_approved = 0 GROUP by po.po_id
UNION ALL
SELECT
    po.*,
   (SELECT creditors.creditor_name from creditors WHERE creditors.creditor_id = po.po_order_to) as order_to_name,
    1 AS approve_sts
FROM
    `jaysan_po` po
INNER JOIN jaysan_po_material pom ON
    po.po_id = pom.jaysan_po_id
WHERE
    pom.is_approved = 1 GROUP by po.po_id";
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


