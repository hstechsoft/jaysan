<?php
 include 'db_head.php';

 $cus_id = test_input($_GET['cus_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "WITH product_price AS (
    SELECT 
        JSON_ARRAYAGG(JSON_OBJECT(
            'ass_id', ap.ass_id,
            'chasis_no', ap.chasis_no,
            'billing_amount', sop.billing_amount,
            'price', sop.price,
            'sub_type', sop.sub_type,
            'type_name', (SELECT jt.type_name FROM jaysan_model_type jt WHERE jt.mtid = sop.type_id),
            'model_name', (SELECT jm.model_name FROM jaysan_product_model jm WHERE jm.model_id = sop.model_id),
            'product_name', (SELECT product_name FROM jaysan_final_product 
                              WHERE product_id = (SELECT jpm.product_id 
                                                  FROM jaysan_product_model jpm 
                                                  WHERE model_id = sop.model_id)),
            'order_no', (SELECT order_no FROM sales_order_form WHERE oid = sop.oid)
        )) AS product_details,
        SUM(price)  AS total_product_price,
        ap.dcf_id,
        (SELECT DATE_ONLY(dcf.dated) FROM dcf WHERE dcf_id = ap.dcf_id) AS dcf_date
    FROM assign_product ap
    INNER JOIN sales_order_product sop ON ap.opid = sop.opid
    inner join sales_order_form sof on sof.oid = sop.oid
    WHERE ap.dcf_id > 0 
      and sof.customer_id = $cus_id
    GROUP BY ap.dcf_id
),

spares_details AS (
    SELECT 
        JSON_ARRAYAGG(JSON_OBJECT('details', sos.qno)) AS spares_details,
        SUM(sos.amount) AS amount,
        sos.dcf_no AS dcf_id,
        (SELECT DATE_ONLY(dcf.dated) FROM dcf WHERE dcf_id = sos.dcf_no) AS dcf_date
    FROM sale_order_spares sos
    inner join sales_order_form sof on sof.oid = sos.oid
    WHERE sof.customer_id = $cus_id
    GROUP BY sos.dcf_no
),

jaysan_payment_details AS (
    SELECT 
        jp.amount,
        DATE_ONLY(jp.dated) AS dated,
        jp.utr_no
    FROM jaysan_payment jp 
    inner join sales_order_form sof on jp.oid = sof.oid
    WHERE sof.customer_id = $cus_id
      AND jp.amount > 0
      AND jp.sts = 'approved'

)

SELECT  JSON_OBJECT(
    'payments', (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'credit', amount,
            'dated', dated,
            'utr_no', utr_no
        ))
        FROM jaysan_payment_details
    ),
    'products', (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'product_details', product_details,
            'total_product_price', total_product_price,
            'dcf_id', dcf_id,
            'dcf_date', dcf_date
        ))
        FROM product_price
    ),
    'spares', (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'spares_details', spares_details,
            'amount', amount,
            'dcf_id', dcf_id,
            'dcf_date', dcf_date
        ))
        FROM spares_details
    ),
    'reamining_balance', ( (SELECT COALESCE(SUM(amount), 0) FROM jaysan_payment_details) -
        (SELECT COALESCE(SUM(total_product_price), 0) FROM product_price) +
        (SELECT COALESCE(SUM(amount), 0) FROM spares_details) 
       
    ),
    'total_paid_amount', (
        SELECT COALESCE(SUM(amount), 0) FROM jaysan_payment_details
    ),
    'total_product_amount', (
        SELECT COALESCE(SUM(total_product_price), 0) FROM product_price
    ),
    'total_spares_amount', (
        SELECT COALESCE(SUM(amount), 0) FROM spares_details
    )
) AS full_result";

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


