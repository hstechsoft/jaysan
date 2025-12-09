<?php
 include 'db_head.php';

 

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "with unassigned as (SELECT  sop.required_qty,sop.oid , (sop.required_qty - sum(ifnull(ap.qty,0))) as un_assign from sales_order_product sop LEFT join assign_product ap on sop.opid = ap.opid GROUP by sop.opid),
summary as (SELECT sof.oid,sof.order_no,sum(un_assign) as unass_qty ,'un_assign' as sts from unassigned inner join sales_order_form sof on sof.oid = unassigned.oid  WHERE sof.order_category = \"Sales\" GROUP by sof.oid HAVING sum(un_assign)>0 ),
pay_summary as(SELECT  sof.order_no,sof.oid,'true' as sts from sales_order_form  sof inner join jaysan_payment jp on jp.oid = sof.oid WHERE jp.sts = 'not_approve' GROUP by sof.oid) 

SELECT JSON_ARRAYAGG(JSON_OBJECT('order_no',order_no)) as order_no,COUNT(oid) as total_pay_approval,'pay_approval' as sts from pay_summary group by sts UNION all 
SELECT JSON_ARRAYAGG(
        JSON_OBJECT('order_no',order_no)) as order_no,COUNT(oid) as total_unassigned_order,'un_assign' as sts from summary group by sts;";

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


