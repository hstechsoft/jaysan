<?php
 include 'db_head.php';





function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT GROUP_CONCAT(employee.emp_name separator '\n') as emp, role_assign.* FROM `role_assign` INNER join employee on role_assign.employee_role = employee.emp_role GROUP by id;";



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


