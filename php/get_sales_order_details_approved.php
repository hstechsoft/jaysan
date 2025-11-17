<?php
 include 'db_head.php';

 $order_id = test_input($_GET['order_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = <<<SQL
SET
    time_zone = '+05:30';
SET
    @row_number = 0;
SET
    time_zone = '+05:30';
SET
    @row_number = 0;
with final as (SELECT
    sales_order_product.sub_type,
    SUM(
        sales_order_product.required_qty
    ) AS total_pro,
    (
    SELECT
        CONCAT(
            GROUP_CONCAT(
                CONCAT(
                    '<tr class = \"pay small\"><td colspan=\"2\">',
                    DATE_FORMAT(
                        jaysan_payment.payment_date,
                        '%d-%m-%Y %h:%i %p'
                    ),
                    '</td><td> ₹ ',
                    FORMAT(jaysan_payment.amount, 2),
                    '</td><td>',
                    IF(
                        jaysan_payment.sts = 'not_approve',
                        'no',
                        'yes'
                    ),
                    '</td>'
                ) SEPARATOR '</tr>'
            ),
            '</tr>'
        ) AS details
    FROM
        `jaysan_payment`
    WHERE
        jaysan_payment.oid =  $order_id 
    GROUP BY
        jaysan_payment.oid
) AS payment_details,
(
    SELECT
        IFNULL(SUM(jaysan_payment.amount),
        0)
    FROM
        jaysan_payment
    WHERE
        jaysan_payment.oid = sales_order_form.oid
) AS paid,
sales_order_form.*,
employee.emp_name,
employee.emp_role,
customer.cus_name,
customer.cus_phone

FROM
    sales_order_form
INNER JOIN employee ON sales_order_form.emp_id = employee.emp_id
INNER JOIN jaysan_payment ON sales_order_form.oid = jaysan_payment.oid
INNER JOIN customer ON sales_order_form.customer_id = customer.cus_id
INNER JOIN sales_order_product ON sales_order_form.oid = sales_order_product.oid
INNER JOIN jaysan_product_model ON jaysan_product_model.model_id = sales_order_product.model_id
INNER JOIN jaysan_model_type ON jaysan_model_type.mtid = sales_order_product.type_id
INNER JOIN jaysan_final_product ON jaysan_final_product.product_id = jaysan_product_model.product_id
WHERE
    sales_order_form.oid =  $order_id )
    
    SELECT final.*,CONCAT(
    GROUP_CONCAT(
        CONCAT(
            '<tr class = \"product small\">',
            '<td>',
            (@row_number := @row_number + 1),
            '</td><td>',(SELECT  jaysan_final_product.product_name from jaysan_final_product WHERE jaysan_final_product.product_id = (SELECT jaysan_product_model.product_id from jaysan_product_model WHERE jaysan_product_model.model_id = sop.model_id)),
            ' - ',
            (SELECT jaysan_product_model.model_name from jaysan_product_model WHERE jaysan_product_model.model_id = sop.model_id)
            ,
            ' - ',
             (SELECT  jaysan_model_type.type_name from jaysan_model_type WHERE jaysan_model_type.mtid = sop.type_id)
           ,
            '</td><td>',
            sop.sub_type,
            '</td><td>',
            sop.required_qty,
            '</td></tr>'
        ) SEPARATOR ''
    ),
    '<tr class=\" product text-bg-light\"><th colspan = \"3\">Total',
    '</th><th>',
  SUM(sop.required_qty),
    '</th></tr>'
) AS product_details from final INNER JOIN sales_order_product sop ON final.oid = sop.oid GROUP by final.oid


SQL;




if ($conn->multi_query($sql)) {
    do {
        if ($result = $conn->store_result()) {
            if ($result === false) {
                echo "Error in query execution: " . $conn->error;
                break; // Exit if an error occurs
            }

            if ($result->num_rows > 0) {
                $rows = array();
                while ($r = $result->fetch_assoc()) {
                    $rows[] = $r;
                }
                print json_encode($rows);
            } else {
                echo "0 result";
            }
            $result->free();
        }
    } while ($conn->next_result());
} else {
    echo "SQL Execution Error: " . $conn->error;
}
$conn->close();

 ?>


