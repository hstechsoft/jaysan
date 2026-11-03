<?php
 include 'db_head.php';


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


 $sql = "with
  full_demand_details as (
    select
      demand.part_id,
      demand.demand_id,
      demand.process_id,
      demand.plan_id,
      demand.demand_qty,
      wo.created_by as wo_created_by,
      ifnull (wo.qty, 0) as wo_qty,
      ifnull (wo.pending_qty, 0) as wo_pending_qty,
      -- demand.demand_qty - ifnull (wo.qty, 0) as remaining_unassigned_qty,
      wo.work_order_id,
      wo.godown,
      wo.dep,
      wo.sec,
      ifnull (wo.completed_qty, 0) as wo_completed_qty,
      date_only ((wo.due_date)) as wo_due_date,
      wo_godown.creditor_name as wo_godown_name,
      wo_dep.dep_name as wo_dep_name,
      wo_dep_sec.sec_name as wo_dep_sec_name,
      wo_emp.emp_name as wo_created_by_name,

      jpv.final_part,
      jpv.final_part_id,
      jpv.final_part_only,
      jpv.process_name
    from
      demand
      
      left join work_order wo on demand.demand_id = wo.demand_id
      left join jaysan_process_view jpv on demand.process_id = jpv.process_id
      left join creditors wo_godown on wo.godown = wo_godown.creditor_id
      left join department wo_dep on wo.dep = wo_dep.dep_id
      left join dep_section wo_dep_sec on wo.sec = wo_dep_sec.dep_sec_id
      left join employee wo_emp on wo.created_by = wo_emp.emp_id
  ),
plan_summary as(select
  part_id,
  demand_id,
  process_id,
  plan_id,
  demand_qty,
 
  godown,
  dep,
  sec,
  sum(wo_qty) as total_wo_qty,
  sum(wo_pending_qty) as total_wo_pending_qty,
  sum(wo_completed_qty) as total_wo_completed_qty,
  demand_qty - sum(wo_qty) as remaining_unassigned_qty,
  max(wo_due_date) as max_wo_due_date,
   if(wo_qty > 0, JSON_ARRAYAGG(
    JSON_OBJECT(
      'wo_created_by', wo_created_by,
      'wo_created_by_name', wo_created_by_name,
      'wo_qty', wo_qty,
      'wo_pending_qty', wo_pending_qty,
      'work_order_id', work_order_id,
      'due_date', wo_due_date,
      'wo_godown', godown,
      'wo_dep', dep,
      'wo_sec', sec,
      'wo_godown_name', wo_godown_name,
      'wo_dep_name', wo_dep_name,
      'wo_sec_name', wo_dep_sec_name
    )
  ), NULL) as work_orders,


  final_part,
  final_part_id,
  final_part_only,
  process_name
from
  full_demand_details
group by
  demand_id,
  plan_id),
  planner_product as (
    SELECT 
      ppv.created_by as pp_created_by,
      ppv.production_plan_date,
      ppv.planner_id,
    
      ppv.pp_created_by_name,
      
      ppv.type_id,
      ppv.model_id,
      ppv.sub_type,
     
      ppv.model_name,
      ppv.product_id,
      ppv.product,
      ppv.type_name,
      ppv.production_request_count,

      JSON_ARRAYAGG(JSON_OBJECT
      (
        'oid', ppv.oid,
        'order_category', ppv.order_category,
        'customer_id', ppv.customer_id,
        'order_type', ppv.order_type,
        'emp_id', ppv.emp_id,
        'emp_name', ppv.emp_name,
        'oe_supply', ppv.oe_supply,
        'commitment_date', ppv.commitment_date,
        'dated', ppv.dated,
        'sof_re_qty', ppv.sof_re_qty,
        'color_choice', ppv.color_choice,
        'color_choice_des', ppv.color_choice_des,
        'chasis_choice', ppv.chasis_choice,
        'chasis_choice_des', ppv.chasis_choice_des,
        'any_other_spec', ppv.any_other_spec,
        'loading_type', ppv.loading_type,
        'order_no', ppv.order_no,
        'production_untill', ppv.production_untill,
        'admin_remarks', ppv.admin_remarks,
        'approved_by', ppv.approved_by,
        'pincode', ppv.pincode,
        'delivery_addr', ppv.delivery_addr,
        'approve_sts', ppv.approve_sts,
        'total_payment', ppv.total_payment,
        'nex_payment_date', ppv.nex_payment_date,
        'first_payment_date', ppv.first_payment_date,
        'cus_name', ppv.cus_name,
        'cus_phone', ppv.cus_phone,
        'opid', ppv.opid,
        
        'required_qty', ppv.required_qty,
        'price', ppv.price
      
      )) as order_details
       from production_plan_view ppv 
       group by ppv.planner_id
       
  )

  select 
pp.*,

  sum(demand_qty) as sum_demand_qty,
  sum(total_wo_qty) as sum_total_wo_qty,
  sum(total_wo_pending_qty) as sum_total_wo_pending_qty,
  sum(total_wo_completed_qty) as sum_total_wo_completed_qty,
  sum(remaining_unassigned_qty) as sum_remaining_unassigned_qty,
  max(max_wo_due_date) as approx_commit_date,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'demand_id', demand_id,
    'demand_qty', demand_qty,
      'total_wo_qty', total_wo_qty,
      'total_wo_pending_qty', total_wo_pending_qty,
      'total_wo_completed_qty', total_wo_completed_qty,
      'remaining_unassigned_qty', remaining_unassigned_qty,
      'max_wo_due_date', max_wo_due_date,
      'work_orders', work_orders,
      'final_part', final_part,
      'final_part_id', final_part_id,
      'final_part_only', final_part_only,
      'process_name', process_name
    )
  ) as demand_details
from plan_summary
inner join planner_product pp on plan_summary.plan_id = pp.planner_id
  group by
  plan_id";

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


