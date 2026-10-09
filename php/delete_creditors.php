<?php
 include 'db_head.php';

 
 $creditor_id =test_input($_GET['creditor_id']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "DELETE from creditors WHERE creditor_id = $creditor_id" ;



log_delete_query($sql);
if ($conn->query($sql) === TRUE) {
    echo "Record deleted successfully";
  } else {
    echo "Error deleting record: " . $conn->error;
  }
$conn->close();

 ?>


