<?php
 include 'db_head.php';

 
 $process_id = test_input($_GET['process_id']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT parts_tbl.part_name,parts_tbl.part_no,process_tbl.process_id,process_tbl.output_part FROM process_tbl INNER JOIN parts_tbl on  process_tbl.output_part = parts_tbl.part_id WHERE process_tbl.process_id = $process_id";

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


