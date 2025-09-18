<?php
 include 'db_head.php';

 $status = test_input($_GET['status']);
$mrf_id = test_input($_GET['mrf_id']);
    $po_date = test_input($_GET['po_date']);
    $po_no = test_input($_GET['po_no']);



 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  material_request_form SET status =  $status , po_date= $po_date,po_no = $po_no  WHERE mrf_id =  $mrf_id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


