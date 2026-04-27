<?php
 include 'db_head.php';

$nesting_id = test_input($_POST['nesting_id']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



$sql_delete = "DELETE FROM nesting_parts WHERE nesting_id = $nesting_id";
if ($conn->query($sql_delete) === TRUE) {
  echo "ok";
} else {
    echo "Error deleting record: " . $conn->error;
}

$conn->close();

 ?>


