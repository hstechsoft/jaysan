<?php
 include 'db_head.php';

 $su_name = test_input($_GET['su_name']);
$su_email = test_input($_GET['su_email']);
$su_phone = test_input($_GET['su_phone']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO sujith (su_name,su_email,su_phone) VALUES ($su_name,$su_email,$su_phone)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


