<?php
 include 'db_head.php';

 
 $oid =test_input($_GET['oid']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "DELETE from sales_order_form WHERE oid = $oid" ;




if ($conn->query($sql) === TRUE) {
    echo "ok";
  } else {
    echo "Error deleting record: " . $conn->error;
  }
$conn->close();

 ?>


