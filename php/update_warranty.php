<?php
 include 'db_head.php';

 $wid = test_input($_GET['wid']);

 $implement = test_input($_GET['implement']);
$model_no = test_input($_GET['model_no']);
$terms = test_input($_GET['terms']);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "UPDATE  wterms SET implement =  $implement,model_no =  $model_no,terms =  $terms WHERE wid =  $wid";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


