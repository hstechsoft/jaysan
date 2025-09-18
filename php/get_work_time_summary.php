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


 $sql = "SELECT min_time,max_time,machine_name,wtid  FROM work_time_master INNER join jaysan_machine on work_time_master.machine_id = jaysan_machine.jmid WHERE process_id =   $process_id";

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


