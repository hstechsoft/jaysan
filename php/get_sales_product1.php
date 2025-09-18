<?php
 include 'db_head.php';

 $oid = test_input($_GET['oid']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




 $sql = "SELECT sop.*, jpm.model_id,jpm.model_name,jmt.mtid,jmt.type_name,(SELECT jaysan_final_product.product_name FROM jaysan_final_product WHERE jaysan_final_product.product_id = jpm.product_id) as produt  FROM sales_order_product sop INNER join jaysan_product_model jpm on sop.model_id = jpm.model_id
INNER join jaysan_model_type jmt on sop.type_id = jmt.mtid WHERE sop.oid =  $oid";

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


