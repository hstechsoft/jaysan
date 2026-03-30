<?php
 include 'db_head.php';

$work_id  = test_input($_POST['work_id']);
$current_process_id = test_input($_POST['current_process_id']);
$current_machine_id = test_input($_POST['current_machine_id']);
$part_id = test_input($_POST['part_id']);
$godown_id = test_input($_POST['godown_id']);
$dep_id = test_input($_POST['dep_id']);
$sec_id = test_input($_POST['sec_id']);


if($work_id =="" || $work_id ==null || $work_id ==0)
{
  echo "work_id is required";
  $conn->close();
  exit();
}

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


$current_process_id =sql_nullable($current_process_id);
$current_machine_id =sql_nullable($current_machine_id);
$part_id =sql_nullable($part_id);
$godown_id =sql_nullable($godown_id);
$dep_id =sql_nullable($dep_id);
$sec_id =sql_nullable($sec_id);



$sql = "UPDATE work_done_table SET  current_process_id = $current_process_id, current_machine_id = $current_machine_id, part_id = $part_id, godown_id = $godown_id, dep_id = $dep_id, sec_id = $sec_id WHERE work_id= $work_id";
  if ( $conn->query($sql) === TRUE) {
    echo "ok";
  } 
   else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }




$conn->close();

 ?>


