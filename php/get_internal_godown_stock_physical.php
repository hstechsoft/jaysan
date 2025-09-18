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
    phy_stock.qty,
    internal_godown.godown_name,
    internal_godown.internal_godown_id as godown_id
FROM
    internal_godown_stock_physical phy_stock
INNER JOIN internal_godown ON phy_stock.godown_id = internal_godown.internal_godown_id WHERE mrf_id =  $mrf_id";

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


