<?php
 include 'db_head.php';

 $parent_cus_id = test_input($_POST['parent_cus_id']);
$child_cus_id = test_input($_POST['child_cus_id']);
$dealer_map_id = test_input($_POST['dealer_map_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  dealer_map SET parent_cus_id =  $parent_cus_id,child_cus_id =  $child_cus_id WHERE dealer_map_id =  $dealer_map_id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


