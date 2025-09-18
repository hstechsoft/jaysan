<?php
 include 'db_head.php';

 
 $cur_time = test_input($_GET['cur_time']);
 $emp_id = test_input($_GET['emp_id']);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT work.work_date from work  WHERE work.work_date > $cur_time AND work.emp_id =  $emp_id AND work.work_com_status = 'incomplete' ORDER BY work.work_date asc limit 1"; 

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


