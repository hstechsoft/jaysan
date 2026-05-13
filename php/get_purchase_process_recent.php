<?php
 include 'db_head.php';

 

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql_process = "SELECT process_wel_tbl.component_cat, process_wel_tbl.process_id,parts_tbl.part_name,process_wel_tbl.output_part,parts_tbl.part_no,parts_tbl.part_id FROM process_wel_tbl 
inner join jaysan_process on process_wel_tbl.process = jaysan_process.process_id
inner join parts_tbl on process_wel_tbl.output_part = parts_tbl.part_id
WHERE process_name = 'purchase' AND cat = 'out' AND process_title = 'purchase'";

$result = $conn->query($sql_process);

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


