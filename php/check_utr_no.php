<?php
 include 'db_head.php';



 $utr_no = test_input($_GET['utr_no']);
  $oid = test_input($_GET['oid']);
    $payment_id = test_input($_GET['payment_id']);

  

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}






$sql = "SELECT if($payment_id = payment_id,'ok','no') as  sts  FROM `jaysan_payment` WHERE utr_no = $utr_no ";


$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        echo $r["sts"];
    }
    
} else {
  echo "0 result";
}
$conn->close();

 ?>


