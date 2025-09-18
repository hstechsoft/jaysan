
<?php
 include 'db_head.php';

 $role =test_input($_GET['role']);
 $menu =test_input($_GET['menu']);
 $res = ($_GET['res']);
 
  
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "UPDATE emp_menu SET menu = $menu , res = '$res' where role = $role";
  
  if ($conn->query($sql) === TRUE) {
    
    
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





