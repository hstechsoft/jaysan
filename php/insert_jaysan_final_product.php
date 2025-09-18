<?php
 include 'db_head.php';

 $product_name = test_input($_GET['product_name']);
$product_model = test_input($_GET['product_model']);
$product_type = test_input($_GET['product_type']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$product_id = 0;
$model_id = 0;
$sql_insert_product = "INSERT INTO jaysan_final_product (product_name)
                       VALUES ($product_name)
                       ON DUPLICATE KEY UPDATE product_id = LAST_INSERT_ID(product_id)";

 if ($conn->query($sql_insert_product) === TRUE) {
  $product_id = $conn->insert_id;

  $sql_insert_model = "INSERT INTO jaysan_product_model (product_id,model_name) VALUES ($product_id,$product_model)
  ON DUPLICATE KEY UPDATE model_id = LAST_INSERT_ID(model_id)";
  if ($conn->query($sql_insert_model) === TRUE) {
    $model_id = $conn->insert_id;
$sql_insert_type = "INSERT INTO  jaysan_model_type (pid,type_name) VALUES ($model_id,$product_type)";
if ($conn->query($sql_insert_type) === TRUE) {
  echo $conn->insert_id;
 }
 else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}
  }
 
 else {
     echo "Error: " . $sql . "<br>" . $conn->error;
   }
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }



$conn->close();

 ?>


