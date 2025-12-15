
<?php
 include 'db_head.php';

 
 $nopid =test_input($_GET['nopid']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "DELETE from nesting_output_part WHERE nopid = $nopid" ;



log_delete_query($sql);
if ($conn->query($sql) === TRUE) {
    echo "ok";
  } else {
    echo "Error deleting record: " . $conn->error;
  }
$conn->close();

 ?>


