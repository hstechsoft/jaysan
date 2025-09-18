<?php
 include 'db_head.php';

  
 $id = test_input($_GET['id']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




 $sql = "DELETE  from product_reminder_master WHERE id = $id ";

 if ($conn->query($sql) === TRUE) {
    echo "Record deleted successfully";
  } else {
    echo "Error deleting record: " . $conn->error;
  }
$conn->close();

 ?>


