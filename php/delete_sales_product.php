<?php
 include 'db_head.php';

 
 $opid =test_input($_GET['opid']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "DELETE from sales_order_product WHERE opid = $opid" ;




if ($conn->query($sql) === TRUE) {
    echo "ok";
  } else {
    echo "Error deleting record: " . $conn->error;
  }
$conn->close();

 ?>


