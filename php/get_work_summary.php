<?php
error_reporting(0);
 include 'db_head.php';
$emp_id = test_input($_POST['emp_id']);
$qr_work_id = test_input($_POST['qr_work_id']) ;
$break_time_array = json_decode($_POST['break_time_array'], true);
$godown_id = test_input($_POST['godown_id']);
$process_part_array = json_decode($_POST['process_part_array'], true);
$dep_id = test_input($_POST['dep_id']);
$sec_id = test_input($_POST['sec_id']);

if($qr_work_id == '')
{
    $qr_work_id = 0;
}


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}

$result_json = array();

$result_json['process_part_array'] = $process_part_array;
$result_json['break_time_array'] = $break_time_array;
// check break_time_array is array and not empty
if(!is_array($break_time_array) || empty($break_time_array)) {
    $break_time_array = array();
}

// check process_part_array is array and not empty
if(!is_array($process_part_array) || empty($process_part_array)) {
  $conn->close();
  $result_json['message'] = "Process part array is required and should be a non-empty array.";
   echo json_encode($result_json);
    exit;
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

$production_id = 'NULL';
// if qr_work_id is not null then get current sts 
if($qr_work_id > 0) {
$sql_get_sts_qr = "SELECT production_id from qr_work_entry where qr_work_id = $qr_work_id and production_id is not null and work_sts = 'in-process'";
$result_qr_sts = $conn->query($sql_get_sts_qr);
if ($result_qr_sts->num_rows > 0) {
   $production_id = $result_qr_sts->fetch_assoc()['production_id'];
} else {
   $result_json['message'] = "No active work entry found for the given QR work ID.";
   echo json_encode($result_json);
   $conn->close();
   exit;
}
}
else{
    // qr id not there so this is normal work before that is ther any qr work in process
$sql_get_sts_qr = "SELECT 1 from qr_work_entry where work_done_id = $work_done_id and production_id is not null and work_sts = 'in-process'   order by qr_work_id desc limit 1";
$result_qr_sts = $conn->query($sql_get_sts_qr);
if ($result_qr_sts->num_rows > 0) {
    $result_json['message'] = "There is an active QR work entry for this work done ID. Please complete that work entry before submitting this work.";
    echo json_encode($result_json);
    $conn->close();
    exit;
}
}
  $total_work_duration_minutes = 0;
  $total_break_duration_minutes = 0;
// if production_id > 0 all time for that production 
if($production_id > 0 && $production_id != 'NULL') {
    $sql_get_all_qr_time = "SELECT start_time, ifnull(end_time, now()) as end_time,sum(TIMESTAMPDIFF(MINUTE, start_time, IFNULL(end_time, NOW()))) AS total_duration_minutes

FROM qr_work_entry 
WHERE production_id = $production_id and work_done_id = $work_done_id;";
$result_json['sql_get_all_qr_time'] = $sql_get_all_qr_time;
$result_json['production_id'] = $production_id;
    $result_qr_time = $conn->query($sql_get_all_qr_time);
  
    if ($result_qr_time->num_rows > 0) {
        while($row = $result_qr_time->fetch_assoc()) {
    
            $total_work_duration_minutes = $row['total_duration_minutes']; // Convert minutes to seconds
        }
    }
    $result_json['total_minutes'] = $total_work_duration_minutes; // Convert back to seconds
  
}
// qr_work_id not available so calculate break time from break_time_array 
else
    {
      
if(count($break_time_array) > 0) {
    foreach($break_time_array as $break_time) {
    $mins = $break_time['break_minutes'];
    $total_break_duration_minutes += $mins;
    }
}

$total_qr_time = 0;
// get all production entry where start time greater than current_process_start_time and end time is null or end time less than now and sum total process time and break time for those entry and add to total_work_duration_minutes and total_break_duration_minutes
$sql_get_production_entry_time = "SELECT sum(TIMESTAMPDIFF(MINUTE, start_time, end_time)) AS total_qr_time FROM qr_work_entry WHERE production_id > 0 and start_time >= '$current_process_start_time' and end_time <= now() and end_time is not null and work_done_id = $work_done_id";
$result_production_entry_time = $conn->query($sql_get_production_entry_time);
if ($result_production_entry_time->num_rows > 0) {
    while($row = $result_production_entry_time->fetch_assoc()) {
        $total_qr_time += $row['total_qr_time']; // Convert minutes to seconds
    }
}

// calcaulate total work time with break
$day_start =  new DateTime($current_process_start_time);
$now = new DateTime();
$result_json['current_process_start_time'] = $current_process_start_time;
$result_json['now'] = $now->format('Y-m-d H:i:s');
$result_json['time_zone'] = date_default_timezone_get();
$interval = $day_start->diff($now);

$totalMinutes = ($interval->days * 24 * 60) + ($interval->h * 60) + $interval->i + ($interval->s / 60);

$result_json['total_minutes'] = $totalMinutes;

$total_work_duration_minutes = $totalMinutes - ($total_break_duration_minutes + $total_qr_time);
$result_json['total_work_minutes'] = $total_work_duration_minutes;
$result_json['total_break_minutes'] = $total_break_duration_minutes;

    }
$consumption = [];
$stock_zero_count = 0;
$stcok_zero_array = [];

// check there enough bom stock for the process part
foreach($process_part_array as $process_part) {
  
    $required_qty = $process_part['required_qty'];
    $process_id = $process_part['process_id'];
    $machine_id = $process_part['machine_id'];
    $part_id = $process_part['part_id'];
    $sql_check_stock = "SELECT ifnull(SUM(js.qty), 0) as total_stock_qty, pt.part_name,wtm.min_time,wtm.max_time, js.godown,js.dep,js.sec, pwt.process_id,if(iwp.input_part_id = 0,$part_id,iwp.input_part_id) as input_part_id,iwp.previous_process_id,iwp.qty,jp.process_name as inprocess,jp_in.process_name as pre_process FROM process_wel_tbl pwt 
inner join input_wel_parts iwp on iwp.process_id = pwt.process_id
inner join jaysan_process jp on jp.process_id = pwt.process
left join parts_tbl pt on pt.part_id = if(iwp.input_part_id = 0,$part_id,iwp.input_part_id)
left join process_wel_tbl pwti on pwti.process_id = iwp.previous_process_id
left join jaysan_process jp_in on jp_in.process_id = pwti.process
left join jaysan_stock js on iwp.previous_process_id = ifnull(js.process_id,0) and if(iwp.input_part_id = 0,$part_id,iwp.input_part_id) = js.part_id and js.godown = $godown_id and js.dep = $dep_id  
left join work_time_master wtm on wtm.ori_process_id = pwt.process_id and wtm.machine_id = $machine_id
 WHERE pwt.process_id = $process_id  GROUP BY iwp.input_part_id";

    $result_check_stock = $conn->query($sql_check_stock);
    if ($result_check_stock->num_rows > 0) {

      
        while($row = $result_check_stock->fetch_assoc()){
          
            $consume_qty = $row['qty'] * $required_qty;
            $remaining = $row['total_stock_qty'] - $consume_qty;
       $consumption[] = [
        "part_id" => $row['input_part_id'],
        "previous_process_id" => $row['previous_process_id'],
        "qty" => $consume_qty,
       
    ];

              if($remaining < 0) {
            $stock_zero_count++;
$stcok_zero_array[] = [
    "process_name" => $row['pre_process'],
    "part_name" => $row['part_name'],
    "part_id" => $row['input_part_id'],
    "required_qty" => $consume_qty,
    "available_qty" => $row['total_stock_qty'],
    "previous_process_id" => $row['previous_process_id']
];
            
        }

        }


    } else {
        $stock_zero_count++;
        $stcok_zero_array[] = [
    "process_name" => $row['pre_process'],
    "part_name" => $row['part_name'],
    "part_id" => $row['input_part_id'],
    "required_qty" => $consume_qty,
    "available_qty" => 0,
    "previous_process_id" => $row['previous_process_id']
];
       
    }
}

if($stock_zero_count > 0) {
    $result_json['message'] = "Insufficient stock for some parts.";
    $result_json['stock_issue'] = $stcok_zero_array;
    echo json_encode($result_json);
    $conn->close();
    exit;
}

    try{
$conn->begin_transaction();
// get min and max time for the process and multiply with required qty then reduce total_work_duration_minutes
$total_min_time = 0;
$total_max_time = 0;
$free_time = 0;
$process_time_array = [];
$current_work_id = 0;

if($qr_work_id > 0) {
    $current_work_id = $qr_work_id;
    $sql_update_qr_work_entry = "UPDATE qr_work_entry SET end_time = NOW(), work_sts = 'finished' WHERE qr_work_id = $qr_work_id";
    if ($conn->query($sql_update_qr_work_entry) !== TRUE) {
        $conn->rollback();
        $result_json['message'] = "Error updating QR work entry: " . $conn->error;
        echo json_encode($result_json);
        $conn->close();
        exit; 
    }
}
else {
    // insert new entry in qr_work_entry with work sts as finished and end time as now
   
    $sql_insert_qr_work_entry = "INSERT INTO qr_work_entry (emp_id, production_id, sec_id, work_done_id, work_sts, start_time, end_time) VALUES ($emp_id, $production_id, $sec_id, $work_done_id, 'finished', '$current_process_start_time', NOW())";
      if ($conn->query($sql_insert_qr_work_entry) === TRUE) {
           $current_work_id = $conn->insert_id;
           $result_json['current_work_id'] = $current_work_id;
      }
   else {
        $conn->rollback();
        $result_json['message'] = "Error inserting QR work entry: " . $conn->error;
        echo json_encode($result_json);
        $conn->close();
        exit; 
    }
    
}


foreach($process_part_array as $process_part) {
    $process_id = $process_part['process_id'];
     $required_qty = $process_part['required_qty'];
     $machine_id = $process_part['machine_id'];
   
$get_proess_time_sql = "SELECT min_time, max_time FROM work_time_master WHERE ori_process_id = $process_id and machine_id = $machine_id";

$result_process_time = $conn->query($get_proess_time_sql);
if ($result_process_time->num_rows > 0) {
     $row = $result_process_time->fetch_assoc();
    $process_time_array[] = [
        "process_id" => $process_id,
        "min_time" => $row['min_time'],
        "max_time" => $row['max_time'],
        "required_qty" => $required_qty
    ];
   
    $total_min_time += $row['min_time'] * $required_qty;
    $total_max_time += $row['max_time'] * $required_qty;
}
else {
    $conn->rollback();
    $result_json['message'] = "No time information found for process ID: $process_id.";
    echo json_encode($result_json);
    $conn->close();
    exit; 
}

if($total_work_duration_minutes < $total_min_time) {
    $conn->rollback();

    $result_json['message'] = "Total work duration is less than the minimum required time for the processes. Total work duration: $total_work_duration_minutes minutes, Minimum required time: $total_min_time minutes.";
    echo json_encode($result_json);
    $conn->close();
    exit; 
}
if($total_work_duration_minutes > $total_max_time) {
    // now total work time greater then max time so we assigin process time as max time and calulate extra time as total work time - max time
    
    $free_time = $total_work_duration_minutes - $total_max_time;
    $result_json['process_time_array'] = $process_time_array;
    foreach($process_time_array as $process_time) {
    //  insert into work_process
    $pr_id = $process_time['process_id'];
    $pr_time = $process_time['max_time'];
    $required_qty1 = $process_time['required_qty'];
    $insert_work_process_sql = "INSERT INTO work_process (work_id, process_id, work_time_per_unit,qty,current_work_id) VALUES ($work_done_id,$pr_id, $pr_time, $required_qty1, $current_work_id)";
    if ($conn->query($insert_work_process_sql) !== TRUE) {
        $conn->rollback();
        $result_json['message'] = "Error inserting work process: " . $conn->error;
        echo json_encode($result_json);
        $conn->close();
        exit; 

    }
}
}
else if ($total_work_duration_minutes >= $total_min_time && $total_work_duration_minutes <= $total_max_time) {
    // this is correct on time  so we sum all min time and that time we reduce from total work time then we calulate excess time and distubute to all process
    $excess_time = $total_work_duration_minutes - $total_min_time;
    $time_to_distribute = $excess_time/count($process_time_array);
    $result_json['process_time_array'] = $process_time_array;
    foreach($process_time_array as $process_time) {
        //  insert into work_process
        $pr_id = $process_time['process_id'];
        $pr_time = $process_time['min_time'] + $time_to_distribute;
        $required_qty1 = $process_time['required_qty'];
        $insert_work_process_sql = "INSERT INTO work_process (work_id, process_id, work_time_per_unit, qty, current_work_id) VALUES ($work_done_id,$pr_id, $pr_time, $required_qty1, $current_work_id)";
        if ($conn->query($insert_work_process_sql) !== TRUE) {
            $conn->rollback();
            $result_json['message'] = "Error inserting work process: " . $conn->error;
            echo json_encode($result_json);
            $conn->close();
            exit; 
        }

     
    }
}
}


if($production_id > 0 && $production_id != 'NULL')
    {
$sql_get_time = "with work_details as (SELECT
    qr_work_entry.*,
    work_process.qty,
    work_process.work_time_per_unit,
    sum(
        work_process.qty * work_process.work_time_per_unit
    ) as total_process_time,
    TIMESTAMPDIFF(
        MINUTE,
        qr_work_entry.start_time,
        qr_work_entry.end_time
    ) as process_duration
 
FROM qr_work_entry
    left join work_process on qr_work_entry.qr_work_id = work_process.current_work_id
WHERE
    production_id = $production_id
GROUP BY
    qr_work_entry.qr_work_id),
    summary as(SELECT work_details.*,
    sum(total_process_time) over (PARTITION BY production_id) as cumulative_process_time,
    sum(process_duration) over (ORDER  BY qr_work_id) as running_process_time
     FROM work_details ORDER BY qr_work_id),

    summary1 as(SELECT summary.*,cumulative_process_time-(running_process_time-process_duration) as ftf FROM summary)
     SELECT summary1.qr_work_id,if(ftf > 0, if(cumulative_process_time - running_process_time > 0 ,0,  running_process_time - cumulative_process_time),process_duration) as free_time FROM summary1";
$result_time = $conn->query($sql_get_time);
if ($result_time->num_rows > 0) {
    while($row = $result_time->fetch_assoc()) {
        $qr_id = $row['qr_work_id'];
        $free_time = $row['free_time'];
        if($free_time < 0) {
            $free_time = 0;
        }
        $sql_update_free_time = "update qr_work_entry set free_time = $free_time where qr_work_id = $qr_id";
        if ($conn->query($sql_update_free_time) !== TRUE) {
            $conn->rollback();
            $result_json['message'] = "Error updating free time: " . $conn->error;
            echo json_encode($result_json);
            $conn->close();
            exit; 
        }
    }
}
    }
    else
        {
$sql_get_time = "  SELECT  TIMESTAMPDIFF(
        MINUTE,
        qr_work_entry.start_time,
        qr_work_entry.end_time
    ) as process_duration,qr_work_entry.qr_work_id,
    sum(work_time_per_unit*qty) as total_work_time, 
    if(TIMESTAMPDIFF(
        MINUTE,
        qr_work_entry.start_time,
        qr_work_entry.end_time
    ) - sum(work_time_per_unit*qty) > 0,  (TIMESTAMPDIFF(
        MINUTE,
        qr_work_entry.start_time,
        qr_work_entry.end_time
    ) ) - sum(work_time_per_unit*qty), 0 ) as free_time ,(SELECT sum(TIMESTAMPDIFF(MINUTE, qr1.start_time, qr1.end_time)) FROM qr_work_entry qr1 WHERE  work_done_id = $work_done_id and production_id >  0 and qr1.end_time is not null and qr1.start_time >= qr_work_entry.start_time and qr1.end_time <= qr_work_entry.end_time) as total_qr_time FROM qr_work_entry 
     LEFT join work_process on qr_work_entry.qr_work_id = work_process.current_work_id
     WHERE qr_work_id = $current_work_id group by qr_work_entry.qr_work_id";
$result_time = $conn->query($sql_get_time);
if ($result_time->num_rows > 0) {
    while($row = $result_time->fetch_assoc()) {
        $qr_id = $row['qr_work_id'];
        $free_time = $row['free_time'] - ($row['total_qr_time'] + $total_break_duration_minutes);
        $result_json['free_time_cal'] = $row['free_time']. "-" . ($row['total_qr_time'] . " - " . $total_break_duration_minutes);
        if($free_time < 0) {
            $free_time = 0;
        }
        $sql_update_free_time = "update qr_work_entry set free_time = $free_time where qr_work_id = $qr_id";
        if ($conn->query($sql_update_free_time) !== TRUE) {
            $conn->rollback();
            $result_json['message'] = "Error updating free time: " . $conn->error;
            echo json_encode($result_json);
            $conn->close();
            exit; 
        }
    }
}


        }

// update or insert qr_work_entry with end time and work sts as completed for the given qr_work_id


// bom stock check  done. now reduce bom input and add output to stock based on process_part_array and process_id




    // insert breaks 
    if($production_id > 0)
        {
    foreach($break_time_array as $break_time) {
       $break_miutes = $break_time['break_minutes'];
        $break_id = $break_time['break_id'] ?? 'NULL';
        $sql_insert_break = "INSERT INTO work_break (ext_id, break_time, current_work_id,work_id) VALUES ($break_id, $break_miutes, $current_work_id, $work_done_id)";
            if ($conn->query($sql_insert_break) !== TRUE) {
            $conn->rollback();
            $result_json['message'] = "Error updating free time: " . $conn->error;
            echo json_encode($result_json);
            $conn->close();
            exit; 
        }
      
    }
        }




   
    $result_json['message'] = "Work done entry and stock updates successful.";
    
    }

     catch(Exception $e) {
        $conn->rollback();
        $result_json['message'] = "Transaction failed: " . $e->getMessage();
        echo json_encode($result_json);
        $conn->close();
        exit;
    }

    
    $total_qr_time = 0;

    $sql_get_production_entry_time = "SELECT sum(TIMESTAMPDIFF(MINUTE, start_time, end_time)) AS total_qr_time FROM qr_work_entry WHERE production_id > 0 and start_time >= '$current_process_start_time' and end_time <= now() and end_time is not null and work_done_id = $work_done_id";
$result_production_entry_time = $conn->query($sql_get_production_entry_time);
if ($result_production_entry_time->num_rows > 0) {
    while($row = $result_production_entry_time->fetch_assoc()) {
        $total_qr_time += $row['total_qr_time']; // Convert minutes to seconds
    }
}
$result_json['total_qr_time'] = $total_qr_time;


// get inserted entry
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

$result_json['message'] = "success";
http_response_code(200);
echo json_encode($result_json);

 
 $conn->rollback();

$conn->close();

 ?>


