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
$sql .="SELECT customer.cus_name , customer.cus_phone  ,sales_order_form.*,(select ifnull(sum(amount),0)  from jaysan_payment where jaysan_payment.oid =  $oid ) as advance_payment FROM sales_order_form  INNER join customer on sales_order_form.customer_id = customer.cus_id  WHERE oid =  $oid and approve_sts = 0"; 

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


