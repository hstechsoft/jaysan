<?php
 include 'db_head.php';


$emp_id = test_input($_POST['emp_id']);
$current_process_id = test_input($_POST['current_process_id']);
$current_machine_id = test_input($_POST['current_machine_id']);
$part_id = test_input($_POST['part_id']);
$godown_id = test_input($_POST['godown_id']);
$dep_id = test_input($_POST['dep_id']);
$sec_id = test_input($_POST['sec_id']);

if($emp_id =="" || $emp_id ==null || $emp_id ==0)
{
  echo "emp_id is required";
  $conn->close();
  exit();
}

$current_process_id =sql_nullable($current_process_id);
$current_machine_id =sql_nullable($current_machine_id);
$part_id =sql_nullable($part_id);
$godown_id =sql_nullable($godown_id);
$dep_id =sql_nullable($dep_id);
$sec_id =sql_nullable($sec_id);



 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


 $sql = "INSERT INTO work_done_table (emp_id,start_date,current_process_id,current_machine_id,part_id,godown_id,dep_id,sec_id) VALUES ($emp_id, NOW(), $current_process_id, $current_machine_id, $part_id, $godown_id, $dep_id, $sec_id)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


