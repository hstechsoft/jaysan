<?php
 include 'db_head.php';
 $did = test_input($_GET['did']);
 $date_query_start = ($_GET['date_query_start']);
 $date_query_end = ($_GET['date_query_end']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




//report for web lead only
$sql = "SET time_zone = '+05:30';"; 
 $sql .= "SELECT cus_name, cus_phone,implement, model, chasis_no,DATE_FORMAT(ddate, '%d-%m-%Y %h:%i %p') as ddate,ext_warranty from dealer_delivery WHERE dealer_delivery.did =  $did  and ddate BETWEEN  $date_query_start AND  $date_query_end ";
$result = $conn->multi_query($sql);
$conn->next_result();
    $result = $conn->store_result();

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
  echo "0 result";
}
$conn->close();

 ?>


