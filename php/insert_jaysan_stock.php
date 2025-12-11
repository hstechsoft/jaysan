<?php
 include 'db_head.php';

 $godown = ($_GET['godown']);
$dep = ($_GET['dep']);
$sec = ($_GET['sec']);
$part_id = test_input($_GET['part_id']);
$batch_id = test_input($_GET['batch_id']);
$qty = test_input($_GET['qty']);

$finished_godown = ($_GET['finished_godown']);

$godown = sql_nullable($godown);
$dep = sql_nullable($dep);
$sec = sql_nullable($sec);

$finished_godown = sql_nullable($finished_godown);



function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




 $sql = "INSERT INTO jaysan_stock ( godown,dep,sec,part_id,batch_id,qty,finished_godown) VALUES ($godown,$dep,$sec,$part_id,$batch_id,$qty,$finished_godown)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


