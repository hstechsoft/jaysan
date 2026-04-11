<?php
 include 'db_head.php';

 $wtid  = test_input($_POST['wtid']);

// delete 
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "DELETE  FROM work_time_master WHERE wtid =  $wtid";
log_delete_query($sql);
  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


