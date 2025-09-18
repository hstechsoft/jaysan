<?php
 include 'db_head.php';

 error_reporting(E_ALL ^ E_NOTICE);  
 $phone_id =test_input($_GET['phone_id']);
 $pay_month =test_input($_GET['pay_month']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SELECT * FROM payslip WHERE emp_id = (SELECT employee.emp_code FROM employee WHERE employee.emp_phone_id = $phone_id) and pay_month =  $pay_month ";

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


