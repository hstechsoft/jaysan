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


$sql = "SELECT  (SELECT jaysan_process.process_name FROM jaysan_process WHERE jaysan_process.process_id = (SELECT process_tbl.process from process_tbl WHERE process_tbl.process_id = input_parts.previous_process_id)) as process_name,input_parts.id,input_parts.input_part_id,parts_tbl.part_name,parts_tbl.part_no,input_parts.id,input_parts.previous_process_id,input_parts.qty FROM input_parts INNER JOIN parts_tbl on input_parts.input_part_id  = parts_tbl.part_id WHERE input_parts.process_id = (WITH RECURSIVE process_chain AS (
    -- Base Case: Selects a set of rows with 6 columns including process_name
    SELECT p.process_id, p.previous_process_id
    FROM process_tbl p
    
    WHERE p.process_id =   $process_id AND p.cat = 'out'
    
    UNION ALL
    
    -- Recursive Case: Selects a set of rows with the same 6 columns including process_name
    SELECT p.process_id, p.previous_process_id
    FROM process_tbl p
    INNER JOIN process_chain pc ON p.process_id = pc.previous_process_id

)
-- Final output
SELECT process_id
FROM process_chain WHERE previous_process_id = 0)";

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


