<?php
 include 'db_head.php';

 
 $part_id =test_input($_GET['part_id']);
 $godown_id =($_GET['godown_id']);
 $dep_id =($_GET['dep_id']);
 $dep_sec_id =($_GET['dep_sec_id']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$godown_id = sql_nullable($godown_id);
$dep_id = sql_nullable($dep_id);    
$dep_sec_id = sql_nullable($dep_sec_id);




 $sql = "SELECT finished_godown_master.part_id,part_name FROM finished_godown_master 
 inner join parts_tbl on finished_godown_master.part_id = parts_tbl.part_id
 where finished_godown_master.godown_id = $godown_id and finished_godown_master.dep_id = $dep_id and finished_godown_master.dep_sec_id = $dep_sec_id
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


