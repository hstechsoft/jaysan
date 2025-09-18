<?php
 include 'db_head.php';

 $mtid = test_input($_GET['mtid']);
$subtype_name = test_input($_GET['subtype_name']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO jaysan_model_subtype ( mtid,subtype_name) VALUES ($mtid,$subtype_name)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


