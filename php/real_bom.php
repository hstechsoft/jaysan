<?php
 include 'db_head.php';

 

 
function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  $data = "'" . $data . "'";
  return $data;
}

require_once 'loadBom.php';
$bom = loadBom($conn);
print_r($bom);
$conn->close();



 ?>


