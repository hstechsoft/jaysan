<?php
 include 'db_head.php';

 $dep_id = test_input($_GET['dep_id']);
$sec_name = test_input($_GET['sec_name']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO dep_section ( ) VALUES ($)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


