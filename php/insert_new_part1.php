<?php
 include 'db_head.php';

 $part_name = test_input($_GET['part_name']);
$part_no = test_input($_GET['part_no']);
$new_part = test_input($_GET['new_part']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "INSERT INTO parts_tbl (part_name,part_no,new_part) VALUES ($part_name,$part_no,$new_part)";

  if ($conn->query($sql) === TRUE) {
    echo  $conn->insert_id;
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


