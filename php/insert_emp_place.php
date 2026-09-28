<?php
 include 'db_head.php';

 $godown = test_input($_POST['godown']);
$dep = test_input($_POST['dep']);
$sec = test_input($_POST['sec']);
$emp_id = test_input($_POST['emp_id']);

$dep = sql_nullable($dep);
$sec = sql_nullable($sec);
$emp_id = sql_nullable($emp_id);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO emp_place ( godown,dep,sec,emp_id) VALUES ($godown,$dep,$sec,$emp_id)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


