<?php
 include 'db_head.php';

 $payment_id = test_input($_POST['payment_id']);
$amount = test_input($_POST['amount']);
$oid = test_input($_POST['oid']);
$cus_id = test_input($_POST['cus_id']);
$advance_ref_id = ($_POST['advance_ref_id']);
$emp_id = test_input($_POST['emp_id']);
 echo "payment_id: $payment_id, amount: $amount, oid: $oid, cus_id: $cus_id, advance_ref_id: $advance_ref_id, emp_id: $emp_id";
$credit = 0;
$debit = 0;
// get full info
$sql_full_info = "select * from sale_order_payment_full where oid = $oid ";
$result_full_info = $conn->query($sql_full_info);
if ($result_full_info->num_rows > 0) {
  while($row = $result_full_info->fetch_assoc()) {
    $debit = $row['debit'];
    $credit = $row['credit'];
   
  }
}
 
$total_after_insert =  (float)$credit +  (float)$amount;

if($total_after_insert > $debit)
{
  http_response_code(400);
  echo "Advance amount exceed debit amount";
  $conn->close();
  exit();
}
 
 
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
  {
 http_response_code(400);
  echo "need advance reference id";
  $conn->close();
  exit();
  }
if($advance_ref_id == "NULL")
$payment_id_advance = $payment_id;

 $sql = "INSERT INTO sale_payment_advance (payment_id,amount,oid,cus_id,advance_ref_id,emp_id,dated) VALUES ($payment_id_advance,$amount,$oid,$cus_id,$advance_ref_id,$emp_id,NOW())";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


