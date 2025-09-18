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



// $sql =  "SELECT final.* , concat('
//             <div class=\"d-flex justify-content-center gap-2 p-1 \">
//                 <p class=\"small text-bg-secondary m-0 p-0\">',(SELECT jaysan_final_product.product_name FROM jaysan_final_product WHERE jaysan_final_product.product_id = jaysan_product_model.product_id),'</p>  <p class=\"small text-bg-info m-0 p-0\">', jaysan_product_model.model_name,'</p> <p class=\"small text-bg-success m-0 p-0\">',jaysan_model_type.type_name,'</p>','<p class=\" m-0 p-0 small text-bg-warning\"> Qty :',final.required_qty , '</p></div><p class=\" m-0 p-0 small text-muted\">',final.sub_type,'</p>'  ) as product from(SELECT so.*,sum(qty) as assign_qty,concat('<ul class=\"list-group\">',GROUP_CONCAT(concat('<li class=\"list-group-item \">',so.assign_type,' - ', so.qty,'</li>') SEPARATOR ''),'<li class=\"list-group-item fw-bold\">', 'Unassigned - ',so.required_qty - sum(qty),'</li></ul>') as summary from(SELECT sales_order_product.type_id,sales_order_product.model_id,sales_order_product.sub_type,sales_order_product.opid,sales_order_product.oid,sales_order_product.required_qty,sum(assign_product.qty)as qty,assign_product.assign_type
//  from sales_order_product INNER join assign_product on sales_order_product.opid = assign_product.opid WHERE sales_order_product.oid = $order_id GROUP by sales_order_product.opid , assign_product.assign_type) as so   GROUP by so.opid UNION ALL SELECT sales_order_product.type_id,sales_order_product.model_id,sales_order_product.sub_type,sales_order_product.opid,sales_order_product.oid,sales_order_product.required_qty,'0' as qty, 'Unassigned' as assign_type,'0' as assign_qty,concat('Unassigned - ',sales_order_product.required_qty) as summary from sales_order_product WHERE sales_order_product.opid not in (SELECT assign_product.opid from assign_product) and sales_order_product.oid = $order_id) as final INNER join jaysan_product_model on final.model_id = jaysan_product_model.model_id INNER join jaysan_model_type on final.type_id = jaysan_model_type.mtid;";




$sql =  "SELECT GROUP_CONCAT(concat('<tr class = \"product_sts samll\"><td colspan = \"2\">',product,'</td><td colspan = \"2\">',sts,'</td></tr>') separator '')as product,GROUP_CONCAT(sts SEPARATOR '') as  sts, GROUP_CONCAT(concat('<div class = \"card \"><div class = \"card-header m-0 p-0 border border-1  \">',product,'</div><div class = \"card-body\">',sts,'</div></div>') SEPARATOR '') as pro from sales_order_product  sop
INNER join sales_product_view spv  on  sop.opid = spv.opid 
 INNER join sales_order_sts_view sosv  on  sop.opid = sosv.opid 
INNER join sales_order_form sof  on  sof.oid = sop.oid WHERE sof.oid = $order_id ";

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
