
<?php
 include 'db_head.php';

 
 $pid =test_input($_GET['payment_id']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "DELETE from payment WHERE pid = $pid" ;




if ($conn->query($sql) === TRUE) {
    echo "Record deleted successfully";
  } else {
    echo "Error deleting record: " . $conn->error;
  }
$conn->close();

 ?>


