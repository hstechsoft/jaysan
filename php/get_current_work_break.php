<?php
 include 'db_head.php';
error_reporting(0);
 $emp_id = test_input($_GET['emp_id']);



 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}

require __DIR__ . '/get_current_work_info.php';

$start_time = current_info($conn, $emp_id)['start_time'];

if (!$start_time) {
    echo json_encode(array("message" => "No active work found for the employee."));
    exit;
}

$start_time_only = date('H:i:s', strtotime($start_time));


 $sql = "SELECT * FROM extra_time_master WHERE start_time >= '$start_time_only' AND end_time <= now() and ex_type = 'break'; ";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
  echo "0 result";
}
$conn->close();

 ?>


