<?php
 include 'db_head.php';

 $emp_id =test_input($_GET['emp_id']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$sql = "SET time_zone = '+05:30';"; 
$sql .= "SELECT emp_name, (SELECT count(*) as pending_work FROM `work` WHERE work.emp_id = $emp_id and work_com_status = 'incomplete' and work_date < UNIX_TIMESTAMP(CONCAT(CURDATE(), ' 00:00:00')) * 1000 ) as pending, ( SELECT count(*) as today_work FROM `work` WHERE work.emp_id = $emp_id and work_com_status = 'incomplete' and work_date BETWEEN UNIX_TIMESTAMP(CONCAT(CURDATE(), ' 00:00:00')) * 1000 and UNIX_TIMESTAMP(CONCAT(CURDATE(), ' 23:59:59')) * 1000) as today_work from employee where emp_id = $emp_id";

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


