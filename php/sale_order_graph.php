<?php
 include 'db_head.php';


 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "with pay_summary as (SELECT  sof.oid,'true' as sts from sales_order_form  sof inner join jaysan_payment jp on jp.oid = sof.oid WHERE jp.sts = 'not_approve' GROUP by sof.oid),
unassigned as (SELECT  sop.required_qty,sop.oid , (sop.required_qty - sum(ifnull(ap.qty,0))) as un_assign from sales_order_product sop left join assign_product ap on sop.opid = ap.opid GROUP by sop.opid),
unass_summary as (SELECT oid,sum(un_assign) as unass_qty from unassigned GROUP by oid)


SELECT sof.oid,pay_summary.sts,unass_qty from sales_order_form sof LEFT join pay_summary on sof.oid = pay_summary.oid left join unass_summary on sof.oid = unass_summary.oid";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


