<?php
 include 'db_head.php';

 $qty = ($_POST['qty']);
$transport_id = ($_POST['transport_id']);


//  add transport part details to transport_parts table
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  transport_parts SET qty =  '$qty' WHERE transport_id =  $transport_id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


