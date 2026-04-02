<?php
 include 'db_head.php';

 $work_done_id = test_input($_POST['work_done_id']);



 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}
// check work id has end_date is null
$sql_check_work_done = "SELECT * FROM work_done_table WHERE work_id = $work_done_id and end_date is null";
$result_check_work_done = $conn->query($sql_check_work_done);
if ($result_check_work_done->num_rows > 0) {
  // check is there any unfinished work entry for the work id
  $sql_check_work_entry = "SELECT * FROM qr_work_entry WHERE work_done_id = $work_done_id and work_sts = 'in-process'";
  $result_check_work_entry = $conn->query($sql_check_work_entry);
  if ($result_check_work_entry->num_rows > 0) {
    $conn->close();
    echo "Cannot end work. There are unfinished work entries.";
    exit; 
}
 
}

// all ok now we can end the work

$sql_end_work = "UPDATE work_done_table SET end_date = now() WHERE work_id = $work_done_id";
if ($conn->query($sql_end_work) === TRUE) {
    echo "Work ended successfully";
} else {
    echo "Error ending work: " . $conn->error;
    $conn->close();
    echo json_encode($result_json);
    exit;
}


$conn->close();

 ?>


