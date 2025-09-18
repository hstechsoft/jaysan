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
$sql =  "SELECT(SELECT count(rate_quotation.rqpid)as qno from  rate_quotation WHERE rate_quotation.rqpid = rate_quotation_part.part_id) as qno, rate_quotation_part.*,parts_tbl.part_name from rate_quotation_part INNER join parts_tbl on rate_quotation_part.part_id = parts_tbl.part_id ";
else
$sql =  "SELECT(SELECT count(rate_quotation.rqpid)as qno from  rate_quotation WHERE rate_quotation.rqpid = rate_quotation_part.part_id) as qno, rate_quotation_part.*,parts_tbl.part_name from rate_quotation_part INNER join parts_tbl on rate_quotation_part.part_id = parts_tbl.part_id WHERE sts = $sts";

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


