<?php
 include 'db_head.php';

  $part_id = test_input($_POST['part_id']);
$status = test_input($_POST['status']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  mrf_request SET status =  $status WHERE part_id =  $part_id and status = 'created'";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


