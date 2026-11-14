<?php
 include 'db_head.php';

 $parent_cus_id = test_input($_POST['parent_cus_id']);
$child_cus_id = test_input($_POST['child_cus_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO dealer_map (parent_cus_id,child_cus_id) VALUES ($parent_cus_id,$child_cus_id)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


