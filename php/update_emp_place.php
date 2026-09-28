<?php
 include 'db_head.php';

 $godown = test_input($_POST['godown']);
$dep = test_input($_POST['dep']);
$sec = test_input($_POST['sec']);
$emp_id = test_input($_POST['emp_id']);
$emp_place_id = test_input($_POST['emp_place_id']);


$godown = sql_nullable($godown);
$dep = sql_nullable($dep);
$sec = sql_nullable($sec);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  emp_place SET godown =  $godown,dep =  $dep,sec =  $sec,emp_id =  $emp_id WHERE emp_place_id =  $emp_place_id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


