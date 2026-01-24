<?php
 include 'db_head.php';

 $oid = test_input($_POST['oid']);

$opid = test_input($_POST['opid']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "DELETE FROM sales_order_product WHERE opid =  $opid";

  if ($conn->query($sql) === TRUE) {

$sql_delete_advance = "DELETE FROM jaysan_advance_payment WHERE jaysan_advance_payment.oid = $oid";
log_delete_query($sql_delete_advance);
if ($conn->query($sql_delete_advance) === TRUE) { 
echo "ok";
  } else {
    echo "Error deleting record: " . $conn->error;    
  }


  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


