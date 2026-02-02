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
$sql_get = "SELECT sale_order_spares.oid, sales_order_form. customer_id FROM sale_order_spares JOIN sales_order_form ON sale_order_spares.oid = sales_order_form.oid WHERE sale_order_spares.spares_id =  $spares_id";
$result_get = $conn->query($sql_get);
if ($result_get->num_rows > 0) {
  $row = $result_get->fetch_assoc();
  $oid = $row['oid'];
  $customer_id = $row['customer_id'];
}


 $sql =  "DELETE FROM sale_order_spares WHERE spares_id =  $spares_id";

  if ($conn->query($sql) === TRUE) {
      require __DIR__ . '/modify_payment.php';
        modify_payment($conn, (int)str_replace("'", "", $oid), (int)str_replace("'", "", $customer_id));
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


