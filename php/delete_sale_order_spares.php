<?php
 include 'db_head.php';


$spares_id = test_input($_POST['spares_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$oid = null;
$customer_id = null;
// get oid and customer id before delete
$sql_get = "SELECT sale_order_spares.oid, sale_order. customer_id FROM sale_order_spares JOIN sale_order ON sale_order_spares.oid = sale_order.oid WHERE sale_order_spares.spares_id =  $spares_id";
$result_get = $conn->query($sql_get);
if ($result_get->num_rows > 0) {
  $row = $result_get->fetch_assoc();
  $oid = $row['oid'];
  $customer_id = $row['customer_id'];
}


 $sql =  "DELETE FROM sale_order_spares WHERE spares_id =  $spares_id";

  if ($conn->query($sql) === TRUE) {
      require __DIR__ . '/modify_payment.php';
        modify_payment($conn, $oid, $customer_id);
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


