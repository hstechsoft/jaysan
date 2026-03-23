

<?php
 include 'db_head.php';

 $godown_id = test_input($_GET['godown_id']);
  $dep_id = test_input($_GET['dep_id']);
   $sec_id = test_input($_GET['sec_id']);
    $process_id = test_input($_GET['process_id']);
    $required_qty = test_input($_GET['required_qty']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}





 $sql = "SELECT ifnull(SUM(js.qty), 0) as total_stock_qty,  ifnull(SUM(js.qty), 0) - (iwp.qty * $required_qty)  as remaining_qty, js.godown,js.dep,js.sec, pwt.process_id,iwp.input_part_id,iwp.previous_process_id,iwp.qty,jp.process_name as inprocess FROM process_wel_tbl pwt 
inner join input_wel_parts iwp on iwp.process_id = pwt.process_id
inner join jaysan_process jp on jp.process_id = pwt.process
left join jaysan_stock js on pwt.process_id = js.process_id and iwp.input_part_id = js.part_id and js.godown = $godown_id and js.dep = $dep_id 
 
 WHERE pwt.process_id = $process_id  GROUP BY iwp.input_part_id";


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


