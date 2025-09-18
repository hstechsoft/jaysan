<?php
 include 'db_head.php';

 
 $work_id = test_input($_GET['work_id']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT customer.cus_name,customer.cus_phone,customer.cus_location,customer.cus_address FROM  customer inner join work on customer.cus_id = work.cus_id  where work.work_id = $work_id ";

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


