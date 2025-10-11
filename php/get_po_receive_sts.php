<?php
 include 'db_head.php';

 
$po_id = test_input($_GET['po_id']);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';";
$sql .= "SELECT
    jpm.*,
    parts_tbl.part_name,

    if((GROUP_CONCAT(grn.grn_id)) is null ,'nothing received', JSON_ARRAYAGG(json_object('dc_no', grn.dc_no,'dc_date',grn.dc_date,'qty',grn.qty,'received_by',(SELECT employee.emp_name from employee WHERE employee.emp_id = grn.received_by)))) as receive_json_sts,
    JSON_ARRAYAGG(json_object('dc_no', grn.dc_no,'dc_date',grn.dc_date,'qty',grn.qty,'received_by',(SELECT employee.emp_name from employee WHERE employee.emp_id = grn.received_by))) as receive_json,
   ifnull(sum(grn.qty),0) as total_received
FROM
    jaysan_po_material jpm
    INNER join parts_tbl on jpm.po_material_id = parts_tbl.part_id 
    LEFT join grn  on jpm.jaysan_po_material_id = grn.jaysan_po_material_id WHERE jpm.jaysan_po_id = $po_id 
    GROUP by jpm.jaysan_po_material_id";

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


