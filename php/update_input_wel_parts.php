<?php
 include 'db_head.php';


 $process_id =test_input($_POST['process_id']);
 $input_part_id =test_input($_POST['input_part_id']);
 $previous_process_id =test_input($_POST['previous_process_id']);
 $qty =test_input($_POST['qty']);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

try {
    $conn->begin_transaction();
$sql_insert = "INSERT INTO input_wel_parts (process_id,input_part_id,previous_process_id,qty) VALUES ($process_id,$input_part_id,$previous_process_id,$qty);";

  if ($conn->query($sql_insert) === TRUE) {
    echo "ok";
  } else {
   throw new Exception("Error: " . $sql_insert . "<br>" . $conn->error);
  }

  // check if there is any loop in process flow after insertion of new process id
include 'bom_process_loop_check.php';
$no_loop = correction_check_fn($conn);
if(!$no_loop){
    throw new Exception("Error: Loop detected in process flow after insertion of new process. Please check the process flow and try again.");
}

  $conn->commit();
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
    $conn->rollback();
}
    
  



$conn->close();

 ?>


