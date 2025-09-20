<?php
 include 'db_head.php';

 



$date_query = ($_GET['date_query']);
 $cus_query = ($_GET['cus_query']);
 $sub_type_query = ($_GET['sub_type_query']);
  $model_query = ($_GET['model_query']);
   $type_query = ($_GET['type_query']);
     $product_query = ($_GET['product_query']);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$sql = "SET time_zone = '+05:30';"; 
// $sql .= "SELECT

//     assign_data.*,
//     ifnull(assign_data.qty -  IFNULL(SUM(pma.qty),
//     0),0) as aqty,
//     IFNULL(SUM(pma.qty),
//     0) AS modify_qty,
//      concat('<ul class=\"list-group small  mt-1\">', '<li class=\"list-group-item active small\">Modification requseted</li>',
//     GROUP_CONCAT(
//         CONCAT(
//             '<li class=\"list-group-item small\">',
//             DATE_FORMAT(pma.modify_date, '%d-%m-%Y'),
//             ' - ',
//             pma.qty,
//             '</li>'
//         ) SEPARATOR ''
//     ) ,'</ul>')AS date_info
// FROM
//     (
//     SELECT
//         COUNT(*) AS qty,
//         opid,
//         assign_date,
//         CONCAT(
//             '<div class=\"d-flex justify-content-center gap-2 p-1 \">
// <p class=\"small  m-0 p-0\">',
//             (
//             SELECT
//                 jaysan_final_product.product_name
//             FROM
//                 jaysan_final_product
//             WHERE
//                 jaysan_final_product.product_id = jaysan_product_model.product_id
//         ),
//         '</p>  <p class=\"small m-0 p-0\">',
//         jaysan_product_model.model_name,
//         '</p> <p class=\"small  m-0 p-0\">',
//         jaysan_model_type.type_name,
//         '</p>',
//         '<p class=\" m-0 p-0 small \"> Qty :',
//         COUNT(*),
//         '</p></div><p class=\" m-0 p-0 small text-muted\">',
//         pm.sub_type,
//         '</p>'
//         ) AS product,
//         sales_order_form.customer_id,
//         (
//         SELECT
//             CONCAT(
//                 customer.cus_name,
//                 ' - ',
//                 customer.cus_phone
//             )
//         FROM
//             customer
//         WHERE
//             customer.cus_id = sales_order_form.customer_id 
//     ) AS customer
// FROM
//     (
//     SELECT
//      assign_product.dated as assign_date,
//         sales_order_product.opid,
//         sales_order_product.oid,
//         sales_order_product.type_id,
//         sales_order_product.model_id,
//         sales_order_product.sub_type,
//         sales_order_product.required_qty
//     FROM
//         `assign_product`
//     INNER JOIN sales_order_product ON assign_product.opid = sales_order_product.opid
//     WHERE
//         $date_query AND assign_product.assign_type = 'Production' AND dcf_id = 0 and $sub_type_query
// ) AS pm
// INNER JOIN jaysan_product_model ON pm.model_id = jaysan_product_model.model_id
// INNER JOIN jaysan_model_type ON pm.type_id = jaysan_model_type.mtid
// INNER JOIN sales_order_form ON pm.oid = sales_order_form.oid where $cus_query and $model_query and $type_query 
// GROUP BY
//     customer_id,
//     opid
// ) AS assign_data
// LEFT JOIN production_modify_approval pma ON
//     assign_data.opid = pma.opid
// GROUP BY
//     assign_data.opid,assign_data.assign_date;";



$sql .= <<<SQL
WITH
    assign_info AS(
    SELECT
        ap.ass_id,
        ap.opid,
        ap.qty,
        ap.dated,
        ap.emergency_order,
        ap.assign_type,
        ap.finished_details,
        ap.line_no,
        ap.godown,
        ap.chasis_no,
        ap.dcf_id,
        SUM(ap.qty) OVER(
    PARTITION BY opid
    ) AS total_assigned_no,
    SUM(ap.qty) OVER(
    PARTITION BY opid,
    ap.assign_type
) AS total_assign_type,
SUM(ap.qty) OVER(
    PARTITION BY opid,
    ap.assign_type,
    ap.dated
) AS total_assign_dated,
soiv.cus_name,
soiv.oid,
soiv.required_qty,
soiv.product,
soiv.model_name,
soiv.type_name,
soiv.sub_type,
soiv.order_no,
 soiv.type_id,
    soiv.model_id,
(
    soiv.required_qty - SUM(ap.qty) OVER(
PARTITION BY opid
)
) AS unassi
FROM
    assign_product ap
INNER JOIN sales_order_info_view soiv ON
    ap.opid = soiv.opid
ORDER BY
    unassi ASC
)
SELECT
    *
FROM
    assign_info
LEFT JOIN(
    SELECT
        pma.opid,
        SUM(pma.qty) AS total_modify_qty,
        date_only(pma.modify_date) AS modify_date,
        date_only(pma.actual_date) AS actual_date_f,
        pma.actual_date
    FROM
        `production_modify_approval` pma
    WHERE
        pma.sts = "un_approve"
    GROUP BY
        opid,
        actual_date
) AS pma
ON
        assign_info.opid = pma.opid AND assign_info.dated = pma.actual_date  where $date_query and  $type_query and  $model_query and $sub_type_query and $product_query  and assign_info.assign_type = "Production"  group by assign_info.opid,assign_info.dated limit 30;;  ;  
SQL;


// Execute the multi_query
if ($conn->multi_query($sql)) {
    // This loop is used to handle multiple result sets
    do {
        // Store the result set from the query
        if ($result = $conn->store_result()) {
            if ($result->num_rows > 0) {
                $rows = array();
                while($r = $result->fetch_assoc()) {
                    $rows[] = $r;
                }
                // Output the result as JSON
                print json_encode($rows);
            } else {
                echo "0 result";
            }
            $result->free(); // Free the result set
        }
        // Check if there are more result sets
    } while ($conn->more_results() && $conn->next_result());
} else {
    // If the multi_query fails, output the error
    echo "Error: " . $conn->error;
}
$conn->close();

 ?>


