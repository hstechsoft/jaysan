<?php
 include 'db_head.php';

 
 $phone_id = test_input($_GET['phone_id']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT  COUNT(*)as total, GROUP_CONCAT( CONCAT(work_type, ' - ',work_description)) as work_des from work WHERE work_date BETWEEN UNIX_TIMESTAMP(CURRENT_TIMESTAMP())*1000  and UNIX_TIMESTAMP(CURRENT_TIMESTAMP())*1000 + 300000 and work_com_status = 'incomplete' and emp_id = (SELECT employee.emp_id FROM employee WHERE employee.emp_phone_id = $phone_id ) GROUP by emp_id";

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


