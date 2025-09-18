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

$sql = "SELECT GROUP_CONCAT(concat(' <li class=\"list-group-item m-0 p-0\"> <div class=\"card\"><div class=\"card-header small\">',machine_name,' </div><div class=\"card-body m-0 p-0 small\"><p class=\"m-0 p-0 \">Min - ',min_time,' Mins</p>  <p class=\" \">Max - ',max_time,' Mins</p> </div></div>
            </li>') separator '') as details, min_time,max_time,machine_name,wtid,process_name,jaysan_process.process_id  FROM work_time_master INNER join jaysan_machine on work_time_master.machine_id = jaysan_machine.jmid  INNER join jaysan_process on work_time_master.process_id = jaysan_process.process_id where jaysan_process.process_id = $process_id";

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


