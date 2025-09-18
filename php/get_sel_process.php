<?php
 include 'db_head.php';

 

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT jaysan_process.process_name,parts_tbl.part_name,parts_tbl.part_no,process_tbl.process_id,process_tbl.output_part from process_tbl INNER JOIN jaysan_process ON process_tbl.process = jaysan_process.process_id INNER join parts_tbl ON process_tbl.output_part = parts_tbl.part_id WHERE process_tbl.process_id not in (SELECT input_parts.previous_process_id from input_parts)  and process_tbl.cat = 'out'";

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


