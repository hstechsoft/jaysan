
<?php
 include 'db_head.php';

 $output_part =test_input($_GET['output_part']);

 $process_id =test_input($_GET['process_id']);



 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "UPDATE process_tbl SET output_part = $output_part where process_id=$process_id";
  
  if ($conn->query($sql) === TRUE) {
    
   

echo "ok";

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





