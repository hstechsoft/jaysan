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

$sql = "SET time_zone = '+05:30';";

$sql .= "SELECT DISTINCT
    mrf.mrf_id,
    mrf.corrective_action,
mrf.preventive_action,
mrf.root_cause,
mrf.uom,
emp.emp_role as department_print,
emp.emp_role as desigination_print,
emp.emp_name as name_print,
parts_tbl.part_name as part_no_print,
mrf.order_type as order_type_print,
mrf.shortfall_qty as shortfall_qty_print,
mrf.stock_for_sufficent_days as stock_for_sufficient_days_print,
mrf.req_qty as requirement_qty_print,
 
DATE_FORMAT(mrf.req_date , '%d-%m %Y ')as requirement_date_print,
DATE_FORMAT(mrf.last_purchase_date, '%d-%m %Y ') as last_purchase_date_print,
mrf.last_purchase_qty as last_purchase_qty_print,
mrf.material_receipt_status as material_receipt_status_print,
IF(mrf.bom_production = 1,'yes','no') as bom_production_print,
GROUP_CONCAT(concat('<tr><td>',(select godown_name from internal_godown where internal_godown_id = phy.godown_id) ,'</td><td>',phy.qty,'</td></tr>') ) as phy_stock,
ifnull(GROUP_CONCAT(concat('<tr><td>',(select godown_name from internal_godown where internal_godown_id = tally.godown_id) ,'</td><td>',tally.qty,'</td></tr>') ),'<tr><td colspan = \"2\"> NO DATA </td></tr>') as tally_stock,

ifnull(group_concat(concat('<tr><td>',(select godown_name from internal_godown where internal_godown_id = tally.godown_id) ,'</td><td>',tally.qty,' ',mrf.uom,'</td></tr>') ),'<tr rowspan = \"2\"><td colspan = \"2\"> NO DATA </td></tr>' )as tally_stock_only,


ifnull(group_concat(concat('<tr><td>',(select godown_name from internal_godown where internal_godown_id = phy.godown_id) ,'</td><td>',phy.qty,' ',mrf.uom,'</td></tr>') ),'<tr><td colspan = \"2\"> NO DATA </td></tr>' ) as phy_stock_only,

-- concat('<tr>',GROUP_CONCAT(concat('<td>',(select godown_name from internal_godown where internal_godown_id = phy.godown_id) ,'</td><td>',phy.qty,'</td>') ),ifnull(GROUP_CONCAT(concat('<td>',(select godown_name from internal_godown where internal_godown_id = tally.godown_id)  ,'</td><td>',tally.qty,'</td>')),0),'</tr>') as phy_stock,

ifnull(sum(phy.qty),0) as total_physical_stock_print,
ifnull(sum(tally.qty),0) as total_tally_stock_print,
emp.emp_name as physical_stock_verfied_by_print,
emp_tally_stock.emp_name as tally_stock_verfied_by_print,
emp_purchase_requested.emp_role as purchase_desigination_print,
emp_purchase_requested.emp_name as purchase_name_print,
mrf_purchase.order_to as order_to_print,
mrf_purchase.delivery_to as delivery_to_print,
mrf_purchase.raw_material_part_id as raw_material_part_no_print,
mrf_purchase.order_qty as order_qty_print,
mrf_purchase.batch_qty as order_qty_print,
mrf_purchase.next_batch_date as next_batch_date_print,
mrf_purchase.next_po_date as next_po_date_print,
mrf_purchase.raw_material_rate as raw_material_rate_print,
mrf_purchase.raw_material_budget as raw_material_budget_print,
mrf_purchase.po_no as po_no_print,
mrf_purchase.po_date as po_date_print,
emp_purchase_requested.emp_name as requested_by_print,
emp_purchase_requested.emp_name as verified_by_print,
emp_purchase_approved.emp_name as approved_by_print,
    emp_tally_stock.emp_name as tally_stock_approved_by_name
  
FROM
    material_request_form mrf
INNER JOIN employee emp ON
    mrf.emp_id = emp.emp_id
INNER JOIN parts_tbl ON mrf.part_id = parts_tbl.part_id
LEFT JOIN internal_godown_stock_physical phy on mrf.mrf_id = phy.mrf_id
LEFT JOIN internal_godown_stock_tally tally on mrf.mrf_id = tally.mrf_id
LEFT JOIN mrf_purchase ON mrf.mrf_id = mrf_purchase.mrf_id
LEFT JOIN employee emp_tally_stock on mrf.tally_stock_approved_by = emp_tally_stock.emp_id
left JOIN employee emp_purchase_requested ON mrf_purchase.purchase_requested_by = emp_purchase_requested.emp_id 
left JOIN employee emp_purchase_approved ON mrf_purchase.purchase_approved_by = emp_purchase_approved.emp_id 
WHERE mrf.mrf_id 
= $mrf_id GROUP by mrf_id
 ";





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


