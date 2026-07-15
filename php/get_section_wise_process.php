

<?php
 include 'db_head.php';

 $godown_id = test_input($_GET['godown_id']);
  $dep_id = test_input($_GET['dep_id']);
   $sec_id = test_input($_GET['sec_id']);
    $machine_id = test_input($_GET['machine_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}





 $sql = "with  sec_wise as (SELECT pwt.previous_process_id, pwt.process,pwt.process_id,pwt.process_title,wtm.min_time,wtm.max_time,wtm.dep_id,wtm.dep_sec_id,wtm.godown_id,wtm.wtid FROM work_time_master wtm inner JOIN process_wel_tbl pwt on wtm.ori_process_id = pwt.process_id WHERE  wtm.godown_id = $godown_id and wtm.dep_id = $dep_id and wtm.dep_sec_id = $sec_id and wtm.machine_id = $machine_id), 
outpart as (SELECT min_time,max_time, get_output_part(process_id) as outpart,  previous_process_id, process,process_id,process_title,dep_id,dep_sec_id,godown_id,wtid FROM sec_wise )
SELECT outpart.*,jp.process_name,pt.part_name as output_part FROM outpart
 inner join jaysan_process jp on outpart.process = jp.process_id
 inner join parts_tbl pt on outpart.outpart = pt.part_id";


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


