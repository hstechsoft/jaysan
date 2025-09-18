<?php
 include 'db_head.php';

 $emp_id = test_input($_GET['emp_id']);
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
$sql .= "SELECT 
date_series.Date ,ifnull(tno,0)  as tno


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
 DATE_FORMAT(FROM_UNIXTIME(work.work_date / 1000), '%Y-%m-%d') AS Date,
 count(work.work_id) as tno
    
FROM 
    work 
WHERE 
    work.emp_id =  $emp_id 
GROUP BY 
    Date
) work_data ON date_series.Date = work_data.Date  
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


