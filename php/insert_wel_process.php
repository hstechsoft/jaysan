<?php
include 'db_head.php';

$processData = $_POST['processData']; // This should be an array of data for process_tbl
$inputPartsData = $_POST['inputPartsData']; // This should be an array of data for input_parts
$previous_process_id = 0;
$title_id = $_POST['title_id'];

foreach ($inputPartsData as $input)
{ 
  
    $pre_process_id = $input['pre_process_id']; 
    $input_part = $input['part_id']; 
    $input_qty = $input['part_qty']; 
}
foreach ($processData as $process) {
    $process_id = $process['process_id']; 
    if ($process === end($processData))
    {
        $output_part = $process['output_part'];
        $cat = 'out';
    }
     
   else
   {
    $output_part =  $input_part;
    $cat = '';
   }


   


   $sql_process = "INSERT  INTO  process_tbl (process,output_part,previous_process_id,cat,title_id)
   VALUES ('$process_id',' $output_part','0','out','$title_id')";
 
 if ($conn->query($sql_process) === TRUE) {
    $last_insert_id = $conn->insert_id;
 {
   

    $sql_input= "INSERT INTO  input_parts  (process_id, input_part_id, previous_process_id, qty)
    VALUES ('$last_insert_id',' $input_part','$pre_process_id',' $input_qty')";
     
      
       if ($conn->query($sql_input) === TRUE) {
       } 
       else {
         echo "Error: " . $sql_input . "<br>" . $conn->error;
       }
    }
    $pre_process_id =   $last_insert_id;
    $previous_process_id = $last_insert_id;

 } else {
   echo "Error: " . $sql_process . "<br>" . $conn->error;
 }
 if ($process === end($processData))
 {
    echo "ok";
 }
}
$conn->close();
?>
