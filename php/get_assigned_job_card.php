<?php
 include 'db_head.php';



function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


 $sql = "with nesting_assign as (
 select JSON_ARRAYAGG(
        JSON_OBJECT(
            'assign_date', laser_job_card.assign_date,
            'shift', laser_job_card.shift,
            'machine_id', laser_job_card.machine_id,
            'assigned_by', laser_job_card.assigned_by,
            'status', laser_job_card.status,
            'scarp_weight', laser_job_card.scarp_weight,
            'job_card_id', laser_job_card.job_card_id,
            'scarp_qty', laser_job_card.scarp_qty
        )
    ) as laser_assigned_details, ifnull(nes_work.material_qty, 0) as material_qty, sum(ifnull(laser_job_card.qty, 0)) as total_assigned_qty, ifnull(nes_work.material_qty, 0) - sum(ifnull(laser_job_card.qty, 0))  as remaining_qty, nes_work.nesting_id
from
   nesting_details nes_work
    inner join  laser_job_card  on laser_job_card.nesting_details_id = nes_work.nesting_details_id
    
group by
    nes_work.nesting_id
 )
    
 select
    nd.created_by,
    nd.material_qty,
    nd.nesting_details_id,
    nd.nesting_id,
    emp.emp_name,
    nest_part.part_name as part_name,
    mat_part.part_name as material_name,
    nd.run_time,
    mas.nesting_name,
    mas.material_id,
    mas.path,
    mas.nesting_type,
    mas.std_length,
    mas.run_time,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'nes_part_id',
            nesting_parts.nes_part_id,
            'part_id',
            nesting_parts.part_id,
            'qty',
            nesting_parts.qty,
            'part_name',
            nest_part.part_name
        )
    ) as nesting_parts_details,
     ifnull(total_assigned_qty, 0) as total_assigned_qty,
     ifnull(remaining_qty, 0) as remaining_qty,
    laser_assigned_details
    from
    nesting_details nd
    inner join nesting_assign na on nd.nesting_id = na.nesting_id
    left join nesting_master mas on nd.nesting_id = mas.nes_master_id
    left join nesting_parts on mas.nes_master_id = nesting_parts.nesting_id
    left join parts_tbl nest_part on nesting_parts.part_id = nest_part.part_id
    left join parts_tbl mat_part on mas.material_id = mat_part.part_id
    left join employee emp on nd.created_by = emp.emp_id
  WHERE  1 group by nd.nesting_id";

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


