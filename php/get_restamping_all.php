<?php
 include 'db_head.php';

 


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SELECT restamping.*,customer.cus_name , customer.cus_phone,employee.emp_name  FROM restamping INNER join customer on customer.cus_id = restamping.cus_id INNER join employee ON employee.emp_id = restamping.emp_id";

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


