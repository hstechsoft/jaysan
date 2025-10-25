<?php
include 'db_head.php';



$data = json_decode($_POST['allWeldingData'], true);
$output_part_pr =  $_POST['output_part'];
$component_cat =  $_POST['component_cat'];

$totalRows = count($data); 
$output_part ="0";
$pre_process_id = "0";
$cat = "" ;// Initialize pre_process_id to 0
foreach ($data as $row) {
   $process_id = $row['process']['process_id'];

   if ($row === end($data))
    {
      $output_part =$output_part_pr;
      $cat = 'out';
    }
 

   
   $sql_process = "INSERT  INTO  process_wel_tbl (process,output_part,previous_process_id,cat,component_cat)
   VALUES ('$process_id','$output_part','$pre_process_id','$cat','$component_cat')";
 
 if ($conn->query($sql_process) === TRUE) {
    $last_insert_id = $conn->insert_id;
 {
   foreach ($row['input_parts'] as $input) {
      $part_id = isset($input['part_id']) ? $input['part_id'] : '0';
      $part_qty = isset($input['part_qty']) ? $input['part_qty'] : '';
$in_pre_id = 0;
if($part_id == 0)
$in_pre_id = $pre_process_id;

     
   $sql_input= "INSERT INTO  input_wel_parts  (process_id, input_part_id, previous_process_id, qty)
   VALUES ('$last_insert_id',' $part_id','$in_pre_id',' $part_qty')";
    
     
      if ($conn->query($sql_input) === TRUE) {
      } 
      else {
        echo "Error: " . $sql_input . "<br>" . $conn->error;
      }

   }

   if ($row === end($data))
   {
    echo "ok";
   }

       }
       $pre_process_id = $last_insert_id; // Update pre_process_id for the next iteration


 } else {
   echo "Error: " . $sql_process . "<br>" . $conn->error;
 }




   
}


$conn->close();
?>
