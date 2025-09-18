<?php
include("db_head.php");

$emp_id = $_GET['emp_id'];
$start_date = $_GET['start_date'];
$end_date = $_GET['end_date'];

$sql = "SELECT work_id FROM work_done_table 
        WHERE emp_id = '$emp_id'
        AND (
          ('$start_date' BETWEEN start_date AND end_date)
          OR ('$end_date' BETWEEN start_date AND end_date)
          OR (start_date BETWEEN '$start_date' AND '$end_date')
          OR (end_date BETWEEN '$start_date' AND '$end_date')
        )";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "exists";
} else {
    echo "not_found";
}
?>
