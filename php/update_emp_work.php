<?php
 include 'db_head.php';

 $wid = test_input($_GET['wid']);




 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

// Update for `work_employee`
$sql_emp = "SET time_zone = '+05:30'; 
UPDATE work_employee
SET sts = 'finish', end_time = NOW()
WHERE wid = $wid AND sts = 'live';";

if ($conn->multi_query($sql_emp)) {
    do {
        // Consume multiple result sets if any
        if ($result = $conn->store_result()) {
            $result->free();
        }
    } while ($conn->more_results() && $conn->next_result());
} else {
    echo "Error in work_employee update: " . $conn->error;
}

// Update for `emp_work`
$sql_work = "SET time_zone = '+05:30'; 
UPDATE emp_work
SET sts = 'finish', end_time = NOW()
WHERE wid = $wid AND sts = 'ip';";

if ($conn->multi_query($sql_work)) {
    do {
        // Consume multiple result sets if any
        if ($result = $conn->store_result()) {
            $result->free();
        }
    } while ($conn->more_results() && $conn->next_result());
    echo "ok";
} else {
    echo "Error in emp_work update: " . $conn->error;
}

$conn->close();
 ?>


