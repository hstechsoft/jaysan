<?php
 include 'db_head.php';


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}





$sql = "SELECT
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'vendor_name',
            creditors.creditor_name,
            'vendor_phone',
            creditors.creditor_mobile,
            'spec_pdf',
            rate_quotation.spec_addr,
            'quotation_pdf',
            rate_quotation.quotation_addr,
            'dated',date_only(rate_quotation.dated)
        )) as details,
        rate_quotation.*,
        parts_tbl.part_name
    FROM
        `rate_quotation`
    INNER JOIN parts_tbl ON rate_quotation.rqpid = parts_tbl.part_id
    INNER JOIN creditors ON creditors.creditor_id = rate_quotation.vendor_id
    GROUP BY
        rqpid";


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


