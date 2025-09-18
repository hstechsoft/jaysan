<?php
 include 'db_head.php';

 $oid = test_input($_GET['oid']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$conn->query("SET time_zone = '+05:30'");

 $sql = "SELECT jaysan_payment.*,DATE_FORMAT(dated, '%d-%m-%Y %h:%i %p') as formatted_datetime FROM jaysan_payment WHERE oid = $oid";

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


