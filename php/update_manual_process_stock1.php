<?php
 include 'db_head.php';



 $godown = test_input($_POST['godown']);
    $dep = test_input($_POST['dep']);
    $sec = test_input($_POST['sec']);
    $process_id = test_input($_POST['process_id']);
    $part_id = test_input($_POST['part_id']);
$qty = test_input($_POST['qty']);
$stock_reserve=test_input($_POST['stock_reserve']);
$reserve_type=test_input($_POST['reserve_type']);





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
// if stock reserve is 1 need to get stock id from stock table and  reserve that stock on stock_reserve table  and exit

if($stock_reserve == 1){
    // get stock id from jaysan_stock table for that godown,dep,sec,process_id,part_id
    $sql_get_stock_id = "SELECT stock_id,srv.available_qty FROM jaysan_stock 
    inner join stock_reserve_view srv on jaysan_stock.stock_id = srv.stock_id
    WHERE godown <=> $godown AND dep <=> $dep AND sec <=> $sec AND process_id <=> $process_id AND part_id <=> $part_id";
    $result_get_stock_id = $conn->query($sql_get_stock_id);
    if ($result_get_stock_id->num_rows > 0) {
        $row_get_stock_id = $result_get_stock_id->fetch_assoc();
        $stock_id = $row_get_stock_id['stock_id'];
        if($row_get_stock_id['available_qty'] < $qty) {
            echo "Error: Not enough available stock to reserve.";
            $conn->close();
            exit();
        }
        // insert into stock_reserve table
        $sql_insert_stock_reserve = "INSERT INTO stock_reserve (stock_id, reserve_type, qty) VALUES ($stock_id, '$reserve_type', $qty) on duplicate key update qty = $qty";
        if ($conn->query($sql_insert_stock_reserve) === TRUE) {
            echo "ok";
        } else {
            echo "Error: " . $sql_insert_stock_reserve . "<br>" . $conn->error;
        }
    } else {
        echo "Error: Could not retrieve stock ID.";
    }
   
}

else
    {

$sql = "insert into jaysan_stock (godown,dep,sec,process_id,qty,remark,part_id) values ($godown,$dep,$sec,$process_id,$qty,'$remark',$part_id) ON DUPLICATE KEY UPDATE qty =  $qty, remark = '$remark' ";

//  echo $sql;
$stock_id = 0;
  if ($conn->query($sql) === TRUE) {
    // get inserted stock id if new record inserted else get stock id from jaysan_stock table for that godown,dep,sec,process_id,part_id
    if ($conn->affected_rows > 0) {
        $stock_id = $conn->insert_id;
    } 
    
    if($stock_id == 0){
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
   
   $result = stock_distribution($conn,$stock_id,$qty,$process_id);
echo "\n result:".$result;
   if ($result) {
    //    echo "ok";
   } else {
       echo "error distributing stock".$result;
   }


  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
    }
$conn->close();

 ?>


