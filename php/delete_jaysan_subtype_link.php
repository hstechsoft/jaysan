<?php
 include 'db_head.php';

 $link_id = test_input($_GET['link_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql_delete = "DELETE FROM jaysan_subtype_link WHERE link_id = $link_id";
 

  if ($conn->query($sql_delete) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql_delete . "<br>" . $conn->error;
  }
$conn->close();

 ?>


