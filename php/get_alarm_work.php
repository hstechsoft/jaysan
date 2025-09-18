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


$sql = "SELECT DISTINCT work_date, CASE WHEN COUNT(work_date) > 1 THEN 'Multiple Work' ELSE CONCAT(work_type, ' - ',work_description) END AS work_des FROM work INNER JOIN employee on work.emp_id = employee.emp_id WHERE (UNIX_TIMESTAMP(CURRENT_TIMESTAMP())*1000) <= work_date AND employee.emp_phone_id =  $phone_id GROUP BY work_date LIMIT 1";

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


