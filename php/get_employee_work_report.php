<?php
 include 'db_head.php';

 $emp_id = test_input($_GET['emp_id']);
 $start_time = test_input($_GET['start_time']);
 $end_time = test_input($_GET['end_time']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}




 $sql = "WITH qr_summary_wob as (SELECT wd.work_id,wd.start_date,wd.end_date, qr_work_entry.qr_work_id,qr_work_entry.emp_id, qr_work_entry.start_time, qr_work_entry.end_time,qr_work_entry.free_time,qr_work_entry.production_id,qr_work_entry.reason,qr_work_entry.work_sts,
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
   qr_work_entry.work_done_id in (select work_id from work_done_table where emp_id = $emp_id and start_date >= '$start_time' and (end_date <= '$end_time' or end_date is null) group by qr_work_entry.qr_work_id)  group by qr_work_entry.qr_work_id),
    qr_summary as ( SELECT qr_summary_wob.*,JSON_ARRAYAGG(JSON_OBJECT('break_time',work_break.break_time,'ext_id',work_break.ext_id,'ex_name',extra_time_master.ex_name)) as break_data,

sum(work_break.break_time) as total_break_time from  qr_summary_wob
  left join work_break on qr_summary_wob.qr_work_id = work_break.current_work_id
   left join extra_time_master on work_break.ext_id = extra_time_master.ext_id GROUP BY qr_summary_wob.qr_work_id
  )
SELECT work_id,start_date, end_date,TIMESTAMPDIFF(MINUTE, start_date, end_date) as total_work_duration,sum(free_time) as total_free_time,sum(total_time) as total_work_time,sum(total_process_time) as total_process_time,sum(total_break_time) as total_break_time,sum(total_processes) as total_process_count, JSON_ARRAYAGG(JSON_OBJECT('qr_work_id', qr_work_id, 'emp_id', emp_id, 'start_time', start_time, 'end_time', end_time, 'free_time', free_time, 'production_id', qr_summary.production_id, 'reason', reason, 'work_sts', work_sts, 'process_data', if(qr_summary.production_id>0,worked_process_data,process_data), 'break_data', if(qr_summary.production_id>0,null,break_data), 'total_process_time', total_process_time, 'total_break_time', total_break_time, 'total_time', total_time, 'total_processes', total_processes, 'production_data', production_data, 'assign_product_data', if(ap.ass_id>0, JSON_OBJECT('dated',ap.dated,'emergency_order',ap.emergency_order,'chasis_no',ap.chasis_no), null))) as detailed_data  FROM qr_summary 
left  join machine_production_taken mpt on qr_summary.production_id = mpt.production_id
left join assign_product ap on mpt.ass_id = ap.ass_id GROUP BY work_id";

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

