<?php
 include 'db_head.php';


 $vendor = ($_GET['vendor']);
 $term = ($_GET['term']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$vendor  = "%" .  $vendor ."%";


if($term == 'no')

$sql = "SELECT vid,vendor_phone,vendor_name FROM  vendor  WHERE vendor_phone LIKE  '$vendor'";
else 

 $sql = "SELECT vid,vendor_phone,vendor_name FROM  vendor  WHERE vendor_name LIKE  '$vendor'";

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


