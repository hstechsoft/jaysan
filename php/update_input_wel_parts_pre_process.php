<?php
 include 'db_head.php';


 $id =test_input($_POST['id']);

 $previous_process_id = sql_nullable(test_input($_POST['previous_process_id']));
 


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}

try {
    $conn->begin_transaction();
$sql = "UPDATE input_wel_parts SET previous_process_id = $previous_process_id WHERE id = $id;";

  if ($conn->query($sql) === TRUE) {

  } else {
   throw new Exception("Error: " . $sql . "<br>" . $conn->error);
  }
  // check if there is any loop in process flow after update of previous_process_id
 include_once 'bom_process_loop_check.php';
$no_loop = correction_check_fn($conn);
if(!$no_loop){
    throw new Exception("Error: Loop detected in process flow after update of previous process id. Please check the process flow and try again.");
}


    
  $conn->commit();  
      echo "ok";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
    $conn->rollback();
}



$conn->close();

 ?>


