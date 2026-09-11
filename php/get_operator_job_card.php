<?php
 include 'db_head.php';
$shift = test_input($_GET['shift']);
$machine_id = test_input($_GET['machine_id']);
$status = test_input($_GET['status']);
$status_query = 1;
$shift_query = 1;
$machine_id_query = 1;

if($status != 'all'){
  $status_query = "laser_job_card.status = '$status'";
}

if($shift != 'all'){
  $shift_query = "laser_job_card.shift = '$shift'";
}

if($machine_id != 'all'){
  $machine_id_query = "laser_job_card.machine_id = $machine_id";
}



function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


 $sql = " select 
*

from
   job_card_view
    inner join  nesting_details_view on nesting_details_view.nesting_details_id = job_card_view.nesting_details_id where $shift_query and $machine_id_query and $status_query";

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


