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


 $sql = "SELECT bom_output.part_id,bom_output.component_cat,bom_input.qty,(select part_name from parts_tbl where part_id  =  $part_id) as sub_part_name,(select part_no from parts_tbl where part_id  =  $part_id) as sub_part_no from bom_output INNER join bom_input on bom_input.bom_id = bom_output.bom_id WHERE bom_input.part_id =  $part_id";

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


