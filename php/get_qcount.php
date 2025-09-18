<?php
 include 'db_head.php';

 $sts = test_input($_GET['sts']);


 

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

if( $sts == "'0'")
$sql =  "SELECT (SELECT  COUNT(part_id)as total FROM rate_quotation_part) as tqno,  COUNT(part_id)as total FROM rate_quotation_part ";
else
$sql =  "SELECT (SELECT  COUNT(part_id)as total FROM rate_quotation_part) as tqno,  COUNT(part_id)as total FROM rate_quotation_part WHERE sts =  $sts";

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


