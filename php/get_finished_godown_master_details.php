<?php
 include 'db_head.php';

 $part_id = test_input($_GET['part_id']);



 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT finished_godown_master.master_id, finished_godown_master.part_id,time_taken,godown_id,finished_godown_master.category,creditor_name,creditor_gst,creditor_phone,part_name,dep_name,sec_name    FROM finished_godown_master 
 inner join parts_tbl on finished_godown_master.part_id = parts_tbl.part_id
 left join creditors on finished_godown_master.godown_id = creditors.creditor_id
 left join department on finished_godown_master.dep_id = department.dep_id
 left join dep_section on finished_godown_master.dep_sec_id = dep_section.dep_sec_id
 
 where finished_godown_master.part_id = $part_id";

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


