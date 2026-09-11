<?php
 include 'db_head.php';



function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


 $sql = "with 
    jcard_summary as (select 
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'assign_date', assign_date,
            'shift', shift,
            'jmid', jmid,
            'run_time', run_time,
            'handling_time', handling_time,
            'godown_id', godown_id,
            'dep_id', dep_id,
            'dep_sec_id', dep_sec_id,
            'godown', godown,
            'dep', dep,
            'sec', sec,
            'machine_name', machine_name,
            'assigned_by', assigned_by,
            'laser_machine_id', laser_machine_id,
            'qty', qty,
            'remark', remark,
            'operator_id', operator_id,
            'status', status,
            'scarp_weight', scarp_weight,
            'job_card_id', job_card_id,
            'scarp_qty', scarp_qty,
            'finished_date', finished_date,
            'operator_name', operator_name
        )
    ) as job_card_details,

   sum(ifnull(run_time, 0)) as total_run_time,
   sum(ifnull(handling_time, 0)) as total_handling_time,
    sum(ifnull(qty, 0)) as total_qty,
    sum(ifnull(scarp_weight, 0)) as total_scarp_weight,
    sum(ifnull(scarp_qty, 0)) as total_scarp_qty,
    nesting_details_id
   from job_card_view GROUP BY nesting_details_id)
   select ndv.nesting_id,
ndv.nesting_name,
ndv.material_id,
ndv.path,
ndv.nesting_type,
ndv.std_length,
ndv.material_name,
ndv.scrap_name,
ndv.master_created_by,
ndv.master_created_name,
ndv.nesting_parts_details,
 ndv.nesting_details_id,
 ndv.created_by_name,
 ndv.created_by,
 ndv.material_qty,
 jc.job_card_details,
 ifnull(jc.total_run_time, 0) as total_run_time,
 ifnull(jc.total_handling_time, 0) as total_handling_time,
 ifnull(jc.total_qty, 0) as total_qty,
 ifnull(jc.total_scarp_weight, 0) as total_scarp_weight,
 ifnull(jc.total_scarp_qty, 0) as total_scarp_qty,
 ifnull(jc.total_qty, 0) as assigned_qty,
 ndv.material_qty - ifnull(jc.total_qty, 0) as remaining_unassigned_qty,
 ifnull(jc.total_run_time, 0) + ifnull(jc.total_handling_time, 0) as total_time
  from nesting_details_view ndv
  
 left JOIN jcard_summary jc on ndv.nesting_details_id = jc.nesting_details_id where  ndv.material_qty - ifnull(jc.total_qty, 0) > 0";

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


