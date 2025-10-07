<?php
 include 'db_head.php';

 $po_material_id = test_input($_GET['po_material_id']);
$is_approved = test_input($_GET['is_approved']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  jaysan_po_material SET is_approved =  $is_approved WHERE po_material_id =  $po_material_id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


