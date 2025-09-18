<?php
include("db_head.php");
function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
if (
    isset($_POST['ext_id']) &&
    isset($_POST['ex_name']) &&
    isset($_POST['ex_type']) &&
    isset($_POST['ex_time'])
) {
    $id = test_input($_POST['ext_id']);
    $ex_name = test_input($_POST['ex_name']);
    $ex_type = test_input($_POST['ex_type']);
    $ex_time = (int) $_POST['ex_time'];
    $start_time = isset($_POST['start_time']) ? test_input($_POST['start_time']) : null;
    $end_time = isset($_POST['end_time']) ? test_input($_POST['end_time']) : null;
    $is_payable = isset($_POST['is_payable']) ? (int)$_POST['is_payable'] : 0;

    $sql = "UPDATE extra_time_master SET 
              ex_name = '$ex_name',
              ex_type = '$ex_type',
              start_time = " . ($start_time ? "'$start_time'" : "NULL") . ",
              end_time = " . ($end_time ? "'$end_time'" : "NULL") . ",
              ex_time = $ex_time,
                is_payable = $is_payable
            WHERE ext_id = $id";

    if ($conn->query($sql)) {
        echo "ok";
    } else {
        echo $conn->error;
    }
} else {
    echo "Missing required fields";
}
?>
