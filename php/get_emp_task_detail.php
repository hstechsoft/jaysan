<?php
 include 'db_head.php';

  $emp_id =test_input($_GET['emp_id']);
  $start_date =($_GET['start_date']);
  $end_date =($_GET['end_date']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$sql = "SET time_zone = '+05:30';"; 
$sql .= "SELECT  work.work_description,work.work_type,work.work_status,work.work_com_status,work.work_date as work_date1, (select emp_name from employee where employee.emp_id = work.emp_id) as emp_name ,DATE_FORMAT(FROM_UNIXTIME(work.work_date / 1000), '%d/%m/%Y %r') AS work_date,  GROUP_CONCAT( '<div  class=\"list-group-item list-group-item-action flex-column align-items-start\"> <div class=\"d-flex w-100 justify-content-between\"> <p class=\"text-muted small\">',DATE_FORMAT(FROM_UNIXTIME(work_history.his_date / 1000), '%d/%m/%Y %r'),'</p> <small class=\"text-muted\">', CASE
                WHEN TIMESTAMPDIFF(SECOND, FROM_UNIXTIME(work_history.his_date / 1000), NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(SECOND, FROM_UNIXTIME(work_history.his_date / 1000), NOW()), ' seconds ago')
                WHEN TIMESTAMPDIFF(MINUTE, FROM_UNIXTIME(work_history.his_date / 1000), NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, FROM_UNIXTIME(work_history.his_date / 1000), NOW()), ' minutes ago')
                WHEN TIMESTAMPDIFF(HOUR, FROM_UNIXTIME(work_history.his_date / 1000), NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, FROM_UNIXTIME(work_history.his_date / 1000), NOW()), ' hours ago')
                ELSE CONCAT(TIMESTAMPDIFF(DAY, FROM_UNIXTIME(work_history.his_date / 1000), NOW()), ' days ago')
            END,'</small> </div> <p class=\"mb-1\">',work_history.comments,'</p> </div>' SEPARATOR '') as his, work_history.his_date,work_history.comments from work INNER join work_history on work.work_id = work_history.work_id WHERE work.work_date BETWEEN  UNIX_TIMESTAMP('$start_date') * 1000 and  UNIX_TIMESTAMP('$end_date') * 1000 and work.emp_id = $emp_id and work.work_assign_status = 'accept' GROUP by work.work_id order by work.work_date ASC;";

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


