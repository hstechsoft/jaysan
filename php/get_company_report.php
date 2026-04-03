<?php
 include 'db_head.php';


$emp_id_query = ($_GET['emp_id']) == '' ? 1 : " emp_id  = " . test_input($_GET['emp_id']);


// sales date
$sale_order_date_query = ($_GET['sale_order_date']) == '' ? 1 : "dated  between " . ($_GET['sale_order_date']); 
// customer
$customer_id_query = ($_GET['customer_id']) == '' ? 1 : "customer_id  = " . test_input($_GET['customer_id']);
// product_id,model_id,type_id
$product_id_query = ($_GET['product_id']) == '' ? 1 : "product_id  = " . test_input($_GET['product_id']);
$type_id_query = ($_GET['type_id']) == '' ? 1 : "type_id  = " . test_input($_GET['type_id']);
$model_id_query = ($_GET['model_id']) == '' ? 1 : "model_id  = " . test_input($_GET['model_id']);
// employee 
$emp_id_query = ($_GET['emp_id']) == '' ? 1 : "emp_id  = " . test_input($_GET['emp_id']);



function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


$sql = "with report as(SELECT soiv.* FROM sales_order_info_view soiv where $sale_order_date_query and $customer_id_query and $product_id_query and $type_id_query and $model_id_query and $emp_id_query),
monthly_wise as(select sum(required_qty*price) as total_amount, DATE_FORMAT(dated, '%Y-%M') as month from report group by DATE_FORMAT(dated, '%Y-%m') order by month desc),
product_wise as(select sum(required_qty*price) as total_amount, product,model_name,type_name from report group by product_id,model_id,type_id order by total_amount desc),
employee_wise as(select sum(required_qty*price) as total_amount, emp_name from report group by emp_id order by total_amount desc),
customer_wise as(select sum(required_qty*price) as total_amount, cus_name from report group by customer_id order by total_amount desc)
select (select JSON_ARRAYAGG(JSON_OBJECT('month', month, 'total_amount', total_amount)) as monthly_wise from monthly_wise) as monthly_wise,
(select JSON_ARRAYAGG(JSON_OBJECT('product', product, 'model_name', model_name, 'type_name', type_name, 'total_amount', total_amount)) as product_wise from product_wise) as product_wise,
(select JSON_ARRAYAGG(JSON_OBJECT('emp_name', emp_name, 'total_amount', total_amount)) as employee_wise from employee_wise) as employee_wise,
(select JSON_ARRAYAGG(JSON_OBJECT('cus_name', cus_name, 'total_amount', total_amount)) as customer_wise from customer_wise) as customer_wise;";



//  $sql = "SELECT  dcf1.dcf_id,dcf1.dated,dcf1.consignee,dcf1.sts,DATE_FORMAT(dcf1.dated, '%d-%m-%Y') as dated,employee.emp_name FROM dcf dcf1 INNER join employee on dcf1.dcf_by = employee.emp_id WHERE 1 ORDER by dcf_by ";

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




