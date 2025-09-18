
<?php
 include 'db_head.php';

 $change_input_id =test_input($_GET['change_input_id']);





 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "DELETE FROM input_parts WHERE input_parts.id = $change_input_id";
  
  if ($conn->query($sql) === TRUE) {
    
   

echo "ok";

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





