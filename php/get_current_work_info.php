<?php





function current_info(mysqli $conn, int $emp_id)
{
// get work done id from emp id
$work_done_id = null;
$start_time= null;
$day_start_time = null;
$current_process_id = null;
$current_machine_id = null;
$sql_work_done = "SELECT work_id,start_date,current_process_id,current_machine_id from work_done_table where emp_id = $emp_id and end_date is null limit 1 ";
$result_work_done = $conn->query($sql_work_done);
if ($result_work_done->num_rows > 0) {
    $row_work_done = $result_work_done->fetch_assoc();
    $work_done_id = $row_work_done['work_id'];
    $start_time= $row_work_done['start_date'];
    $day_start_time = $row_work_done['start_date'];
    $current_process_id = $row_work_done['current_process_id'];
    $current_machine_id = $row_work_done['current_machine_id'];
} else {
   return (array("start_time" => $start_time, "work_done_id" => $work_done_id, "current_process_id" => $current_process_id, "current_machine_id" => $current_machine_id));
   echo json_encode(array("start_time" => $start_time, "work_done_id" => $work_done_id, "current_process_id" => $current_process_id, "current_machine_id" => $current_machine_id));
}


$sql = "SELECT qr.end_time  from qr_work_entry qr
where
    qr.work_done_id = $work_done_id
    and qr.production_id is null
ORDER BY qr.qr_work_id DESC
limit 1";

$result = $conn->query($sql);
// if its empty result there is no work entry for this work done id
if ($result->num_rows > 0) {
  
   
        // fetch end time
        $row = $result->fetch_assoc();
        $start_time= $row['end_time'];
    
} 



return (array("start_time" => $start_time, "day_start_time" => $day_start_time, "work_done_id" => $work_done_id, "current_process_id" => $current_process_id, "current_machine_id" => $current_machine_id));




}







 ?>


