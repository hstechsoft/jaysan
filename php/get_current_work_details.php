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
$result_display['part_id'] = (int) ($curent_work_info['part_id'] ?? 0);
$result_display['godown_id'] = (int) ($curent_work_info['godown_id'] ?? 0);
$result_display['dep_id'] = (int) ($curent_work_info['dep_id'] ?? 0);
$result_display['sec_id'] = (int) ($curent_work_info['sec_id'] ?? 0);
$result_display['day_start_time'] = $curent_work_info['day_start_time'] ?? null;
$result_display['start_time'] = $curent_work_info['start_time'] ?? null;


// get start time from work_done_table if work_done_id is available
// if ($work_done_id) {
// $sql_start_time = "SELECT date_time_only(start_date) as start_date FROM work_done_table WHERE work_id = $work_done_id";
// $result_start_time = $conn->query($sql_start_time);
// if ($result_start_time->num_rows > 0) {
//     $row = $result_start_time->fetch_assoc();
//     $result_display['start_time'] = $row['start_date'];
// } else {
//     $result_display['start_time'] = null;
// }
// } else {
//     $result_display['start_time'] = null;
// }

// paused work entries

$sql_paused_works = "with paused_summary as (
    SELECT max(qr_work_id) as qr_work_id  from qr_work_entry where work_sts = 'paused' and emp_id = $emp_id and production_id  not in (SELECT production_id FROM qr_work_entry WHERE (work_sts = 'in-process' or work_sts = 'finished') AND emp_id = $emp_id AND production_id is not null) GROUP BY production_id
)

SELECT JSON_ARRAYAGG(JSON_OBJECT(
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
inner join paused_summary on qr.qr_work_id = paused_summary.qr_work_id
 WHERE   work_sts = 'paused'     GROUP BY qr.work_sts";
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


//  $sql_finished_entries = "SELECT  date_time_only(qr.start_time) as start_time,date_time_only(qr.end_time) as end_time,qr.production_id,qr.qr_work_id 
// FROM  qr_work_entry qr 
// WHERE   qr.work_done_id = $work_done_id and qr.work_sts  =  'finished' ";


$sql_finished_entries = "WITH qr_summary_wob as (SELECT wd.work_id,wd.start_date,wd.end_date, qr_work_entry.qr_work_id,qr_work_entry.emp_id, qr_work_entry.start_time, qr_work_entry.end_time,qr_work_entry.free_time,qr_work_entry.production_id,qr_work_entry.reason,qr_work_entry.work_sts,
JSON_ARRAYAGG(JSON_OBJECT('part_id',work_process.part_id,'qty',work_process.qty,'work_time_per_unit',work_process.work_time_per_unit,'total_time',work_process.qty * work_process.work_time_per_unit,'process_id',work_process.process_id,'process_name',jaysan_process.process_name,'part_name',parts_tbl.part_name)) as process_data,

sum(work_process.qty * work_process.work_time_per_unit) as total_process_time,

time_diff(qr_work_entry.start_time,qr_work_entry.end_time,'minute') as total_time,
COUNT(work_process.process_id) as total_processes,
pv.worked_process_data,
if(pv.production_id>0,JSON_OBJECT('worked_process_data',pv.worked_process_data,'process_total_time',pv.process_total_time,'process_total_time',pv.process_total_time,'production_entry_data',pv.production_entry_data,'total_free_time',pv.total_free_time,'total_proess_count',pv.total_proess_count,'total_qr_work_time',pv.total_qr_work_time,'total_work_count',pv.total_work_count),null) as production_data


FROM qr_work_entry

    left join work_process on qr_work_entry.qr_work_id = work_process.current_work_id

    left join process_wel_tbl on work_process.process_id = process_wel_tbl.process_id
    left join jaysan_process on process_wel_tbl.process = jaysan_process.process_id
    LEFT join parts_tbl on work_process.part_id = parts_tbl.part_id

    left join production_details_view pv on qr_work_entry.production_id = pv.production_id
    inner join work_done_table wd on qr_work_entry.work_done_id = wd.work_id
    WHERE
   qr_work_entry.work_done_id  = $work_done_id and qr_work_entry.work_sts = 'finished'  group by qr_work_entry.qr_work_id),
    qr_summary as ( SELECT qr_summary_wob.*,JSON_ARRAYAGG(JSON_OBJECT('break_time',work_break.break_time,'ext_id',work_break.ext_id,'ex_name',extra_time_master.ex_name)) as break_data,

sum(work_break.break_time) as total_break_time from  qr_summary_wob
  left join work_break on qr_summary_wob.qr_work_id = work_break.current_work_id
   left join extra_time_master on work_break.ext_id = extra_time_master.ext_id GROUP BY qr_summary_wob.qr_work_id
  )
SELECT  qr_summary.*, ap.dated,ap.emergency_order,ap.chasis_no FROM qr_summary 
left  join machine_production_taken mpt on qr_summary.production_id = mpt.production_id
left join assign_product ap on mpt.ass_id = ap.ass_id ";

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


