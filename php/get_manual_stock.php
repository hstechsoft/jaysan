<?php
 include 'db_head.php';

 $process_id = test_input($_GET['process_id']);




 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}




  

 $sql = "with
    srv as (
        select process_id, part_id
        from stock_reserve_view
        WHERE
            process_id = $process_id
    )
select
    srv.process_id,
    srv.part_id,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'godown',
            srv1.godown,
            'dep',
            srv1.dep,
            'sec',
            srv1.sec,
            'stock_id',
            srv1.stock_id,
            'creditor_name',
            srv1.creditor_name,
            'dep_name',
            srv1.dep_name,
            'sec_name',
            srv1.sec_name,
            'qty',
            srv1.qty,
            'reserve_qty',
            srv1.reserve_qty,
            'available_qty',
            srv1.available_qty,
            'reserve_details',
            srv1.reserve_details
        )
    ) as stock_details,
    sum(srv1.available_qty) as total_available_qty,
    sum(ifnull(srv1.reserve_qty, 0)) as total_reserve_qty,
    sum(srv1.qty) as total_qty
from srv
  left join stock_reserve_view srv1 on CASE
       WHEN srv.part_id IS NOT NULL
           THEN srv.part_id = srv1.part_id
       ELSE
           srv.process_id = srv1.process_id
   END";
 
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


