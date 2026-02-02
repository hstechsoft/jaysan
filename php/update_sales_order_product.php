<?php
include 'db_head.php';

$oid = test_input($_POST['oid']);
$type_id = test_input($_POST['type_id']);
$model_id = test_input($_POST['model_id']);
$sub_type = test_input($_POST['sub_type']);
$required_qty = test_input($_POST['required_qty']);
$price = test_input($_POST['price']);
$billing_amount = test_input($_POST['billing_amount']);
$opid = test_input($_POST['opid']);
$customer_id = test_input($_POST['customer_id']);




function test_input($data)
{
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  $data = "'" . $data . "'";
  return $data;
}


$sql =  "UPDATE  sales_order_product SET oid =  $oid,type_id =  $type_id,model_id =  $model_id,sub_type =  $sub_type,required_qty =  $required_qty,price =  $price,billing_amount =  $billing_amount WHERE opid =  $opid";

if ($conn->query($sql) === TRUE) {

  $sql_delete_advance = "DELETE FROM sale_payment_advance WHERE sale_payment_advance.oid = $oid";
  log_delete_query($sql_delete_advance);
  if ($conn->query($sql_delete_advance) === TRUE) {
    require __DIR__ . '/modify_payment.php';
    modify_payment($conn, (int)str_replace("'", "", $oid), (int)str_replace("'", "", $customer_id));

    echo "ok";
  } else {
    echo "Error deleting record: " . $conn->error;
  }
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}
$conn->close();
