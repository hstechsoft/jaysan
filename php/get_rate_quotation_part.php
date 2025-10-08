<?php
 include 'db_head.php';

 
$rqpid = test_input($_GET['rqpid']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "SELECT
*,
    JSON_ARRAYAGG(JSON_OBJECT('spec_label',spec_label,'spec_value',qvalue))  as d
FROM
    `rate_quotation`
INNER JOIN creditors ON rate_quotation.vendor_id = creditors.creditor_id
INNER JOIN rate_quotation_spec ON rate_quotation.rqid = rate_quotation_spec.rqid
WHERE
    rqpid = $rqpid GROUP by rate_quotation_spec.rqid";

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


