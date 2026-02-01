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

 $sql = "SELECT 
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'payment_id', payment_id,
            'amount', amount,
            'approved_by', approved_by,
            'approved_date', approved_date,
            'dated', dated,
            'oid', oid,
            'payment_date', payment_date,
            'ref_no', ref_no,
            'sts', sts,
            'utr_no', utr_no,
            'formatted_datetime', DATE_FORMAT(dated, '%d-%m-%Y %h:%i %p')
        )
    ) as payments_json,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'amount', amount,
                'utr_no', utr_no
            )
        )
        FROM (
            SELECT sao.amount,
                   (SELECT utr_no FROM jaysan_payment WHERE payment_id = (SELECT payment_id FROM sale_payment_advance sa WHERE sa.advance_id = sao.advance_ref_id)) as utr_no 
            FROM sale_payment_advance sao 
            WHERE oid = $oid AND advance_ref_id > 0 
            GROUP BY sao.oid
        ) as subquery
    ) as advances_json
FROM jaysan_payment 
WHERE oid = $oid
";

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


