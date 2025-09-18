
<?php
 include 'db_head.php';




 $input_part_id =test_input($_GET['input_part_id']);
 $previous_process_id =test_input($_GET['previous_process_id']);
 $process_id =test_input($_GET['process_id']);
 $qty =test_input($_GET['qty']);
  
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT INTO input_parts (input_part_id, previous_process_id, process_id,qty) VALUES ($input_part_id,$previous_process_id,$process_id,qty);";
  
  if ($conn->query($sql) === TRUE) {
    
   

echo "ok";

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





