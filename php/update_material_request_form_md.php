<?php
 include 'db_head.php';

 $mrf_id = test_input($_GET['mrf_id']);
$purchase_verified_by = test_input($_GET['purchase_verified_by']);
$purchase_approved_by = test_input($_GET['purchase_approved_by']);
$md_approve_option = ($_GET['md_approve_option']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$sts = 'Purchase Requeset '.$md_approve_option.' by ';


 $sql = "update mrf_purchase set purchase_verified_by = $purchase_verified_by,purchase_approved_by = $purchase_approved_by  WHERE mrf_id =  $mrf_id";

  if ($conn->query($sql) === TRUE) {

  
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }



     $sql_update_history = "SET time_zone = '+05:30';"; // First query to set the time zone
   $sql_update_history .= "UPDATE material_request_form SET status = '$md_approve_option',form_history =  CONCAT(form_history ,'<li class = \'list-group-item\'> $sts', (SELECT emp_name FROM employee WHERE emp_id = $purchase_verified_by), ' on ', DATE_FORMAT(NOW(), '%d-%m-%Y %H:%i'),' </li>')  where mrf_id = $mrf_id";
   
   if ($conn->multi_query($sql_update_history) === TRUE) {
       echo "ok";
   } else {
       echo "Error: " . $sql_update_history . "<br>" . $conn->error;
   }


$conn->close();

 ?>


