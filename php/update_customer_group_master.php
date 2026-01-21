<?php
 include 'db_head.php';

 $group_id = test_input($_POST['group_id']);
 $group_name = test_input($_POST['group_name']);



 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "update    customer_group_master set group_name = $group_name WHERE group_id =  $group_id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


