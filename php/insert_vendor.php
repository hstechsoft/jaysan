<?php
 include 'db_head.php';

 $vendor_name = test_input($_GET['vendor_name']);
$vendor_phone = test_input($_GET['vendor_phone']);
$vendor_gst = test_input($_GET['vendor_gst']);
$vendor_addr = test_input($_GET['vendor_addr']);
$vendor_remark = test_input($_GET['vendor_remark']);
$vendor_email = test_input($_GET['vendor_email']);
$vendor_website = test_input($_GET['vendor_website']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO creditors (	creditor_name,	creditor_mobile,	creditor_gst,	creditors_addr,	creditor_remark,	creditors_email,	creditor_website) VALUES ($vendor_name,$vendor_phone,$vendor_gst,$vendor_addr,$vendor_remark,$vendor_email,$vendor_website)";

  if ($conn->query($sql) === TRUE) {
   echo    $last_id = $conn->insert_id;;
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


