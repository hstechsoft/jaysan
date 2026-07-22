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



 $sql = "SELECT pout.part_name as out_part_name,
ifnull(count(process_wel_tbl.process_id),0) as process_availble,
bom_input.part_id,
bom_input.qty-bom_input.sub_ass_qty as qty,
parts_tbl.part_name,
parts_tbl.sub_ass,
bom_input.bom_id,
parts_tbl.part_no,
 JSON_ARRAYAGG(JSON_OBJECT('process',jaysan_process.process_name,'process_id',process_wel_tbl.process_id)) as process_details

from bom_input 

INNER JOIN bom_output on bom_input.bom_id = bom_output.bom_id 
INNER JOIN parts_tbl pout on bom_output.part_id = pout.part_id 
INNER JOIN parts_tbl on bom_input.part_id = parts_tbl.part_id 
left join process_wel_tbl on bom_input.part_id = process_wel_tbl.output_part and process_wel_tbl.cat = 'out'
left join jaysan_process on process_wel_tbl.process = jaysan_process.process_id
WHERE bom_output.part_id = $part_id and bom_output.component_cat = $component_cat and bom_input.qty-bom_input.sub_ass_qty > 0 GROUP by bom_input.part_id";

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


