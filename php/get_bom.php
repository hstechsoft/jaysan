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



 $sql = "SELECT (select part_name from parts_tbl where part_id = $part_id) as out_part_name,(select sub_ass from parts_tbl where part_id = bom_input.part_id) as sub_ass, bom_input.part_id,bom_input.qty,parts_tbl.part_name,bom_input.bom_id,parts_tbl.part_no from bom_input INNER JOIN bom_output on bom_input.bom_id = bom_output.bom_id INNER JOIN parts_tbl on bom_input.part_id = parts_tbl.part_id WHERE bom_output.part_id =$part_id and bom_output.component_cat = $component_cat";

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


