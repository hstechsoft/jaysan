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
  $total_work_duration_minutes = 0;
  $total_break_duration_minutes = 0;
  $totalMinutes = 0;
// if production_id > 0 all time for that production 
// if production id is above 0 then its qr work now there is no break time so we calculate all time as work time
if($production_id > 0 && $production_id != 'NULL') {
    $sql_get_all_qr_time = "SELECT JSON_ARRAYAGG(JSON_OBJECT('start_time',start_time,'end_time',ifnull(end_time, now()),'duration_minutes', TIMESTAMPDIFF(MINUTE, start_time, IFNULL(end_time, NOW())),'work_sts', work_sts)) AS qr_time_array, sum(TIMESTAMPDIFF(MINUTE, start_time, IFNULL(end_time, NOW()))) AS total_duration_minutes

FROM qr_work_entry 
WHERE production_id = $production_id;";

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
         $start = new DateTime($break_time['start_time']);
    $end = new DateTime($break_time['end_time']);

    $interval = $start->diff($end);

    $minutes = ($interval->h * 60) + $interval->i + ($interval->s / 60);
    $total_break_duration_minutes += $minutes;
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

$total_work_duration_minutes = $totalMinutes - $total_break_duration_minutes;
$result_json['total_work_minutes'] = $total_work_duration_minutes;
$result_json['total_break_minutes'] = $total_break_duration_minutes;

    }

// now we have total work time ,total break time, total time
// check there enough bom stock for the process part
$stock_zero_count = 0;
$stcok_zero_array = [];
foreach($process_part_array as $process_part) {
  
    $required_qty = $process_part['required_qty'];
    $process_id = $process_part['process_id'];
    $machine_id = $process_part['machine_id'];
    $sql_check_stock = "SELECT concat(ifnull(jpre_process.process_name, ''), ' -> ', pt.part_name) as part_name, ifnull(SUM(js.qty), 0) as total_stock_qty, wtm.min_time,wtm.max_time, js.godown,js.dep,js.sec, pwt.process_id,iwp.input_part_id,iwp.previous_process_id,iwp.qty,jp.process_name as inprocess FROM process_wel_tbl pwt 
inner join input_wel_parts iwp on iwp.process_id = pwt.process_id
inner join parts_tbl pt on pt.part_id = iwp.input_part_id
inner join jaysan_process jp on jp.process_id = pwt.process
left join jaysan_stock js on iwp.previous_process_id = ifnull(js.process_id,0) and iwp.input_part_id = js.part_id and js.godown = $godown_id and js.dep = $dep_id  
left join work_time_master wtm on wtm.ori_process_id = pwt.process_id and wtm.machine_id = $machine_id
left join jaysan_process jpre_process on jpre_process.process_id = iwp.previous_process_id
 WHERE pwt.process_id = $process_id  GROUP BY iwp.input_part_id";

    $result_check_stock = $conn->query($sql_check_stock);
    if ($result_check_stock->num_rows > 0) {

      
        while($row = $result_check_stock->fetch_assoc()){
          
            $consume_qty = $row['qty'] * $required_qty;
            $remaining = $row['total_stock_qty'] - $consume_qty;
 

        if($remaining < 0) {
            $stock_zero_count++;
$stcok_zero_array[] = [
    "process_name" => $row['inprocess'],
    "part_name" => $row['part_name'],
    "part_id" => $row['input_part_id'],
    "required_qty" => $consume_qty,
    "available_qty" => $row['total_stock_qty']
];
            
        }

        }
    } else {
        $stock_zero_count++;
        $stcok_zero_array[] = [
    "process_name" => $row['inprocess'],
    "part_name" => $row['part_name'],
    "part_id" => $row['input_part_id'],
    "required_qty" => $consume_qty,
    "available_qty" => 0
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

$total_min_time = 0;
$total_max_time = 0;
$free_time = 0;
$process_time_array = [];
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
        "max_time" => $row['max_time']
    ];
   
    $total_min_time += $row['min_time'] * $required_qty;
    $total_max_time += $row['max_time'] * $required_qty;
}
else {
    
    $result_json['message'] = "No time information found for process ID: $process_id.";
    echo json_encode($result_json);
    $conn->close();
    exit; 
}

if($total_work_duration_minutes < $total_min_time) {
    

    $result_json['message'] = "Total work duration is less than the minimum required time for the processes. Total work duration: $total_work_duration_minutes minutes, Minimum required time: $total_min_time minutes.";
    echo json_encode($result_json);
    $conn->close();
    exit; 
}
    $work_array = [];
    $current_process_work_time = 0;
if($total_work_duration_minutes > $total_max_time) {
    // now total work time greater then max time so we assigin process time as max time and calulate extra time as total work time - max time
    
    $free_time = $total_work_duration_minutes - $total_max_time;

    foreach($process_time_array as $process_time) {
    //  insert into work_process
    $pr_id = $process_time['process_id'];
    $pr_time = $process_time['max_time'];
    $required_qty1 = $process_time['required_qty'];
    $current_process_work_time += $pr_time * $required_qty1;
    // get process_name 
    $sql_process_name = "SELECT process_name,$pr_time FROM process_wel_tbl inner join jaysan_process on process_wel_tbl.process = jaysan_process.process_id WHERE process_wel_tbl.process_id = $pr_id";
    $result_process_name = $conn->query($sql_process_name);
    if ($result_process_name->num_rows > 0) {
      $work_array[] = [
          "process_id" => $pr_id,
          "process_name" => $result_process_name->fetch_assoc()['process_name'],
          "process_time" => $pr_time * $required_qty1
      ];
    }
    
    $result_json['free_time'] = $free_time;
    $result_json['work_status'] = "excess_time";
    $result_json['work_array'] = $work_array;


 


}
}
else if ($total_work_duration_minutes >= $total_min_time && $total_work_duration_minutes <= $total_max_time) {
    // this is correct on time  so we sum all min time and that time we reduce from total work time then we calulate excess time and distubute to all process
    $excess_time = $total_work_duration_minutes - $total_min_time;
    $time_to_distribute = $excess_time/count($process_time_array);
    foreach($process_time_array as $process_time) {
        //  insert into work_process
        $pr_id = $process_time['process_id'];
        $pr_time = $process_time['min_time'] + $time_to_distribute;
         $sql_process_name = "SELECT process_name,$pr_time FROM process_wel_tbl inner join jaysan_process on process_wel_tbl.process = jaysan_process.process_id WHERE process_wel_tbl.process_id = $pr_id";
    $result_process_name = $conn->query($sql_process_name);
    if ($result_process_name->num_rows > 0) {
      $work_array[] = [
          "process_id" => $pr_id,
          "process_name" => $result_process_name->fetch_assoc()['process_name'],
          "process_time" => $pr_time
      ];
    }
    
    $result_json['free_time'] = 0;
    $result_json['work_status'] = "on_time";
    $result_json['work_array'] = $work_array;

     
    }
}
}

// get inserted entry
$sql_report = "WITH qr_summary as (SELECT qr_work_entry.qr_work_id,qr_work_entry.emp_id, qr_work_entry.start_time, qr_work_entry.end_time,qr_work_entry.free_time,qr_work_entry.production_id,qr_work_entry.reason,qr_work_entry.work_sts,
JSON_ARRAYAGG(JSON_OBJECT('part_id',work_process.part_id,'qty',work_process.qty,'work_time_per_unit',work_process.work_time_per_unit,'total_time',work_process.qty * work_process.work_time_per_unit,'process_id',work_process.process_id,'process_name',jaysan_process.process_name,'part_name',parts_tbl.part_name)) as process_data,
JSON_ARRAYAGG(JSON_OBJECT('break_time',work_break.break_time,'ext_id',work_break.ext_id,'ex_name',extra_time_master.ex_name)) as break_data,
sum(work_process.qty * work_process.work_time_per_unit) as total_process_time,
sum(work_break.break_time) as total_break_time,
TIMESTAMPDIFF(MINUTE,qr_work_entry.start_time,qr_work_entry.end_time) as total_time,
COUNT(work_process.process_id) as total_processes,
pv.worked_process_data,
if(pv.production_id>0,JSON_OBJECT('worked_process_data',pv.worked_process_data,'process_total_time',pv.process_total_time,'process_total_time',pv.process_total_time,'production_entry_data',pv.production_entry_data,'total_free_time',pv.total_free_time,'total_proess_count',pv.total_proess_count,'total_qr_work_time',pv.total_qr_work_time,'total_work_count',pv.total_work_count),null) as production_data


FROM qr_work_entry

    left join work_process on qr_work_entry.qr_work_id = work_process.current_work_id
    left join work_break on qr_work_entry.qr_work_id = work_break.current_work_id
    left join process_wel_tbl on work_process.process_id = process_wel_tbl.process_id
    left join jaysan_process on process_wel_tbl.process = jaysan_process.process_id
    LEFT join parts_tbl on work_process.part_id = parts_tbl.part_id
    left join extra_time_master on work_break.ext_id = extra_time_master.ext_id
    left join production_details_view pv on qr_work_entry.production_id = pv.production_id
    WHERE
   qr_work_entry.work_done_id = $work_done_id group by qr_work_entry.qr_work_id)
SELECT qr_work_id, emp_id, start_time, end_time, free_time, qr_summary.production_id, reason, work_sts, if(qr_summary.production_id>0,worked_process_data,process_data) as process_data, if(qr_summary.production_id>0,null,break_data) as break_data, total_process_time, total_break_time, total_time, total_processes,production_data, if(ap.ass_id>0, JSON_OBJECT('dated',ap.dated,'emergency_order',ap.emergency_order,'chasis_no',ap.chasis_no), null) as assign_product_data FROM qr_summary 
left  join machine_production_taken mpt on qr_summary.production_id = mpt.production_id
left join assign_product ap on mpt.ass_id = ap.ass_id";
$result_report = $conn->query($sql_report);
    $rows = array();
    $total_process_entry_time = 0;
    $total_break_entry_time = 0;
    $tpt = 0;
if ($result_report->num_rows > 0) {
    while($row = $result_report->fetch_assoc()) {
        $rows[] = $row;
        $total_process_entry_time += $row['total_time'];
        $total_break_entry_time += $row['total_break_time'];
        $tpt += $row['total_process_time'];
    }
}

$result_json['report'] = $rows;

  
$total_wtime = $total_process_entry_time + $totalMinutes;
$total_btime = $total_break_entry_time + $total_break_duration_minutes;

$actual_work_time = $total_wtime - $total_btime;

$result_json['total_entry_time'] = $total_process_entry_time;
$result_json['total_current_work_time'] = $total_work_duration_minutes;
$result_json['total_break_entry_time'] = $total_break_entry_time;
$result_json['total_current_break_time'] = $total_break_duration_minutes;
$result_json['total_work_time_both'] = $total_wtime;
$result_json['total_break_time_both'] = $total_btime;
$result_json['total_process_entry_time'] = $tpt;
$result_json['actual_work_time'] = $actual_work_time;


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
$conn->close();
 




 ?>


