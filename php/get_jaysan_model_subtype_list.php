<?php
 include 'db_head.php';




 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT jaysan_model_subtype.*,bom_output.part_id,bom_output.component_cat,(select part_name from parts_tbl where part_id = bom_output.part_id) as part_name FROM jaysan_model_subtype 
 left join bom_output on jaysan_model_subtype.bom_id = bom_output.bom_id
 WHERE alias_name <> ''";

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


