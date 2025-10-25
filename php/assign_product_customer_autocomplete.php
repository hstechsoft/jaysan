<?php
 include 'db_head.php';


 $term = ($_GET['term']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$term  = "%" .  $term ."%";

//  $sql = "SELECT
//     cus_info.*,
//     customer.cus_name,
//     customer.cus_phone
// FROM
//     (
//     SELECT
//         sales_order_product.opid,
//         sales_order_product.oid,
//         sales_order_form.customer_id,
//         sales_order_product.type_id,
//         sales_order_product.model_id,
//         sales_order_product.sub_type,
//         sales_order_product.required_qty
//     FROM
//         sales_order_product
//     INNER JOIN sales_order_form ON sales_order_form.oid = sales_order_product.oid
//     WHERE
//         sales_order_product.opid IN(
//         SELECT
//             opid
//         FROM
//             assign_product
//         WHERE
//             assign_product.dcf_id = 0 AND assign_product.assign_type = 'Production'
//         GROUP BY
//             assign_product.opid
//     )
// ) AS cus_info
// INNER JOIN customer ON cus_info.customer_id = customer.cus_id
// GROUP BY
//     oid";



 $sql = "SELECT * from(SELECT

    customer.cus_name,
    customer.cus_phone,
    customer_id as cus_id
FROM
    (
    SELECT
        sales_order_product.opid,
        sales_order_product.oid,
        sales_order_form.customer_id,
        sales_order_product.type_id,
        sales_order_product.model_id,
        sales_order_product.sub_type,
        sales_order_product.required_qty
    FROM
        sales_order_product
    INNER JOIN sales_order_form ON sales_order_form.oid = sales_order_product.oid
    WHERE
        sales_order_product.opid IN(
        SELECT
            opid
        FROM
            assign_product
        WHERE
            assign_product.dcf_id = 0 AND assign_product.assign_type = 'Production'
        GROUP BY
            assign_product.opid
    )
) AS cus_info
INNER JOIN customer ON cus_info.customer_id = customer.cus_id
GROUP BY
    oid) as final WHERE cus_name like '$term' group by cus_id";

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


