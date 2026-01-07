<?php
 include 'db_head.php';


 $cus_type_id =test_input($_POST['cus_type_id']);
 $cus_id =test_input($_POST['cus_id']);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



$sql = "UPDATE customer SET cus_type_id = $cus_type_id WHERE cus_id= $cus_id";
  if ( $conn->query($sql) === TRUE) {
    echo "ok";
  } 
   else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  

  

$conn->close();

 ?>


