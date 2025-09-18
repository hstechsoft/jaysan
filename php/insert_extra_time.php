<?php
include("db_head.php");
function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}

if (
    isset($_POST['ex_name']) &&
    isset($_POST['ex_type']) &&
    isset($_POST['ex_time'])
) {
    $is_payable = isset($_POST['is_payable']) ? (int)$_POST['is_payable'] : 0;
    $ex_name = test_input($_POST['ex_name']);
    $ex_type = test_input($_POST['ex_type']);
    $ex_time = (int) $_POST['ex_time'];
    $start_time = isset($_POST['start_time']) ? test_input($_POST['start_time']) : null;
    $end_time = isset($_POST['end_time']) ? test_input($_POST['end_time']) : null;

$sql = "INSERT INTO extra_time_master (ex_name, ex_type, start_time, end_time, ex_time, is_payable)
        VALUES ('$ex_name', '$ex_type', " . 
        ($start_time ? "'$start_time'" : "NULL") . ", " .
        ($end_time ? "'$end_time'" : "NULL") . ", $ex_time, $is_payable)";

    if ($conn->query($sql)) {
        echo "ok";
    } else {
        echo $conn->error;
    }
} else {
    echo "Missing required fields";
}
?>
