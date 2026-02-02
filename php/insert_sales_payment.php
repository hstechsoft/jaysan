<?php
 include 'db_head.php';

 $amount = test_input($_POST['amount']);
$payment_date = test_input($_POST['payment_date']);
$oid = test_input($_POST['oid']);
$ref_no = test_input($_POST['ref_no']);
$utr_no = test_input($_POST['utr_no']);

$customer_id = test_input($_POST['customer_id']);



function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO jaysan_payment ( amount, payment_date, oid, ref_no, sts,utr_no) VALUES ( $amount,$payment_date,$oid, $ref_no, 'not_approve',$utr_no)";

  if ($conn->query($sql) === TRUE) {
   $payment_id = $conn->insert_id;
  
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }


  require __DIR__ . '/modify_payment.php';
        modify_payment($conn, (int)$oid, (int)$customer_id);
echo "ok";

$conn->close();

 ?>


