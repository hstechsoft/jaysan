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
$sql .= "SELECT DATE_FORMAT(emp_break.start_time, '%Y-%m-%dT%H:%i:%s') as start_time,bid FROM emp_break INNER join work_employee on  emp_break.wid = work_employee.wid INNER join emp_work on emp_work.wid = emp_break.wid WHERE emp_break.end_time = '0000-00-00 00:00:00' and work_employee.emp_id =  $emp_id and emp_break.brtype = 'break'";

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


