<?php
 include 'db_head.php';


 

 $policy_id = test_input($_GET['policy_id']);
 $policy_cat = test_input($_GET['policy_cat']);
 

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



$sql ="UPDATE policy SET policy_cat = $policy_cat where policy_id = $policy_id";
  if ( $conn->query($sql) === TRUE) {
  } 
   else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  

$sql_i = "INSERT INTO policy_correction ( policy_id) VALUES ($policy_id);";
 
 if ($conn->query($sql_i) === TRUE) {
 
echo "ok";
 } else {
   echo "Error: " .  "<br>" ."not Valid";
 }

  

$conn->close();

 ?>


