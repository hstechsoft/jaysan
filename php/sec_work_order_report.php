

<?php
 include 'db_head.php';

 $godown_id = test_input($_GET['godown_id']);
  $dep_id = test_input($_GET['dep_id']);
   $sec_id = test_input($_GET['sec_id']);
    $process_id = test_input($_GET['process_id']);

$godown_id =sql_nullable($godown_id);
$dep_id =sql_nullable($dep_id);
$sec_id =sql_nullable($sec_id);
 
 
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
    'needed_qty',iv.needed
)) as raw_materials_needed from input_part_demand_view iv
left join parts_tbl pt on iv.input_part_id = pt.part_id
left join jaysan_process_view jpv on iv.previous_process_id = jpv.process_id
where iv.godown = $godown_id and iv.dep <=> $dep_id and iv.sec <=> $sec_id and iv.work_process_id <=> $process_id
GROUP BY iv.work_process_id,iv.godown,iv.dep,iv.sec)
select dm.*,jpv.* from demand_material dm
inner join jaysan_process_view jpv on dm.work_process_id = jpv.process_id
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


