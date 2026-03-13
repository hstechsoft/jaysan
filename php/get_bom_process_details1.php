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
WITH RECURSIVE process_wel AS (
    -- Anchor
   select pwt.previous_process_id,
   pwt.output_part,
   pwt.process,
   pwt.process_id,
   
     jp.process_name ,
     0 as level
     
     from process_wel_tbl pwt
 

   inner join jaysan_process jp on jp.process_id = pwt.process
    WHERE 
        pwt.cat = 'out' AND pwt.process_id = $process_id

    UNION ALL

    -- Recursive
   select pwt.previous_process_id,
   pwt.output_part,
   pwt.process,
 
   pwt.process_id,
        jp.process_name,
   level + 1 as level
   
    from process_wel_tbl pwt

inner join process_wel on process_wel.previous_process_id = pwt.process_id
   inner join jaysan_process jp on jp.process_id = pwt.process
  
   
   
),
in_wel as ( SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'input_part_id',
            iwp.input_part_id,
            'part_name',
            inpart.part_name,
            'previous_process_id',
            iwp.previous_process_id,
            'qty',
            iwp.qty
        )) AS input_parts,

process_name, 
pw.process_id,
pw.process,  
LEVEL  FROM process_wel  pw
inner  join input_wel_parts iwp on iwp.process_id = pw.process_id
left join parts_tbl  inpart on iwp.input_part_id = inpart.part_id
 GROUP BY pw.process_id
  ORDER by LEVEL DESC)


SELECT 
input_parts,
 JSON_ARRAYAGG(
        JSON_OBJECT(
            'godown_id',
            wtm.godown_id,
            'godown_name',
            creditors.creditor_name,
            'dep_id',
            wtm.dep_id,
            'dep_name',
            department.dep_name,
            'dep_sec_id',
            wtm.dep_sec_id,
            'dep_sec_name',
            dep_section.sec_name,
            'dep_sec_machine_id',
            wtm.machine_id,
            'dep_sec_machine_name',
            jaysan_machine.machine_name,
            'min_time',
            min_time,
            'max_time',
            max_time,
            'cost',
            wtm.cost

            
            
        )
    ) AS process_details,



process_name, 
inwel.process,
in_wel.process_id, 
LEVEL,
count(wtm.wtid) AS total_extra
FROM in_wel  

left join work_time_master wtm on wtm.ori_process_id = in_wel.process_id
left JOIN creditors ON creditors.creditor_id = wtm.godown_id
LEFT JOIN department ON department.dep_id = wtm.dep_id
LEFT JOIN dep_section ON dep_section.dep_sec_id = wtm.dep_sec_id
LEFT JOIN  jaysan_machine ON  jaysan_machine.jmid = wtm.machine_id   GROUP BY in_wel.process_id
  ORDER by LEVEL DESC




  ;
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


