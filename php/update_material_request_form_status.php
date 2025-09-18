<?php
 include 'db_head.php';

 $status = test_input($_GET['status']);
$mrf_id = test_input($_GET['mrf_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  material_request_form SET status =  $status WHERE mrf_id =  $mrf_id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


