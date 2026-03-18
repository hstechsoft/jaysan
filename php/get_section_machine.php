

<?php
 include 'db_head.php';

 $godown_id = test_input($_GET['godown_id']);
  $dep_id = test_input($_GET['dep_id']);
   $sec_id = test_input($_GET['sec_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}





 
 $sql = "SELECT wtm.machine_id, jm.machine_name FROM work_time_master wtm 
inner join jaysan_machine jm on wtm.machine_id = jm.jmid
WHERE wtm.godown_id = $godown_id and wtm.dep_id = $dep_id and wtm.dep_sec_id = $sec_id GROUP BY wtm.machine_id";


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


