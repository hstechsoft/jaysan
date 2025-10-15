<?php
 include 'db_head.php';


 $part = ($_GET['part']);
 $term = ($_GET['term']);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$part  = "%" .  $part ."%";


if($term == 'part')

$sql = "SELECT mrf.mrf_id,parts_tbl.part_name,parts_tbl.part_id
 FROM  material_request_form mrf INNER join parts_tbl on mrf.part_id= parts_tbl.part_id WHERE parts_tbl.part_name like '$part' group by parts_tbl.part_id";
 
else if($term == 'raw')

$sql = "SELECT jaysan_po_material.po_material_id,parts_tbl.part_name
 FROM  jaysan_po_material INNER join parts_tbl on jaysan_po_material.po_material_id = parts_tbl.part_id WHERE parts_tbl.part_name like '$part' group by parts_tbl.part_id";
else 
 $sql = "SELECT jaysan_po.po_order_to,creditors.creditor_name
 FROM  jaysan_po INNER join creditors on jaysan_po.po_order_to = creditors.creditor_id WHERE creditors.creditor_name like  '$part' group by creditors.creditor_id";

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


