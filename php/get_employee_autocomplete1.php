<?php
 include 'db_head.php';


 $emp_name = test_input($_GET['emp_name']);
 $wid = test_input($_GET['wid']);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT emp_name,emp_id FROM employee WHERE emp_name LIKE $emp_name and emp_id not in (select emp_id from work_employee where work_employee.wid = $wid and  end_time = '0000-00-00 00:00:00')" ;


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


