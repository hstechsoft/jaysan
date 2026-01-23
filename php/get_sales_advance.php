<?php
 include 'db_head.php';

 

$cus_id = test_input($_GET['cus_id']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$sql = "with advance_master as(SELECT amount,advance_id,payment_id FROM `sale_payment_advance` WHERE advance_ref_id is null and cus_id = $cus_id),
advance_child as (SELECT sum(amount) as total_amount,advance_ref_id,payment_id from sale_payment_advance WHERE advance_ref_id is NOT null and cus_id = $cus_id GROUP by advance_ref_id),

advance as(SELECT am.amount,am.advance_id,ac.total_amount, am.amount-ifnull(ac.total_amount,0) as balance_amount,am.payment_id FROM advance_master am
LEFT JOIN advance_child ac on am.advance_id = ac.advance_ref_id)

SELECT advance.*,jp.payment_date,jp.ref_no,jp.utr_no  FROM advance  advance inner join jaysan_payment jp on advance.payment_id = jp.payment_id WHERE  advance.balance_amount > 0";

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


