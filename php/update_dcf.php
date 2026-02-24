<?php
 include 'db_head.php';

 $dcf_report = test_input($_POST['dcf_report']);
$dcf_id = test_input($_POST['dcf_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  dcf SET dcf_report =  $dcf_report WHERE dcf_id =  $dcf_id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


