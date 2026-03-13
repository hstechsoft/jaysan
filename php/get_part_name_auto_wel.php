<?php
 include 'db_head.php';


 $part = ($_GET['part']);
 $term = ($_GET['term']);
 $godwon_id = isset($_GET['godwon_id']) ? $_GET['godwon_id'] : null;
 $department_id = isset($_GET['department_id']) ? $_GET['department_id'] : null;
 $section_id = isset($_GET['section_id']) ? $_GET['section_id'] : null;
 
 $godwon_id = sql_nullable($godwon_id);
 $department_id = sql_nullable($department_id);
    $section_id = sql_nullable($section_id);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$part  = "%" .  $part ."%";


if($term == 'no')
{

if($godwon_id != 'null' || $department_id != 'null' || $section_id != 'null')
    $sql = "SELECT part_name,part_no,parts_tbl.part_id FROM `parts_tbl` 
inner  join finished_godown_master fm on fm.part_id = parts_tbl.part_id and fm.godown_id = $godwon_id and fm.dep_id = $department_id and fm.dep_sec_id = $section_id
 WHERE part_no 
  LIKE  '$part'";
  else
        $sql = "SELECT part_name,part_no,parts_tbl.part_id FROM `parts_tbl` 
inner  join finished_godown_master fm on fm.part_id = parts_tbl.part_id 
 WHERE part_no 
  LIKE  '$part'";
}

else 
    {
if($godwon_id != 'null' || $department_id != 'null' || $section_id != 'null')
 $sql = "SELECT part_name,part_no,parts_tbl.part_id FROM parts_tbl 
 inner  join finished_godown_master fm on fm.part_id = parts_tbl.part_id and fm.godown_id = $godwon_id and fm.dep_id = $department_id and fm.dep_sec_id = $section_id
 WHERE part_name LIKE  '$part'";
    else
 $sql = "SELECT part_name,part_no,parts_tbl.part_id FROM parts_tbl WHERE part_name LIKE  '$part'";

    }

echo $sql;
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


