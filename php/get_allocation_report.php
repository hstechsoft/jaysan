<?php
 include 'db_head.php';

//  demo text 12345
$allocation_sts = isset($_GET['allocation_sts']) ? $_GET['allocation_sts'] : '';
  $allocation_sts = ($allocation_sts == '') ? "1" :  " allocation_status= '$allocation_sts'";

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';";


$sql .= "SELECT stock_allocation.*,
         parts_tbl.part_name,
        IF(stock_allocation.from_place_type = 'unit',(select creditors.creditor_name from creditors where creditors.creditor_id = stock_allocation.from_place_id),if(stock_allocation.from_place_type = 'dep',(SELECT department.dep_name FROM department WHERE department.dep_id = stock_allocation.from_place_id),(SELECT dep_section.sec_name FROM dep_section WHERE dep_section.dep_sec_id = stock_allocation.from_place_id))) AS from_place_name,
        IF(stock_allocation.to_place_type = 'unit',(select creditors.creditor_name from creditors where creditors.creditor_id = stock_allocation.to_palce_id),if(stock_allocation.to_place_type = 'dep',(SELECT department.dep_name FROM department WHERE department.dep_id = stock_allocation.to_palce_id),(SELECT dep_section.sec_name FROM dep_section WHERE dep_section.dep_sec_id = stock_allocation.to_palce_id))) AS to_place_name
FROM `stock_allocation`
    inner join parts_tbl on stock_allocation.part_id = parts_tbl.part_id
WHERE
   $allocation_sts;
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
