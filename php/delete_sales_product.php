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

// delete sales_order_subtype record
$sql_delete_subtype = "DELETE FROM sales_order_subtype WHERE opid =  $opid";
if($conn->query($sql_delete_subtype) === TRUE){
  // echo "subtype deleted";
} else {
  echo "Error deleting subtype record: " . $conn->error;
  exit();
}



$sql = "DELETE from sales_order_product WHERE opid = $opid" ;



log_delete_query($sql);
if ($conn->query($sql) === TRUE) {
    echo "ok";
  } else {
    echo "Error deleting record: " . $conn->error;
  }
$conn->close();

 ?>


