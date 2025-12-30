<?php
include "db_head.php";

$emp_id = $_POST['emp_id'];
$process_id = $_POST['process_id'];
$machine_id = $_POST['machine_select'];

$sql = "INSERT INTO employee_process (emp_id, process_id, machine_id, assigned_date)
        VALUES ('$emp_id', '$process_id', '$machine_id', NOW())";

if ($conn->query($sql) === TRUE) {
  echo "ok";
} else {
  echo $conn->error;
}
?>
