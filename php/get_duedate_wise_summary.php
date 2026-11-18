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
     sum(wo.qty) as  work_order_qty,
    sum(demand.demand_qty) as demand_qty,
        MAX(wo.due_date) AS due_date
FROM work_order wo
INNER JOIN demand ON wo.demand_id = demand.demand_id
INNER JOIN production_planner pp ON pp.planner_id = demand.plan_id
GROUP BY pp.planner_id
ORDER BY due_date DESC),
pp as
(
    select 
production_plan_date,
planner_id,
due_date,
remark,
pp_created_by_name,
production_request_count,
product,
model_name,
type_name,
sub_type,

JSON_ARRAYAGG(JSON_OBJECT(
    'oid', oid,
    'order_category', order_category,
    'customer_id', customer_id,
    'order_type', order_type,
    'emp_id', emp_id,
    'emp_name', emp_name,
    'oe_supply', oe_supply,
    'commitment_date', commitment_date,
    'dated', dated,
    'sof_re_qty', sof_re_qty,
    'color_choice', color_choice,
    'color_choice_des', color_choice_des,
    'chasis_choice', chasis_choice,
    'chasis_choice_des', chasis_choice_des,
    'any_other_spec', any_other_spec,
    'loading_type', loading_type,
    'order_no', order_no,
    'production_untill', production_untill,
    'admin_remarks', admin_remarks,
    'approved_by', approved_by,
    'pincode', pincode,
    'delivery_addr', delivery_addr,
    'approve_sts', approve_sts,
    'total_payment', total_payment,
    'nex_payment_date', nex_payment_date,
    'first_payment_date', first_payment_date,
    'cus_name', cus_name,
    'cus_phone', cus_phone,
    'opid', opid,
    'type_id', type_id,
    'model_id', model_id,
    'sub_type', sub_type,
    'required_qty', required_qty,
    'price', price,
    'model_name', model_name,
    'product_id', product_id,
    'product', product,
    'type_name', type_name
  
)) as order_details
 from  production_plan_view ppv GROUP BY planner_id
)
select 
date_only(p.due_date) as max_workorder_due_date,
p.work_order_qty,
p.demand_qty,
date_only(ppv.due_date) as production_plan_due_date,
    ppv.planner_id,
   ppv.remark,
      ppv.production_request_count,
      ppv.order_details
from planner p
inner join pp ppv on p.planner_id = ppv.planner_id;
";


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


