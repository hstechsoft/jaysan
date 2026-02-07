<?php
include 'db_head.php';

$oid = test_input($_POST['oid']);
$qno = test_input($_POST['qno']);
$remark = test_input($_POST['remark']);
$amount = test_input($_POST['amount']);
$dcf_no = ($_POST['dcf_no']);
$customer_id = test_input($_POST['customer_id']);
echo "dcf - " . $dcf_no."\n";


function test_input($data)
{
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  $data = "'" . $data . "'";
  return $data;
}

$dcf_no = sql_nullable($dcf_no);
echo $dcf_no;
$sql = "INSERT INTO sale_order_spares ( oid,qno,remark,amount,dcf_no) VALUES ($oid,$qno,$remark,$amount,$dcf_no)";

if ($conn->query($sql) === TRUE) {
  require __DIR__ . '/modify_payment.php';
  modify_payment($conn, (int)str_replace("'", "", $oid), (int)str_replace("'", "", $customer_id));

  echo "ok";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}
$conn->close();
