<?php
 include 'db_head.php';


 $today_start = test_input($_GET['today_start']);
 $today_end = test_input($_GET['today_end']);
 $emp_id = test_input($_GET['emp_id']);
 


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT * FROM `marketing_lead` WHERE emp_id = $emp_id and dated between  $today_start and  $today_end";


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


