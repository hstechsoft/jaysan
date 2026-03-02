<?php
 include 'db_head.php';





 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT finished_godown_master.part_id,part_name FROM finished_godown_master 
 inner join parts_tbl on finished_godown_master.part_id = parts_tbl.part_id
 group by finished_godown_master.part_id";

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


