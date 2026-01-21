<?php
 include 'db_head.php';

 $sub_group_id = test_input($_POST['sub_group_id']);
 $sub_group_name = test_input($_POST['sub_group_name']);



 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "update    customer_subgroup_master set sub_group_name = $sub_group_name WHERE sub_group_id =  $sub_group_id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


