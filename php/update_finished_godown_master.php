<?php
 include 'db_head.php';

 $part_id = test_input($_POST['part_id']);
$time_taken = test_input($_POST['time_taken']);
$godown_id = test_input($_POST['godown_id']);
$category = test_input($_POST['category']);
$master_id = test_input($_POST['master_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  finished_godown_master SET part_id =  $part_id,time_taken =  $time_taken,godown_id =  $godown_id,category =  $category WHERE master_id =  $master_id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


