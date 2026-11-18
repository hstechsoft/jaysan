<?php
 include 'db_head.php';


 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "select pp.due_date,
sum(ppv.production_request_count) as total_production_request_count,
JSON_ARRAYAGG(JSON_OBJECT(
    'plan_name', pp.plan_name,
    'remark', pp.remark,
    'order_no', ppv.order_no,
    'oid', ppv.oid,
    'any_other_spec', ppv.any_other_spec,
    'chasis_choice', ppv.chasis_choice,
    'commitment_date', ppv.commitment_date,
    'cus_name', ppv.cus_name,
    'cus_phone', ppv.cus_phone,
    'product', ppv.product,
    'required_qty', ppv.required_qty,
    'loading_type', ppv.loading_type,
    'production_request_count', ppv.production_request_count
)) as plan_details from production_planner pp
inner join production_plan_view ppv on pp.planner_id = ppv.planner_id GROUP BY pp.due_date";


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


