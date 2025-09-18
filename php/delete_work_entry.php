<?php
include "db_head.php";

$emp_id = $_POST['emp_id'];
$start_date = $_POST['start_date'];
$end_date = $_POST['end_date'];

// Find work_id
$sql = "SELECT work_id FROM work_done_table 
        WHERE emp_id = '$emp_id' 
        AND (
          ('$start_date' BETWEEN start_date AND end_date)
          OR ('$end_date' BETWEEN start_date AND end_date)
          OR (start_date BETWEEN '$start_date' AND '$end_date')
          OR (end_date BETWEEN '$start_date' AND '$end_date')
        ) LIMIT 1";

$result = $conn->query($sql);

if ($row = $result->fetch_assoc()) {
  $work_id = $row['work_id'];

  // Delete from child tables first
  $conn->query("DELETE FROM work_process WHERE work_id = '$work_id'");
  $conn->query("DELETE FROM work_break WHERE work_id = '$work_id'");

  // Then delete from main table
  $conn->query("DELETE FROM work_done_table WHERE work_id = '$work_id'");

  echo "ok";
} else {
  echo "No matching entry found";
}
?>
