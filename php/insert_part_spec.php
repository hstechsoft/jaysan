<?php
include 'db_head.php';

$part_spec_data = $_POST['part_spec']; // This should be an array of data for process_tbl
$part_id = $_POST['part_id']; // This should be an array of data for input_parts
$previous_process_id = 0;
$vendor_id = $_POST['vendor_id'];

$last_id = 0;


$time_zone_sql = "SET time_zone = '+05:30';";
$conn->query($time_zone_sql);

// Insert into emp_work
$insert_quotaion = "INSERT INTO rate_quotation (rqpid,sample_chk,remarks,vendor_id) VALUES ( '$part_id',  '', '', '$vendor_id ');";

if ($conn->query($insert_quotaion) === TRUE) {
    // Retrieve the last inserted ID
    $last_id =  $conn->insert_id;
  echo  $last_id ;
} else {
    echo "Error: " . $insert_quotaion . "<br>" . $conn->error;
}


$insert_part = "INSERT IGNORE  INTO rate_quotation_part (part_id ,sts) VALUES ('$part_id',  'In Process');";

if ($conn->query($insert_part) === TRUE) {
    // Retrieve the last inserted ID
   
} else {
    echo "Error: " . $insert_part . "<br>" . $conn->error;
}

foreach ($part_spec_data as $part)
{ 
    $spec_label =  $part['label']; 
   $qvalue=  $part['value']; 
    
$insert_part_spec = "INSERT  INTO rate_quotation_spec (rqid,spec_label,qvalue)
VALUES ($last_id, '$spec_label','$qvalue')";
 
 if ($conn->query($insert_part_spec) === TRUE) {
  
   
 } else {
   echo "Error: " . $insert_part_spec . "<br>" . $conn->error;
 }
}
// foreach ($part_spec as $process) {
//     $process_id = $process['process_id']; 
//     if ($process === end($processData))
//     {
//         $output_part = $process['output_part'];
//         $cat = 'out';
//     }
     
//    else
//    {
//     $output_part =  $input_part;
//     $cat = '';
//    }


   


//    $sql_process = "INSERT  INTO  process_tbl (process,output_part,previous_process_id,cat,title_id)
//    VALUES ('$process_id',' $output_part','0','out','$title_id')";
 
//  if ($conn->query($sql_process) === TRUE) {
//     $last_insert_id = $conn->insert_id;
//  {
   

//     $sql_input= "INSERT INTO  input_parts  (process_id, input_part_id, previous_process_id, qty)
//     VALUES ('$last_insert_id',' $input_part','$pre_process_id',' $input_qty')";
     
      
//        if ($conn->query($sql_input) === TRUE) {
//        } 
//        else {
//          echo "Error: " . $sql_input . "<br>" . $conn->error;
//        }
//     }
//     $pre_process_id =   $last_insert_id;
//     $previous_process_id = $last_insert_id;

//  } else {
//    echo "Error: " . $sql_process . "<br>" . $conn->error;
//  }
//  if ($process === end($processData))
//  {
//     echo "ok";
//  }
// }
$conn->close();
?>
