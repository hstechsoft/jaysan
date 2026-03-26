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


// check break_time_array is array and not empty
if(!is_array($break_time_array) || empty($break_time_array)) {
    $break_time_array = array();
}

// check process_part_array is array and not empty
if(!is_array($process_part_array) || empty($process_part_array)) {
  $conn->close();
    echo json_encode(array("message" => "Process part array is required and should be a non-empty array."));
    exit;
}
require __DIR__ . '/get_current_work_info.php';
$curent_work_info = current_info($conn, $emp_id);

if(!$curent_work_info['start_time']) {
     $conn->close();
    echo json_encode(array("message" => "No active work found for the employee."));
    exit;
}

$work_done_id = $curent_work_info['work_done_id'];
$day_start_time = $curent_work_info['start_time'];
echo json_encode($curent_work_info);
$production_id = 0;
// if qr_work_id is not null then get current sts 
if($qr_work_id > 0) {
$sql_get_sts_qr = "SELECT production_id from qr_work_entry where qr_work_id = $qr_work_id and production_id is not null and work_sts = 'in-process'";
$result_qr_sts = $conn->query($sql_get_sts_qr);
if ($result_qr_sts->num_rows > 0) {
   $production_id = $result_qr_sts->fetch_assoc()['production_id'];
} else {
   echo json_encode(array("message" => "No active work entry found for the given QR work ID."));
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
    echo json_encode(array("total_minutes" => $total_work_duration_minutes )); // Convert back to seconds
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
$day_start =  new DateTime($day_start_time);
$now = new DateTime();

$interval = $day_start->diff($now);

$totalMinutes = ($interval->days * 24 * 60) + ($interval->h * 60) + $interval->i + ($interval->s / 60);

echo "Total Minutes: " . $totalMinutes;

$total_work_duration_minutes = $totalMinutes - $total_break_duration_minutes;
echo json_encode(array("total_work_minutes" => $total_work_duration_minutes, "total_break_minutes" => $total_break_duration_minutes));
    }
$consumption = [];

// check there enough bom stock for the process part
foreach($process_part_array as $process_part) {
    $part_id = $process_part['part_id'];
    $required_qty = $process_part['required_qty'];
    $process_id = $process_part['process_id'];
    $sql_check_stock = "SELECT ifnull(SUM(js.qty), 0) as total_stock_qty,   js.godown,js.dep,js.sec, pwt.process_id,iwp.input_part_id,iwp.previous_process_id,iwp.qty,jp.process_name as inprocess FROM process_wel_tbl pwt 
inner join input_wel_parts iwp on iwp.process_id = pwt.process_id
inner join jaysan_process jp on jp.process_id = pwt.process
left join jaysan_stock js on iwp.previous_process_id = ifnull(js.process_id,0) and iwp.input_part_id = js.part_id and js.godown = $godown_id and js.dep = $dep_id  
 WHERE pwt.process_id = $process_id  GROUP BY iwp.input_part_id";

    $result_check_stock = $conn->query($sql_check_stock);
    if ($result_check_stock->num_rows > 0) {

      
        while($row = $result_check_stock->fetch_assoc()){
          
            $consume_qty = $row['qty'] * $required_qty;
            $remaining = $row['total_stock_qty'] - $consume_qty;
       $consumption[] = [
        "part_id" => $row['input_part_id'],
        "previous_process_id" => $row['previous_process_id'],
        "qty" => $consume_qty
    ];

        if($remaining < 0) {
            echo json_encode(array("message" => "Not enough stock for part ID: " . $row['input_part_id'] . ". Required: $consume_qty, Available: " . ($row['total_stock_qty'])));
            $conn->close();
            exit;
        }

        }
    } else {
        echo json_encode(array("message" => "No stock information found for part ID: $part_id."));
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
        echo json_encode(array("message" => "Error updating stock: " . $conn->error));
    
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
        echo json_encode(array("message" => "Error inserting output stock: " . $conn->error));
        $conn->rollback();
        $conn->close();
        exit;
        
    

    }
    }
    $conn->commit();
    echo json_encode(array("message" => "Work done entry and stock updates successful."));
    }

     catch(Exception $e) {
        $conn->rollback();
        echo json_encode(array("message" => "Transaction failed: " . $e->getMessage()));
        $conn->close();
        exit;
    }
  






 




 ?>


