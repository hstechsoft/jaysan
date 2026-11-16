<?php
 include 'db_head.php';

 $amount = test_input($_POST['amount']);
$cus_id = test_input($_POST['cus_id']);
$bank = test_input($_POST['bank']);
$utr_no = test_input($_POST['utr_no']);
$mode = test_input($_POST['mode']);
$ref = test_input($_POST['ref']);
$dated = test_input($_POST['dated']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;  
}


 $sql = "INSERT INTO dcf_payment_details ( amount,cus_id,bank,utr_no,mode,ref,dated) VALUES ($amount,$cus_id,$bank,$utr_no,$mode,$ref,$dated)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


