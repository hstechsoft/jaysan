
<?php
 include 'db_head.php';

   
$cus_id = test_input($_GET['cus_id']);
$invoice_id = test_input($_GET['invoice_id']);
$dated = test_input($_GET['dated']);
$invoice_type = test_input($_GET['invoice_type']);
$ref_id = test_input($_GET['ref_id']);
$amount	 = test_input($_GET['amount']);
$sqno	 = test_input($_GET['sqno']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT  INTO  payment (cus_id,invoice_id,dated,invoice_type,ref_id,amount,sqno)
 VALUES ($cus_id,$invoice_id,$dated,$invoice_type,$ref_id,$amount,$sqno	)";
  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





