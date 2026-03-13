<?php
include 'db_head.php';



$data = json_decode($_POST['allWeldingData'], true);
$output_part_pr =  $_POST['output_part'];
$did =  $_POST['did'];
$component_cat =  $_POST['component_cat'];
$process_title =  $_POST['process_title'];
$is_default =  $_POST['is_default'];


$totalRows = count($data); 

if ($totalRows == 0) {
  echo "No data to process.";
  $conn->close();
  exit;
}
$conn->begin_transaction();
 try
 {

$output_part ="0";
$pre_process_id = "0";
$cat = "" ;// Initialize pre_process_id to 0

// check if input_wel_parts has refenced this as previous_process_id if yes do not proceed with delete query 
$out_process_id = 0;
foreach ($did as $row) {

// get that n process  cat is out

$sql_check_ou = "SELECT 1 FROM process_wel_tbl WHERE process_id = $row AND cat = 'out' " ;
$result_check_ou = $conn->query($sql_check_ou);
if ($result_check_ou->num_rows > 0) {
    // There are rows with cat 'out', do not proceed with delete
 
$sql_check_input = "SELECT 1 FROM input_wel_parts WHERE previous_process_id = $row " ;
$result_check_input = $conn->query($sql_check_input);
if ($result_check_input->num_rows > 0) {
    // There are rows in input_wel_parts referencing this process, do not proceed with delete
    $conn->rollback();
    echo "Cannot delete process with ID $row because it is referenced in input_wel_parts.";
    exit; 
}


}
}


foreach ($did as $row) {





$sql = "DELETE from process_wel_tbl WHERE process_id = $row" ;



log_delete_query($sql);
if ($conn->query($sql) === TRUE) {
   
  } else {
    throw new Exception($conn->error);
  }

}

foreach ($data as $row) {


$process_title1 = "";
$is_default1 = 0;



   $process_id = $row['process']['process_id'];

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
 
//  if is_default is 1 then set all other is_default to 0 for same part,companent_cat and cat
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
   VALUES ('$process_id','$output_part','$pre_process_id','$cat','$component_cat','$process_title1','$is_default1')";
 
 if ($conn->query($sql_process) === TRUE) {
    $last_insert_id = $conn->insert_id;
 {
   foreach ($row['input_parts'] as $input) {
    $in_pre_id = 0;
      $part_id = isset($input['part_id']) ? $input['part_id'] : '0';
      $part_qty = isset($input['part_qty']) ? $input['part_qty'] : '';
         $in_pre_id = isset($input['pre_process_id']) ? $input['pre_process_id'] : '0';

if($part_id == 0)
$in_pre_id = $pre_process_id;

     
   $sql_input= "INSERT INTO  input_wel_parts  (process_id, input_part_id, previous_process_id, qty)
   VALUES ('$last_insert_id',' $part_id','$in_pre_id',' $part_qty')";
    
     
      if ($conn->query($sql_input) === TRUE) {
      } 
      else {
        throw new Exception($conn->error);
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
    echo "ok";
   }

       }
       $pre_process_id = $last_insert_id; // Update pre_process_id for the next iteration


 } else {
 throw new Exception($conn->error);
 }




   
}
 $conn->commit();
 }catch(Exception $e)
 {
   $conn->rollback();
    echo $e->getMessage();
 }


$conn->close();
?>
