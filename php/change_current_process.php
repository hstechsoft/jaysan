<?php
 include 'db_head.php';

$work_id  = test_input($_POST['work_id']);
$current_process_id = test_input($_POST['current_process_id']);
$current_machine_id = test_input($_POST['current_machine_id']);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



$sql = "UPDATE work_done_table SET  current_process_id = $current_process_id, current_machine_id = $current_machine_id WHERE work_id= $work_id";
  if ( $conn->query($sql) === TRUE) {
  } 
   else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }




$conn->close();

 ?>


