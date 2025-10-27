<?php
 include 'db_head.php';

 $machine_name = test_input($_GET['machine_name']);
$sec_id = test_input($_GET['sec_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO dep_sec_machine ( ) VALUES ($)";

  if ($conn->query($sql) === TRUE) {
  $last_id = $conn->insert_id;
   echo   $last_id;
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


