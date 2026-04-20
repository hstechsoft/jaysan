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
    $nesting_name_query = "nesting_name = $nesting_name";
}

if($material_id != ''){
    $material_id_query = "material_id = $material_id";
}
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT created_by,path,nesting_name,material_id,material_qty,run_time,product,employee.emp_name,parts_tbl.part_name as material_name FROM nesting_details
 inner join employee on nesting_details.created_by = employee.emp_id
inner join parts_tbl on nesting_details.material_id = parts_tbl.part_id
  WHERE $created_by_query and $nesting_name_query and $material_id_query";


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


