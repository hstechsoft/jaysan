<?php
 include 'db_head.php';

 $godown = isset($_GET['godown']) ? test_input($_GET['godown']) : 'null';
$dep = isset($_GET['dep']) ? test_input($_GET['dep']) : 'null';
$sec = isset($_GET['sec']) ? test_input($_GET['sec']) : 'null';
$work_order_id = isset($_GET['work_order_id']) ? test_input($_GET['work_order_id']) : 'null';


$work_order_id_query = 1;


 if($work_order_id != 'null'){
    $work_order_id_query = " work_order_id = $work_order_id";
 }

 $godown = sql_nullable($godown);
$dep = sql_nullable($dep);
$sec = sql_nullable($sec);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


 $sql = "SELECT work_order.*,input_parts,input_parts,final_part FROM work_order 
 inner join demand on work_order.demand_id = demand.demand_id
 inner  join jaysan_process_view on demand.process_id = jaysan_process_view.process_id
 WHERE work_order.godown <=>  $godown and work_order.dep <=> $dep and work_order.sec <=> $sec and $work_order_id_query order by work_order_id desc";
 echo "sql: $sql\n";

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


