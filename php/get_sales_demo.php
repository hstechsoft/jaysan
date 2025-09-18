<?php
 include 'db_head.php';




 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



$sql =  "SELECT soid as oid, dated,concat(customer.cus_name,'-',customer.cus_phone) as cus, employee.emp_name as emp, order_no,concat('<ul class=\"list-group\">',GROUP_CONCAT(concat(' <li class=\"list-group-item\"><div class=\"d-flex justify-content-center gap-2 p-1 \"><p class=\"small text-bg-secondary m-0 p-0\">',pr,'</p>  <p class=\"small text-bg-info m-0 p-0\">',ma,'</p> <p class=\"small text-bg-success m-0 p-0\">',tn,'</p> <p class=\"small text-bg-success m-0 p-0\">',st,'</p> <p class=\"small text-bg-warning m-0 p-0\">',ass_pro.pro_qty,'</p></div> </li>') SEPARATOR ''),'</ul>') as pro, count(so_opid)as rowspan1,rowspan,concat('<ul class=\"list-group\">',GROUP_CONCAT(concat(' <li class=\"list-group-item\">',details,'</li>')  separator ''),'</ul>')  as sts from(SELECT sof.oid as soid, sof.dated,sof.order_no, sof.customer_id,sof.emp_id,(SELECT jaysan_final_product.product_name from jaysan_final_product WHERE jaysan_final_product.product_id = jaysan_product_model.product_id) as pr,jaysan_product_model.model_name as ma,jaysan_model_type.type_name as tn,ass_pro.st,ass_pro.eo,ass_pro.ln,ass_pro.oid,ass_pro.so_opid,ifnull(sum(ass_pro.tot_ass_pro),0) as tot_ass_pro,ass_pro.pro_qty,
if(pro_qty-ifnull(sum(ass_pro.tot_ass_pro),0) > 0 AND pro_qty-ifnull(sum(ass_pro.tot_ass_pro),0) != pro_qty,concat(GROUP_CONCAT(details SEPARATOR ''),'<div class = \"text-bg-warning\">Unassigned - ', pro_qty-ifnull(sum(ass_pro.tot_ass_pro),0),'</div>'),GROUP_CONCAT(details SEPARATOR '')) as details, if(pro_qty-ifnull(sum(ass_pro.tot_ass_pro),0) > 0 AND pro_qty-ifnull(sum(ass_pro.tot_ass_pro),0) != pro_qty,count(ass_pro.so_opid)+1,count(ass_pro.so_opid)) as rowspan
from(SELECT ass_pro.ti,ass_pro.mi,ass_pro.st,ass_pro.eo,ass_pro.ln,ass_pro.oid,ass_pro.so_opid,ifnull(sum(ass_pro.tot_ass_pro),0) as tot_ass_pro,ass_pro.pro_qty, concat('<div ><p class = \"small m-0 p-0 text-bg-secondary\">',AT,'-',ifnull(sum(ass_pro.tot_ass_pro),ass_pro.pro_qty - ifnull(sum(ass_pro.tot_ass_pro),0)),'</p>',GROUP_CONCAT(ass_pro.details SEPARATOR '<br>'),'</div>') as details   from(SELECT
        sales_order_product.type_id AS ti,
        sales_order_product.model_id AS mi,
        sales_order_product.sub_type AS st,
        assign_product.qty,
        assign_product.dated,
        assign_product.emergency_order AS eo,
        IFNULL(
            assign_product.assign_type,
            '<span class = \"small text-bg-warning text-decoration-underline\">Unassigned</span>'
        ) AS AT,
        assign_product.finished_details AS fd,
        assign_product.line_no AS ln,
        sales_order_product.oid,
        sales_order_product.opid AS so_opid,
        SUM(assign_product.qty) AS tot_ass_pro,
        sales_order_product.required_qty AS pro_qty,
        IF(
            assign_product.assign_type = 'Production',
            CONCAT(
                assign_product.dated,
                ' - ',
                SUM(assign_product.qty)
            ),
            IF(
                assign_product.assign_type = 'Finshed',
                CONCAT(
                
                   assign_product.finished_details,
                    ' - ',
                    SUM(assign_product.qty)
                ),
                ''
            )
        ) AS details
        
    FROM
        assign_product
    RIGHT JOIN sales_order_product ON assign_product.opid = sales_order_product.opid 
    #WHERE sales_order_product.opid = 74
    GROUP BY
        sales_order_product.opid,
        assign_product.assign_type,
        assign_product.dated  
ORDER BY `so_opid` ASC) as ass_pro  GROUP by ass_pro.so_opid,ass_pro.AT) as ass_pro  
INNER join jaysan_product_model on jaysan_product_model.model_id = ass_pro.mi
INNER join jaysan_model_type on jaysan_model_type.mtid = ass_pro.ti
INNER join sales_order_form as sof on sof.oid = ass_pro.oid 
 #WHERE sof.oid = 138
GROUP by ass_pro.so_opid)  as ass_pro
inner join customer on ass_pro.customer_id = customer.cus_id
inner join employee on ass_pro.emp_id = employee.emp_id
GROUP by oid;";

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

