<?php
 include 'db_head.php';



 $godown = test_input($_POST['godown']);
    $dep = test_input($_POST['dep']);
    $sec = test_input($_POST['sec']);
    $process_id = test_input($_POST['process_id']);

$qty = test_input($_POST['qty']);





$godown = sql_nullable($godown);
$dep = sql_nullable($dep);
$sec = sql_nullable($sec);
$process_id = sql_nullable($process_id);


 $remark = "Stock manually updated";
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


// get part id from process_wel_tbl

$get_part_id_sql = "SELECT output_part FROM process_wel_tbl WHERE process_id <=> $process_id";
$result = $conn->query($get_part_id_sql);
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $part_id = $row['output_part'];
    $part_id = sql_nullable($part_id);
} else {
    echo "Error: Could not retrieve part ID.";
    $conn->close();
    exit();
}


if($part_id == "null" || $part_id == null || $part_id == "NULL")
{
}
else
    {
        $process_id = "NULL";
    }
    {

$sql = "insert into jaysan_stock (godown,dep,sec,process_id,qty,remark,part_id) values ($godown,$dep,$sec,$process_id,$qty,'$remark',$part_id) ON DUPLICATE KEY UPDATE qty =  qty + $qty, remark = '$remark' ";

//  echo $sql;
$stock_id = 0;
  if ($conn->query($sql) === TRUE) {

    $stock_id = $conn->insert_id;
    echo "ok";
 




  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
    }
$conn->close();

 ?>


