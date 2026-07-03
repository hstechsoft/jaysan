<?php
 include 'db_head.php';

 $process_id = test_input($_GET['process_id']);




 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


  

 $sql = "select JSON_ARRAYAGG(
        JSON_OBJECT( 'godown', srv.godown, 'dep', srv.dep, 'sec', srv.sec, 'stock_id', srv.stock_id, 'creditor_name', srv.creditor_name, 'dep_name', srv.dep_name, 'sec_name', srv.sec_name, 'reserve_qty', srv.reserve_qty, 'available_qty', srv.available_qty, 'reserve_details', srv.reserve_details) ) as stock_details,sum(srv.available_qty) as total_available_qty,sum(srv.reserve_qty) as total_reserve_qty from stock_reserve_view srv   where srv.process_id <=> $process_id group by srv.process_id";
 
// echo "sql: " . $sql . "<br>";

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


