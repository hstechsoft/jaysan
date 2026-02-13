<?php
 include 'db_head.php';




function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



 $sql = "SELECT bo1.bom_id,bo1.part_id,bo1.component_cat,parts_tbl.part_name from bom_output bo1 INNER join parts_tbl on bo1.part_id = parts_tbl.part_id WHERE bo1.bom_id  in(SELECT bom_output.bom_id from bom_output 
inner join bom_input on bom_output.bom_id = bom_input.bom_id WHERE bom_output.part_id = bom_input.part_id and bom_output.component_cat <> 'Process' GROUP by  bom_output.bom_id)";

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


