<?php
 include 'db_head.php';


 $dated = test_input($_GET['dated']);
 // $today_end = test_input($_GET['today_end']);
 $emp_id = test_input($_GET['emp_id']);
 $all_leads = test_input($_GET['all_leads']);
$date_query = 1;
// convert date to timestamp in query
$today_start = strtotime($dated . ' 00:00:00') *1000;
$today_end = strtotime($dated . ' 23:59:59') *1000;
 if ($all_leads == "all") {
   $date_query = "dated between  $today_start and  $today_end";
 }


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}



$sql = "SELECT * FROM `marketing_lead` WHERE emp_id = $emp_id and $date_query";


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


