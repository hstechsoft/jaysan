
<?php
 include 'db_head.php';

 $manager =test_input($_GET['manager']);
 $employee =test_input($_GET['employee']);

 
  
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT  INTO role_assign (owner_role,employee_role)
 VALUES ($manager,$employee)";
  
  if ($conn->query($sql) === TRUE) {
    echo "ok";
    
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





