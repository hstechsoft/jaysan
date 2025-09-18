<?php
 include 'db_head.php';

 $su_name = test_input($_GET['su_name']);
$su_email = test_input($_GET['su_email']);
$su_phone = test_input($_GET['su_phone']);
$suith_id = test_input($_GET['suith_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  sujith SET su_name =  $su_name,su_email =  $su_email,su_phone =  $su_phone WHERE suith_id =  $suith_id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


