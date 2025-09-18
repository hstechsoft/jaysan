<?php
 include 'db_head.php';

 $oid = test_input($_GET['oid']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




 $sql = "SELECT product ,order_no,(select count(opid) from assign_product where assign_product.opid = opid and assign_product.assign_type = 'delivered') as delivered,  concat('<ul class=\"list-group\">',GROUP_CONCAT(concat('<li class=\"list-group-item d-flex justify-content-between gap-2\"><div class=\" flex-fill \"><p class=\"my-auto\">',assign_type,'-(',details,')</p></div><div><input type=\"checkbox\"  value=\"',ass_id,'\"></div></li>') SEPARATOR ''),'</ul>') as rtd from ( SELECT (select order_no from sales_order_form where sales_order_form.oid = spv.oid) as order_no, spv.oid,spv.opid,spv.product,concat('<span class = \"text-bg-warning\">',ap.assign_type,'</span>') as assign_type,ap.dated as details,ap.ass_id from sales_product_view spv INNER JOIN assign_product ap on spv.opid = ap.opid  WHERE ap.assign_type != 'Waiting' AND ap.dcf_id = 0 and spv.oid in  (SELECT oid from sales_order_form WHERE sales_order_form.customer_id = (SELECT sales_order_form.customer_id from sales_order_form WHERE sales_order_form.oid =  $oid)) and ap.assign_type = \"Production\"
UNION ALL 
SELECT (select order_no from sales_order_form where sales_order_form.oid = spv.oid) as order_no, spv.oid,spv.opid,spv.product,concat('<span class = \"text-bg-success\">',ap.assign_type,'</span>') as assign_type,(SELECT concat(godown.godown_name,'-',godown.place) from godown WHERE godown.gid = ap.godown) as details,ap.ass_id from sales_product_view spv INNER JOIN assign_product ap on spv.opid = ap.opid  WHERE ap.assign_type != 'Waiting' AND ap.dcf_id = 0 and spv.oid in  (SELECT oid from sales_order_form WHERE sales_order_form.customer_id = (SELECT sales_order_form.customer_id from sales_order_form WHERE sales_order_form.oid =  $oid)) and ap.assign_type = \"Finshed\") as sp group by opid";

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


