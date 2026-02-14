<?php
 include 'db_head.php';


$bom_id = test_input($_POST['bom_id']);

 $is_default = sql_nullable($_POST['is_default']);
 if($is_default != '1') {
   $is_default = "NULL";
 }
 
 
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


