<?php
 include 'db_head.php';
$min_qty = test_input($_POST['min_qty']);
$max_qty = test_input($_POST['max_qty']);
$store_type = test_input($_POST['store_type']);

$store_id = test_input($_POST['store_id']);
$master_id = test_input($_POST['master_id']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $update_sql = "UPDATE sec_stock_master SET min_qty = $min_qty, max_qty = $max_qty, store_type = $store_type,store_id = $store_id WHERE master_id = $master_id";

  if ($conn->query($update_sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $update_sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


