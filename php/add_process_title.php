<?php
 include 'db_head.php';

 $title = test_input($_GET['title']);
$multi_view = test_input($_GET['multi_view']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO prs_title (prs_name,multi_view) VALUES ($title, $multi_view)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


