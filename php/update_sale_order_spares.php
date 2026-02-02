<?php
 include 'db_head.php';

 $oid = test_input($_POST['oid']);
$qno = test_input($_POST['qno']);
$remark = test_input($_POST['remark']);
$amount = test_input($_POST['amount']);
$dcf_no = ($_POST['dcf_no']);
$spares_id = test_input($_POST['spares_id']);
$customer_id = test_input($_POST['customer_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$dcf_no = sql_nullable($dcf_no);
 $sql =  "UPDATE  sale_order_spares SET oid =  $oid,qno =  $qno,remark =  $remark,amount =  $amount,dcf_no =  $dcf_no,spares_id =  $spares_id WHERE spares_id =  $spares_id";

  if ($conn->query($sql) === TRUE) {
      require __DIR__ . '/modify_payment.php';
        modify_payment($conn, (int)$oid, (int)$customer_id);
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


