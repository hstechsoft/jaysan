
<?php

error_reporting(E_ALL);

ini_set('display_errors', 1);
    
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
    )) as stock_log from jaysan_stock_log GROUP BY stock_id ORDER BY log_id desc ),

jaysan_stock_view as (SELECT 
js.part_id,
js.process_id,
js.godown,
js.dep,
js.sec,
js.batch_id,
js.stock_id,
sr.reserve_type,
sr.reserve_type_id,
sr.stock_reserve_id,
creditors.creditor_name,
department.dep_name,
dep_section.sec_name,
js.qty as stock_qty,
sum(sr.reserve_qty) as total_reserved_qty,

 
   JSON_ARRAYAGG(JSON_OBJECT(

    
                    'reserve_qty', sr.reserve_qty,
                    'reserve_status', sr.reserve_status,
                    'reserve_date', sr.dated,
                    'reserve_id', sr.stock_reserve_id
    )) AS reserve_details
 

 FROM jaysan_stock js  
 LEFT JOIN stock_reserve sr ON sr.stock_id = js.stock_id 
 left join creditors on creditors.creditor_id = js.godown
 left join department on department.dep_id = js.dep
    left join dep_section on dep_section.dep_sec_id = js.sec
    


group by js.stock_id),
  stock_rv as  ( select 
    stock_log,
    jaysan_stock_view.stock_qty - IFNULL(jaysan_stock_view.total_reserved_qty, 0) as available_qty,
           part_id,
           process_id,
           godown,
           dep,
           sec,
           jaysan_stock_view.sec_name,
           jaysan_stock_view.stock_id,
           batch_id,
           reserve_details,
           stock_qty,
           total_reserved_qty,
         
           creditor_name,
           dep_name
   

    from jaysan_stock_view 
    
    left join stock_log on jaysan_stock_view.stock_id = stock_log.stock_id
    where  $godown_query and $part_query)
    
    
select 
stock_log,
        stock_rv.part_id,
           stock_rv.process_id,
           
           if(stock_rv.part_id is null,jpv.final_part,parts_tbl.part_name) as rpart_name,
            sum(available_qty) as available_qty,
         
           sum(stock_qty) as qty,
           sum(total_reserved_qty) as reserve_qty,
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
        'qty', stock_qty,
        'reserve_qty', total_reserved_qty,
       
        'creditor_name', creditor_name,
        'dep_name', dep_name
    )
) as stock_details
           
from stock_rv
 left join parts_tbl on stock_rv.part_id = parts_tbl.part_id
    left join jaysan_process_view jpv on jpv.process_id = stock_rv.process_id
WHERE 1
group by stock_rv.part_id,
stock_rv.process_id limit 500
";


// echo $sql;
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


