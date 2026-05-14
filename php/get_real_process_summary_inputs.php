<?php
 include 'db_head.php';

$process_id = test_input($_GET['process_id']);
$qty_needed = test_input($_GET['qty_needed']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}
  
$sql = <<<SQL
-- Active: 1766425908618@@srv1002.hstgr.io@3306@u333142350_jaysan
with RECURSIVE input_group as (
    select 
    previous_process_id, 
    qty 
    from input_wel_parts iwp1 
    WHERE  iwp1.process_id = $process_id 
    
    UNION ALL
SELECT 
    iwp2.previous_process_id, 
    iwp2.qty
    from input_wel_parts iwp2
inner JOIN input_group ig ON iwp2.process_id = ig.previous_process_id 
),

process_available as (
    SELECT previous_process_id as process_available_id, sum(qty) as qty  FROM input_group 
    WHERE previous_process_id IS NOT NULL GROUP BY previous_process_id 
    UNION ALL
    SELECT $process_id as process_available_id,1
),


stock_wise as (SELECT process_available.process_available_id, process_available.qty*$qty_needed as required_qty,ifnull(sum(js.qty),0) as available_qty, if(ifnull(sum(js.qty),0) < (process_available.qty*$qty_needed), true, FALSE) as is_not_available, (process_available.qty*$qty_needed) - ifnull(sum(js.qty),0) as shortage_qty FROM process_available 
left join jaysan_stock js on js.process_id = process_available.process_available_id
GROUP BY process_available.process_available_id),
  bom_plan as (
        SELECT
          
            iwp_parent.previous_process_id,
            iwp_parent.process_id,
            stock_wise.required_qty,
            stock_wise.available_qty,
            stock_wise.is_not_available,
            stock_wise.shortage_qty,
            0  as LEVEL
          
          
        FROM
            input_wel_parts iwp_parent
            inner join stock_wise on iwp_parent.process_id = stock_wise.process_available_id and stock_wise.is_not_available
          WHERE iwp_parent.process_id = $process_id
      
            UNION ALL

        SELECT
         
            iwp_child.previous_process_id,
            iwp_child.process_id,
            bp.shortage_qty as required_qty,
            sw.available_qty,
            sw.is_not_available,
            (bp.shortage_qty - sw.available_qty) as shortage_qty,
            level + 1
         
        FROM
            input_wel_parts iwp_child
        
             inner join bom_plan bp ON bp.previous_process_id = iwp_child.process_id 
             inner join stock_wise sw on sw.process_available_id = iwp_child.process_id and sw.is_not_available
         
                 -- qty to produced

    ),
      final_needed as (
       SELECT bom_plan.process_id, MAX(bom_plan.level) AS max_level,bom_plan.required_qty as requseted_qty, bom_plan.available_qty, bom_plan.shortage_qty as required_qty FROM bom_plan
inner join stock_wise  on bom_plan.process_id = stock_wise.process_available_id
   GROUP BY bom_plan.process_id
    ORDER BY max_level),

    input_grouped as (SELECT final_needed.process_id,final_needed.max_level,final_needed.required_qty,final_needed.requseted_qty,final_needed.available_qty,JSON_ARRAYAGG(JSON_OBJECT(
        'input_part_id', iwp.input_part_id,
        'previous_process_id', iwp.previous_process_id,
        'input_part_name', COALESCE(pt.part_name, CONCAT('semi finished part - ' , final_part.part_name,'(from -', jp.process_name, ')')),
        'qty', iwp.qty
    )) as input_parts FROM final_needed
    inner join input_wel_parts iwp on final_needed.process_id = iwp.process_id
    LEFT JOIN parts_tbl pt ON iwp.input_part_id = pt.part_id
    left join process_wel_tbl in_pwl on iwp.previous_process_id = in_pwl.process_id
    left join jaysan_process jp on in_pwl.process = jp.process_id
    inner  join process_wel_tbl final_pwl on final_needed.process_id = final_pwl.process_id
    inner join process_wel_tbl final_pwl2 on final_pwl.final_process_id = final_pwl2.process_id 
    inner join parts_tbl final_part on final_part.part_id = final_pwl2.output_part

GROUP BY final_needed.process_id),
process_group as(SELECT input_grouped.process_id,jp.process_name,input_grouped.max_level,input_grouped.required_qty,input_grouped.requseted_qty,input_grouped.available_qty,input_grouped.input_parts,final_pwl.output_part,final_pwl.process_title,COALESCE(process_part.part_name, CONCAT('semi finished part - ' , final_part.part_name,'(IN -', jp.process_name, ')'))  as output_part_name,pwt.process from input_grouped 
inner join process_wel_tbl pwt on input_grouped.process_id = pwt.process_id
inner join jaysan_process jp on jp.process_id = pwt.process
inner JOIN process_wel_tbl final_pwl on pwt.final_process_id = final_pwl.process_id
left join parts_tbl process_part on pwt.output_part = process_part.part_id
left join parts_tbl final_part on final_part.part_id = final_pwl.output_part)

SELECT  process_group.process_name,process_group.process_id as process_available_id ,process_group.process,process_group.max_level,process_group.required_qty as production_qty,process_group.requseted_qty,process_group.available_qty,process_group.input_parts,process_group.output_part,process_group.process_title,process_group.output_part_name,production_godown.creditor_name as production_godown_name, production_department.dep_name as production_department_name, production_sec.sec_name as production_sec_name, wtm.cost as production_cost, wtm.min_time as production_min_time, wtm.max_time as production_max_time from process_group
left join work_time_master wtm on wtm.ori_process_id = process_group.process_id and wtm.is_default = 1
left join creditors production_godown on production_godown.creditor_id = wtm.godown_id
left join department production_department on production_department.dep_id = wtm.dep_id
left join dep_section production_sec on production_sec.dep_sec_id = wtm.dep_sec_id 



    
SQL;


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


