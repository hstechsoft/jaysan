<?php
 include 'db_head.php';



 $wtid = test_input($_POST['wtid']);
$qty = test_input($_POST['qty']);


// get_details fromwork_time_master table
$get_details_sql = "SELECT wtm.godown_id, wtm.dep_id, wtm.dep_sec_id, wtm.ori_process_id,pwt.part_id,pwt.process_id FROM work_time_master wtm
inner join process_wel_tbl pwt on wtm.ori_process_id = pwt.process_id
WHERE wtid = $wtid";
$result = $conn->query($get_details_sql);
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $godown = $row['godown_id'];
    $dep = $row['dep_id'];
    $sec = $row['dep_sec_id'];
    $process_id = $row['ori_process_id'];
    $part_id = $row['part_id'];
} else {
    echo "No details found for the given work time ID.";
    $conn->close();
    exit();
}


$godown = sql_nullable($godown);
$dep = sql_nullable($dep);
$sec = sql_nullable($sec);
$process_id = sql_nullable($process_id);

 $remark = "Stock manually updated ";
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}

// insert on duplicate ket update

$sql = "insert into jaysan_stock (godown,dep,sec,process_id,qty,remark,part_id) values ($godown,$dep,$sec,$process_id,$qty,'$remark',$part_id) ON DUPLICATE KEY UPDATE qty =  $qty, remark = '$remark' ";

 

  if ($conn->query($sql) === TRUE) {
    // get inserted stock id
    $stock_id = $conn->insert_id;
   require_once 'stock_distribution.php';
   $result = stock_distribution($conn,$stock_id,$qty,$process_id);
   if ($result) {
       echo "ok";
   } else {
       echo "error distributing stock";
   }


  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


