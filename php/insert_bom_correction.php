<?php
 include 'db_head.php';

 $outpart_bom_id = test_input($_POST['outpart_bom_id']);
$bomlist_id = test_input($_POST['bomlist_id']);
$part_id = test_input($_POST['part_id']);
$bom_output_id = test_input($_POST['bom_output_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "INSERT INTO bom_correction (outpart_bom_id, bomlist_id, part_id, bom_output_id) VALUES ($outpart_bom_id, $bomlist_id, $part_id, $bom_output_id) ON DUPLICATE KEY UPDATE bomlist_id = $bomlist_id";

if ($conn->query($sql) === TRUE) {
  echo "ok";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}
$conn->close();

 ?>


