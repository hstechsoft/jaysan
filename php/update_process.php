
<?php
 include 'db_head.php';

 $process =test_input($_GET['process']);

 $process_id =test_input($_GET['process_id']);



 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "UPDATE process_tbl SET process = $process where process_id=$process_id";
  
  if ($conn->query($sql) === TRUE) {
    
   

echo "ok";

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





