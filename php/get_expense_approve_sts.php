<?php
 include 'db_head.php';

 $exp_emp_id = test_input($_GET['exp_emp_id']);
$exp_approve = test_input($_GET['exp_approve']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT * FROM expense WHERE exp_emp_id =  $exp_emp_id AND exp_approve =  $exp_approve";

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


