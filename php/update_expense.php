<?php
 include 'db_head.php';


 $exp_id =test_input($_GET['exp_id']);
 $exp_approve =test_input($_GET['exp_approve']);
 

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



$sql = "UPDATE expense SET  exp_approve =  $exp_approve WHERE exp_id= $exp_id";
  if ( $conn->query($sql) === TRUE) {
  } 
   else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

$conn->close();

 ?>


