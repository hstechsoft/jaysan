<?php
include "db_head.php";

$emp_id = $_GET['emp_id'];
$start_date = $_GET['start_date'];
$end_date = $_GET['end_date'];

$data = [
  "status" => "not_found"
];

// Step 1: Find matching work entry
$sql = "SELECT * FROM work_done_table 
        WHERE emp_id = '$emp_id'
        AND (
          ('$start_date' BETWEEN start_date AND end_date)
          OR ('$end_date' BETWEEN start_date AND end_date)
          OR (start_date BETWEEN '$start_date' AND '$end_date')
          OR (end_date BETWEEN '$start_date' AND '$end_date')
        )
        LIMIT 1";

$result = $conn->query($sql);

if ($row = $result->fetch_assoc()) {
  $work_id = $row['work_id'];
  $data['status'] = "found";
  $data['work_id'] = $work_id;
  $data['work_sts'] = $row['work_sts'];
  $data['act_work_time'] = $row['act_work_time'];
  $data['remark'] = $row['remark'];

  // ✅ Process rows with JOIN from work_time_master, jaysan_process, jaysan_machine
$process_rows = [];
$res = $conn->query("
  SELECT wp.*, (select part_name from parts_tbl where part_id = wp.part_id) as part_name,
         wtm.min_time, wtm.max_time, 
         jp.process_name, 
         jm.machine_name
  FROM work_process wp
  JOIN work_time_master wtm ON wp.wtid = wtm.wtid
  JOIN jaysan_process jp ON wtm.process_id = jp.process_id
  JOIN jaysan_machine jm ON wtm.machine_id = jm.jmid
  WHERE wp.work_id = '$work_id'
");

while ($r = $res->fetch_assoc()) {
  $process_rows[] = [
    "wtid" => $r['wtid'],
    "part_id" => $r['part_id'],
    "part_name" => $r['part_name'],
    "qty" => $r['qty'],
    "time" => $r['work_time_per_unit'],  // ✅ new field
    "min_time" => $r['min_time'],
    "max_time" => $r['max_time'],
    "process_name" => $r['process_name'],
    "machine_name" => $r['machine_name']
  ];
}


  // ✅ Break rows from extra_time_master
  $break_rows = [];
  $res2 = $conn->query("
    SELECT wb.*, etm.ex_name 
    FROM work_break wb
    JOIN extra_time_master etm ON wb.ext_id = etm.ext_id
    WHERE wb.work_id = '$work_id'
  ");

  while ($r2 = $res2->fetch_assoc()) {
    $break_rows[] = $r2;
  }

  $data['process'] = $process_rows;
  $data['break'] = $break_rows;
}

echo json_encode($data);
?>
