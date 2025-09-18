<?php
 include 'db_head.php';

 
 $emp_id = test_input($_GET['emp_id']);
 $start_date = ($_GET['start_date']);
 $end_date = ($_GET['end_date']);

 $sql_date = "SELECT FROM_UNIXTIME( ($start_date)/1000,'%Y-%m-%d') as sd,FROM_UNIXTIME( ($end_date)/1000,'%Y-%m-%d') as ed";
$result = $conn->query($sql_date);

if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    $start_date =  $row["sd"];
    $end_date =  $row["ed"];
  }
} 

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

//select from two table and join together

$sql = "SELECT status, count(status)as count from(SELECT 
Date,
Att_time_formatted,
CASE
  WHEN Att_time_formatted LIKE '%Partial%' THEN 'Partial Day'
  WHEN Att_time_formatted = 'Absent' THEN 'Absent'
  ELSE 'Present'
END AS Status
FROM (
SELECT 
  date_series.Date,
  CASE
    WHEN total_time = 0 AND partial_count > 0 THEN 'Partial Login'
    WHEN total_time = 0 AND partial_count = 0 THEN 'Absent'
    ELSE CONCAT(
      LPAD(FLOOR(total_time / 3600), 2, '0'), ':',
      LPAD(FLOOR((total_time % 3600) / 60), 2, '0'), ':',
      LPAD(FLOOR(total_time % 60), 2, '0'),
      IF(partial_count > 0, ' hours Partial Day', ' hours')
    )
  END AS Att_time_formatted
FROM (
  SELECT 
    ADDDATE('$start_date', numbers.n) AS Date,
    SUM(CASE WHEN att.logout_time > 0 THEN att.logout_time - att.login_time ELSE 0 END) / 1000 AS total_time,
    SUM(CASE WHEN att.logout_time = 0 THEN 1 ELSE 0 END) AS partial_count
  FROM (
    SELECT a.N + b.N * 10 + c.N * 100 AS n
    FROM 
      (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a,
      (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b,
      (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c
  ) numbers
  LEFT JOIN attendance att ON ADDDATE('$start_date', numbers.n) = DATE(FROM_UNIXTIME(att.dated / 1000))  and att.phone_id = (SELECT employee.emp_phone_id FROM employee WHERE employee.emp_id =  $emp_id)
  WHERE numbers.n BETWEEN 0 AND DATEDIFF('$end_date', '$start_date')
  GROUP BY Date
) AS date_series
) AS final_series
ORDER BY Date) as f  GROUP by status"   ;

// $sql = "SELECT work.work_type,work_history.his_status,COUNT(work_history.his_status) as total FROM work_history left JOIN work ON work_history.work_id = work.work_id WHERE  work_history.emp_id = $emp_id and work_history.his_date between  $start_date and  $end_date GROUP BY work_type,his_status ORDER by work.work_type ";




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


