<?php
 include 'db_head.php';

 $mtid = test_input($_GET['mtid']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT(SELECT jaysan_final_product.product_name from jaysan_final_product WHERE jaysan_final_product.product_id = jaysan_product_model.product_id) as product, jaysan_product_model.model_name, jaysan_model_type.type_name from jaysan_model_type INNER join jaysan_product_model on jaysan_model_type.pid = jaysan_product_model.model_id WHERE jaysan_model_type.mtid = $mtid";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
  echo "0 result";
}
$conn->close();

 ?>


