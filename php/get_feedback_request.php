<?php
 include 'db_head.php';

 


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "select review_id,cus_name,cus_phone,cus_addr,dealer_name,chasis_no,implement,service_person_name,rating_service,rating_dealer,DATE_FORMAT(review_date, '%d-%m-%Y %h:%i %p') as review_date ,cus_id from review where work_id = 0";

$result = $conn->query($sql);

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


