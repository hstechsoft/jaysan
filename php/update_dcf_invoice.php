<?php
 include 'db_head.php';

 $dcf_invoice_by = test_input($_POST['dcf_invoice_by']);
$dcf_id = test_input($_POST['dcf_id']);
$dcf_invoice_no = test_input($_POST['dcf_invoice_no']);
$dcf_report = ($_POST['dcf_report']);
$transport_driver = test_input($_POST['transport_driver']);
$transport_vno = test_input($_POST['transport_vno']);



 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  dcf SET   invoice_by =  $dcf_invoice_by,dcf_report = '$dcf_report' ,sts = 'delivery',vno = $transport_vno,invoice_no = $dcf_invoice_no,driver = $transport_driver  WHERE dcf_id =  $dcf_id";

  if ($conn->query($sql) === TRUE) {
    $sql =  "UPDATE  assign_product SET   assign_type =  'Delivered'  WHERE dcf_id =  $dcf_id";

    if ($conn->query($sql) === TRUE) {
     echo "ok";
    } else {
      echo "Error: " . $sql . "<br>" . $conn->error;
    }
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


