<?php
 include 'db_head.php';

 $oid = test_input($_POST['oid']);
$qno = test_input($_POST['qno']);
$remark = test_input($_POST['remark']);
$amount = test_input($_POST['amount']);
$dcf_no = test_input($_POST['dcf_no']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO sale_order_spares ( oid,qno,remark,amount,dcf_no) VALUES ($oid,$qno,$remark,$amount,$dcf_no)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


