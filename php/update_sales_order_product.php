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

$subtype_details = isset($_POST['subtype_details']) ? $_POST['subtype_details'] : 0;
if($subtype_details == 0)
{
  echo "Please select at least one subtype.";
  exit();
}
else
{
  $subtype_details = explode(',', $subtype_details);
}


function test_input($data)
{
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  $data = "'" . $data . "'";
  return $data;
}

echo "oid: $oid, type_id: $type_id, model_id: $model_id, sub_type: $sub_type, required_qty: $required_qty, price: $price, billing_amount: $billing_amount, opid: $opid, customer_id: $customer_id, subtype_details: " . implode(',', $subtype_details) . "\n";

exit()


// delete sales_order_subtype record
$sql_delete_subtype = "DELETE FROM sales_order_subtype WHERE opid =  $opid";
if($conn->query($sql_delete_subtype) === TRUE){
  // echo "subtype deleted";
} else {
  echo "Error deleting subtype record: " . $conn->error;
  exit();
}


$sql =  "UPDATE  sales_order_product SET oid =  $oid,type_id =  $type_id,model_id =  $model_id,sub_type =  $sub_type,required_qty =  $required_qty,price =  $price,billing_amount =  $billing_amount WHERE opid =  $opid";

if ($conn->query($sql) === TRUE) {


  $last_opid = $opid;
  foreach ($subtype_details as $subtype_id) {
    $sql_insert_subtype_details = "INSERT INTO sales_order_subtype (opid, msid) VALUES ('$last_opid', '$subtype_id');";
    if ($conn->query($sql_insert_subtype_details) === TRUE) {
        // Successfully inserted subtype details
    } else {
        echo "Error: " . $sql_insert_subtype_details . "<br>" . $conn->error;
    }
  }

   require __DIR__ . '/modify_payment.php';
    modify_payment($conn, (int)str_replace("'", "", $oid), (int)str_replace("'", "", $customer_id));

    echo "ok";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}
$conn->close();
