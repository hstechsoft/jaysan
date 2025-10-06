<?php
 include 'db_head.php';

 $part_name = ($_GET['part_name']);

 $part_name = '%'.$part_name.'%';
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


//  $sql = "SELECT part_name,part_no,reorder_qty,min_order_qty,part_id FROM parts_tbl WHERE part_name like '$part_name'";

 $sql = "SELECT count(mrf_id)as total_count,part_name,part_no,reorder_qty,min_order_qty,parts_tbl.part_id,parts_tbl.baseunits,parts_tbl.gstrate FROM parts_tbl LEFT join material_request_form mrf on parts_tbl.part_id = mrf.part_id  WHERE part_name like'$part_name' GROUP by parts_tbl.part_id";

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


