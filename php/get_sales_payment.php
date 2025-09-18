<?php
 include 'db_head.php';

 $oid_arr = ($_GET['oid_arr']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT  concat('₹',FORMAT(jaysan_payment.amount, 0)) as amount,DATE_FORMAT(jaysan_payment.payment_date, '%d-%m-%Y %h:%i %p') as date_f ,jaysan_payment.sts,(SELECT sales_order_form.order_no from sales_order_form WHERE sales_order_form.oid = jaysan_payment.oid) as order_no from jaysan_payment WHERE jaysan_payment.oid in (SELECT sales_order_form.oid from sales_order_form WHERE sales_order_form.order_no in ( $oid_arr )) order by order_no";

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


