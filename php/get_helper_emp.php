<?php
 include 'db_head.php';
 $wid = test_input($_GET['wid']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT work_employee.*,employee.emp_name FROM `work_employee` inner join employee on work_employee.emp_id  = employee.emp_id WHERE wid = $wid and end_time = '0000-00-00 00:00:00' and cat = 'helper'";


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


