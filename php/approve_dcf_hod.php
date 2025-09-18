<?php
 include 'db_head.php';

 $dcf_hod_verify = test_input($_POST['dcf_hod_verify']);
$dcf_id = test_input($_POST['dcf_id']);
$dcf_report = ($_POST['dcf_report']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  dcf SET   marketing_by =  $dcf_hod_verify,dcf_report = '$dcf_report' ,sts = 'HOD' WHERE dcf_id =  $dcf_id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


