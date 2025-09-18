<?php
 include 'db_head.php';




 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SET time_zone = '+05:30';"; // First query to set the time zone
$sql .= "SELECT g.*,GROUP_CONCAT( concat(\"<li  class='\",bal_cat, \"   list-group-item m-0 p-0'><div  style='background-color: lightgrey;color: black;'  class = ' text-decoration-underline p-1 d-flex  justify-content-between  gap-2'> <p class= 'm-0 p-0'>\",product,\"</p><p class= 'm-0 p-0'>\",model,\"</p><p class= 'm-0 p-0'>\",type,\"</p></div><p class= 'm-0 p-0'>\",sub_type,\"</p><div style = 'background-color: #e4e7eb;'  class = 'mt-1  p-1 d-flex  justify-content-between  gap-2'> <p class= 'm-0 p-0'>Required :\",required_qty,\"</p><p class= 'm-0 p-0'>Assigned : \",assign_qty,\"</p><p class= 'm-0 p-0'>Balance : \",bal_qty,\"</p></div>  <div class='order_list_control d-flex justify-content-between my-auto py-1  gap-1'><div> <div class='input-group input-group-sm w-75'> <label class='\",bal_cat, \" input-group-text' ><span> Qty </span> </label> <input data-max_qty='\",bal_qty,\"' type='number' class='pro_qty form-control' ></div></div>  <div><button class='btn btn-outline-danger border-0'> <i class='fa-regular fa-star'></i> </button></div> <div class='input-group input-group-sm'><select class='custom-select form-control form-sm'>

  <option  value='' selected disabled>Choose Options...</option>
<option value='Production'>Production</option>
<option value='Finshed'>Finshed</option>
<option value='Waiting'>Waiting</option>

 
 </select>
 </div><div></div><div> <button value='\",opid,\"' class=' \",bal_cat, \" pro_btn btn btn-primary btn-sm'>Add</button></div> </div>  </li>\") SEPARATOR '') as product_list from(SELECT (SELECT jaysan_final_product.product_name from jaysan_final_product WHERE jaysan_final_product.product_id = (SELECT  jaysan_product_model.product_id from jaysan_product_model WHERE jaysan_product_model.model_id = sales_order_product.model_id)) as product, (SELECT jaysan_model_type.type_name from jaysan_model_type WHERE jaysan_model_type.mtid = sales_order_product.type_id)as type,(SELECT jaysan_product_model.model_name from jaysan_product_model WHERE jaysan_product_model.model_id = sales_order_product.model_id)as model, employee.emp_name,customer.cus_name,customer.cus_phone, sales_order_product.* ,sales_order_form.order_no,(SELECT ifnull(sum(assign_product.qty),0 )from assign_product WHERE assign_product.opid = sales_order_product.opid) as assign_qty , (SELECT IF(sales_order_product.required_qty  > assign_qty, '', 'disabled')) AS bal_cat , (SELECT sales_order_product.required_qty- assign_qty) as bal_qty,DATE_FORMAT(sales_order_form.dated, '%d-%m-%Y %h:%i %p') as date_f from sales_order_form INNER JOIN sales_order_product on sales_order_form.oid = sales_order_product.oid INNER join customer on sales_order_form.customer_id = customer.cus_id INNER join employee on sales_order_form.emp_id =  employee.emp_id inner join  jaysan_payment on sales_order_form.oid =  jaysan_payment.oid where sales_order_form.approve_sts != 1)  as g WHERE oid in (SELECT  jaysan_payment.oid from jaysan_payment WHERE jaysan_payment.sts = 'approved')  group by oid;";

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


