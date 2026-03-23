<?php
 include 'db_head.php';


$customer_id =  isset($_GET['customer_id']) ? test_input($_GET['customer_id']) : null;
$customer_query = "1";
 if($customer_id){
    $customer_query = "customer.cus_id = $customer_id";
 }


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


// get all customer details    

$sql_get_customer = "SELECT sof.customer_id,customer.cus_name,cus_email,cus_phone FROM jaysan_payment jp 
inner join sales_order_form  sof on jp.oid = sof.oid
inner join customer on sof.customer_id = customer.cus_id
WHERE $customer_query AND jp.sts = 'approved' GROUP BY cus_id";

$result_get_customer = $conn->query($sql_get_customer);
$customer_arr = array();
if ($result_get_customer->num_rows > 0) {
    while($r = mysqli_fetch_assoc($result_get_customer)) {
        $customer_arr[] = $r;
    }
} else {
    echo "0 result";
}  

$result_json = array();
foreach($customer_arr as $customer){
    $customer_id = $customer['customer_id'];
    $customer_name = $customer['cus_name'];
    $customer_email = $customer['cus_email'];
    $customer_phone = $customer['cus_phone'];



$sql_sales_statement = "WITH product_price AS (
    SELECT 
(SELECT jaysan_product_model.product_id FROM jaysan_product_model WHERE model_id = sop.model_id) as product_id,
            sop.billing_amount,
             sop.price,
             sop.required_qty,
             (sop.price * sop.required_qty) AS total_price,
             sop.sub_type,
             sop.model_id,
             sop.type_id,
             sof.order_no,
             jmt.type_name as type_name,
             jpm.model_name as model_name,
             jfp.product_name as product_name
      

          
       

    FROM  sales_order_product sop 
    inner join sales_order_form sof on sof.oid = sop.oid
     INNER JOIN jaysan_product_model jpm ON jpm.model_id = sop.model_id
    INNER JOIN jaysan_final_product jfp ON jfp.product_id = jpm.product_id
    INNER JOIN jaysan_model_type jmt ON jmt.mtid = sop.type_id
    WHERE  sof.customer_id =  $customer_id
    ),

    product_summary as(
        SELECT 
product_name,
             type_name,
             model_name,
           sum(total_price) as total_price,
           sum(required_qty) as total_qty,
             JSON_ARRAYAGG(JSON_OBJECT(
     
         'order_no', order_no,
             'billing_amount', billing_amount,
             'price', price,
            'required_qty', required_qty,
             'total_price', total_price,
             'sub_type', sub_type
             )) as product_details
         from product_price GROUP BY product_id,model_id,type_id
        
    ),

spares_details AS (
    SELECT 
        JSON_ARRAYAGG(JSON_OBJECT('details', sos.qno)) AS spares_details,
        SUM(sos.amount) AS amount,
        sof.order_no
    
    FROM sale_order_spares sos
    inner join sales_order_form sof on sof.oid = sos.oid
    WHERE sof.customer_id =  $customer_id
    GROUP BY sos.oid
),

jaysan_payment_details AS (
    SELECT 
    sof.order_no,
        jp.amount,
        DATE_ONLY(jp.dated) AS dated,
        jp.utr_no
    FROM jaysan_payment jp 
    inner join sales_order_form sof on jp.oid = sof.oid
    WHERE sof.customer_id =  $customer_id
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
        SELECT   JSON_ARRAYAGG(JSON_OBJECT(
        'product_name', product_name,
            'type_name', type_name,
            'model_name', model_name,
            'total_required_qty', total_qty,
            'total_product_price', total_price,
            'product_details', product_details
       
          
        ))
        FROM product_summary
    ),
    'spares', (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'spares_details', spares_details,
            'amount', amount,
            'order_no', order_no
        ))
        FROM spares_details
    ),
    'remaining_balance', ( (SELECT ifnull(SUM(amount), 0) FROM jaysan_payment_details) -
        (SELECT ifnull(SUM(total_price), 0) FROM product_summary) +
        (SELECT ifnull(SUM(amount), 0) FROM spares_details) 
       
    ),
    'total_paid_amount', (
        SELECT ifnull(SUM(amount), 0) FROM jaysan_payment_details
    ),
    'total_product_amount', (
        SELECT ifnull(SUM(total_price), 0) FROM product_summary
    ),
    'total_spares_amount', (
        SELECT ifnull(SUM(amount), 0) FROM spares_details
    )
) AS full_result;";

$result_sales_statement = $conn->query($sql_sales_statement);
if ($result_sales_statement->num_rows > 0) {
    while($r = mysqli_fetch_assoc($result_sales_statement)) {
        $result_json[] = array(
            'customer_id' => $customer_id,
            'customer_name' => $customer_name,
            'customer_email' => $customer_email,
            'customer_phone' => $customer_phone,
            'sales_statement' => json_decode($r['full_result'], true)
        );
      
    }
} else {
    echo "0 result";
}  
}
echo json_encode($result_json);






$conn->close();

 ?>


