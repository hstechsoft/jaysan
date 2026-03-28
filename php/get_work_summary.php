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
$total_process_entry_time = 0;
$total_break_entry_time = 0;

 $sql_finished_entries = "SELECT  date_time_only(qr.start_time) as start_time,date_time_only(qr.end_time) as end_time,qr.production_id,qr.qr_work_id,TIMESTAMPDIFF(MINUTE, qr.start_time, qr.end_time) AS time_diff_minutes 
FROM  qr_work_entry qr 
WHERE   qr.work_done_id = $work_done_id and qr.work_sts  =  'finished' ";

$result_finished_entries = $conn->query($sql_finished_entries);

if ($result_finished_entries->num_rows > 0) {
    $rows = array();
    $rows1 = array();
    while($r = mysqli_fetch_assoc($result_finished_entries)) {
        
        
   


        $rows[] = $r;
         $total_process_entry_time += $r['time_diff_minutes'];
    }
    $result_json['finished_work_entries'] = $rows;

    
} else {
 $result_json['finished_work_entries'] = [];
   
}

// get total break time entered
$sql_break_entries = "SELECT  sum(break_time) as total_break_time
FROM  work_break
WHERE   work_done_id = $work_done_id";
$result_break_entries = $conn->query($sql_break_entries);
if ($result_break_entries->num_rows > 0) {
    $row = $result_break_entries->fetch_assoc();
    $total_break_entry_time = $row['total_break_time'];
}






// get full process entered in work process table
$tpt = 0;
$sql_get_work_process = "SELECT   wp.qty,wp.process_id,wp.work_time_per_unit,p.process_name,pt.part_name FROM work_process wp 
left join parts_tbl pt on pt.part_id = wp.part_id
left join process_wel_tbl pwt on pwt.process_id = wp.process_id
left join jaysan_process p on p.process_id = pwt.process
 where wp.work_id = $work_done_id";
$result_work_process = $conn->query($sql_get_work_process);
if ($result_work_process->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result_work_process)) {
        $rows[] = $r;
        $tpt += $r['work_time_per_unit'] * $r['qty'];
    }
    $result_json['work_process'] = $rows;
    
} else {
 $result_json['work_process'] = [];
   
}
 

  
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


