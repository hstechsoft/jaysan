<?php
 include 'db_head.php';

 $nes_master_id = test_input($_GET['nes_master_id']);



 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "DELETE  FROM nesting_master WHERE nes_master_id =  $nes_master_id";

  if ($conn->query($sql) === TRUE) {

  // delete if any attachments in folder 

   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


