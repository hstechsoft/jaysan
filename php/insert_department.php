<?php
 include 'db_head.php';

 $godown_id = test_input($_GET['godown_id']);
$dep_name = test_input($_GET['dep_name']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO department ( godown_id,dep_name) VALUES ($godown_id,$dep_name)";

  if ($conn->query($sql) === TRUE) {
   $last_id = $conn->insert_id;
   echo   $last_id;
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


