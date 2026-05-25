<?php
 include 'db_head.php';

 $part_id = test_input($_GET['part_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}






$sql = <<<SQL
with mrf_details as(SELECT  mrf_purchase.raw_material_part_id, group_concat(mrf_purchase.raw_material_rate) as approx_delivery_days, creditors.creditor_name, creditors.creditor_id FROM mrf_purchase
inner join creditors on mrf_purchase.po_order_to = creditors.creditor_id GROUP BY raw_material_part_id,creditors.creditor_id),
wtm as (select godown_id,output_part from process_wel_tbl inner join work_time_master on process_wel_tbl.process_id = work_time_master.ori_process_id where process_wel_tbl.component_cat = 'purchase' and process_wel_tbl.process_title = 'purchase' and process_wel_tbl.cat = 'out')
select raw_material_part_id, approx_delivery_days, creditor_name, creditor_id, godown_id from mrf_details 
left join wtm on mrf_details.raw_material_part_id = wtm.output_part WHERE godown_id is null and raw_material_part_id = $part_id
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


