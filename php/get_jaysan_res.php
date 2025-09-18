<?php
 include 'db_head.php';

 $phone_id =test_input($_GET['phone_id']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT emp_menu.res,role FROM emp_menu WHERE role = (SELECT employee.emp_role FROM employee WHERE employee.emp_phone_id =  $phone_id)";



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


