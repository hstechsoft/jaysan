<?php
 include 'db_head.php';

$emp_id = test_input($_GET['emp_id']);

$result_json = array();
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}
require __DIR__ . '/get_current_work_info.php';
$curent_work_info = current_info($conn, $emp_id);

if(!$curent_work_info['start_time']) {
     $conn->close();
    $result_json['message'] = "No active work found for the employee.";
    echo json_encode($result_json);
    exit;
}

$work_done_id = $curent_work_info['work_done_id'];
$day_start_time = $curent_work_info['day_start_time'];
$current_process_start_time = $curent_work_info['start_time'];
$result_json['current_work_info'] = $curent_work_info;

    $total_qr_time = 0;

    $sql_get_production_entry_time = "SELECT sum(TIMESTAMPDIFF(MINUTE, start_time, end_time)) AS total_qr_time FROM qr_work_entry WHERE production_id > 0 and start_time >= '$current_process_start_time' and end_time <= now() and end_time is not null and work_done_id = $work_done_id";
$result_production_entry_time = $conn->query($sql_get_production_entry_time);
if ($result_production_entry_time->num_rows > 0) {
    while($row = $result_production_entry_time->fetch_assoc()) {
        $total_qr_time += $row['total_qr_time']; // Convert minutes to seconds
    }
}
$result_json['total_qr_time'] = $total_qr_time;

$sql_report = "WITH qr_summary_wob as (SELECT wd.start_date,wd.end_date,qr_work_entry.qr_work_id,qr_work_entry.emp_id, qr_work_entry.start_time, qr_work_entry.end_time,qr_work_entry.free_time,qr_work_entry.production_id,qr_work_entry.reason,qr_work_entry.work_sts,
JSON_ARRAYAGG(JSON_OBJECT('part_id',work_process.part_id,'qty',work_process.qty,'work_time_per_unit',work_process.work_time_per_unit,'total_time',work_process.qty * work_process.work_time_per_unit,'process_id',work_process.process_id,'process_name',jaysan_process.process_name,'part_name',parts_tbl.part_name)) as process_data,

sum(work_process.qty * work_process.work_time_per_unit) as total_process_time,

TIMESTAMPDIFF(MINUTE,qr_work_entry.start_time,qr_work_entry.end_time) as total_time,
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
   qr_work_entry.work_done_id = $work_done_id group by qr_work_entry.qr_work_id),
 qr_summary as ( SELECT qr_summary_wob.*,JSON_ARRAYAGG(JSON_OBJECT('break_time',work_break.break_time,'ext_id',work_break.ext_id,'ex_name',extra_time_master.ex_name)) as break_data,

sum(work_break.break_time) as total_break_time from  qr_summary_wob
  left join work_break on qr_summary_wob.qr_work_id = work_break.current_work_id
   left join extra_time_master on work_break.ext_id = extra_time_master.ext_id GROUP BY qr_summary_wob.qr_work_id
  )
SELECT qr_work_id,start_date, end_date,TIMESTAMPDIFF(MINUTE, start_date, now()) as total_work_duration, emp_id, start_time, end_time, free_time, qr_summary.production_id, reason, work_sts, if(qr_summary.production_id>0,worked_process_data,process_data) as process_data, if(qr_summary.production_id>0,null,break_data) as break_data, total_process_time, total_break_time, total_time, total_processes,production_data, if(ap.ass_id>0, JSON_OBJECT('dated',ap.dated,'emergency_order',ap.emergency_order,'chasis_no',ap.chasis_no), null) as assign_product_data FROM qr_summary 
left  join machine_production_taken mpt on qr_summary.production_id = mpt.production_id
left join assign_product ap on mpt.ass_id = ap.ass_id";
$result_report = $conn->query($sql_report);
    $rows = array();
    $total_process_entry_time = 0;
    $total_break_entry_time = 0;
    $tpt = 0;
    $total_free_time = 0;
if ($result_report->num_rows > 0) {
    while($row = $result_report->fetch_assoc()) {
        $rows[] = $row;
        $total_process_entry_time += $row['total_time'];
        $total_break_entry_time += $row['total_break_time'];
        $tpt += $row['total_process_time'];
        $total_free_time += $row['free_time'];
        $total_work_duration = $row['total_work_duration'];
    }
}

$result_json['report'] = $rows;

$total_wtime = $total_process_entry_time;
$total_btime = $total_break_entry_time ;

$actual_work_time = $total_wtime - ($total_btime + $total_qr_time);
$result_json['ref'] = 'total_time-'.$total_wtime.'-'.$total_btime.'-'.$total_qr_time;
$result_json['total_entry_time'] = $total_process_entry_time;



$result_json['total_work_time'] = $total_wtime;
$result_json['total_break_time'] = $total_btime;
$result_json['actual_work_time'] = $actual_work_time;
$result_json['total_process_entry_time'] = $tpt;

$result_json['total_free_time'] = $total_free_time;
$result_json['total_day_time'] = $total_work_duration;


if($actual_work_time < $tpt) {
    $result_json['final_status'] = "less_time ";
    $result_json['time_info'] = 0;

} else if($actual_work_time > $tpt) {
    $free_time = $actual_work_time - $tpt;
    $result_json['final_status'] = "free time";
    $result_json['time_info'] = $free_time;
} else {
    $result_json['final_status'] = "on_time";
     $result_json['time_info'] = 0;
}
print json_encode($result_json);
$conn->close();

 ?>


