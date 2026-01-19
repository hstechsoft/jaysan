<?php
 include 'db_head.php';

 $msid = test_input($_POST['msid']);
$bom_id = test_input($_POST['bom_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  jaysan_model_subtype SET bom_id =  $bom_id WHERE msid =  $msid";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


