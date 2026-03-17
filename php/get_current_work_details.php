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

$work_done_id = (int) (current_info($conn,(int) $emp_id)['work_done_id'] ?? 0);




 $sql = "SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'start_time', qr.start_time,
        'end_time', qr.end_time,
        'production_id', qr.production_id,
        'work_sts', qr.work_sts,
        'work_id', wd.work_id,
        'current_work_id', qr.qr_work_id 
    )) as work_entries,qr.work_sts
FROM work_done_table wd 

left join qr_work_entry qr on wd.work_id = qr.work_done_id

WHERE   wd.work_id = $work_done_id GROUP BY qr.work_sts";

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


