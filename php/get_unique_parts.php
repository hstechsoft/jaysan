<?php
 include 'db_head.php';

 
 $title_id = $_GET['title_id'];
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

if($title_id == '0')
 $sql = "SELECT DISTINCT parts_tbl.part_id, parts_tbl.part_name, parts_tbl.part_no        
   FROM parts_tbl 
          INNER JOIN part_assign_tbl ON parts_tbl.part_id = part_assign_tbl.part_id";
else
$sql = "SELECT DISTINCT parts_tbl.part_id, parts_tbl.part_name, parts_tbl.part_no 
FROM parts_tbl 
INNER JOIN part_assign_tbl ON parts_tbl.part_id = part_assign_tbl.part_id where title_id = $title_id";
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



