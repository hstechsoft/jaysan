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




 $sql = "WITH RECURSIVE dates AS (
    SELECT DATE('$start_time') AS dt
    UNION ALL
    SELECT dt + INTERVAL 1 DAY
    FROM dates
    WHERE dt < now()
)
SELECT 
d.dt as dates,
JSON_ARRAYAGG(JSON_OBJECT('ex_time',ex_time,
                             'ex_id',ext_id,
                          'ex_name',ex_name,
                          'start_datetime',TIMESTAMP(d.dt, b.start_time),
                          'end_datetime', TIMESTAMP(d.dt, b.end_time) 
                         ))  as break_details
  
FROM dates d
CROSS JOIN extra_time_master b
WHERE TIMESTAMP(d.dt, b.start_time) >= '$start_time'
  AND TIMESTAMP(d.dt, b.end_time)   <= now() and b.ex_type = 'break' GROUP by dt ; ";

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


