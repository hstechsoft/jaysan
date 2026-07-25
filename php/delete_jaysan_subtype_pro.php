<?php
 include 'db_head.php';

 $part_id = test_input($_GET['part_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql_delete = "DELETE FROM jaysan_subtype_link WHERE part_id = $part_id";
 

  if ($conn->query($sql_delete) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql_delete . "<br>" . $conn->error;
  }
$conn->close();

 ?>


