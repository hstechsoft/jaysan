<?php
 include 'db_head.php';

 $godown = test_input($_POST['godown']);
$dep = test_input($_POST['dep']);
$sec = test_input($_POST['sec']);
$finished_process_no = test_input($_POST['finished_process_no']);
 $part_id = test_input($_POST['part_id']);
$qty = test_input($_POST['qty']);
$remark = test_input($_POST['remark']);

if($remark == '' || $remark == null || $part_id == '' || $part_id == null || $part_id <= 0 ){
  $conn->close();
  echo "Please fill all the required fields";
  exit();
}



 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}

// insert on duplicate ket update

$sql = "insert into jaysan_stock (godown,dep,sec,process_id,qty,remark,part_id) values ($godown,$dep,$sec,$finished_process_no,$qty,'$remark',$part_id) ON DUPLICATE KEY UPDATE qty =  $qty, remark = '$remark' ";



  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


