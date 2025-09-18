<?php
 include 'db_head.php';

 
 $lead_id =test_input($_GET['lead_id']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "DELETE from api WHERE lead_id = $lead_id" ;




if ($conn->query($sql) === TRUE) {
    echo "Record deleted successfully";
  } else {
    echo "Error deleting record: " . $conn->error;
  }
$conn->close();

 ?>


