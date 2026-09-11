<?php
 include 'db_head.php';

 $godown =  test_input($_GET['godown']);
 $dep = test_input($_GET['dep']);
 $sec = test_input($_GET['sec']);
 $part_id = test_input($_GET['part_id']);
 $process_id = test_input($_GET['process_id']);

 $godown = sql_nullable($godown);
 $dep = sql_nullable($dep);
 $sec = sql_nullable($sec);
 $part_id = sql_nullable($part_id);
 $process_id = sql_nullable($process_id);

 $godown_query = 1;
 $part_query = 1;

 if($part_id != 'NULL') {
  $process_id = 'NULL';
 }

 if($godown != 'NULL') {
  $godown_query = "godown <=> $godown and dep <=> $dep and sec <=> $sec";
 }
 
 if($part_id != 'NULL' || $process_id != 'NULL') {
  $part_query = "part_id <=> $part_id and process_id <=> $process_id";
 }
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}
$sql = "with 
stock_log as (
    select stock_id,JSON_ARRAYAGG(JSON_OBJECT(
        'dated',date_time_only(dated),
        'remark',remark,
        'old_qty', old_qty,
        'new_qty', new_qty,
        'update_type',action_type
    )) as stock_log from jaysan_stock_log GROUP BY stock_id ORDER BY log_id desc limit 50), 

stock_rv as (
    select 
    stock_log,
    available_qty,
           part_id,
           process_id,
           godown,
           dep,
           sec,
           sec_name,
           stock_reserve_view.stock_id,
           batch_id,
           reserve_details,
           qty,
           reserve_qty,
           rpart_name,
           rprocess_name,
           creditor_name,
           dep_name
   

    from stock_reserve_view 
    
    left join stock_log on stock_reserve_view.stock_id = stock_log.stock_id
    where $godown_query and $part_query

)

select 
stock_log,
        part_id,
           process_id,
             rpart_name,
           rprocess_name,
            sum(available_qty) as available_qty,
         
           sum(qty) as qty,
           sum(reserve_qty) as reserve_qty,
JSON_ARRAYAGG(
    JSON_OBJECT(
        'stock_log', stock_log,
        'available_qty', available_qty,
        'godown', godown,
        'dep', dep,
        'sec', sec,
        'sec_name', sec_name,
        'stock_id', stock_id,
        'batch_id', batch_id,
        'reserve_details', reserve_details,
        'qty', qty,
        'reserve_qty', reserve_qty,
        'rpart_name', rpart_name,
        'rprocess_name', rprocess_name,
        'creditor_name', creditor_name,
        'dep_name', dep_name
    )
) as stock_details
           
from stock_rv WHERE part_id IS NOT NULL
group by part_id,
process_id limit 50";



$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
  echo "0 result";
}
$conn->close();

 ?>


