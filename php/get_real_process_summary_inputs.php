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
  
// $sql = <<<SQL
// -- Active: 1766425908618@@srv1002.hstgr.io@3306@u333142350_jaysan
// with RECURSIVE input_group as (
//     select 
//     previous_process_id, 
//     qty 
//     from input_wel_parts iwp1 
//     WHERE  iwp1.process_id = $process_id 
    
//     UNION ALL
// SELECT 
//     iwp2.previous_process_id, 
//     iwp2.qty
//     from input_wel_parts iwp2
// inner JOIN input_group ig ON iwp2.process_id = ig.previous_process_id 
// ),

// process_available as (
//     SELECT previous_process_id as process_available_id, sum(qty) as qty  FROM input_group 
//     WHERE previous_process_id IS NOT NULL GROUP BY previous_process_id 
//     UNION ALL
//     SELECT $process_id as process_available_id,1
// ),


// stock_wise as (SELECT process_available.process_available_id, process_available.qty*$qty_needed as required_qty,ifnull(sum(js.qty),0) as available_qty, if(ifnull(sum(js.qty),0) < (process_available.qty*$qty_needed), true, FALSE) as is_not_available, (process_available.qty*$qty_needed) - ifnull(sum(js.qty),0) as shortage_qty FROM process_available 
// left join jaysan_stock js on js.process_id = process_available.process_available_id
// GROUP BY process_available.process_available_id),
//   bom_plan as (
//         SELECT
          
//             iwp_parent.previous_process_id,
//             iwp_parent.process_id,
//             stock_wise.required_qty,
//             stock_wise.available_qty,
//             stock_wise.is_not_available,
//             stock_wise.shortage_qty,
//             0  as LEVEL
          
          
//         FROM
//             input_wel_parts iwp_parent
//             inner join stock_wise on iwp_parent.process_id = stock_wise.process_available_id and stock_wise.is_not_available
//           WHERE iwp_parent.process_id = $process_id
      
//             UNION ALL

//         SELECT
         
//             iwp_child.previous_process_id,
//             iwp_child.process_id,
//             bp.shortage_qty as required_qty,
//             sw.available_qty,
//             sw.is_not_available,
//             (bp.shortage_qty - sw.available_qty) as shortage_qty,
//             level + 1
         
//         FROM
//             input_wel_parts iwp_child
        
//              inner join bom_plan bp ON bp.previous_process_id = iwp_child.process_id 
//              inner join stock_wise sw on sw.process_available_id = iwp_child.process_id and sw.is_not_available
         
//                  -- qty to produced

//     ),
//       final_needed as (
//        SELECT bom_plan.process_id, MAX(bom_plan.level) AS max_level,bom_plan.required_qty as requseted_qty, bom_plan.available_qty, bom_plan.shortage_qty as required_qty FROM bom_plan
// inner join stock_wise  on bom_plan.process_id = stock_wise.process_available_id
//    GROUP BY bom_plan.process_id
//     ORDER BY max_level),

//     input_grouped as (SELECT final_needed.process_id,final_needed.max_level,final_needed.required_qty,final_needed.requseted_qty,final_needed.available_qty,JSON_ARRAYAGG(JSON_OBJECT(
//         'input_part_id', iwp.input_part_id,
//         'previous_process_id', iwp.previous_process_id,
//         'input_part_name', COALESCE(pt.part_name, CONCAT('semi finished part - ' , final_part.part_name,'(from -', jp.process_name, ')')),
//         'qty', iwp.qty
//     )) as input_parts FROM final_needed
//     inner join input_wel_parts iwp on final_needed.process_id = iwp.process_id
//     LEFT JOIN parts_tbl pt ON iwp.input_part_id = pt.part_id
//     left join process_wel_tbl in_pwl on iwp.previous_process_id = in_pwl.process_id
//     left join jaysan_process jp on in_pwl.process = jp.process_id
//     inner  join process_wel_tbl final_pwl on final_needed.process_id = final_pwl.process_id
//     inner join process_wel_tbl final_pwl2 on final_pwl.final_process_id = final_pwl2.process_id 
//     inner join parts_tbl final_part on final_part.part_id = final_pwl2.output_part

// GROUP BY final_needed.process_id),
// process_group as(SELECT input_grouped.process_id,jp.process_name,input_grouped.max_level,input_grouped.required_qty,input_grouped.requseted_qty,input_grouped.available_qty,input_grouped.input_parts,final_pwl.output_part,final_pwl.process_title,COALESCE(process_part.part_name, CONCAT('semi finished part - ' , final_part.part_name,'(IN -', jp.process_name, ')'))  as output_part_name,pwt.process from input_grouped 
// inner join process_wel_tbl pwt on input_grouped.process_id = pwt.process_id
// inner join jaysan_process jp on jp.process_id = pwt.process
// inner JOIN process_wel_tbl final_pwl on pwt.final_process_id = final_pwl.process_id
// left join parts_tbl process_part on pwt.output_part = process_part.part_id
// left join parts_tbl final_part on final_part.part_id = final_pwl.output_part)

// SELECT  process_group.process_name,process_group.process_id as process_available_id ,process_group.process,process_group.max_level,process_group.required_qty as production_qty,process_group.requseted_qty,process_group.available_qty,process_group.input_parts,process_group.output_part,process_group.process_title,process_group.output_part_name,production_godown.creditor_name as production_godown_name, production_department.dep_name as production_department_name, production_sec.sec_name as production_sec_name, wtm.cost as production_cost, wtm.min_time as production_min_time, wtm.max_time as production_max_time from process_group
// left join work_time_master wtm on wtm.ori_process_id = process_group.process_id and wtm.is_default = 1
// left join creditors production_godown on production_godown.creditor_id = wtm.godown_id
// left join department production_department on production_department.dep_id = wtm.dep_id
// left join dep_section production_sec on production_sec.dep_sec_id = wtm.dep_sec_id 



    
// SQL;


 require_once 'buildTree.php';
 require_once 'collectProcessIds.php';
 require_once 'buildPartStock.php';
 require_once 'collectPartIds.php';
 require_once 'buildProcessStock.php';
 require_once 'planTree.php';
$required_qty = $qty_needed; // Set the required quantity for the root process


$tree = buildTree($conn, $process_id, $required_qty);
$partIds = [];
$processIds = [];
collectPartIds($tree, $partIds);
collectProcessIds($tree, $processIds);

// Convert keys to normal array
$partIds = array_keys($partIds);


// if partid null do not add in comma separated string
$part_ids = [];
$process_ids = [];
foreach ($partIds as $key => $partId) {
    
   if (!is_null($partId) && $partId !== '' && $partId !== '0' && $partId !== 'NULL' && $partId > 0) {
        $part_ids[] = $partId;
    }
 
}
$part_ids_str = implode(',', $part_ids);



$processIds = array_keys($processIds);

foreach ($processIds as $key => $processId) {
    
   if (!is_null($processId) && $processId !== '' && $processId !== '0' && $processId !== 'NULL' && $processId > 0) {
        $process_ids[] = $processId;
    }
 
}
$process_ids_str = implode(',', $process_ids);

$partStock = buildPartStock($conn, $part_ids_str);
$processStock = buildProcessStock($conn, $process_ids_str);



$demandReserve = [];
$demands = [];
$summary = [];
planTree($tree, $partStock, $processStock, $demandReserve, $demands,$summary);





$result_json =[];
$level = 0;

foreach ($summary as $key => $value) {
    $level++;
    // echo "Process ID: " . $value['process_id'] . ", Required Qty: " . $value['required_qty'] . ", Stock Qty: " . $value['stock_qty'] . ", Consume Qty: " . $value['consume_qty'] . ", Produce Qty: " . $value['produce_qty'] . "<br>";
    $process_id1 = $value['process_id'];
    $required_qty1 = $value['required_qty'];


// SELECT  process_group.process_name,process_group.process_id as process_available_id ,process_group.process,process_group.max_level,process_group.required_qty as production_qty,process_group.requseted_qty,process_group.available_qty,process_group.input_parts,process_group.output_part,process_group.process_title,process_group.output_part_name,production_godown.creditor_name as production_godown_name, production_department.dep_name as production_department_name, production_sec.sec_name as production_sec_name, wtm.cost as production_cost, wtm.min_time as production_min_time, wtm.max_time as production_max_time from process_group
// left join work_time_master wtm on wtm.ori_process_id = process_group.process_id and wtm.is_default = 1
// left join creditors production_godown on production_godown.creditor_id = wtm.godown_id
// left join department production_department on production_department.dep_id = wtm.dep_id
// left join dep_section production_sec on production_sec.dep_sec_id = wtm.dep_sec_id 

$sql_get_process_details = "with process_group as (
    select JSON_ARRAYAGG(JSON_OBJECT(
        'input_part_id', iwp.input_part_id,
        'previous_process_id', iwp.previous_process_id,
        'input_part_name', COALESCE(pt.part_name, CONCAT('semi finished part - ' , final_part.part_name,'(from -', jp.process_name, ')')),
        'qty', iwp.qty
    )) as input_parts,
    jp.process_name,
    pwt.process_id,
    pwt.process,
    final_pwt.output_part,
    pwt.process_title,
    final_part.part_name as output_part_name

    


    
     FROM process_wel_tbl pwt
    inner join jaysan_process jp on jp.process_id = pwt.process
    inner join input_wel_parts iwp on pwt.process_id = iwp.process_id
    left join parts_tbl pt on iwp.input_part_id = pt.part_id
    left join process_wel_tbl final_pwt on pwt.final_process_id = final_pwt.process_id
    left join parts_tbl final_part on final_part.part_id = final_pwt.output_part
    where pwt.process_id = $process_id1
    group by pwt.process_id)

    SELECT  process_group.process_name,process_group.process_id as process_available_id ,process_group.process,process_group.input_parts,process_group.output_part,process_group.process_title,process_group.output_part_name,production_godown.creditor_name as production_godown_name, production_department.dep_name as production_department_name, production_sec.sec_name as production_sec_name, wtm.cost as production_cost, wtm.min_time as production_min_time, wtm.max_time as production_max_time from process_group
 left join work_time_master wtm on wtm.ori_process_id = process_group.process_id and wtm.is_default = 1
 left join creditors production_godown on production_godown.creditor_id = wtm.godown_id
 left join department production_department on production_department.dep_id = wtm.dep_id
 left join dep_section production_sec on production_sec.dep_sec_id = wtm.dep_sec_id";
$result = $conn->query($sql_get_process_details);
if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;

        $result_json[] = [
            'process_id' => $r['process_available_id'],
            'process_name' => $r['process_name'],
            'process' => $r['process'],
            'input_parts' => json_decode($r['input_parts'], true),
            'output_part' => $r['output_part'],
            'process_title' => $r['process_title'],
            'output_part_name' => $r['output_part_name'],
            'production_godown_name' => $r['production_godown_name'],
            'production_department_name' => $r['production_department_name'],
            'production_sec_name' => $r['production_sec_name'],
            'production_cost' => $r['production_cost'],
            'production_min_time' => $r['production_min_time'],
            'production_max_time' => $r['production_max_time'],
            'max_level' => $level,
            'requseted_qty' => $qty_needed,
            'available_qty' => $value['stock_qty'],
            '$production_qty' => $value['produce_qty'],
            'consume_qty' => $value['consume_qty'],


            'required_qty' => $required_qty1
        ];
    }
   
} else {
  echo "0 result";
}
    
}

   print json_encode($result_json);


// $result = $conn->query($sql);

// if ($result->num_rows > 0) {
//     $rows = array();
//     while($r = mysqli_fetch_assoc($result)) {
//         $rows[] = $r;
//     }
//     print json_encode($rows);
// } else {
//   echo "0 result";
// }
$conn->close();

 ?>


