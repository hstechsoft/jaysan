<?php
 include 'db_head.php';

 $creditor_name = test_input($_POST['creditor_name']);
$creditor_phone = test_input($_POST['creditor_phone']);
$creditor_mobile = test_input($_POST['creditor_mobile']);
$creditor_gst = test_input($_POST['creditor_gst']);
  
$creditors_email = test_input($_POST['creditors_email']);
$creditors_terms = test_input($_POST['creditors_terms']);
$contact_person = test_input($_POST['contact_person']);
$contact = test_input($_POST['contact']);
$state_name = test_input($_POST['state_name']);
$creditors_addr = test_input($_POST['creditors_addr']);
$creditor_website = test_input($_POST['creditor_website']);
$creditor_remark = test_input($_POST['creditor_remark']);
$latti = test_input($_POST['latti']);
$longi = test_input($_POST['longi']);
$creditor_id = test_input($_POST['creditor_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  creditors SET creditor_name =  $creditor_name,creditor_phone =  $creditor_phone,creditor_mobile =  $creditor_mobile,creditor_gst =  $creditor_gst,creditors_email =  $creditors_email,creditors_terms =  $creditors_terms,contact_person =  $contact_person,contact =  $contact,state_name =  $state_name,creditors_addr =  $creditors_addr,creditor_website =  $creditor_website,creditor_remark =  $creditor_remark,latti =  $latti,longi =  $longi WHERE creditor_id =  $creditor_id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


