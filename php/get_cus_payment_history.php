<?php
 include 'db_head.php';

 $cus_id =test_input($_GET['cus_id']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$sql = "SET time_zone = '+05:30';"; 
$sql .= "SELECT price,product,DATE_FORMAT(dated, '%d-%m-%Y %h:%i %p') as dated,sts from(SELECT concat('-',price) as price,product,dcf.dated,order_no,'deliver' as sts from (SELECT price,product,assign_product.dcf_id,order_no  from(SELECT sap.price,sap.opid,product,sap.oid,order_no from (SELECT sop.price,sop.opid,sof.oid,sof.order_no from sales_order_form sof INNER join sales_order_product sop on sof.oid = sop.oid  WHERE sof.customer_id =  $cus_id) as sap inner join sales_product_view spv on sap.opid = spv.opid  ) as dcfr INNER join assign_product on dcfr.opid = assign_product.opid WHERE assign_product.dcf_id > 0) as de INNER join dcf on de.dcf_id = dcf.dcf_id
UNION all 

SELECT jp.amount as price, '' as product,jp.payment_date as dated,sof.order_no,'pay' as sts from jaysan_payment jp INNER JOIN sales_order_form sof on jp.oid = sof.oid WHERE sof.customer_id =  $cus_id and jp.sts = 'approved') as dcfr order by dated";

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


