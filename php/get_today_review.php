<?php
 include 'db_head.php';

 $did = test_input($_GET['did']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$sql = "SET time_zone = '+05:30';"; 
$sql .= "SELECT cus_name, service_person_name, chasis_no,DATE_FORMAT(review_date, '%d-%m-%Y %H:%i %p') as ddate FROM review WHERE review_date BETWEEN CURRENT_DATE AND NOW() and did = $did";

if ($conn->multi_query($sql)) {
    // Move to the second result set
    $conn->next_result();
    $result = $conn->store_result();

    if ($result->num_rows > 0) {
        $rows = array();
        while($r = $result->fetch_assoc()) {
            $rows[] = $r;
        }
        print json_encode($rows);
    } else {
        echo "0 result";
    }

    $result->free();
} else {
    echo "Error: " . $conn->error;
}

$conn->close();
?>

