<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
include 'db_head.php';

try {

$conn->begin_transaction();

$data = json_decode($_POST['allWeldingData'], true);

$output_part_pr =  $_POST['output_part'];
$component_cat =  $_POST['component_cat'];
$process_title =  $_POST['process_title'];
$is_default =  $_POST['is_default'];

$totalRows = count($data); 
$output_part = null;
$pre_process_id = null;
$cat = "" ;// Initialize pre_process_id to 0
foreach ($data as $row) {
   $process_id = $row['process']['process_id'];
$process_title1 = "";
$is_default1 = 0;
   if ($row === end($data))
    {
      $output_part =$output_part_pr;
      $cat = 'out';
      $process_title1 = $process_title;
      $is_default1 = $is_default;
    }
    else
      {
      
        $process_title1 = "";
        $is_default1 = 0;
      }
 
if($is_default1 == 1)
  {
    $sql_update_default = "UPDATE process_wel_tbl SET is_default = 0 WHERE output_part = '$output_part' AND component_cat = '$component_cat' AND cat = '$cat'";
    if ($conn->query($sql_update_default) === TRUE) {
        // Default updated successfully
    } else {
        throw new Exception($conn->error);
    }
  }
   
   $sql_process = "INSERT  INTO  process_wel_tbl (process,output_part,previous_process_id,cat,component_cat,process_title,is_default)
   VALUES ('$process_id', " . sql_nullable($output_part) . ", " . sql_nullable($pre_process_id) . ", '$cat', '$component_cat', '$process_title', '$is_default')";

 if ($conn->query($sql_process) === TRUE) {
    $last_insert_id = $conn->insert_id;
 {
   foreach ($row['input_parts'] as $input) {
    $in_pre_id = null;
      $part_id = isset($input['part_id']) ? $input['part_id'] : null;
      $part_qty = isset($input['part_qty']) ? $input['part_qty'] : '';
      $in_pre_id = isset($input['pre_process_id']) ? $input['pre_process_id'] : null;
    
if($part_id === null)
$in_pre_id = $pre_process_id;

     
   $sql_input= "INSERT INTO  input_wel_parts  (process_id, input_part_id, previous_process_id, qty)
   VALUES ('$last_insert_id', " . sql_nullable($part_id) . ", " . sql_nullable($in_pre_id) . ", " . sql_nullable($part_qty) . ")";
    
     
      if ($conn->query($sql_input) === TRUE) {
      } 
      else {
       throw new Exception($conn->error);
      }

      // check if there is any loop in process flow after insertion of new process id
include 'bom_process_loop_check.php'; 
$no_loop = correction_check_fn($conn);
if(!$no_loop){

    throw new Exception("Error: Loop detected in process flow after insertion of new process. Please check the process flow and try again.");
}

   }


     if (count($row['extra_details']) > 0 ) 
  {
    foreach ($row['extra_details'] as $extra) {
            $godown_id = isset($extra['godown_id']) ? $extra['godown_id'] : '';
            $dep_id = isset($extra['dep_id']) ? $extra['dep_id'] : '';
            $dep_sec_id = isset($extra['dep_sec_id']) ? $extra['dep_sec_id'] : '';
            $dep_sec_machine_id = isset($extra['dep_sec_machine_id']) ? $extra['dep_sec_machine_id'] : '';
            $min_time = isset($extra['min_time']) ? $extra['min_time'] : '';
            $max_time = isset($extra['max_time']) ? $extra['max_time'] : '';
          
            $cost = isset($extra['cost']) ? $extra['cost'] : '';

            $dep_id = sql_nullable($dep_id);
            $dep_sec_id = sql_nullable($dep_sec_id);
            $dep_sec_machine_id = sql_nullable($dep_sec_machine_id);

            $insert_part = "INSERT INTO `work_time_master` ( `godown_id`, `dep_id`, `dep_sec_id`, `machine_id`, `min_time`, `max_time`, `process_id`, `cost`,ori_process_id) VALUES ( '$godown_id', $dep_id,  $dep_sec_id ,  $dep_sec_machine_id, '$min_time', '$max_time', '$process_id', '$cost', '$last_insert_id');";

if ($conn->query($insert_part) === TRUE) {
    // Retrieve the last inserted ID
   
} else {
 
    throw new Exception($conn->error);
}
           
    }
  }

   if ($row === end($data))
   {

   }

       }
       $pre_process_id = $last_insert_id; // Update pre_process_id for the next iteration


 } else {
   throw new Exception($conn->error);
 }




   
}
$conn->commit();
    echo "ok";
}

 catch (Exception $e) {

$conn->rollback();

echo "Error: " . $e->getMessage();

}


$conn->close();
?>
