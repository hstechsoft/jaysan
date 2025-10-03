<?php
 include 'db_head.php';

//  demo text 12345

  $material_query = test_input($_GET['material_query']);
  $date_query = test_input($_GET['date_query']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';";
$sql .= "SELECT
    jp.po_no,
    jp.po_date,
    (SELECT creditors.creditor_name from  creditors WHERE creditors.creditor_id = jp.po_order_to) order_to,
    sum(jmat.qty) as total_po_qty,
       sum(jaysan_inward.qty) as inward_qty
 
FROM
    jaysan_po jp
INNER JOIN jaysan_po_material jmat ON  jmat.jaysan_po_id = jp.po_id
left join jaysan_inward on jp.po_id = jaysan_inward.ref_id and jaysan_inward.inward_cat = 'po'
   
WHERE
  $material_query and $date_query";
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


