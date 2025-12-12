<?php
 include 'db_head.php';

 $term = ($_GET['term']);
 $part_id  = test_input($_GET['part_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$term = "%".$term."%";

 $sql = "SELECT creditors.*,sec_stock_master.min_qty,sec_stock_master.max_qty FROM creditors left join  sec_stock_master on  creditors.creditor_id =  sec_stock_master.store_id and sec_stock_master.store_type = 'godown' and sec_stock_master.part_id = $part_id WHERE creditor_name   like  '$term' group by creditors.creditor_id";

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


