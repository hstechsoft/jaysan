<?php
 include 'db_head.php';

 $emp_id = ($_GET['emp_id']);
$astart_date = test_input($_GET['astart_date']);
$aend_date = test_input($_GET['aend_date']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$sql = "SET time_zone = '+05:30';"; 
$sql .= "SELECT ifnull(req ,'')as req,(select emp_name from employee where employee.emp_id = $emp_id ) as emp_name,
date_series.Date, CASE
    WHEN total_time = 0 AND partial_count > 0 THEN 'Partial Login'
    WHEN total_time = 0 AND partial_count = 0 THEN 'Absent'
    ELSE CONCAT(
        LPAD(FLOOR(total_time / 3600), 2, '0'), ':',
        LPAD(FLOOR((total_time % 3600) / 60), 2, '0'), ':',
        LPAD(FLOOR(total_time % 60), 2, '0'),
        IF(partial_count > 0, ' hours Partial Login', ' hours')
    )
END AS Att_time_formatted, CASE
    WHEN total_time = 0 AND partial_count > 0 THEN 'partial'
    WHEN total_time = 0 AND partial_count = 0 THEN 'absent'
      WHEN total_time > 0  THEN 'present'
    ELSE 'absent'
    
END AS att_report,
total_time,
COALESCE(time_history, 'Absent') AS time_history
FROM (
SELECT 
    DATE_ADD($astart_date, INTERVAL t.n DAY) AS Date
FROM 
    (SELECT 
        a.N + b.N * 10 + c.N * 100 AS n
    FROM 
        (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
        CROSS JOIN 
        (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
        CROSS JOIN 
        (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c
    ) t
WHERE 
    DATE_ADD($astart_date, INTERVAL t.n DAY) BETWEEN $astart_date AND $aend_date
) date_series
LEFT JOIN (
SELECT 
    DATE(FROM_UNIXTIME(att.dated / 1000)) AS Date,
    ifnull( (SELECT concat(att_req.leave_type,'-',att_req.status) as sts
FROM att_req 
WHERE emp_id = 6 
AND  DATE(FROM_UNIXTIME(att.dated / 1000)) BETWEEN STR_TO_DATE(att_req.from_date, '%Y-%m-%d') AND STR_TO_DATE(att_req.to_date, '%Y-%m-%d')) ,'') as req,
    SUM(CASE WHEN att.logout_time > 0 THEN att.logout_time - att.login_time ELSE 0 END) / 1000 AS total_time,
    SUM(CASE WHEN att.logout_time = 0 THEN 1 ELSE 0 END) AS partial_count,
    GROUP_CONCAT(
        CONCAT(
            'login - ', DATE_FORMAT(FROM_UNIXTIME(att.login_time / 1000), '%Y-%m-%d %H:%i:%s'),
            ' : logout -  ',
            CASE WHEN att.logout_time > 0 THEN  DATE_FORMAT(FROM_UNIXTIME(att.logout_time / 1000), '%Y-%m-%d %H:%i:%s') ELSE 'Still logged in' END
        ) ORDER BY att.login_time ASC SEPARATOR '</br> '
    ) AS time_history
FROM 
    attendance att
WHERE 
    att.phone_id = (SELECT employee.emp_phone_id FROM employee WHERE employee.emp_id = $emp_id) 
GROUP BY 
    Date
) att_data ON date_series.Date = att_data.Date  
ORDER BY `date_series`.`Date`  ASC";

// Execute the multi_query
if ($conn->multi_query($sql)) {
    // This loop is used to handle multiple result sets
    do {
        // Store the result set from the query
        if ($result = $conn->store_result()) {
            if ($result->num_rows > 0) {
                $rows = array();
                while($r = $result->fetch_assoc()) {
                    $rows[] = $r;
                }
                // Output the result as JSON
                print json_encode($rows);
            } else {
                echo "0 result";
            }
            $result->free(); // Free the result set
        }
        // Check if there are more result sets
    } while ($conn->more_results() && $conn->next_result());
} else {
    // If the multi_query fails, output the error
    echo "Error: " . $conn->error;
}
$conn->close();

 ?>


