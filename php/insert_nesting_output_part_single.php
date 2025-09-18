<?php
 include 'db_head.php';

 $nsid = test_input($_GET['nsid']);
$part_id = test_input($_GET['part_id']);
$qty = test_input($_GET['qty']);
$rack = test_input($_GET['rack']);
$bin = test_input($_GET['bin']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO nesting_output_part ( nsid,part_id,qty,rack,bin) VALUES ($nsid,$part_id,$qty,$rack,$bin)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


