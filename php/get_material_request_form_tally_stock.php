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
 
    internal_godown_stock_.qty,
    internal_godown.godown_name
  
    FROM internal_godown_stock_
INNER JOIN internal_godown ON internal_godown_stock_.godown_id = internal_godown.internal_godown_id

WHERE
  internal_godown_stock_.mrf_id  =  $mrf_id";

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


