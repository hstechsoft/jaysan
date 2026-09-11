<?php
 include 'db_head.php';

//  demo text 12345
$jobcard_shift = isset($_GET['jobcard_shift']) ? $_GET['jobcard_shift'] : '';
$laser_machine = isset($_GET['laser_machine']) ? $_GET['laser_machine'] : '';
$job_card_sts = isset($_GET['job_card_sts']) ? $_GET['job_card_sts'] : '';
$job_card_assigned_by = isset($_GET['job_card_assigned_by']) ? $_GET['job_card_assigned_by'] : '';
$job_card_assigned_from_date = isset($_GET['job_card_assigned_from_date']) ? $_GET['job_card_assigned_from_date'] : '';
$job_card_assigned_to_date = isset($_GET['job_card_assigned_to_date']) ? $_GET['job_card_assigned_to_date'] : '';

$job_card_finished_from_date = isset($_GET['job_card_finished_from_date']) ? $_GET['job_card_finished_from_date'] : '';
$job_card_finished_to_date = isset($_GET['job_card_finished_to_date']) ? $_GET['job_card_finished_to_date'] : '';

$job_card_finished_emp = isset($_GET['job_card_finished_emp']) ? $_GET['job_card_finished_emp'] : '';

$nesting_details_id = isset($_GET['nesting_details_id']) ? $_GET['nesting_details_id'] : '';
$nesting_id = isset($_GET['nesting_id']) ? $_GET['nesting_id'] : '';
$raw_material_id = isset($_GET['raw_material_id']) ? $_GET['raw_material_id'] : '';

$laser_work_created_emp = isset($_GET['laser_work_created_emp']) ? $_GET['laser_work_created_emp'] : '';


$jobcard_shift_query = 1;
$laser_machine_query = 1;
$job_card_sts_query = 1;
$job_card_assigned_by_query = 1;

$job_card_assigned_date_query = 1;

$job_card_finished_date_query = 1;

$job_card_finished_emp_query = 1;
$nesting_details_id_query = 1;
$nesting_id_query = 1;
$raw_material_id_query = 1;
$laser_work_created_emp_query = 1;

if($jobcard_shift != ''){
    $jobcard_shift_query = "shift = '$jobcard_shift'";
}

if($laser_machine != ''){
    $laser_machine_query = "jmid = '$laser_machine'";
}

if($job_card_sts != ''){
    $job_card_sts_query = "status = '$job_card_sts'";
}

if($job_card_assigned_by != ''){
    $job_card_assigned_by_query = "assigned_by = '$job_card_assigned_by'";
}

if($job_card_assigned_from_date != '' && $job_card_assigned_to_date != ''){
    $job_card_assigned_date_query = "assign_date between '$job_card_assigned_from_date' and '$job_card_assigned_to_date'";
}

if($job_card_finished_from_date != '' && $job_card_finished_to_date != ''){
    $job_card_finished_date_query = "finished_date between '$job_card_finished_from_date' and '$job_card_finished_to_date'";
}

if($job_card_finished_emp != ''){
    $job_card_finished_emp_query = "operator_id = '$job_card_finished_emp'";
}

if($nesting_details_id != ''){
    $nesting_details_id_query = "nesting_details_id = '$nesting_details_id'";
}

if($nesting_id != ''){
    $nesting_id_query = "nesting_id = '$nesting_id'";
}

if($raw_material_id != ''){
    $raw_material_id_query = "material_id = '$raw_material_id'";
}

if($laser_work_created_emp != ''){
    $laser_work_created_emp_query = "created_by = '$laser_work_created_emp'";
}


 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "
with jcard as (select 
 assign_date,
    shift,
   jmid,
   run_time,
   handling_time,
   godown_id,
   dep_id,
   dep_sec_id,
   
     godown,
    dep,
    sec,
   machine_name,
    assigned_by,
    laser_machine_id,
    qty,
    remark,
    operator_id,
    status,
    scarp_weight,
    job_card_id,
    scarp_qty,
    nesting_details_id,
    finished_date,
    operator_name,
    assigned_by_name from job_card_view where $jobcard_shift_query and $laser_machine_query and $job_card_sts_query and $job_card_assigned_by_query and $job_card_assigned_date_query and $job_card_finished_date_query and $job_card_finished_emp_query ),
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
            'operator_name', operator_name,
            'assigned_by_name', assigned_by_name
        )
    ) as job_card_details,

   sum(ifnull(run_time, 0)) as total_run_time,
   sum(ifnull(handling_time, 0)) as total_handling_time,
    sum(ifnull(qty, 0)) as total_qty,
    sum(ifnull(scarp_weight, 0)) as total_scarp_weight,
    sum(ifnull(scarp_qty, 0)) as total_scarp_qty,
    nesting_details_id
   from jcard GROUP BY nesting_details_id),
    laser_summary as (
        select 
       ndv.nesting_id,
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
 ndv.master_scarp_weight,
 ndv.raw_material_weight
         from nesting_details_view ndv WHERE  $nesting_details_id_query and $nesting_id_query and $raw_material_id_query and $laser_work_created_emp_query
    ),
    jc_unassign as(
        select ifnull(sum(qty), 0) as total_qty, nesting_details_id from laser_job_card GROUP BY nesting_details_id
    )
    select ls.nesting_id,
ls.nesting_name,
ls.material_id,
ls.path,
ls.nesting_type,
ls.std_length,
ls.material_name,
ls.scrap_name,
ls.master_created_by,
ls.master_created_name,
ls.nesting_parts_details,
 ls.nesting_details_id,
 ls.created_by_name,
 ls.created_by,
 ls.material_qty,
 ls.master_scarp_weight,
 ls.raw_material_weight,
 jc.job_card_details,
 ifnull(jc.total_run_time, 0) as total_run_time,
 ifnull(jc.total_handling_time, 0) as total_handling_time,
 ifnull(jc.total_qty, 0) as total_qty,
 ifnull(jc.total_scarp_weight, 0) as total_scarp_weight,
 ifnull(jc.total_scarp_qty, 0) as total_scarp_qty,
 ifnull(ju.total_qty, 0) as assigned_qty,
 ls.material_qty - ifnull(ju.total_qty, 0) as remaining_unassigned_qty,
 ifnull(jc.total_run_time, 0) + ifnull(jc.total_handling_time, 0) as total_time
  from laser_summary ls
  left join jc_unassign ju on ls.nesting_details_id = ju.nesting_details_id
 left JOIN jcard_summary jc on ls.nesting_details_id = jc.nesting_details_id";


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
