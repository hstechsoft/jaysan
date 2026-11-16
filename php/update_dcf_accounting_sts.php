<?php
 include 'db_head.php';

 $dcf_accounting_id = test_input($_POST['dcf_accounting_id']);
$sts = test_input($_POST['sts']);
// sts only done,cancelled

 
 if($sts != "'done'" && $sts != "'cancelled'") {
     echo "Invalid status";
     exit;
 }
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  dcf_accounting SET sts =  $sts WHERE dcf_accounting_id =  $dcf_accounting_id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


