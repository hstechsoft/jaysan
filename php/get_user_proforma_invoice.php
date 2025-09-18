<?php
 include 'db_head.php';

 
 $cus_id =test_input($_GET['cus_id']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "SELECT proforma_invoice.*,(SELECT sum(payment.amount)FROM payment WHERE payment.invoice_id = proforma_invoice.pino and invoice_type = 'proforma') as amount FROM proforma_invoice  where cus_id = $cus_id";

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


