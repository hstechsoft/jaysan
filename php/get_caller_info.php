<?php
 include 'db_head.php';

 
 $phone_number = test_input($_GET['phone_number']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'%".$data."%'";
return $data;
}


$sql = "SELECT customer.cus_name,customer.cus_phone FROM  customer  where customer.cus_phone  LIKE $phone_number ";

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


