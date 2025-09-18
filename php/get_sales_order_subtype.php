<?php
 include 'db_head.php';

 $oid = test_input($_GET['oid']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SET time_zone = '+05:30';"; // First query to set the time zone
$sql .="SELECT sales_order_subtype.msid FROM sales_order_subtype WHERE sales_order_subtype.oid =  $oid" ;

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


