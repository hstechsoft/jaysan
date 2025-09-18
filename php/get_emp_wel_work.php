<?php
 include 'db_head.php';

 $emp_id = test_input($_GET['emp_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$sql = "SET time_zone = '+05:30';"; 
$sql .= "SELECT emp_work.*,DATE_FORMAT(emp_work.start_time, '%d-%m-%Y %h:%i %p') as  start_time_f,jaysan_process.process_name FROM `emp_work` INNER join work_employee on  emp_work.wid = work_employee.wid INNER join jaysan_process on emp_work.process_id = jaysan_process.process_id WHERE work_employee.emp_id =  $emp_id  and emp_work.sts = 'ip' LIMIT 1";

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

 ?>


