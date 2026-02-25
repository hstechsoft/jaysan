<?php
 include 'db_head.php';


$ass_id = test_input($_POST['ass_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  assign_product SET finished_details =  'print' WHERE finished_details = 'no_sts' AND ass_id =  $ass_id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


