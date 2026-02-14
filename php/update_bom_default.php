<?php
 include 'db_head.php';

 $is_default = test_input($_POST['is_default']);
$bom_id = test_input($_POST['bom_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  bom_output SET is_default =  1 WHERE bom_id =  $bom_id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


