<?php
include "db_head.php";

$start_date = $_POST['start_date'];
$end_date = $_POST['end_date'];
$emp_id = $_POST['emp_id'];
$work_sts = $_POST['work_sts'];
$remark = $_POST['remark'];
$process_json = $_POST['work_process'];
$break_json = $_POST['work_break'];
$action = $_POST['action'];
$work_id = $_POST['work_id'];
$act_work_time = $_POST['act_work_time'];


$work_process = json_decode($process_json, true);
$work_break = json_decode($break_json, true);


if ($action === "update") {
    // 1. Update work_done_table
  $sql = "UPDATE work_done_table SET 
          start_date = '$start_date',
          end_date = '$end_date',
          emp_id = '$emp_id',
          work_sts = '$work_sts',
          remark = '$remark',
          act_work_time = '$act_work_time'
        WHERE work_id = '$work_id'";


    if (!$conn->query($sql)) {
        echo "Error updating work_done_table: " . $conn->error;
        exit;
    }

    // 2. Delete old process/break data
    $conn->query("DELETE FROM work_process WHERE work_id = '$work_id'");
    $conn->query("DELETE FROM work_break WHERE work_id = '$work_id'");

    // 3. Re-insert new process data
    foreach ($work_process as $row) {
        $wtid = $row['wtid'];
         $qty = $row['qty'];
         $time = $row['time'];
         $part_id = $row['part_id'];
        $conn->query("INSERT INTO work_process (work_id, wtid, qty, work_time_per_unit, part_id) 
                  VALUES ('$work_id', '$wtid', '$qty', '$time', '$part_id')");
    }

    // 4. Re-insert new break data
    foreach ($work_break as $row) {
        $ext_id = $row['ext_id'];
        $break_time = $row['break_time'];
        $conn->query("INSERT INTO work_break (work_id, ext_id, break_time) VALUES ('$work_id', '$ext_id', '$break_time')");
    }

    echo "ok";
    exit;
} else {
  // Insert into work_done_table
$sql = "INSERT INTO work_done_table (start_date, end_date, emp_id, work_sts, remark, act_work_time) 
        VALUES ('$start_date', '$end_date', '$emp_id', '$work_sts', '$remark', '$act_work_time')";

if ($conn->query($sql) === TRUE) {
    $work_id = $conn->insert_id;

    // Insert into work_process
    foreach ($work_process as $row) {
        $wtid = $row['wtid'];
        $qty = $row['qty'];
          $time = $row['time'];
        $part_id = $row['part_id'];
     $conn->query("INSERT INTO work_process (work_id, wtid, qty, work_time_per_unit, part_id) 
                  VALUES ('$work_id', '$wtid', '$qty', '$time', '$part_id')");
    }

    // Insert into work_break
    foreach ($work_break as $row) {
        $ext_id = $row['ext_id'];
        $break_time = $row['break_time'];
        $conn->query("INSERT INTO work_break (work_id, ext_id, break_time) VALUES ('$work_id', '$ext_id', '$break_time')");
    }

    echo "ok";
} else {
    echo "Insert failed: " . $conn->error;
}
}


?>
