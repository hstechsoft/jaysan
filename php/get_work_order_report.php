<?php
 include 'db_head.php';


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}



// combine both results

  

 $sql = "with wo_details as(select JSON_ARRAYAGG(JSON_OBJECT(
    'created_by', emp.emp_name,
    'created_date', wo.created_date,
    'hour_since', time_diff(wo.created_date,now(),'hour'),  
    'work_order_no', wo.work_order_no
)) as work_order_details,  wo.godown,wo.dep,wo.sec,creditors.creditor_name,dep.dep_name,sec.sec_name, sum(wo.qty) as total_process,sum(wo.pending_qty) as total_pending_process,wo.work_order_no,wo.demand_id,demand.process_id from work_order wo 
inner join demand on wo.demand_id = demand.demand_id
left join employee emp on wo.created_by = emp.emp_id
left join creditors on wo.godown = creditors.creditor_id
left join department dep on wo.dep = dep.dep_id
left join dep_section sec on wo.sec = sec.dep_sec_id
group by demand.process_id,wo.godown,wo.dep,wo.sec
),

raw_material as(select
    wo.work_order_details,
    wo.godown,
    wo.dep,
    wo.sec,
    wo.creditor_name,
    wo.dep_name,
    wo.sec_name,
    wo.total_process,
    wo.total_pending_process,
    wo.process_id,
    sv.reserve_qty,
   
    iv.previous_process_id,
   GROUP_CONCAT(sv.stock_reserve_id) as stock_reserve_ids,
   iv.input_part_id,
   if(iv.input_part_id is null ,CONCAT('semi finished part ',pt_final.part_name), pt.part_name) as input_part_name,
   iv.required_qty,
   iv.total_reserve_qty,
   iv.needed,
   sum(sv.reserve_qty) as total_exreserve_qty
   
from
    wo_details wo
    inner JOIN input_part_demand_view iv on wo.process_id = iv.work_process_id
    and wo.godown <=> iv.godown
    and wo.dep <=> iv.dep
    and wo.sec <=> iv.sec
    left  join stock_view sv on 
    case when sv.part_id is not null then sv.part_id = iv.input_part_id and sv.reserve_type = 'job_work_order'
    else sv.process_id = iv.previous_process_id and sv.reserve_type = 'job_work_order' 
    end

    left join parts_tbl pt on iv.input_part_id = pt.part_id
    left join process_wel_tbl pwt on pwt.process_id = iv.previous_process_id
    left join process_wel_tbl pwt_final on pwt_final.process_id = pwt.final_process_id
    left join parts_tbl pt_final on pt_final.part_id = pwt_final.output_part
 GROUP BY wo.process_id,iv.input_part_id,wo.godown,wo.dep,wo.sec),

rm_group as (select 
 work_order_details,
 godown,
 dep,
    sec,
    creditor_name,
    dep_name,
    sec_name,
    total_process,
    total_pending_process,
    process_id,
  needed,
sum(total_exreserve_qty) as total_exreserve_qty,
sum(required_qty) as total_required_qty,
sum(total_reserve_qty) as total_internal_reserve_qty,
    previous_process_id,
       JSON_ARRAYAGG(JSON_OBJECT(
        'input_part_id', rm.input_part_id,
        'input_part_name', rm.input_part_name,
        'previous_process_id', rm.previous_process_id,
        'required_qty', rm.required_qty,
        'total_reserve_qty', rm.total_reserve_qty,
        'needed', rm.needed,
        'ex_qty',rm.total_exreserve_qty
    )) as input_details
   


  from raw_material rm GROUP BY rm.process_id,rm.godown,rm.dep,rm.sec),

rm_con as(select work_order_details, godown, dep, sec, creditor_name, dep_name, sec_name, total_process,needed, total_pending_process, process_id, total_exreserve_qty, total_required_qty, total_internal_reserve_qty, previous_process_id, input_details from rm_group 
-- WHERE process_id = 2796 and godown = 1087 and dep <=> null and sec<=> null
), 
cr as(select  process_id,JSON_ARRAYAGG(JSON_OBJECT(
    'work_order_details', work_order_details,
    'godown', godown,
    'dep', dep,
    'sec', sec,
    'creditor_name', creditor_name,
    'dep_name', dep_name,
    'sec_name', sec_name,
    'total_process', total_process,
    'total_pending_process', total_pending_process,

    'total_exreserve_qty', total_exreserve_qty,
    'total_required_qty', total_required_qty,
    'total_internal_reserve_qty', total_internal_reserve_qty,
    'previous_process_id', previous_process_id,
    'input_details', input_details
)) as work_order_details,
sum(total_process) as total_process,
sum(total_pending_process) as total_pending_process,
sum(total_required_qty) as total_input_required_qty,
sum(needed) as total_input_needed,
sum(total_internal_reserve_qty) as total_internal_reserve_qty,
total_exreserve_qty
from rm_con GROUP BY process_id)
select work_order_details,cr.process_id,total_process,total_pending_process,total_input_required_qty,total_input_needed,total_internal_reserve_qty,total_exreserve_qty,jpv.input_parts,jpv.process_name,jpv.godown_details,jpv.final_part from cr
inner join jaysan_process_view jpv on jpv.process_id = cr.process_id";
 


// echo "sql: " . $sql . "<br>";


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


