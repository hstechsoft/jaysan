
<?php
 include 'db_head.php';

 $role =test_input($_GET['role']);
 $app_menu_id =test_input($_GET['app_menu_id']);

 
  
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT  INTO app_menu (role,app_menu_id)
 VALUES ( $role, $app_menu_id)";
  
  if ($conn->query($sql) === TRUE) {
    
    $last_id_work = $conn->insert_id;
    echo "inserted id - ". $last_id_work;
 



  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





