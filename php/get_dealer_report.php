<?php
 include 'db_head.php';

 $date_query_start = ($_GET['date_query_start']);
 $date_query_end = ($_GET['date_query_end']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


//report for web lead only
// $sql = "SELECT  (SELECT api.lead_source FROM api WHERE api.work_id = min(work.work_id)) as lead_source ,(SELECT api.generated_date FROM api WHERE api.work_id = min(work.work_id)) as lead_date,customer.cus_id, customer.cus_name,min(work.work_description) as work_des, CONCAT(max(work.work_type), ' - ', max(work_status), '\n') as cur_work,   GROUP_CONCAT('emp name - ',employee.emp_name,' ','Date- ',DATE_FORMAT(FROM_UNIXTIME(work.work_date/1000), '%e %b %Y'),' ',work.work_type ,' - ',work.work_status,'\n' , ' ' SEPARATOR'<br><br>') as comments ,(SELECT report_master.report_cat FROM report_master WHERE report_master.work_type = max(work.work_type) AND report_master.work_status = max(work.work_status) ) as report FROM `work` INNER JOIN customer on work.cus_id = customer.cus_id INNER JOIN employee on work.emp_id = employee.emp_id  WHERE pipeline_id in (SELECT api.work_id from api where api.work_id > 0)  GROUP BY pipeline_id";

//report for web lead only
$sql = "SET time_zone = '+05:30';";  // First query to set the time zone
$sql .= "SELECT dealer.did, dealer.dname, 
                   (SELECT COUNT(*) from dealer_delivery 
                    WHERE dealer_delivery.did = dealer.did 
                    AND ddate BETWEEN $date_query_start AND  $date_query_end) as sale 
            FROM dealer 
            GROUP BY dealer.dname 
            ORDER BY sale DESC;";

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


