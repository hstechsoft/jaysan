<?php
 include 'db_head.php';

 $part_id = test_input($_POST['part_id']);
$min_qty = test_input($_POST['min_qty']);
$max_qty = test_input($_POST['max_qty']);
$store_id = test_input($_POST['store_id']);
$store_type = test_input($_POST['store_type']);
$rack = test_input($_POST['rack']);
$bin = test_input($_POST['bin']);



 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO sec_stock_master ( part_id,min_qty,max_qty,store_id,store_type,rack,bin) VALUES ($part_id,$min_qty,$max_qty,$store_id,$store_type,$rack,$bin)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


