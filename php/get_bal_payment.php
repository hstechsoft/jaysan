<?php
 include 'db_head.php';

 $oid_arr = ($_GET['oid_arr']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT ifnull((g.paid-g.deliver_amount),0) as balance  from (SELECT ifnull(sum(sop.price),0) as deliver_amount,(SELECT ifnull(sum(jp.amount),0) as paid_amount FROM jaysan_payment jp WHERE jp.oid in (SELECT sof.oid from sales_order_form sof WHERE sof.order_no in ( $oid_arr))) as paid from sales_order_product sop INNER JOIN assign_product ap on sop.opid = ap.opid WHERE sop.oid in (SELECT sof.oid from sales_order_form sof WHERE sof.order_no in ( $oid_arr)) and ap.dcf_id > 0) as g";

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


