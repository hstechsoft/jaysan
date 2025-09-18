<?php
 include 'db_head.php';

 $req_id =test_input($_GET['req_id']);
 


 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$sql = "SET time_zone = '+05:30';"; 
$sql .= " SELECT  req_approval.*,employee.emp_name FROM `req_approval` INNER join employee on employee.emp_id = req_approval.emp_id WHERE req_approval.att_req_id = $req_id";

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


