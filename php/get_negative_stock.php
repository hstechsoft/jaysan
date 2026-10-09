<?php
 include 'db_head.php';

 

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$sql = "select * from stock_full_view WHERE qty < 0";

//  $sql = "SELECT spa.*,jp.payment_date,jp.ref_no,jp.utr_no  FROM `sale_payment_advance`  spa inner join jaysan_payment jp on spa.payment_id = jp.payment_id WHERE spa.amount > 0 and spa.advance_ref_id is null and spa.cus_id = $cus_id";

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


