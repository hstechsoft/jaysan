
<?php
 include 'db_head.php';

 
 $app_menu_id =test_input($_GET['app_menu_id']);
 $role =test_input($_GET['role']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "DELETE from app_menu WHERE app_menu_id = $app_menu_id and role =  $role" ;

if ($conn->query($sql) === TRUE) {
    echo "Record deleted successfully";
  } else {
    echo "Error deleting record: " . $conn->error;
  }
$conn->close();

 ?>


