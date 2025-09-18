<?php
 include 'db_head.php';

 $mrf_id = test_input($_GET['mrf_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT
    DATE_FORMAT(mrf.last_purchase_date, '%d-%m-%Y') as last_purchase_date,
    mrf.material_receipt_status,
    phy.qty,
    mrf.last_purchase_qty,
    mrf.uom,
    (SELECT internal_godown.godown_name from internal_godown WHERE internal_godown.internal_godown_id = phy.godown_id) as godown_name
    FROM
    material_request_form mrf
left JOIN internal_godown_stock_physical phy ON mrf.mrf_id = phy.mrf_id
 WHERE mrf.mrf_id =   $mrf_id";

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


