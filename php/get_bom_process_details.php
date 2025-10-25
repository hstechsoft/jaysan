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
SELECT  GROUP_CONCAT(  concat('<li class=\"list-group-item d-flex justify-content-between\" data-part-id = \"',input_part_id,'\" data-part-qty=\"',qty,'\">  
            <p class=\"m-0 p-0  \">',ifnull(part_name,concat('process - <span class=\"pr_no\">', @rownum := @rownum + 1)),'</span><span class = \"fw-bold ms-2 mark\"> Qty : <span contenteditable=\"true\" class= \" m-0 p-0 px-1 qty-editable\">',qty,'</span></span></p><button' ,if(part_name IS null , ' disabled',''), ' class=\"btn btn-sm btn-outline-danger border-0 m-0 p-0 px-3\"><i class=\"fa fa-trash\" aria-hidden=\"true\"></i></button>') separator '') as in_tbl,  concat('<li class=\"list-group-item\" data-process-id=',process,' data-pid=',pid,'> <p class=\"m-0 p-0\">',wel_pr,'</p></li>')   as pr_tbl,input_part_id,part_name,qty,process,wel_pr,pid,LEVEL,(SELECT
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'godown_id',
            ped.godown_id,
            'godown_name',
            creditors.creditor_name,
            'dep_id',
            ped.dep_id,
            'dep_name',
            department.dep_name,
            'dep_sec_id',
            ped.dep_sec_id,
            'dep_sec_name',
            dep_section.sec_name,
            'dep_sec_machine_id',
            ped.dep_sec_machine_id,
            'dep_sec_machine_name',
            dep_sec_machine.machine_name,
            'min_time',
            min_time,
            'max_time',
            max_time,
            'cost',
            cost

            
            
        )
    )
FROM
    `process_extra_details` ped
INNER JOIN creditors ON creditors.creditor_id = ped.godown_id
LEFT JOIN department ON department.dep_id = ped.dep_id
LEFT JOIN dep_section ON dep_section.dep_sec_id = ped.dep_sec_id
LEFT JOIN dep_sec_machine ON dep_sec_machine.dep_sec_machine_id = ped.dep_sec_machine_id
WHERE
    process_id = pid
GROUP BY
    process_id) as extra  from (

 


  SELECT @rownum := 0
) AS init,(WITH RECURSIVE process_wel AS (
    -- Anchor
    SELECT 
    (SELECT jp.process_name from jaysan_process jp WHERE jp.process_id = pwt.process) as wel_pr,
    iwp.id,
        pwt.process_id,
          
        pwt.previous_process_id,
        pwt.process,
        iwp.qty,
        iwp.input_part_id,
        pt.part_name,
    1 as level
    FROM 
        input_wel_parts iwp
    INNER JOIN process_wel_tbl pwt ON pwt.process_id = iwp.process_id
    LEFT JOIN parts_tbl pt ON pt.part_id = iwp.input_part_id
    WHERE 
        pwt.cat = 'out' AND pwt.output_part =  $part_id and pwt.component_cat = $component_cat

    UNION ALL

    -- Recursive
    SELECT 
        (SELECT jp.process_name from jaysan_process jp WHERE jp.process_id = prev_pwt.process) as wel_pr,
        iwp.id,
        prev_pwt.process_id,
        
        prev_pwt.previous_process_id,
        prev_pwt.process,
        iwp.qty,
        iwp.input_part_id,
        pt.part_name,
    LEVEL+1 as LEVEL
    FROM 
        process_wel pw
    INNER JOIN process_wel_tbl prev_pwt ON prev_pwt.process_id = pw.previous_process_id
    INNER JOIN input_wel_parts iwp ON iwp.process_id = prev_pwt.process_id
    LEFT JOIN parts_tbl pt ON pt.part_id = iwp.input_part_id
)
SELECT   DISTINCT id,part_name,input_part_id,qty,process,wel_pr,process_id as pid,LEVEL  FROM process_wel) as re_fn GROUP by level ORDER by LEVEL DESC
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


