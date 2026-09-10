<?php
 include 'db_head.php';

 $jmid = test_input($_POST['jmid']);
$nes_master_id = test_input($_POST['nes_master_id']);
$run_time = test_input($_POST['run_time']);
$handling_time = test_input($_POST['handling_time']);
$godown = sql_nullable(test_input($_POST['godown']));
$dep = sql_nullable(test_input($_POST['dep']));
$sec = sql_nullable(test_input($_POST['sec']));


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}

// update jaysan_machine with godown, dep, sec
$sql_update_machine = "UPDATE jaysan_machine SET godown_id = $godown, dep_id = $dep, dep_sec_id = $sec WHERE jmid = $jmid";
echo $sql_update_machine;
if ($conn->query($sql_update_machine) !== TRUE) {
    throw new Exception("Error: " . $sql_update_machine . "<br>" . $conn->error);
}

 $sql = "INSERT INTO laser_machine ( jmid,nes_master_id,run_time,handling_time) VALUES ($jmid,$nes_master_id,'$run_time','$handling_time')";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


