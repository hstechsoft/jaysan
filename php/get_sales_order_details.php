<?php
 include 'db_head.php';

 $ass_id = test_input($_GET['ass_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SET time_zone = '+05:30';"; // First query to set the time zone
$sql .="SELECT (SELECT concat( GROUP_CONCAT(concat('<tr class = \"pay small\"><td colspan=\"2\">',DATE_FORMAT(jaysan_payment.payment_date, '%d-%m-%Y %h:%i %p'),'</td><td> ₹ ',FORMAT(jaysan_payment.amount, 2),'</td><td>',if(jaysan_payment.sts = 'not_approve','no','yes'),'</td>') SEPARATOR '</tr>'),'</tr>')as details FROM `jaysan_payment` WHERE jaysan_payment.oid = sales_order_product.oid GROUP by jaysan_payment.oid) as payment_details, (SELECT ifnull(sum(jaysan_payment.amount),0) from jaysan_payment WHERE jaysan_payment.oid  = sales_order_form.oid ) as paid, assign_product.ass_id,sales_order_form.*,employee.emp_name, customer.cus_name,customer.cus_phone ,(SELECT jaysan_product_model.model_name from jaysan_product_model WHERE jaysan_product_model.model_id = sales_order_product.model_id) as model,(SELECT jaysan_model_type.type_name FROM jaysan_model_type WHERE jaysan_model_type.mtid = sales_order_product.type_id) as type,(SELECT jaysan_final_product.product_name from jaysan_final_product WHERE jaysan_final_product.product_id = (SELECT jaysan_product_model.product_id from jaysan_product_model WHERE jaysan_product_model.model_id = sales_order_product.model_id)) as product,sales_order_form.oid,sales_order_product.sub_type,DATE_FORMAT(sales_order_form.dated, '%d-%m-%Y %h:%i %p') as date_f from sales_order_product INNER join assign_product on sales_order_product.opid = assign_product.opid INNER join sales_order_form on sales_order_product.oid = sales_order_product.oid INNER JOIN customer ON sales_order_form.customer_id = customer.cus_id  INNER join employee on sales_order_form.emp_id = employee.emp_id  where sales_order_product.opid = (SELECT assign_product.opid from assign_product WHERE assign_product.ass_id = $ass_id) and assign_product.ass_id = $ass_id"; 

if ($conn->multi_query($sql)) {
    // Move to the second result set
    $conn->next_result();
    $result = $conn->store_result();

    if ($result->num_rows > 0) {
        $rows = array();
        while($r = $result->fetch_assoc()) {
            $rows[] = $r;
        }
        print json_encode($rows);
    } else {
        echo "0 result";
    }

    $result->free();
} else {
    echo "Error: " . $conn->error;
}
$conn->close();

 ?>


