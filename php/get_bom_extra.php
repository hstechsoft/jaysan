<?php





function get_extra(mysqli $conn, int $part_id, string $component_cat)
{
  
{
  $correction_check = false;
$sql_correction_check = "
WITH RECURSIVE bom_process AS (

SELECT
 output_part,
 process_id,
 process,
 previous_process_id,
 cat,
 0 AS level
FROM process_wel_tbl
WHERE component_cat = '$component_cat'
AND output_part = '$part_id'
AND cat = 'out'

UNION ALL

SELECT
 pwt.output_part,
 pwt.process_id,
 pwt.process,
 pwt.previous_process_id,
 pwt.cat,
 bom_process.level + 1
FROM bom_process
JOIN process_wel_tbl pwt
ON bom_process.previous_process_id = pwt.process_id
),

bom_master as (SELECT 
wtm.min_time,
wtm.max_time,
wtm.cost,
wtm.dep_id,
wtm.dep_sec_id,
wtm.godown_id,
wtm.machine_id,
creditors.creditor_name,
department.dep_name,
dep_section.sec_name,
dep_sec_machine.machine_name,
bp.process_id,
jaysan_process.process_name,
JSON_ARRAYAGG(JSON_OBJECT('input_part_id',input_part_id,'part_name',pt.part_name,'input_qty',iwp.qty)) AS input_parts,
wtm.wtid



FROM bom_process bp
LEFT JOIN input_wel_parts iwp

ON bp.process_id = iwp.process_id
LEFT join parts_tbl pt on iwp.input_part_id = pt.part_id 
left join work_time_master wtm on bp.process_id = wtm.ori_process_id 
left join creditors on creditors.creditor_id = wtm.godown_id
LEFT join department on department.dep_id = wtm.dep_id      
LEFT join dep_section on dep_section.dep_sec_id = wtm.dep_sec_id
LEFT join dep_sec_machine on dep_sec_machine.dep_sec_machine_id = wtm.machine_id
LEFT join jaysan_process on jaysan_process.process_id = bp.process


WHERE input_part_id > 0 GROUP BY process_id,wtid
ORDER BY bp.level DESC )

SELECT min_time,max_time,cost,dep_id,dep_sec_id,godown_id,machine_id,creditor_name,dep_name,sec_name,machine_name,process_id,input_parts,process_name,
JSON_ARRAYAGG(JSON_OBJECT(
'wtid',wtid,
'min_time',min_time,
'max_time',max_time,
'cost',cost,
'dep_id',dep_id,
'dep_sec_id',dep_sec_id,
'godown_id',godown_id,
'machine_id',machine_id,
'creditor_name',creditor_name,
'dep_name',dep_name,
'sec_name',sec_name,
'machine_name',machine_name)) as extra_details FROM bom_master GROUP BY process_id;";
$result_correction_check = $conn->query($sql_correction_check);
if ($result_correction_check->num_rows > 0) {
    while($row = $result_correction_check->fetch_assoc()) {
        $correction_check = $row['correction_check'];
    }
return $correction_check;

}
}

}

 ?>


