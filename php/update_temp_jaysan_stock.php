<?php
 include 'db_head.php';


$batch_id = test_input($_GET['batch_id']);
$qty = test_input($_GET['qty']);
$update_emp_name = test_input($_GET['update_emp_name']);
$requset_id = test_input($_GET['requset_id']);





 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}

// get details from stock request table
$get_request_details_sql = "SELECT * FROM stock_request WHERE request_id = $requset_id";
$result = $conn->query($get_request_details_sql);
if ($result->num_rows > 0) {
    $request_details = mysqli_fetch_assoc($result);
} else {
  echo "no request found";
  $conn->close();
  exit;
}

 $godown = sql_nullable($request_details['godown']);
$dep = sql_nullable($request_details['dep']);
$sec = sql_nullable($request_details['sec']);
$finished_process_no = sql_nullable($request_details['previous_process_id']);
$part_id = sql_nullable($request_details['part_id']);

$remark = "stock manully updated for temp stock update by " . $update_emp_name;


// UPDATE first
$sql = "
UPDATE jaysan_stock 
SET qty = qty + $qty, remark = '$remark'
WHERE 
  godown <=> $godown AND 
  dep <=> $dep AND 
  sec <=> $sec AND 
  process_id <=> $finished_process_no AND 
  part_id <=> $part_id
";

$conn->query($sql);

if ($conn->affected_rows == 0) {
    // INSERT if not exists
    $sql = "
    INSERT INTO jaysan_stock 
    (godown, dep, sec, process_id, batch_id, qty, remark, part_id)
    VALUES ($godown, $dep, $sec, $finished_process_no, '$batch_id', $qty, '$remark', $part_id)
    ";
    $conn->query($sql);
}

    $sql_delete_request = "DELETE FROM stock_request WHERE request_id = $requset_id";
    if ($conn->query($sql_delete_request) === TRUE) {
   echo "ok";
  }
  else {
    echo "Error deleting stock request: " . $conn->error;
  }


$conn->close();

 ?>


