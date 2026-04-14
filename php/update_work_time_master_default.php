<?php
 include 'db_head.php';

$wtid  = test_input($_POST['wtid']);
$is_default = test_input($_POST['is_default']);
$ori_process_id = test_input($_POST['process_id']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


// if is default is 0  check there is atleat one deafult = 1 for that ori_process_id if not set this as 1 instead of 0
if($is_default == "0")
{
  $sql = "SELECT * FROM work_time_master WHERE ori_process_id = $ori_process_id and is_default = 1";
  $result = $conn->query($sql);
  if ($result->num_rows == 0) {
    $is_default = "1";
  }
}
// if is default is 1 then set all other default to 0 for that ori_process_id
else if($is_default == "1")
  {
    $sql = "UPDATE work_time_master SET is_default = 0 WHERE ori_process_id = $ori_process_id";
    if ($conn->query($sql) === TRUE) {
     // echo "ok";
    } else {
      echo "Error: " . $sql . "<br>" . $conn->error;
    }
  }
  else{
    echo "Error: Invalid value for is_default. Must be '0' or '1'.";
    $conn->close();
    exit;
  }



 $sql =  "UPDATE  work_time_master SET is_default = $is_default WHERE wtid =  $wtid";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
$conn->close();

 ?>


