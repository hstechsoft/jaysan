<?php
 include 'db_head.php';

  $mrf_request_id = test_input($_POST['mrf_request_id']);
$status = test_input($_POST['status']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  mrf_request SET status =  $status WHERE mrf_request_id =  $mrf_request_id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


