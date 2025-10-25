<?php
 include 'db_head.php';


 $type_id =test_input($_GET['type_id']);
$model_id =test_input($_GET['model_id']);
$sub_type =test_input($_GET['sub_type']);
  
  



function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = <<<SQL
SELECT
    assign_product.opid,
    soiv.cus_name,
    soiv.cus_phone,
    soiv.model_name,
    soiv.sub_type,
    soiv.type_name,
    soiv.product
FROM
    `assign_product`
INNER JOIN sales_order_info_view soiv ON assign_product.opid = soiv.opid
WHERE
    assign_product.assign_type = "Finshed" AND godown > 0 and type_id = $type_id and model_id = $model_id  and sub_type = $sub_type
GROUP BY
    assign_product.opid,
    godown
SQL;





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


