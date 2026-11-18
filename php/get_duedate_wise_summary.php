<?php
 include 'db_head.php';


 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "with planner as(SELECT
    pp.planner_id,
    MAX(wo.due_date) AS due_date
FROM work_order wo
INNER JOIN demand ON wo.demand_id = demand.demand_id
INNER JOIN production_planner pp ON pp.planner_id = demand.plan_id
GROUP BY pp.planner_id
ORDER BY due_date DESC)
select  p.due_date as max_workorder_due_date,
ppv.due_date as production_plan_due_date,
   ppv.remark,
    ppv.order_no,
    ppv.oid,
    ppv.any_other_spec,
    ppv.chasis_choice,
    ppv.commitment_date,
    ppv.cus_name,
    ppv.cus_phone,
    ppv.product,
    ppv.required_qty,
    ppv.loading_type,
    ppv.production_request_count
from planner p
inner join production_plan_view ppv on p.planner_id = ppv.planner_id";


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


