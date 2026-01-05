<?php
 include 'db_head.php';

 
 $email = test_input($_GET['email']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "SELECT emp_id,emp_name,emp_role,emp_approve FROM employee where emp_email = $email ";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
        $_SESSION['user_id'] = $r['emp_id'];
$_SESSION['role']    = $r['emp_role'];
    }
    print json_encode($rows);
} else {
  echo "0 result";
}
$conn->close();

 ?>


