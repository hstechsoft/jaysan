<?php
 include 'db_head.php';

 $chasis_no = test_input($_GET['chasis_no']);
$did = test_input($_GET['did']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT cus_name,cus_phone,cus_addr, implement, model, chasis_no,DATE_FORMAT(ddate, '%d-%m-%Y %h:%i %p') as ddate , (SELECT terms FROM wterms WHERE model_no = dealer_delivery.model)as wterms from dealer_delivery WHERE chasis_no =  $chasis_no AND did =  $did";

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


