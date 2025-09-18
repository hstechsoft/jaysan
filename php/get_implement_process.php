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


$sql = "WITH RECURSIVE process_chain AS (
    -- Base Case: Selects a set of rows with 6 columns including process_name
    SELECT p.process_id, p.process, p.output_part, p.previous_process_id, 1 AS level, jp.process_name,p.cat
    FROM process_tbl p
    JOIN jaysan_process jp ON p.process = jp.process_id
    WHERE p.process_id =  $process_id AND p.cat = 'out'
    
    UNION ALL
    
    -- Recursive Case: Selects a set of rows with the same 6 columns including process_name
    SELECT p.process_id, p.process, p.output_part, p.previous_process_id, pc.level + 1 AS level, jp.process_name,p.cat
    FROM process_tbl p
    INNER JOIN process_chain pc ON p.process_id = pc.previous_process_id
    JOIN jaysan_process jp ON p.process = jp.process_id
)

-- Final output
SELECT process_id, process, output_part, previous_process_id, level, process_name,cat
FROM process_chain
ORDER BY level DESC;
";

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


