<?php
 include 'db_head.php';

 $godown = test_input($_GET['godown']);
$dep = test_input($_GET['dep']);
$sec = test_input($_GET['sec']);
$finished_process_no = test_input($_GET['finished_process_no']);
$batch_id = test_input($_GET['batch_id']);
$qty = test_input($_GET['qty']);

$finished_godown = ($_GET['finished_godown']);

sql_nullable($godown);
sql_nullable($dep);
sql_nullable($sec);

sql_nullable($finished_godown);
 
 echo $godown;
  echo $dep;
    echo $sec;
      echo $finished_process_no;
      echo $batch_id;
        echo $qty;

          echo $finished_godown;


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




 $sql = "INSERT INTO jaysan_stock ( godown,dep,sec,finished_process_no,batch_id,qty,finished_godown) VALUES ($godown,$dep,$sec,$finished_process_no,$batch_id,$qty,$finished_godown)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


