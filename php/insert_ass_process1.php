<?php
include 'db_head.php';

$processData = $_POST['processData']; // This should be an array of data for process_tbl
$inputPartsData = $_POST['inputPartsData']; // This should be an array of data for input_parts

foreach ($processData as $process) {
    $process_id = $process['process_id']; 
    $output_part = $process['output_part']; 
   

    


$sql_process = "INSERT  INTO  process_tbl (process,output_part,previous_process_id,cat)
VALUES ('$process_id',' $output_part','0','out')";
 
 if ($conn->query($sql_process) === TRUE) {
    $last_insert_id = $conn->insert_id;
    foreach ($inputPartsData as $input) {
    $pre_process_id = $input['pre_process_id']; 
    $input_part = $input['part_id']; 
    $input_qty = $input['part_qty']; 

    $sql_input= "INSERT INTO  input_parts  (process_id, input_part_id, previous_process_id, qty)
    VALUES ('$last_insert_id',' $input_part','$pre_process_id',' $input_qty')";
     
      
       if ($conn->query($sql_input) === TRUE) {
       } 
       else {
         echo "Error: " . $sql_input . "<br>" . $conn->error;
       }
    }
    echo "ok";
 } else {
   echo "Error: " . $sql_process . "<br>" . $conn->error;
 }
}
$conn->close();
?>
