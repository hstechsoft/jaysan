
<?php
 include 'db_head.php';

$exp_des = test_input($_GET['exp_des']);
    $exp_cat = test_input($_GET['exp_cat']);
    $exp_amount = test_input($_GET['exp_amount']);
    $exp_date = ($_GET['exp_date']);
     $exp_emp_id = test_input($_GET['exp_emp_id']);
$exp_id = test_input($_GET['exp_id']);



function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



$sql = "UPDATE expense SET exp_des = $exp_des,exp_cat = $exp_cat,exp_amount = $exp_amount,exp_date = UNIX_TIMESTAMP('$exp_date') * 1000,exp_emp_id  = $exp_emp_id where exp_id = $exp_id";
  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  echo "ok";
  




$conn->close();

?>





