
<?php
 include 'db_head.php';

 $role =test_input($_GET['role']);
 $menu =test_input($_GET['menu']);
 $res =($_GET['res']);
 
  
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT IGNORE INTO emp_menu (role,menu,res)
 VALUES ($role,$menu,'$res')";
  
  if ($conn->query($sql) === TRUE) {
    
    
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





