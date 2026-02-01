<?php
 include 'db_head.php';

 $oid = test_input($_POST['oid']);
 $customer_id = test_input($_POST['customer_id']);

$opid = test_input($_POST['opid']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
// need to check oid have atleast one product
 $sql_check = "SELECT * FROM sales_order_product WHERE oid =  $oid";
$result_check = $conn->query($sql_check);
if ($result_check->num_rows <= 1) {
  http_response_code(400);
    echo "need_one_product";
    exit();
}

 $sql =  "DELETE FROM sales_order_product WHERE opid =  $opid";

  if ($conn->query($sql) === TRUE) {

$sql_delete_advance = "DELETE FROM sale_payment_advance WHERE sale_payment_advance.oid = $oid";
log_delete_query($sql_delete_advance);
if ($conn->query($sql_delete_advance) === TRUE) { 
    require __DIR__ . '/modify_payment.php';
        modify_payment($conn, $oid, $customer_id);
echo "ok";
  } else {
    echo "Error deleting record: " . $conn->error;    
  }


  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


