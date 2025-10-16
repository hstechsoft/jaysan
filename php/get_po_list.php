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
    (SELECT creditors.creditor_name 
     FROM creditors 
     WHERE creditors.creditor_id = po.po_order_to) AS order_to_name,
    CASE 
        WHEN MIN(pom.is_approved) = 1 THEN 1   -- all approved
        ELSE 0                                 -- at least one not approved
    END AS all_approved,
    0 AS approve_sts
FROM
    jaysan_po po
INNER JOIN jaysan_po_material pom 
    ON po.po_id = pom.jaysan_po_id
GROUP BY
    po.po_id;
";
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


