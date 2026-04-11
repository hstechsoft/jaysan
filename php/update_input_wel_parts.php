<?php
 include 'db_head.php';


 $process_id =test_input($_GET['process_id']);
 $input_part_id =test_input($_GET['input_part_id']);
 $previous_process_id =test_input($_GET['previous_process_id']);
 $qty =test_input($_GET['qty']);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql_insert = "INSERT INTO input_wel_parts (process_id,input_part_id,previous_process_id,qty) VALUES ($process_id,$input_part_id,$previous_process_id,$qty);";

  if ($conn->query($sql_insert) === TRUE) {
    echo "ok";
  } else {
    echo "Error: " . $sql_insert . "<br>" . $conn->error;
  }

    
  



$conn->close();

 ?>


