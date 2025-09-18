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

$sql = " SELECT * from emp_features WHERE emp_features.emp_id = (select emp_id from employee where employee.emp_phone_id = $phone_id )";

// $sql = "SELECT work_description,work_date,work_type,work.emp_id,work_id,emp_name FROM work INNER JOIN employee ON employee.emp_id = work.emp_id where work.work_created_by = $emp_id and work.work_assign_status ='accept' and work.work_com_status = 'incomplete' and work.emp_id != $emp_id ORDER BY work_date";

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


