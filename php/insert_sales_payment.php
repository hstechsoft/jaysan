<?php
 include 'db_head.php';

 $amount = test_input($_GET['amount']);
$payment_date = test_input($_GET['payment_date']);
$oid = test_input($_GET['oid']);
$ref_no = test_input($_GET['ref_no']);



function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}





$sql = "SET time_zone = '+05:30';"; // First query to set the time zone
$sql .= "INSERT INTO jaysan_payment ( amount, payment_date, oid, ref_no, sts) VALUES ( $amount,$payment_date,$oid, $ref_no, 'not_approve');";

if ($conn->multi_query($sql)) {
    // Process the first result set (e.g., time zone set)
    do {
        // Empty the result set
        if ($result = $conn->store_result()) {
            // Process results here if needed
            $result->free();
        }
    } while ($conn->next_result());

  echo "ok";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();

 ?>


