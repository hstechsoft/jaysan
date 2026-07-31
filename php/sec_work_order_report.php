

<?php
 include 'db_head.php';


    $process_id = test_input($_GET['process_id']);

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}





 $sql = "with demand_material as(select iv.work_process_id,iv.godown,iv.dep,iv.sec,iv.work_orders,iv.pending_process_qty,JSON_ARRAYAGG(JSON_OBJECT(
    'input_part_id',iv.input_part_id,
    'part_name',if(iv.input_part_id is null ,jpv.final_part,pt.part_name),
    'qty',iv.required_qty,
    'previous_process_id',iv.previous_process_id,
    'previous_process_name',jpv.process_name,
    'needed_qty',iv.needed,
    'dc_qty',iv.dc_qty,
    'transport_qty',iv.transport_qty
)) as raw_materials_needed from input_part_demand_view iv
left join parts_tbl pt on iv.input_part_id = pt.part_id
left join jaysan_process_view jpv on iv.previous_process_id = jpv.process_id
where  iv.work_process_id <=> $process_id
GROUP BY iv.work_process_id,iv.godown,iv.dep,iv.sec)
select dm.*,jpv.*,creditors.creditor_name as godown_name, dep.dep_name, sec.sec_name from demand_material dm
inner join jaysan_process_view jpv on dm.work_process_id = jpv.process_id
left join creditors on dm.godown = creditors.creditor_id
left join department dep on dm.dep = dep.dep_id
left join dep_section sec on dm.sec = sec.dep_sec_id
";


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


