<?php
 include 'db_head.php';

 $godown = ($_GET['godown']);
$dep = ($_GET['dep']);
$sec = ($_GET['sec']);
$part_id = test_input($_GET['part_id']);
$batch_id = test_input($_GET['batch_id']);
$qty = test_input($_GET['qty']);
$remark = isset($_GET['remark']) && $_GET['remark'] != '' ? test_input($_GET['remark']) : "''";

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


echo "godown: ".$godown." dep: ".$dep." sec: ".$sec." part_id: ".$part_id." batch_id: ".$batch_id." qty: ".$qty." finished_godown: ".$finished_godown." remark: ".$remark."\n";

// Set MySQL timezone
$conn->query("SET time_zone = '+05:30'");

// Check if record exists
$check_sql = "SELECT qty FROM jaysan_stock WHERE godown=$godown AND dep=$dep AND sec=$sec AND part_id=$part_id";
$result = $conn->query($check_sql);

if ($result->num_rows > 0) {
  // Record exists, update it
  $sql = "UPDATE jaysan_stock SET batch_id=$batch_id, qty=$qty, finished_godown=$finished_godown , remark=$remark,dated = NOW()
      WHERE godown=$godown AND dep=$dep AND sec=$sec AND part_id=$part_id";
} else {
  // Record doesn't exist, insert it
  $sql = "INSERT INTO jaysan_stock (godown,dep,sec,part_id,batch_id,qty,finished_godown,remark) 
      VALUES ($godown,$dep,$sec,$part_id,$batch_id,$qty,$finished_godown,$remark)";
}

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


