<?php
 include 'db_head.php';

 

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT mrf_request.part_id,
parts_tbl.part_name,
 sum(mrf_request.qty) as total_qty FROM mrf_request
 inner join parts_tbl on mrf_request.part_id = parts_tbl.part_id where status = 'created' group by mrf_request.part_id";

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


