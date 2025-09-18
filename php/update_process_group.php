<?php
 include 'db_head.php';

 $sample_sts = test_input($_GET['sample_sts']);
$pgid = test_input($_GET['pgid']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  process_group SET sample_sts =  $sample_sts WHERE pgid =  $pgid";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


