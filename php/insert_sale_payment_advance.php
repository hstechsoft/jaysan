<?php
 include 'db_head.php';

 $payment_id = test_input($_POST['payment_id']);
$amount = test_input($_POST['amount']);
$oid = test_input($_POST['oid']);
$cus_id = test_input($_POST['cus_id']);
$advance_ref_id = ($_POST['advance_ref_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$advance_ref_id = sql_nullable($advance_ref_id);
$payment_id_advance = "NULL";
if($advance_ref_id == "NULL")
$payment_id_advance = $payment_id;

 $sql = "INSERT INTO sale_payment_advance (payment_id,amount,oid,cus_id,advance_ref_id) VALUES ($payment_id_advance,$amount,$oid,$cus_id,$advance_ref_id)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


