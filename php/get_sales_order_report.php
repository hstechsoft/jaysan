<?php
 include 'db_head.php';

 $emp_id = test_input($_GET['emp_id']);
 $approve_sts = ($_GET['approve_sts']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


// $sql =  "SELECT concat(customer.cus_name , ' - ' , customer.cus_phone)as customer ,concat( (select jaysan_final_product.product_name from jaysan_final_product where  jaysan_final_product.product_id = jaysan_product_model.product_id),' - ',jaysan_product_model.model_name) as product , order_category,order_no,oid,required_qty FROM sales_order_form INNER join jaysan_product_model on sales_order_form.product_id = jaysan_product_model.model_id INNER join customer on sales_order_form.customer_id = customer.cus_id  WHERE emp_id =  $emp_id  and approve_sts =0";



// $sql =  "SELECT sales_order_form.order_no,sales_order_form.order_category,sales_order_form.oid,concat(customer.cus_name , ' - ' , customer.cus_phone)as customer ,concat(GROUP_CONCAT((SELECT jaysan_product_model.model_name from jaysan_product_model WHERE jaysan_product_model.model_id = sales_order_product.model_id))) as product,sum(sales_order_product.required_qty) as required_qty  from sales_order_form INNER join sales_order_product on sales_order_form.oid = sales_order_product.oid INNER join customer on sales_order_form.customer_id = customer.cus_id  WHERE sales_order_form.emp_id =  $emp_id and sales_order_form.approve_sts =  $approve_sts GROUP by sales_order_form.oid";

// $sql =  "SELECT sod.*,concat('<ul class=\"list-group\">',GROUP_CONCAT(concat('<li class=\"list-group-item \"><span class=\"text-bg-secondary me-1\">',(SELECT jaysan_final_product.product_name from jaysan_final_product WHERE jaysan_final_product.product_id = jaysan_product_model.product_id),'</span>  <span class=\"text-bg-info me-1\">', jaysan_product_model.model_name,'</span> <span class=\"text-bg-success me-1\">',jaysan_model_type.type_name,'</span> <span class=\"text-bg-warning\"> Qty :',sod.required_qty , '</span> <p class=\"m-0 p-0\">',sod.sub_type,'</p> </li>' ) SEPARATOR ''),'</ul') as pde,DATE_FORMAT(sod.dated, '%d-%m-%Y %h:%i %p') as so_date from (SELECT sales_order_product.type_id,sales_order_product.oid,sales_order_product.model_id,sales_order_product.sub_type,sales_order_product.required_qty,employee.emp_name,concat(customer.cus_name , '</br>' , customer.cus_phone)as customer,sales_order_form.first_payment_date as dated,sales_order_form.order_no,sales_order_form.order_category from sales_order_form  INNER join sales_order_product on sales_order_form.oid = sales_order_product.oid inner JOIN employee on employee.emp_id = sales_order_form.emp_id INNER join customer on sales_order_form.customer_id = customer.cus_id where sales_order_form.approve_sts =  $approve_sts) as sod inner join jaysan_product_model on sod.model_id = jaysan_product_model.model_id inner join jaysan_model_type on sod.type_id = jaysan_model_type.mtid GROUP by sod.oid ORDER by sod.order_no asc";
$sql =  "SELECT sod.*,concat('<ul class=\"list-group\">',GROUP_CONCAT(concat('<li class=\"list-group-item \"><span class=\"text-bg-secondary me-1\">',(SELECT jaysan_final_product.product_name from jaysan_final_product WHERE jaysan_final_product.product_id = jaysan_product_model.product_id),'</span>  <span class=\"text-bg-info me-1\">', jaysan_product_model.model_name,'</span> <span class=\"text-bg-success me-1\">',jaysan_model_type.type_name,'</span> <span class=\"text-bg-warning\"> Qty :',sod.required_qty , '</span> <p class=\"m-0 p-0\">',sod.sub_type,'</p> </li>' ) SEPARATOR ''),'</ul') as pde,DATE_FORMAT(sod.dated, '%d-%m-%Y %h:%i %p') as so_date from (SELECT sales_order_product.type_id,sales_order_product.oid,sales_order_product.model_id,sales_order_product.sub_type,sales_order_product.required_qty,employee.emp_name,concat(customer.cus_name , '</br>' , customer.cus_phone)as customer,sales_order_form.first_payment_date as dated,sales_order_form.order_no,sales_order_form.order_category from sales_order_form  INNER join sales_order_product on sales_order_form.oid = sales_order_product.oid inner JOIN employee on employee.emp_id = sales_order_form.emp_id INNER join customer on sales_order_form.customer_id = customer.cus_id where 1) as sod inner join jaysan_product_model on sod.model_id = jaysan_product_model.model_id inner join jaysan_model_type on sod.type_id = jaysan_model_type.mtid GROUP by sod.oid ORDER by sod.order_no asc";
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


