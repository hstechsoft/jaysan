<?php
 include 'db_head.php';
$shift = test_input($_GET['shift']);
$machine_id = test_input($_GET['machine_id']);
$status = test_input($_GET['status']);
$status_query = 1;
if($status != 'all'){
  $status_query = "laser_job_card.status = '$status'";
}

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


 $sql = " select 
    laser_job_card.assign_date,
laser_job_card.shift,
laser_job_card.machine_id,
laser_job_card.assigned_by,
laser_job_card.status,
laser_job_card.scarp_weight,
laser_job_card.job_card_id,
laser_job_card.scarp_qty,
laser_job_card.nesting_details_id,
nesting_view.*

from
   laser_job_card
    left join  nesting_view on nesting_view.nesting_details_id = laser_job_card.nesting_details_id where laser_job_card.shift = '$shift' and laser_job_card.machine_id = $machine_id and $status_query";

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


