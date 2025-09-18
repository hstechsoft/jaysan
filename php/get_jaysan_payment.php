<?php
 include 'db_head.php';




 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SET time_zone = '+05:30';"; 

$sql .= "SELECT employee.emp_name,customer.cus_phone,customer.cus_name, sales_order_form.order_no,jaysan_payment.*,DATE_FORMAT(jaysan_payment.payment_date, '%d-%m-%Y %h:%i %p') as date_f FROM sales_order_form INNER join jaysan_payment on sales_order_form.oid = jaysan_payment.oid INNER JOIN customer on sales_order_form.customer_id = customer.cus_id INNER JOIN employee on sales_order_form.emp_id = employee.emp_id WHERE jaysan_payment.sts = 'not_approve' order by sales_order_form.oid ASC";



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


