<?php
 include 'db_head.php';

 $status = test_input($_GET['status']);
$mrf_id = test_input($_GET['mrf_id']);
$emp_id = test_input($_GET['emp_id']);
$reason = isset($_GET['reason']) ? ($_GET['reason']) : "''";

if ($reason != "''")
{
  $reason  = "because ".$reason; 
}

//  md_rejected-mrf,md_rejected-tally,md_rejected-puraches
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
if($status == "'md_rejected-mrf'" || $status == "'md_rejected-tally'" )
  {
    // delete purchase entry
    $sql_delete = "DELETE FROM mrf_purchase WHERE mrf_id = $mrf_id";
    $conn->query($sql_delete);
    

  }

 $sql =  "UPDATE material_request_form SET   status = $status , form_history =  CONCAT(form_history ,'<li class = \'list-group-item\'>', $status ,' by ' ,(SELECT emp_name FROM employee WHERE emp_id = $emp_id), ' on ', DATE_FORMAT(NOW(), '%d-%m-%Y %H:%i') , '$reason' ,' </li>')  where mrf_id = $mrf_id";

  if ($conn->query($sql) === TRUE) {
 $sql_update =  "UPDATE mrf_purchase SET purchase_approved_by = $emp_id where mrf_id = $mrf_id";

  if ($conn->query($sql_update) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql_update . "<br>" . $conn->error;
  }
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


