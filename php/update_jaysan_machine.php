<?php
 include 'db_head.php';

 $machine_name = test_input($_GET['machine_name']);
$running_cost = test_input($_GET['running_cost']);
$jmid = test_input($_GET['jmid']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  jaysan_machine SET machine_name =  $machine_name,running_cost =  $running_cost WHERE jmid =  $jmid";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


