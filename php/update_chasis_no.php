<?php
 include 'db_head.php';

 $ass_id = test_input($_POST['ass_id']);
$chasis_no = test_input($_POST['chasis_no']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}


 $sql =  "UPDATE  assign_product SET chasis_no =  '$chasis_no' WHERE ass_id =  $ass_id";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


