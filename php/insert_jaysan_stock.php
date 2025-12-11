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
$min_qty =  isset($_GET['min_qty']) ? test_input($_GET['min_qty']) : "''";
$max_qty = isset($_GET['max_qty']) ? test_input($_GET['max_qty']) : "''";




function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


echo 'godown =' . $godown . ' dep =' . $dep . ' sec =' . $sec . ' part_id =' . $part_id;
// Set MySQL timezone
$conn->query("SET time_zone = '+05:30'");

// Check if record exists
$check_sql = "SELECT qty FROM jaysan_stock WHERE (godown = $godown OR $godown IS NULL)AND (dep = $dep OR $dep IS NULL)AND (sec = $sec OR $sec IS NULL)AND (part_id = $part_id )";
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
$check_master = "SELECT *
FROM sec_stock_master
WHERE (godown = $godown OR $godown IS NULL)AND (dep = $dep OR $dep IS NULL)AND (sec = $sec OR $sec IS NULL)AND (part_id = $part_id );";
$master_result = $conn->query($check_master);
if ($master_result->num_rows > 0) {
  // Record exists, update it
  $master_sql = "UPDATE sec_stock_master SET min_qty=$min_qty,max_qty=$max_qty
      WHERE godown=$godown AND dep=$dep AND sec=$sec AND part_id=$part_id";
     $master_sql_result =   $conn->query($master_sql);
      if ($master_sql_result->num_rows > 0) {
      }
      else {
        echo "Error: " . $master_sql . "<br>" . $conn->error;
      }
      
} else {
  // Record doesn't exist, insert it
  $master_sql = "INSERT INTO sec_stock_master (godown,dep,sec,part_id,min_qty,max_qty) 
      VALUES ($godown,$dep,$sec,$part_id,$min_qty,$max_qty)";
      $master_sql_result =   $conn->query($master_sql);
      if ($master_sql_result->num_rows > 0) {
      }
      else {
        echo "Error: " . $master_sql . "<br>" . $conn->error;
      }
}
    echo "ok";




  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


