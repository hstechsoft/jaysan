<?php
 include 'db_head.php';

 

 $part_id = test_input($_GET['part_id']);
 $component_cat = test_input($_GET['component_cat']);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
  
$sql = <<<SQL
WITH RECURSIVE process_details AS (
    SELECT process_wel_tbl.*, 1 as level from process_wel_tbl WHERE output_part =  $part_id  and cat = "out" and component_cat =  $component_cat
    UNION ALL 
    SELECT pwl.*,level+1 as level from process_wel_tbl pwl  join process_details on  pwl.process_id = process_details.previous_process_id WHERE 1),
    
   process_final as(SELECT pd.*,ip.input_part_id,(SELECT parts_tbl.part_name from parts_tbl WHERE parts_tbl.part_id = ip.input_part_id ) as part_name ,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'process_availble',
            (SELECT 1 FROM process_wel_tbl WHERE process_wel_tbl.output_part =  ip.input_part_id  and cat = "out"),
            'part_id',
            ip.input_part_id,
            'part_name',
            (SELECT parts_tbl.part_name from parts_tbl WHERE parts_tbl.part_id = ip.input_part_id ),
            'qty',
            ip.qty
        )) as parts
   from process_details pd
    LEFT join input_wel_parts ip on pd.process_id = ip.process_id GROUP by process_id),
    
    extra as (SELECT pf.*,  
              COUNT(wtm.ori_process_id) over (PARTITION by wtm.wtid) as  a,
     wtm.ori_process_id,
    wtm.godown_id,
    wtm.dep_id,
    wtm.dep_sec_id,
    wtm.machine_id,
    wtm.min_time,
    wtm.max_time,
    wtm.cost,jp.process_name from process_final pf  inner join jaysan_process jp on  pf.process = jp.process_id 
   
    LEFT join work_time_master wtm on pf.process_id = wtm.ori_process_id)
    SELECT ex.* , 
    sum(a) as process_extra_count,
      JSON_ARRAYAGG(
        JSON_OBJECT(	'creditor_name',
            cre.creditor_name,
                    'dep_name',
              dep.dep_name,
                    'sec_name',
              sec.sec_name,
                    'machine_name',
              mac.machine_name,
                    'min_time',
                   min_time,
                   'max_time',
                   max_time,
                   'cost',
                   ex.cost)) as extra,
    		cre.creditor_name,
              dep.dep_name,
              sec.sec_name,
              mac.machine_name from extra  ex
    
    LEFT join creditors cre on ex.godown_id = cre.creditor_id
    LEFT join  department dep on ex.dep_id = dep.dep_id
    LEFT join dep_section sec  on ex.dep_sec_id = sec.dep_sec_id
    LEFT JOIN jaysan_machine mac on ex.machine_id = mac.jmid GROUP by process_id ORDER by level DESC

    
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


