<?php
 include 'db_head.php';

 $group_name = test_input($_POST['group_name']);
 


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO customer_group_master (group_name) VALUES ($group_name) on DUPLICATE KEY UPDATE group_name = $group_name";

  if ($conn->query($sql) === TRUE) {
    $insert_id = $conn->insert_id;
   echo $insert_id;
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


