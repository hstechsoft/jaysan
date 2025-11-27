
<?php
 include 'db_head.php';

$ass_id = test_input($_GET['ass_id']);
    $dated = test_input($_GET['dated']);
   



function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";

return $data;
}

// Check if record exists
$check_sql = "SELECT 1 FROM `machine_production` WHERE ass_id = $ass_id AND dated = $dated";
$result = $conn->query($check_sql);

if ($result && $result->num_rows > 0) {
    echo "Record already exists";
    $conn->close();
    exit;
}



$sql = "UPDATE expense SET exp_des = $exp_des,exp_cat = $exp_cat,exp_amount = $exp_amount,exp_date = UNIX_TIMESTAMP('$exp_date') * 1000,exp_emp_id  = $exp_emp_id where exp_id = $exp_id";
  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  echo "ok";
  




$conn->close();

?>





