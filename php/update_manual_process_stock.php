<?php
 include 'db_head.php';



 $wtid = test_input($_POST['wtid']);
$qty = test_input($_POST['qty']);


// get_details fromwork_time_master table
$get_details_sql = "SELECT wtm.godown_id, wtm.dep_id, wtm.dep_sec_id, wtm.ori_process_id,pwt.output_part,pwt.process_id FROM work_time_master wtm
inner join process_wel_tbl pwt on wtm.ori_process_id = pwt.process_id
WHERE wtid = $wtid";
$result = $conn->query($get_details_sql);
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $godown = $row['godown_id'];
    $dep = $row['dep_id'];
    $sec = $row['dep_sec_id'];
    $process_id = $row['ori_process_id'];
    $part_id = $row['output_part'];
} else {
    echo "No details found for the given work time ID.";
    $conn->close();
    exit();
}


$godown = sql_nullable($godown);
$dep = sql_nullable($dep);
$sec = sql_nullable($sec);
$process_id = sql_nullable($process_id);
$part_id = sql_nullable($part_id);

 $remark = "Stock manually updated ";
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}

// insert on duplicate ket update

$sql = "insert into jaysan_stock (godown,dep,sec,process_id,qty,remark,part_id) values ($godown,$dep,$sec,$process_id,$qty,'$remark',$part_id) ON DUPLICATE KEY UPDATE qty =  $qty, remark = '$remark' ";

//  echo $sql;

  if ($conn->query($sql) === TRUE) {
    // get inserted stock id if new record inserted else get stock id from jaysan_stock table for that godown,dep,sec,process_id,part_id
    if ($conn->affected_rows > 0) {
        $stock_id = $conn->insert_id;
    } else {
        $sql_get_stock_id = "SELECT stock_id FROM jaysan_stock WHERE godown <=> $godown AND dep <=> $dep AND sec <=> $sec AND process_id <=> $process_id AND part_id <=> $part_id";
        $result_get_stock_id = $conn->query($sql_get_stock_id);
        if ($result_get_stock_id->num_rows > 0) {
            $row_get_stock_id = $result_get_stock_id->fetch_assoc();
            $stock_id = $row_get_stock_id['stock_id'];
        } else {
            echo "Error: Could not retrieve stock ID.";
            $conn->close();
            exit();
        }
    }
   require_once 'stock_distribution.php';
   echo "<br>Stock ID: ".$stock_id;
   $result = stock_distribution($conn,$stock_id,$qty,$process_id);
   echo "<br>Stock distribution result: ".$result;
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


