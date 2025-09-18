<?php
 include 'db_head.php';

 $godown_name = test_input($_GET['godown_name']);
$place = test_input($_GET['place']);
$address = test_input($_GET['address']);
$gst = test_input($_GET['gst']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



 $sql = "INSERT INTO godown ( godown_name,place,address,gst) VALUES ($godown_name,$place,$address,$gst)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


 