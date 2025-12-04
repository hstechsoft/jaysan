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
    SELECT process_wel_tbl.*, 1 as level from process_wel_tbl WHERE output_part =  $part_id and cat = "out" and component_cat =  $component_cat
    UNION ALL 
    SELECT pwl.*,level+1 as level from process_wel_tbl pwl  join process_details on  pwl.process_id = process_details.previous_process_id WHERE 1),
    
extra as (SELECT pd.process_id as pid, wtm.*, COUNT(wtm.ori_process_id) over (PARTITION by wtm.wtid) as  a from process_details  pd LEFT join work_time_master wtm on pd.process_id = wtm.ori_process_id)
SELECT 
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
               
              mac.machine_name,
                  
                   min_time,
                
                   ifnull(max_time,0) as max_time,
                  
                   ifnull(ex.cost,0) as cost,
                    sum(a) as process_extra_count,
                    (select jaysan_proces.process_name from jaysan_proces where jaysan_proces.process_id = ex.pid) as process_name
                   from extra ex
    LEFT join creditors cre on ex.godown_id = cre.creditor_id
    LEFT join  department dep on ex.dep_id = dep.dep_id
    LEFT join dep_section sec  on ex.dep_sec_id = sec.dep_sec_id
    LEFT JOIN jaysan_machine mac on ex.machine_id = mac.jmid GROUP by process_id

    

    
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


