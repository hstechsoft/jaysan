<?php
 include 'db_head.php';

 $bom_id = test_input($_POST['bom_id']);

if($bom_id == "''")
{
  http_response_code(400);
  echo "bom_id is required";
  $conn->close();
  exit();
}
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "delete from bom_output where bom_id = $bom_id;";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


