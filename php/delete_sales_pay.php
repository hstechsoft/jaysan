<?php
 include 'db_head.php';

 
 $payment_id =test_input($_GET['payment_id']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
// check payment is not approved
$sql_check = "SELECT * FROM jaysan_payment WHERE payment_id = $payment_id and sts = 'approved'";
$result_check = $conn->query($sql_check);
if ($result_check->num_rows > 0) {
  http_response_code(400);
  echo "payment approved no modify allowed";
  exit();
}


$oid = null;
$customer_id = null;  

$sql_get = "SELECT jaysan_payment.oid, sale_order.customer_id FROM jaysan_payment JOIN sale_order ON jaysan_payment.oid = sale_order.oid WHERE jaysan_payment.payment_id =  $payment_id";
$result_get = $conn->query($sql_get);
if ($result_get->num_rows > 0) {
  $row = $result_get->fetch_assoc();
  $oid = $row['oid'];
  $customer_id = $row['customer_id'];
} 

// delete all advance deposite linked to this payment
$sql_delete_advance = "DELETE FROM sale_payment_advance WHERE sale_payment_advance.payment_id = $payment_id and sale_payment_advance.advance_ref_id is NULL";
if ($conn->query($sql_delete_advance) === TRUE) { 
} else {
  echo "Error deleting record: " . $conn->error;    
}


$sql = "DELETE from jaysan_payment WHERE payment_id = $payment_id and sts <> 'approved'" ;



log_delete_query($sql);
if ($conn->query($sql) === TRUE) {
    echo "ok";
    require __DIR__ . '/modify_payment.php';
        modify_payment($conn, $oid, $customer_id);
  } else {
    echo "Error deleting record: " . $conn->error;
  }
$conn->close();

 ?>


