<?php
 include 'db_head.php';

 $created_by = test_input($_GET['created_by']);
 
$created_by_query = 1;
$nesting_name = test_input($_GET['nesting_name']);
$nesting_name_query = 1;
$material_id = test_input($_GET['material_id']);
$material_id_query = 1;

$remaining_qty_query = 1;
$remaining_qty = test_input($_GET['remaining_qty']);

if($created_by != ''){
    $created_by_query = "mas.created_by = $created_by";
}

if($nesting_name != ''){
    $nesting_name_query = "mas.nesting_name like '%$nesting_name%'";
}

if($material_id != ''){
    $material_id_query = "mas.material_id = $material_id";
}
 

if($remaining_qty > 0){
    $remaining_qty_query = "remaining_qty > 0";
}
 
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
            'machine_id', lm.jmid,
            'run_time', lm.run_time,
            'handling_time', lm.handling_time,
            'godown_name', godown.creditor_name,
            'dep_name', dep.dep_name,
            'sec_name', sec.sec_name,
            'machine_name', jm.machine_name,
            'assigned_by', laser_job_card.assigned_by,
            'status', laser_job_card.status,
            'scarp_weight', laser_job_card.scarp_weight,
            'job_card_id', laser_job_card.job_card_id,
            'scarp_qty', laser_job_card.scarp_qty
        )
    ) as laser_assigned_details, ifnull(nes_work.material_qty, 0) as material_qty, sum(ifnull(laser_job_card.qty, 0)) as total_assigned_qty, ifnull(nes_work.material_qty, 0) - sum(ifnull(laser_job_card.qty, 0))  as remaining_qty,nes_work.nesting_details_id, nes_work.nesting_id, emp.emp_name as created_by_name, nes_work.created_by 
from
   nesting_details nes_work 
    left join employee emp on nes_work.created_by = emp.emp_id
    left join  laser_job_card  on laser_job_card.nesting_details_id = nes_work.nesting_details_id
    left join  laser_machine lm on laser_job_card.laser_machine_id = lm.laser_machine_id
    left join jaysan_machine jm on lm.jmid = jm.jmid
    left join creditors godown on jm.godown_id = godown.creditor_id
    left join department dep on jm.dep_id = dep.dep_id
    left join dep_section sec on jm.dep_sec_id = sec.dep_sec_id
group by
    nes_work.nesting_details_id,nes_work.nesting_id 
 ),
 nes_details as (
    select 
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'laser_assigned_details', na.laser_assigned_details,
            'material_qty', na.material_qty,
            'total_assigned_qty', na.total_assigned_qty,
            'remaining_qty', na.remaining_qty,
            'nesting_details_id', na.nesting_details_id,
            'created_by_id', na.created_by,
            'created_by_name', na.created_by_name 
        )
    ) as nesting_assign_details,
 
    na.nesting_id

     from nesting_assign na where $remaining_qty_query
   
   
group by
     na.nesting_id
 ),
 nes_master as (
     select
     mas.nes_master_id as nesting_id,
      mas.nesting_name,
    mas.material_id,
    mas.path,
    mas.nesting_type,
    mas.std_length,
    mas.master_scarp_weight,
    mat_part.part_name as material_name,
    scarp_part.part_name as scrap_name,
    mas.created_by as master_created_by,
    emp.emp_name as master_created_name,
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
    ) as nesting_parts_details
    from nesting_master mas   
   left join  nesting_parts on nesting_parts.nesting_id = mas.nes_master_id
   left join parts_tbl nest_part on nesting_parts.part_id = nest_part.part_id
   left join parts_tbl mat_part on mas.material_id = mat_part.part_id
   left join parts_tbl scarp_part on mas.scrap_part_id = scarp_part.part_id
   left join employee emp on mas.created_by = emp.emp_id
   WHERE $created_by_query and $nesting_name_query and $material_id_query 
    group by mas.nes_master_id
 )
    

   select 
    nes_master.nesting_id,
    nes_master.nesting_name,
    nes_master.material_id,
    nes_master.path,
    nes_master.nesting_type,
    nes_master.std_length,
    nes_master.material_name,
    nes_master.scrap_name,
    nes_master.master_created_by,
    nes_master.master_created_name,
    nes_master.nesting_parts_details,
    nd.nesting_assign_details
    
    from nes_master 
    inner  join nes_details nd on nes_master.nesting_id = nd.nesting_id
  group by nd.nesting_id";




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


