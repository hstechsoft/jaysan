<?php
 include 'db_head.php';

 $godown = test_input($_GET['godown']);
$dep = test_input($_GET['dep']);
$sec = test_input($_GET['sec']);
$finished_process_no = test_input($_GET['finished_process_no']);
$batch_id = test_input($_GET['batch_id']);
$qty = test_input($_GET['qty']);

$finished_godown = test_input($_GET['finished_godown']);
$stock_id = test_input($_GET['stock_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  jaysan_stock SET godown =  $godown,dep =  $dep,sec =  $sec,finished_process_no =  $finished_process_no,batch_id =  $batch_id,qty =  $qty,finished_godown =  $finished_godown WHERE stock_id =  $stock_id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


