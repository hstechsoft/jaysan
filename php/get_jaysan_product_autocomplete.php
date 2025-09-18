<?php
 include 'db_head.php';


 $product = test_input($_GET['product']);
 $term = test_input($_GET['term']);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

if($term == "'pname'"){
    $sql = "SELECT product_name FROM `jaysan_final_product` WHERE product_name LIKE $product";
}
else if($term == "'pmodel'"){
    $sql = "SELECT model_name as product_name FROM jaysan_product_model WHERE model_name LIKE $product";
}
else if($term == "'ptype'"){
    $sql = "SELECT type_name as product_name FROM  jaysan_model_type WHERE type_name LIKE $product";
};



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


