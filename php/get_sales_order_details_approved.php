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



$sql = " SET time_zone = '+05:30'; SET @row_number = 0; SELECT sales_order_product.sub_type,sum(sales_order_product.required_qty) as total_pro,(SELECT CONCAT(GROUP_CONCAT(CONCAT('<tr class = \"pay small\"><td colspan=\"2\">',DATE_FORMAT(jaysan_payment.payment_date,'%d-%m-%Y %h:%i %p'),'</td><td> ₹ ',FORMAT(jaysan_payment.amount, 2),'</td><td>',IF(jaysan_payment.sts = 'not_approve','no','yes'),'</td>') SEPARATOR '</tr>'), '</tr>') AS details FROM `jaysan_payment` WHERE jaysan_payment.oid =  $order_id GROUP BY jaysan_payment.oid ) AS payment_details,(SELECT IFNULL(SUM(jaysan_payment.amount),0)FROM jaysan_payment WHERE jaysan_payment.oid = sales_order_form.oid) AS paid,sales_order_form.*,employee.emp_name,employee.emp_role,customer.cus_name,customer.cus_phone,concat(GROUP_CONCAT( CONCAT('<tr class = \"product small\">','<td>',(@row_number := @row_number + 1),'</td><td>',jaysan_final_product.product_name,' - ',jaysan_product_model.model_name, ' - ', jaysan_model_type.type_name,'</td><td>',sales_order_product.sub_type,'</td><td>',sales_order_product.required_qty,'</td></tr>') SEPARATOR ''),'<tr class=\" product text-bg-light\"><th colspan = \"3\">Total','</th><th>',sum(sales_order_product.required_qty),'</th></tr>') as product_details FROM sales_order_form INNER JOIN employee ON sales_order_form.emp_id = employee.emp_id INNER JOIN jaysan_payment ON sales_order_form.oid = jaysan_payment.oid
INNER JOIN customer ON sales_order_form.customer_id = customer.cus_id
INNER JOIN sales_order_product ON sales_order_form.oid = sales_order_product.oid
INNER JOIN jaysan_product_model on jaysan_product_model.model_id = sales_order_product.model_id
INNER JOIN jaysan_model_type on jaysan_model_type.mtid = sales_order_product.type_id
INNER join jaysan_final_product on jaysan_final_product.product_id = jaysan_product_model.product_id WHERE sales_order_form.oid = $order_id GROUP BY sales_order_form.oid;"; 


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


