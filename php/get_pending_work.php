<?php
 include 'db_head.php';

 

 $cur_time = test_input($_GET['p_cur_time_p1']);

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SELECT work.work_description,work.work_date,employee.emp_name from work INNER JOIN employee ON work.emp_id = employee.emp_id where work.work_date < $cur_time and work.work_com_status = 'incomplete'";

$result = $conn->query($sql);



if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
  echo "0 results";
}
$conn->close();

 ?>


