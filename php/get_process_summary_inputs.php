<?php
 include 'db_head.php';

$process_id = test_input($_GET['process_id']);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
  
$sql = <<<SQL
with RECURSIVE input_group as (
    select 
    previous_process_id, 
    qty,
    0 as level from input_wel_parts iwp1 WHERE  iwp1.process_id = $process_id 
    
    UNION ALL
SELECT 
    iwp2.previous_process_id, 
    iwp2.qty, 
    ig.level + 1 as level from input_wel_parts iwp2
inner JOIN input_group ig ON iwp2.process_id = ig.previous_process_id 
),
process_available as (
    SELECT previous_process_id as process_available_id, sum(qty) as qty ,level FROM input_group 
    WHERE previous_process_id IS NOT NULL GROUP BY previous_process_id 
    UNION ALL
    SELECT $process_id as process_available_id,1, 0 as level 
),
input_group_details as (
SELECT process_available_id,
 process_available.qty as production_qty,
 pwt.process,
 pwt.output_part,
 iwp.input_part_id,iwp.qty as input_qty,
 jp_input.process_name as previous_process_name,
 if(input_part_id is null , CONCAT('semi finished part - ' , pt_final.part_name,'(from -', jp_input.process_name, ')'), if(iwp.previous_process_id is null, pt.part_name, CONCAT(pt.part_name,'(from -', jp_input.process_name, ')'))) as input_part_name,
 iwp.previous_process_id,pt_final.part_name as final_part_name, pwt_final.output_part as final_part,jp_input.process_name,level,pwt.process_title FROM process_available

inner join process_wel_tbl pwt on process_available.process_available_id = pwt.process_id
inner join input_wel_parts iwp on process_available.process_available_id = iwp.process_id
left join process_wel_tbl pwt_input on iwp.previous_process_id = pwt_input.process_id
left join jaysan_process jp_input on pwt_input.process = jp_input.process_id
inner join process_wel_tbl pwt_final on pwt.final_process_id = pwt_final.process_id
left join parts_tbl pt on iwp.input_part_id = pt.part_id
left join parts_tbl pt_final on pwt_final.output_part = pt_final.part_id),

process_details as(SELECT process_available_id,production_qty, process, output_part,
jp.process_name,

if(output_part is null , CONCAT('semi finished part - ' , final_part_name,'(by -', jp.process_name, ')'), CONCAT(pt.part_name,'(by -', jp.process_name, ')')) as output_part_name,

 JSON_ARRAYAGG(JSON_OBJECT('input_part_id', input_part_id, 'input_qty', input_qty, 'previous_process_name', previous_process_name, 'previous_process_id', previous_process_id,   'input_part_name', input_part_name )) as input_details,final_part_name,final_part,level,process_title FROM input_group_details 
inner join jaysan_process jp on input_group_details.process = jp.process_id
inner join parts_tbl pt_final on input_group_details.final_part = pt_final.part_id
left join parts_tbl pt ON input_group_details.output_part = pt.part_id
GROUP BY process_available_id)
SELECT process_available_id,production_qty, process,process_name, output_part_name, input_details, final_part_name, final_part, level, process_title ,creditor_name as godown_name,dep_name,sec_name,creditor_id,department.dep_id,dep_section.dep_sec_id,cost,min_time,max_time FROM process_details

left join work_time_master wtm on wtm.ori_process_id = process_details.process_available_id
left join creditors on wtm.godown_id = creditors.creditor_id
left join department on wtm.dep_id = department.dep_id
left join dep_section on wtm.dep_sec_id = dep_section.dep_sec_id  order by level





    
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


