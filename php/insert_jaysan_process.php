<?php
 include 'db_head.php';

 $process_name = test_input($_GET['process_name']);
$process_des = test_input($_GET['process_des']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT ignore INTO jaysan_process ( process_name,process_des) VALUES ($process_name,$process_des) on duplicate key update process_id = last_insert_id(process_id)";

  if ($conn->query($sql) === TRUE) {
     $last_id = $conn->insert_id;
   echo  $last_id;
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


