<?php
 include 'db_head.php';

 $mrf_id = test_input($_GET['mrf_id']);
$tally_stock_array = json_decode($_GET['tally_stock_array'],true);
$tally_stock_approved_by = test_input($_GET['tally_stock_approved_by']);
$root_cause = test_input($_GET['root_cause']);
$preventive_action = test_input($_GET['preventive_action']);
$corrective_action = test_input($_GET['corrective_action']);



 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

 foreach ($tally_stock_array as $tally_stock)
{ 
   $godown_id = $tally_stock['godown_id']; 
  $qty = $tally_stock['qty']; 


 $sql = "INSERT INTO internal_godown_stock_tally ( mrf_id,godown_id,qty) VALUES ($mrf_id,'$godown_id','$qty')";

  if ($conn->query($sql) === TRUE) {

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}

$sql_update = "UPDATE material_request_form SET status='tally_stock_approved' , root_cause = $root_cause,preventive_action = $preventive_action, 	corrective_action= $corrective_action,tally_stock_approved_by = $tally_stock_approved_by,form_history =  CONCAT(form_history ,'<li class = \'list-group-item\'> tally stock approved by ', (SELECT emp_name FROM employee WHERE emp_id = $tally_stock_approved_by), ' on ', DATE_FORMAT(NOW(), '%d-%m-%Y %H:%i'),' </li>')  where mrf_id = $mrf_id";

if ( $conn->query($sql_update) === TRUE) {


} else {
  echo "Error: " . $sql_update . "<br>" .  $conn->error;
}
   echo "ok";
$conn->close();

 ?>


