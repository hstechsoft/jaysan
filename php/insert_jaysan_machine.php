<?php
 include 'db_head.php';

 $machine_name = test_input($_GET['machine_name']);
$running_cost = test_input($_GET['running_cost']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT ignore INTO jaysan_machine (  machine_name,running_cost) VALUES ($machine_name,$running_cost) on duplicate key update jmid = last_insert_id(jmid)";

  if ($conn->query($sql) === TRUE) {
    $last_id = $conn->insert_id;
    echo  $last_id;
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


