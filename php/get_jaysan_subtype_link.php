<?php
 include 'db_head.php';

 $product_id = test_input($_POST['product_id']);
 $model_id = test_input($_POST['model_id']);
 $type_id = test_input($_POST['type_id']);

 $product_query = 1;
 $model_query = 1;
 $type_query = 1;
 
 if($product_id != 0){
    $product_query = "product_id = ".$product_id;
 }
 if($model_id != 0){
    $model_query = "model_id = ".$model_id;
 }
 if($type_id != 0){
    $type_query = "mtid = ".$type_id;
 }

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


// get msid from jaysan_product_view
$sql_get_msid = "SELECT jpv.product_id,jpv.model_id,jpv.mtid,jpv.product_name,jpv.model_name,jpv.type_name,JSON_ARRAYAGG(JSON_OBJECT('msid', jpv.msid, 'subtype_name', jpv.subtype_name)) as sub_type FROM jaysan_product_view jpv INNER JOIN jaysan_subtype_link on jpv.msid = jaysan_subtype_link.msid WHERE ".$product_query." AND ".$model_query." AND ".$type_query;






$result = $conn->query($sql_get_msid);

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


