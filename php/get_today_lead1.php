<?php
 include 'db_head.php';


 $dated = test_input($_POST['dated']);

 $phone_id = test_input($_POST['phone_id']);
 


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}
// convert date to timestamp in query
$today_start = strtotime($dated . ' 00:00:00') *1000;
$today_end = strtotime($dated . ' 23:59:59') *1000;


$sql = "SELECT marketing_lead.* FROM `marketing_lead` inner join employee ON marketing_lead.emp_id = employee.emp_id WHERE employee.emp_phone_id = '$phone_id' and marketing_lead.dated between  $today_start and  $today_end";


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


