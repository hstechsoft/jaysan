<?php
 include 'db_head.php';

 $latti = test_input($_POST['latti']);
$longi = test_input($_POST['longi']);
$creditor_id =test_input($_POST['creditor_id']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  creditors SET latti =  $latti, longi = $longi WHERE creditor_id =  $creditor_id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


