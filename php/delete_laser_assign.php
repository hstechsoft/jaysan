<?php
 include 'db_head.php';

 $nesting_details_id = test_input($_POST['nesting_details_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "DELETE  FROM  nesting_details WHERE nesting_details_id =  $nesting_details_id";

  if ($conn->query($sql) === TRUE) {
echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  } 



   echo "ok";
$conn->close();

 ?>


