<?php
 include 'db_head.php';

 $cat = test_input($_GET['cat']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

if($cat == "'not_done'")
  $sql = "SELECT bom_output.part_id,parts_tbl.part_name,sum(ifnull(is_default,0)),GROUP_CONCAT(bom_output.bom_id,component_cat),COUNT(bom_output.part_id),JSON_ARRAYAGG(JSON_OBJECT('bom_id',bom_id,'component_cat',component_cat,'is_default',is_default)) FROM `bom_output`
inner join parts_tbl on bom_output.part_id = parts_tbl.part_id
WHERE component_cat <> 'process' GROUP by bom_output.part_id having COUNT(bom_output.bom_id) > 1 and sum(ifnull(is_default,0)) = 0
ORDER BY `bom_output`.`component_cat` ASC ";
    else

 $sql = "SELECT bom_output.part_id,parts_tbl.part_name,sum(ifnull(is_default,0)),GROUP_CONCAT(bom_output.bom_id,component_cat),COUNT(bom_output.part_id),JSON_ARRAYAGG(JSON_OBJECT('bom_id',bom_id,'component_cat',component_cat,'is_default',is_default)) FROM `bom_output`
inner join parts_tbl on bom_output.part_id = parts_tbl.part_id
WHERE component_cat <> 'process' GROUP by bom_output.part_id having COUNT(bom_output.bom_id) > 1 and sum(ifnull(is_default,0)) > 0
ORDER BY `bom_output`.`component_cat` ASC";

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


