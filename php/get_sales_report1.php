<?php
 include 'db_head.php';




 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



// $sql =  "SELECT  sopv.pay_details,DATE_FORMAT((sof.dated), '%d-%m-%Y %r')  as dated,sof.order_no,sof.oid,emp.emp_name as emp   ,concat(cus.cus_name , ' - ' , cus.cus_phone) as cus,cus.cus_type,GROUP_CONCAT(concat('<div class = \"card \"><div class = \"card-header m-0 p-0 text-bg-secondary\">',spv.product,'</div><div class = \"card-body\">',sosv.sts,'</div></div>') SEPARATOR '') as pro,GROUP_CONCAT(sosv.sts SEPARATOR '') as sts  from sales_order_form sof
// INNER join employee emp on sof.emp_id = emp.emp_id
// INNER join customer cus on sof.customer_id = cus.cus_id
// INNER join sale_order_payment_view sopv  on sof.oid = sopv.oid
// INNER join sales_product_view spv  on sof.oid = spv.oid
// INNER join sales_order_sts_view sosv  on sof.oid = sosv.oid where sof.oid = 119 GROUP by oid";




$sql =  " SELECT pro,sopv.pay_details,DATE_FORMAT((sof.dated), '%d-%m-%Y %r')  as dated,sof.order_no,sof.oid,emp.emp_name as emp,emp.emp_id   ,concat(cus.cus_name , ' - ' , cus.cus_phone) as cus,cus.cus_type from (SELECT sof.customer_id,sof.emp_id,sop.oid,GROUP_CONCAT(concat('<div class = \"card \"><div class = \"card-header m-0 p-0 border border-1  \">',product,'</div><div class = \"card-body\">',sts,'</div></div>') SEPARATOR '') as pro from sales_order_product  sop
INNER join sales_product_view spv  on  sop.opid = spv.opid 
 INNER join sales_order_sts_view sosv  on  sop.opid = sosv.opid 
INNER join sales_order_form sof  on  sof.oid = sop.oid where sof.order_category = 'Sales' GROUP by oid) as sales_pro 
INNER join employee emp on sales_pro.emp_id = emp.emp_id
INNER join customer cus on sales_pro.customer_id = cus.cus_id
INNER join sales_order_form sof  on  sales_pro.oid = sof.oid 
INNER join sale_order_payment_view sopv  on sales_pro.oid = sopv.oid WHERE 1 order by sof.order_no DESC";
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

