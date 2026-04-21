<?php
 include 'db_head.php';

 $created_by = test_input($_GET['created_by']);
 
$created_by_query = 1;
$nesting_name = test_input($_GET['nesting_name']);
$nesting_name_query = 1;
$material_id = test_input($_GET['material_id']);
$material_id_query = 1;

if($created_by != ''){
    $created_by_query = "created_by = $created_by";
}

if($nesting_name != ''){
    $nesting_name_query = "nesting_name like '%$nesting_name%'";
}

if($material_id != ''){
    $material_id_query = "material_id = $material_id";
}
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


 $sql = "SELECT JSON_ARRAYAGG(
        JSON_OBJECT('part_id', nesting_parts.part_id, 'qty', nesting_parts.qty, 'produced_qty', nesting_parts.produced_qty, 'scrap_qty', nesting_parts.scrap_qty, 'part_name', nesting_part.part_name)) as nesting_parts_details, created_by,path,nesting_name,material_id,material_qty,run_time,product,employee.emp_name,parts_tbl.part_name as material_name FROM nesting_details
 left join nesting_parts on nesting_details.nesting_id = nesting_parts.nesting_id
 left join parts_tbl nesting_part on nesting_parts.part_id = nesting_part.part_id
 inner join employee on nesting_details.created_by = employee.emp_id
inner join parts_tbl on nesting_details.material_id = parts_tbl.part_id
  WHERE $created_by_query and $nesting_name_query and $material_id_query  group by nesting_details.nesting_id";


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


