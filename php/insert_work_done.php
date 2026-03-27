<?php
 include 'db_head.php';
$emp_id = test_input($_POST['emp_id']);
$qr_work_id = test_input($_POST['qr_work_id']);
$break_time_array = json_decode($_POST['break_time_array'], true);
$process_part_array = json_decode($_POST['process_part_array'], true);
$godown_id = test_input($_POST['godown_id']);
$dep_id = test_input($_POST['dep_id']);
$sec_id = test_input($_POST['sec_id']);


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

$production_id = 0;
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
// if production_id > 0 all time for that production 
if($production_id > 0) {
    $sql_get_all_qr_time = "SELECT start_time, ifnull(end_time, now()) as end_time,sum(TIMESTAMPDIFF(MINUTE, start_time, IFNULL(end_time, NOW()))) AS total_duration_minutes

FROM qr_work_entry 
WHERE production_id = $production_id;";
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

$interval = $day_start->diff($now);

$totalMinutes = ($interval->days * 24 * 60) + ($interval->h * 60) + $interval->i + ($interval->s / 60);

$result_json['total_minutes'] = $totalMinutes;

$total_work_duration_minutes = $totalMinutes - $total_break_duration_minutes;
$result_json['total_work_minutes'] = $total_work_duration_minutes;
$result_json['total_break_minutes'] = $total_break_duration_minutes;

    }
$consumption = [];

// check there enough bom stock for the process part
foreach($process_part_array as $process_part) {
  
    $required_qty = $process_part['required_qty'];
    $process_id = $process_part['process_id'];
    $sql_check_stock = "SELECT ifnull(SUM(js.qty), 0) as total_stock_qty, wtm.min_time,wtm.max_time, js.godown,js.dep,js.sec, pwt.process_id,iwp.input_part_id,iwp.previous_process_id,iwp.qty,jp.process_name as inprocess FROM process_wel_tbl pwt 
inner join input_wel_parts iwp on iwp.process_id = pwt.process_id
inner join jaysan_process jp on jp.process_id = pwt.process
left join jaysan_stock js on iwp.previous_process_id = ifnull(js.process_id,0) and iwp.input_part_id = js.part_id and js.godown = $godown_id and js.dep = $dep_id  
left join work_time_master wtm on wtm.ori_process_id = pwt.process_id
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
            $result_json['message'] = "Not enough stock for part ID: " . $row['input_part_id'] . ". Required: $consume_qty, Available: " . ($row['total_stock_qty']);
            echo json_encode($result_json);
            $conn->close();
            exit;
        }

        }
    } else {
        $result_json['message'] = "No stock information found for part ID: $part_id.";
        echo json_encode($result_json);
        $conn->close();
        exit;
    }

}


// get min and max time for the process and multiply with required qty then reduce total_work_duration_minutes
$total_min_time = 0;
$total_max_time = 0;
$free_time = 0;
$process_time_array = [];
foreach($process_part_array as $process_part) {
    $process_id = $process_part['process_id'];
     $required_qty = $process_part['required_qty'];
   
$get_proess_time_sql = "SELECT min_time, max_time FROM work_time_master WHERE ori_process_id = $process_id";
$result_process_time = $conn->query($get_proess_time_sql);
if ($result_process_time->num_rows > 0) {
    $process_time_array[] = [
        "process_id" => $process_id,
        "min_time" => $result_process_time->fetch_assoc()['min_time'],
        "max_time" => $result_process_time->fetch_assoc()['max_time']
    ];
    $row = $result_process_time->fetch_assoc();
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
if($total_work_duration_minutes > $total_max_time) {
    // now total work time greater then max time so we assigin process time as max time and calulate extra time as total work time - max time
    
    $free_time = $total_work_duration_minutes - $total_max_time;
    foreach($process_time_array as $process_time) {
    //  insert into work_process
    $pr_id = $process_time['process_id'];
    $pr_time = $process_time['max_time'];
    $insert_work_process_sql = "INSERT INTO work_process (work_id, process_id, work_time_per_unit) VALUES ($work_done_id,$pr_id, $pr_time)";
    if ($conn->query($insert_work_process_sql) !== TRUE) {
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
    foreach($process_time_array as $process_time) {
        //  insert into work_process
        $pr_id = $process_time['process_id'];
        $pr_time = $process_time['min_time'] + $time_to_distribute;
        $insert_work_process_sql = "INSERT INTO work_process (work_id, process_id, work_time_per_unit) VALUES ($work_done_id,$pr_id, $pr_time)";
        if ($conn->query($insert_work_process_sql) !== TRUE) {
            $result_json['message'] = "Error inserting work process: " . $conn->error;
            echo json_encode($result_json);
            $conn->close();
            exit; 
        }

     
    }
}
}

// update or insert qr_work_entry with end time and work sts as completed for the given qr_work_id
if($qr_work_id > 0) {
    $sql_update_qr_work_entry = "UPDATE qr_work_entry SET end_time = NOW(), work_sts = 'finished' WHERE qr_work_id = $qr_work_id";
    if ($conn->query($sql_update_qr_work_entry) !== TRUE) {
        $result_json['message'] = "Error updating QR work entry: " . $conn->error;
        echo json_encode($result_json);
        $conn->close();
        exit; 
    }
}
else {
    // insert new entry in qr_work_entry with work sts as finished and end time as now
    
    $sql_insert_qr_work_entry = "INSERT INTO qr_work_entry (emp_id, production_id, sec_id, work_done_id, work_sts, start_time, end_time) VALUES ($emp_id, $production_id, $sec_id, $work_done_id, 'finished', '$current_process_start_time', NOW())";
    if ($conn->query($sql_insert_qr_work_entry) !== TRUE) {
        $result_json['message'] = "Error inserting QR work entry: " . $conn->error;
        echo json_encode($result_json);
        $conn->close();
        exit; 
    }
}

// bom stock check  done. now reduce bom input and add output to stock based on process_part_array and process_id


    foreach ($consumption as $consume) {
        $part_id = $consume['part_id'];
        $qty_to_consume = $consume['qty'];
    $previous_process_id_query = ($consume['previous_process_id'] == 0) 
    ? 'process_id is null' 
    : "process_id = " . $consume['previous_process_id'];
    //  find sec wise stock details
    $sql_sec_stock = "select stock_id, qty,sec from jaysan_stock where part_id = $part_id and godown = $godown_id and dep = $dep_id and $previous_process_id_query and qty > 0 order by stock_id";
   
    $result_sec_stock = $conn->query($sql_sec_stock);
$remaining = $qty_to_consume;
    if ($result_sec_stock->num_rows > 0) {
    while($row = $result_sec_stock->fetch_assoc()) {

        if($remaining <= 0) break;

        $available = $row['qty'];
        $take_qty = min($available, $remaining);

        // 🔥 reduce stock (insert negative entry with SAME section)
   $sql_update_stock = "update jaysan_stock set qty = qty - $take_qty where stock_id = " . $row['stock_id'];

    if ($conn->query($sql_update_stock) === TRUE) {
    } else {
        $result_json['message'] = "Error updating stock: " . $conn->error;
        echo json_encode($result_json);
    
    }

        $remaining -= $take_qty;
    

    }

    
    }
    }


    try{
$conn->begin_transaction();
  foreach($process_part_array as $process_part) {
        $part_id = $process_part['part_id'];
        $required_qty = $process_part['required_qty'];
        $process_id = $process_part['process_id'];
       
$batch_id = "j".$work_done_id;
    // insert output stock for the process part
    $sql_insert_output = "INSERT INTO jaysan_stock (part_id, process_id, godown, dep, sec, qty, batch_id) VALUES ($part_id, $process_id, $godown_id, $dep_id, $sec_id, $required_qty, '$batch_id') ON DUPLICATE KEY UPDATE qty = qty + $required_qty";

    if ($conn->query($sql_insert_output) === TRUE) {

    } else {
        $result_json['message'] = "Error inserting output stock: " . $conn->error;
        echo json_encode($result_json);
        $conn->rollback();
        $conn->close();
        exit;
        
    

    }
    }
    $conn->commit();
    $result_json['message'] = "Work done entry and stock updates successful.";
    echo json_encode($result_json);
    }

     catch(Exception $e) {
        $conn->rollback();
        $result_json['message'] = "Transaction failed: " . $e->getMessage();
        echo json_encode($result_json);
        $conn->close();
        exit;
    }
  






 




 ?>


