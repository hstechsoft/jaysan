<?php
 include 'db_head.php';

$qr_work_id = test_input($_POST['qr_work_id']);
$work_update_sts = test_input($_POST['work_update_sts']);
$reason = test_input($_POST['reason']);

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
if($work_update_sts != "'in-process'" && $work_update_sts != "'paused'"  || $qr_work_id == "''" || $work_update_sts == "''"){
    echo "Error: Invalid input.";
    $conn->close();
    exit; 
}
$emp_id =  0;
$work_done_id = 0;
$production_id = 0;
$sec_id = 0;


//  check work sts if in-process it can be pausedd or if pausedd it can be in-processd
$sql_check_work_sts = "SELECT * FROM qr_work_entry WHERE qr_work_id = $qr_work_id and work_sts IN ('in-process', 'paused')";
$result_check_work_sts = $conn->query($sql_check_work_sts);
if ($result_check_work_sts->num_rows > 0) {
    $row = $result_check_work_sts->fetch_assoc();
    $current_work_sts = $row['work_sts'];
    $emp_id = $row['emp_id'];
    $work_done_id = $row['work_done_id'];
    $production_id = $row['production_id'];
    $sec_id = $row['sec_id'];


    
    if (($work_update_sts == "'paused'" && $current_work_sts != 'in-process') || ($work_update_sts == "'in-process'" && $current_work_sts != 'paused')) {
        echo "Error: Invalid work status transition.";
        $conn->close();
        exit; 
    }
} else {
    echo "Error: Work entry not found.";
    $conn->close();
    exit; 
}

// check  $production_id is finished
if($production_id) {
$sql_check_production_finished = "SELECT * FROM qr_work_entry WHERE production_id = $production_id and work_sts = 'finished' and work_done_id = $work_done_id";
$result_check_production_finished = $conn->query($sql_check_production_finished);
if ($result_check_production_finished->num_rows > 0) {
    echo "Error: This production is already finished.";
    $conn->close();
    exit; 
}
}

// check if there is in-process entry for emp and work_done_id
if($work_update_sts == "'in-process'") {
$sql_check_work_sts = "SELECT * FROM qr_work_entry WHERE  work_done_id = $work_done_id and work_sts = 'in-process'";
$result_check_work_sts = $conn->query($sql_check_work_sts);
if ($result_check_work_sts->num_rows > 0 && $work_update_sts == "'in-process'") {
    echo "Error: There is already an in-process entry for this work done.";
    $conn->close();
    exit;
}
}

 $sql_update_sts = "UPDATE qr_work_entry SET work_sts = $work_update_sts,end_time = NOW(),reason = $reason WHERE qr_work_id = $qr_work_id";
 
if($work_update_sts == "'in-process'") {
    $sql_update_sts = "insert into qr_work_entry (emp_id, production_id, sec_id, work_done_id, work_sts, start_time) values ($emp_id, $production_id, $sec_id, $work_done_id, 'in-process', NOW())";
}
 
   
 
  if ($conn->query($sql_update_sts) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql_update_sts . "<br>" . $conn->error;
  }
$conn->close();

 ?>


