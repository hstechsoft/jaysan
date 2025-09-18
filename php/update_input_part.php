
<?php
 include 'db_head.php';

 $input_part_id =test_input($_GET['input_part_id']);
 $previous_process_id =test_input($_GET['previous_process_id']);
 $id =test_input($_GET['id']);
 $qty =test_input($_GET['qty']);


 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "UPDATE input_parts SET qty = $qty,input_part_id = $input_part_id,previous_process_id = $previous_process_id where id=$id";
  
  if ($conn->query($sql) === TRUE) {
    
   

echo "ok";

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





