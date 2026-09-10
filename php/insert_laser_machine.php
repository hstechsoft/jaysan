<?php
 include 'db_head.php';

 $jmid = test_input($_POST['jmid']);
$nes_master_id = test_input($_POST['nes_master_id']);
$run_time = test_input($_POST['run_time']);
$handling_time = test_input($_POST['handling_time']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO laser_machine ( jmid,nes_master_id,run_time,handling_time) VALUES ($jmid,$nes_master_id,$run_time,$handling_time)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


