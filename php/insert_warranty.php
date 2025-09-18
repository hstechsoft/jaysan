<?php
 include 'db_head.php';

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


 $sql = "INSERT INTO wterms ( implement,model_no,terms) VALUES ($implement, $model_no,$terms)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


