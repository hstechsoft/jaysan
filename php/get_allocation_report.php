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


// $sql .= "SELECT stock_allocation.*,
//          parts_tbl.part_name,
//         IF(stock_allocation.from_place_type = 'unit',(select creditors.creditor_name from creditors where creditors.creditor_id = stock_allocation.from_place_id),if(stock_allocation.from_place_type = 'dep',(SELECT department.dep_name FROM department WHERE department.dep_id = stock_allocation.from_place_id),(SELECT dep_section.sec_name FROM dep_section WHERE dep_section.dep_sec_id = stock_allocation.from_place_id))) AS from_place_name,
//         IF(stock_allocation.to_place_type = 'unit',(select creditors.creditor_name from creditors where creditors.creditor_id = stock_allocation.to_palce_id),if(stock_allocation.to_place_type = 'dep',(SELECT department.dep_name FROM department WHERE department.dep_id = stock_allocation.to_palce_id),(SELECT dep_section.sec_name FROM dep_section WHERE dep_section.dep_sec_id = stock_allocation.to_palce_id))) AS to_place_name
// FROM `stock_allocation`
//     inner join parts_tbl on stock_allocation.part_id = parts_tbl.part_id
// WHERE
//    $allocation_sts;
// ";


$sql .= "select sa.*, concat(from_godown.creditor_name,' ',dep_from.dep_name,' ',sec_from.sec_name) as from_place_name, concat(to_godown.creditor_name,' ',dep_to.dep_name,' ',sec_to.sec_name) as to_place_name, from_godown.creditor_name as from_godown_name, to_godown.creditor_name as to_godown_name, dep_from.dep_name as from_dep_name, dep_to.dep_name as to_dep_name, sec_from.sec_name as from_sec_name, sec_to.sec_name as to_sec_name,
if(parts_tbl.part_id is null,jpv.final_part, parts_tbl.part_name) as part_name
from stock_allocation sa
left join creditors from_godown  on sa.from_godown = from_godown.creditor_id
left join creditors to_godown  on sa.to_godown = to_godown.creditor_id
left JOIN department dep_from  on sa.from_dep = dep_from.dep_id
left JOIN department dep_to  on sa.to_dep = dep_to.dep_id
left join dep_section sec_from  on sa.from_sec = sec_from.dep_sec_id
left join dep_section sec_to  on sa.to_sec = sec_to.dep_sec_id
left join parts_tbl   on sa.part_id <=> parts_tbl.part_id
left join jaysan_process_view jpv on sa.process_id <=> jpv.process_id
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
