<?php
 include 'db_head.php';

 



 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$conn->query("SET time_zone = '+05:30'");
$sql_store_type = "SELECT CURRENT_TIMESTAMP";
$result = $conn->query($sql_store_type);

if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
   echo $row['CURRENT_TIMESTAMP'];
   
  }
}
echo "ok";

$conn->close();

 ?>


