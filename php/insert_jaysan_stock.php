<?php
 include 'db_head.php';

 $godown = ($_GET['godown']);
$dep = ($_GET['dep']);
$sec = ($_GET['sec']);
$finished_process_no = ($_GET['finished_process_no']);
$batch_id = ($_GET['batch_id']);
$qty = ($_GET['qty']);
$dated = ($_GET['dated']);
$finished_godown = ($_GET['finished_godown']);

sql_nullable($godown);
sql_nullable($dep);
sql_nullable($sec);
sql_nullable($finished_process_no);
sql_nullable($batch_id);
sql_nullable($qty);
sql_nullable($dated);
sql_nullable($finished_godown);
 
 echo $godown;
  echo $dep;
    echo $sec;
      echo $finished_process_no;
      echo $batch_id;
        echo $qty;
        echo $dated;
          echo $finished_godown;


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




 $sql = "INSERT INTO jaysan_stock ( godown,dep,sec,finished_process_no,batch_id,qty,dated,finished_godown) VALUES ($godown,$dep,$sec,$finished_process_no,$batch_id,$qty,$dated,$finished_godown)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


