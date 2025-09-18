<?php
 include 'db_head.php';

 


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SELECT invoice.*, customer.cus_phone,CASE WHEN (SELECT sum(payment.amount)FROM payment WHERE payment.invoice_id = invoice.ino and invoice_type = 'invoice') + (SELECT sum(payment.amount)FROM payment WHERE payment.invoice_id = invoice.enq_no and invoice_type = 'proforma')  < invoice.total_value THEN  (SELECT sum(payment.amount)FROM payment WHERE payment.invoice_id = invoice.ino and invoice_type = 'invoice') + (SELECT sum(payment.amount)FROM payment WHERE payment.invoice_id = invoice.enq_no and invoice_type = 'proforma')WHEN (SELECT sum(payment.amount)FROM payment WHERE payment.invoice_id = invoice.ino and invoice_type = 'invoice') + (SELECT sum(payment.amount)FROM payment WHERE payment.invoice_id = invoice.enq_no and invoice_type = 'proforma')  is null THEN 0 END as paid_amount,
(SELECT sum(payment.amount)FROM payment WHERE payment.invoice_id = invoice.ino and invoice_type = 'invoice') + (SELECT sum(payment.amount)FROM payment WHERE payment.invoice_id = invoice.enq_no and invoice_type = 'proforma') as amount FROM invoice INNER JOIN customer ON invoice.cus_id = customer.cus_id  WHERE invoice.total_value > (SELECT CASE WHEN (SELECT sum(payment.amount)FROM payment WHERE payment.invoice_id = invoice.ino and invoice_type = 'invoice') + (SELECT sum(payment.amount)FROM payment WHERE payment.invoice_id = invoice.enq_no and invoice_type = 'proforma')  < invoice.total_value THEN  (SELECT sum(payment.amount)FROM payment WHERE payment.invoice_id = invoice.ino and invoice_type = 'invoice') + (SELECT sum(payment.amount)FROM payment WHERE payment.invoice_id = invoice.enq_no and invoice_type = 'proforma')WHEN (SELECT sum(payment.amount)FROM payment WHERE payment.invoice_id = invoice.ino and invoice_type = 'invoice') + (SELECT sum(payment.amount)FROM payment WHERE payment.invoice_id = invoice.enq_no and invoice_type = 'proforma')  is null THEN 0 END );";

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


