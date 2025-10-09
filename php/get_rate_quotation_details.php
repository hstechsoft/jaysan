<?php
 include 'db_head.php';

 
$rqid = test_input($_GET['rqid']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT * FROM `rate_quotation` INNER join rate_quotation_spec on rate_quotation.rqid = rate_quotation_spec.rqid WHERE rate_quotation.rqid = $rqid ";

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


