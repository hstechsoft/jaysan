<?php
 include 'db_head.php';


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT 
    (SELECT COUNT(part_id) FROM parts_tbl) AS total_parts,
    (SELECT COUNT(DISTINCT part_id) FROM part_assign_tbl) AS assigned_parts,
    (SELECT COUNT(part_id) FROM parts_tbl) - (SELECT COUNT(DISTINCT part_id) FROM part_assign_tbl) AS unassigned_parts;";


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


