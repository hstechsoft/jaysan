<?php
 include 'db_head.php';


 $emp_id =test_input($_GET['emp_id']);
 $paid_amount =test_input($_GET['paid_amount']);
 $paid_date =test_input($_GET['paid_date']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "INSERT INTO expense_payment (paid_amount,paid_date,emp_id)
 VALUES ($paid_amount,$paid_date,$emp_id)";


  if ( $conn->query($sql) === TRUE) {
  } 
   else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

$conn->close();

 ?>


