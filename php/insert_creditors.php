<?php
 include 'db_head.php';

 $creditor_name = test_input($_GET['creditor_name']);
$creditor_phone = test_input($_GET['creditor_phone']);
$creditor_gst = test_input($_GET['creditor_gst']);
$creditors_email = test_input($_GET['creditors_email']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO creditors ( creditor_name,creditor_phone,creditor_gst,creditors_email) VALUES ($creditor_name,$creditor_phone,$creditor_gst,$creditors_email)";

  if ($conn->query($sql) === TRUE) {
    $creditors_id = $conn->insert_id;
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


