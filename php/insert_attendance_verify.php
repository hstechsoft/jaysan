<?php
include 'db_head.php';

$emp_id = test_input($_GET['emp_id']);
$sts = test_input($_GET['sts']);

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    $data = "'" . $data . "'";
    return $data;
}

$sql = "SET time_zone = '+05:30';";

// Update if a record exists for the same day
$sql .= "UPDATE att_verify 
         SET sts = $sts 
         WHERE emp_id = $emp_id 
           AND dated >= CURDATE() 
           AND dated < CURDATE() + INTERVAL 1 DAY;";

// Insert if no record was updated
$sql .= "INSERT INTO att_verify (emp_id, sts, dated)
         SELECT $emp_id, $sts, NOW()
         WHERE NOT EXISTS (
             SELECT 1 FROM att_verify 
             WHERE emp_id = $emp_id 
               AND dated >= CURDATE() 
               AND dated < CURDATE() + INTERVAL 1 DAY
         );";

if ($conn->multi_query($sql) === TRUE) {
    echo "ok";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
