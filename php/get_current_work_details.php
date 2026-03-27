<?php
 include 'db_head.php';
 error_reporting(0);
 $emp_id = test_input($_GET['emp_id']);



 $result_display = array();
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}

require __DIR__ . '/get_current_work_info.php';
$curent_work_info = current_info($conn, $emp_id);
$work_done_id = (int) ($curent_work_info['work_done_id'] ?? 0);
$result_display['work_done_id'] = $work_done_id;
$result_display['current_process_id'] = (int) ($curent_work_info['current_process_id'] ?? 0);
$result_display['current_machine_id'] = (int) ($curent_work_info['current_machine_id'] ?? 0);


// get start time from work_done_table if work_done_id is available
if ($work_done_id) {
$sql_start_time = "SELECT date_time_only(start_date) as start_date FROM work_done_table WHERE work_id = $work_done_id";
$result_start_time = $conn->query($sql_start_time);
if ($result_start_time->num_rows > 0) {
    $row = $result_start_time->fetch_assoc();
    $result_display['start_time'] = $row['start_date'];
} else {
    $result_display['start_time'] = null;
}
} else {
    $result_display['start_time'] = null;
}

// paused work entries

$sql_paused_works = "SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'start_time', qr.start_time,
        'end_time', qr.end_time,
        'reason', qr.reason,
        'production_id', qr.production_id,
        'chasis_no',(select chasis_no from assign_product where assign_product.ass_id = mpt.ass_id),
        'work_sts', qr.work_sts,
        'work_id', qr.work_done_id,
        'current_work_id', qr.qr_work_id 
    )) as work_entries,qr.work_sts
FROM  qr_work_entry qr
left join machine_production_taken mpt on qr.production_id = mpt.production_id
 WHERE   work_sts = 'paused'    and  qr.emp_id = $emp_id GROUP BY qr.work_sts";
$result_paused_works= $conn->query($sql_paused_works);
if ($result_paused_works->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result_paused_works)) {
        $rows[] = $r;
    }
    $result_display['paused_work_entries'] = $rows;
  
}else {
    $result_display['paused_work_entries'] = [];
}


 $sql_finished_entries = "SELECT  date_time_only(qr.start_time) as start_time,date_time_only(qr.end_time) as end_time,qr.production_id,qr.qr_work_id 
FROM  qr_work_entry qr 
WHERE   qr.work_done_id = $work_done_id and qr.work_sts  =  'finished' ";

$result_finished_entries = $conn->query($sql_finished_entries);

if ($result_finished_entries->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result_finished_entries)) {
        $rows[] = $r;
    }
    $result_display['finished_work_entries'] = $rows;
    
} else {
 $result_display['finished_work_entries'] = [];
   
}


 $sql_process_entries = "with qr_report as(SELECT date_time_only(qr.start_time) as start_time_formated,qr.sec_id,qr.start_time,qr.production_id, qr.qr_work_id, machine_production_taken.ass_id  
FROM qr_work_entry  qr
INNER JOIN machine_production_taken ON qr.production_id = machine_production_taken.production_id 
WHERE qr.work_done_id = $work_done_id AND qr.work_sts = 'in-process'),
ass_details as (
    SELECT qr_report.*,assign_product.chasis_no,assign_product.opid,assign_product.assign_type,date_only(assign_product.dated) as production_date,assign_product.emergency_order FROM assign_product inner join qr_report on assign_product.ass_id = qr_report.ass_id
)
SELECT * FROM ass_details  inner join sales_order_info_view on ass_details.opid = sales_order_info_view.opid  ";

$result_process_entries = $conn->query($sql_process_entries);

if ($result_process_entries->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result_process_entries)) {
        $rows[] = $r;
         $result_display['current_sts'] = 'in-process'; 
    }
    $result_display['in_process_work_entries'] = $rows;
    
} else {
 $result_display['in_process_work_entries'] = [];
    $result_display['current_sts'] = 'not-in-process'; 
}

 print json_encode($result_display);
$conn->close();

 ?>


