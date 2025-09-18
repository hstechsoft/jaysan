<?php
 include 'db_head.php';

 $chasis_no = ($_GET['chasis_no']);


$chasis_no = '%' . $chasis_no;
//  echo $chasis_no ;
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

 $sql = "SELECT cus_name,cus_phone,cus_addr, implement, model, chasis_no,ext_warranty,dimage,DATE_FORMAT(ddate, '%d-%m-%Y %h:%i %p') as ddate , (SELECT terms FROM wterms WHERE model_no = dealer_delivery.model)as wterms from dealer_delivery WHERE chasis_no like  '$chasis_no' ";


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


