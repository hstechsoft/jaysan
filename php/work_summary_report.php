<?php
 include 'db_head.php';

 
 $emp_id = test_input($_GET['emp_id']);
 $start_date = ($_GET['start_date']);
 $end_date = ($_GET['end_date']);

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SELECT DISTINCT (work.work_id) , work.work_type,work.work_status as his_status,count(work.work_id) as total FROM work WHERE EXISTS (SELECT work_history.work_id from work_history where work_history.work_id = work.work_id and work_history.his_date BETWEEN $start_date and $end_date) and work.emp_id = $emp_id  GROUP BY work.work_status";

// $sql = "SELECT work.work_type,work_history.his_status,COUNT(work_history.his_status) as total FROM work_history left JOIN work ON work_history.work_id = work.work_id WHERE  work_history.emp_id = $emp_id and work_history.his_date between  $start_date and  $end_date GROUP BY work_type,his_status ORDER by work.work_type ";


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


