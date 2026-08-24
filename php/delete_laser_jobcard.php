<?php
 include 'db_head.php';

 $job_card_id = test_input($_POST['job_card_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "DELETE  FROM  laser_job_card WHERE job_card_id =  $job_card_id";

  if ($conn->query($sql) === TRUE) {
echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  } 



   echo "ok";
$conn->close();

 ?>


