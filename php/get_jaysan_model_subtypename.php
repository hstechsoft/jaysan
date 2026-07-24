<?php
 include 'db_head.php';

 
// if (isset($_GET['product_id'])) {
//     $product_id = test_input($_GET['product_id']);
// } else {
//     echo "Missing product_id";
//     exit;
// }

if (isset($_GET['type_id'])) {
    $type_id = test_input($_GET['type_id']);
} else {
    echo "Missing type_id";
    exit;
}
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


//  $sql = "SELECT jaysan_model_subtype.* FROM jaysan_model_subtype inner join jaysan_model_type on jaysan_model_subtype.mtid = jaysan_model_type.mtid WHERE jaysan_model_type.pid in (SELECT jaysan_product_model.model_id from jaysan_product_model WHERE jaysan_product_model.product_id = $product_id) ORDER BY `mtid`  DESC";

$sql = "SELECT jaysan_model_subtype.* FROM jaysan_model_subtype WHERE jaysan_model_subtype.mtid = $type_id ORDER BY `mtid`  DESC";

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


