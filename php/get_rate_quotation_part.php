<?php
 include 'db_head.php';

 
$part_id = test_input($_GET['part_id']);
 $process_id = test_input($_GET['process_id']);
 $stype = test_input($_GET['stype']);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

if($stype == "'part'")
 $sql = "SELECT
*,
    JSON_ARRAYAGG(JSON_OBJECT('spec_label',spec_label,'spec_value',qvalue))  as d
FROM
    `rate_quotation`
INNER JOIN creditors ON rate_quotation.vendor_id = creditors.creditor_id
INNER JOIN rate_quotation_spec ON rate_quotation.rqid = rate_quotation_spec.rqid
WHERE
    rqpid = $part_id GROUP by rate_quotation_spec.rqid";
    else
         $sql = "SELECT
*,
    JSON_ARRAYAGG(JSON_OBJECT('spec_label',spec_label,'spec_value',qvalue))  as d
FROM
    `rate_quotation`
INNER JOIN creditors ON rate_quotation.vendor_id = creditors.creditor_id
INNER JOIN rate_quotation_spec ON rate_quotation.rqid = rate_quotation_spec.rqid
WHERE
    process_id = $process_id GROUP by rate_quotation_spec.rqid";
        

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


