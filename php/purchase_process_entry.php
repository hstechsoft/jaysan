<?php
 include 'db_head.php';

 

 $part_id = test_input($_GET['part_id']);

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



try {
    $conn->begin_transaction();
//   check bom_ouput table for part_id with component_cat = 'purchase' if not exsists insert into bom_output table with component_cat = 'purchase' and part_id = $part_id
$sql = "SELECT * FROM bom_output WHERE part_id = $part_id AND component_cat = 'purchase'";
$result = $conn->query($sql);
if ($result->num_rows == 0) {
    // insert bom_outout with id insert bom_output
$sql_bom_output = "INSERT INTO bom_output (part_id, component_cat,bom_source) VALUES ($part_id, 'purchase', 'manual')";
if ($conn->query($sql_bom_output) === TRUE) {
//    get the id of the inserted record
    $bom_output_id = $conn->insert_id;
// insert bom_input with qty
    $sql_bom_input = "INSERT INTO bom_input (part_id,bom_id,bom_source, qty) VALUES ($part_id, $bom_output_id, 'manual', 1)";
    if ($conn->query($sql_bom_input) === TRUE) {
    
    } else {
       throw new Exception("Error: " . $sql_bom_input . "<br>" . $conn->error); 
    }
} else {
   throw new Exception("Error: " . $sql_bom_output . "<br>" . $conn->error);
}
}

$process_id = 0;

// get process_id  from process_wel_tbl where process_name = 'purchase' and output_part = $part_id and cat = 'out'
$sql_process = "SELECT process_wel_tbl.process_id FROM process_wel_tbl 
inner join jaysan_process on process_wel_tbl.process = jaysan_process.process_id
WHERE process_name = 'purchase' AND output_part = $part_id AND cat = 'out' AND process_title = 'purchase'";
$result_process = $conn->query($sql_process);
if ($result_process->num_rows > 0) {
    // output data of each row
    while($row_process = $result_process->fetch_assoc()) {
        $process_id = $row_process["process_id"];
      
    }
} else {
    // insert process_wel_tbl with process_name = 'purchase' and output_part = $part_id and cat = 'out'
    $sql_insert_process_wel_tbl = "INSERT INTO process_wel_tbl ( output_part, process, cat, process_title,component_cat) VALUES ( $part_id, (SELECT process_id FROM jaysan_process WHERE process_name = 'purchase'), 'out', 'purchase', 'purchase')";
    if ($conn->query($sql_insert_process_wel_tbl) === TRUE) {
        $process_id = $conn->insert_id;
    } else {
        throw new Exception("Error: " . $sql_insert_process_wel_tbl . "<br>" . $conn->error);
    }


    // update final_process_id in process_wel_tbl
    $sql_update_final_process_id = "UPDATE process_wel_tbl SET final_process_id = $process_id WHERE process_id = $process_id";
    if ($conn->query($sql_update_final_process_id) === TRUE) {
        
    } else {
        throw new Exception("Error: " . $sql_update_final_process_id . "<br>" . $conn->error);
    }

    // insert input_wel_parts with process_id = $process_id and input_part_id = $part_id and qty = 1
    $sql_insert_input_wel_parts = "INSERT INTO input_wel_parts (process_id, input_part_id, qty) VALUES ($process_id, $part_id, 1)";
    if ($conn->query($sql_insert_input_wel_parts) === TRUE) {
        
    } else {
        throw new Exception("Error: " . $sql_insert_input_wel_parts . "<br>" . $conn->error);
    }


}


$sql_get_details = <<<SQL
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
       
            'id',
            iwp.id,    
            'input_part_id',
            iwp.input_part_id,
            'part_name',
            inpart.part_name,
            'previous_process_id',
            iwp.previous_process_id,
            'qty',
            iwp.qty,
            'input_process_title',
            pwt1.process_title,
            'process_name',
            jp.process_name
        )) AS input_parts,

pw.process_name, 
pw.process_id,
pw.process,  
LEVEL  FROM process_wel  pw
inner  join input_wel_parts iwp on iwp.process_id = pw.process_id
left join  process_wel_tbl pwt1 on pwt1.process_id = iwp.previous_process_id and iwp.input_part_id > 0
left join jaysan_process jp on jp.process_id = pwt1.process
left join parts_tbl  inpart on iwp.input_part_id = inpart.part_id
 GROUP BY pw.process_id
  ORDER by LEVEL DESC)
    

SELECT 
input_parts,
 JSON_ARRAYAGG(
        JSON_OBJECT(
                 'is_default',
            is_default,
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
            wtm.cost,
            'wtid',
            wtm.wtid

            
            
        )
    ) AS process_details,



process_name, 
in_wel.process,
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

$result = $conn->query($sql_get_details);

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
  echo "0 result";
}

$conn->commit();

} catch (Exception $e) {
    // Handle the exception, e.g., log it and return an error response
    $conn->rollback();
    error_log($e->getMessage());
    echo json_encode(["error" => "An error occurred while processing the request."]);
} 



$conn->close();

 ?>


