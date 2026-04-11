<?php
include 'db_head.php';



$process_id = test_input($_POST['process_id']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
try  {
// check there is any previous process if no that is primary process then we cannot delete it
$sql_check = "select * from process_wel_tbl where process_id = $process_id and previous_process_id is null;";
$result_check = $conn->query($sql_check);
if ($result_check->num_rows > 0) {
throw new Exception("Error: This is primary process and there is no previous process to refernce so cannot delete it.");
}
// if not proceed to delete
// 1st get previous process id of deleted process_id
$previous_process_id = 'NULL';
$cat = '';
$output_part = 'NULL';
$component_cat = '';
$get_previous_process_id_sql = "select previous_process_id,cat,output_part,component_cat from process_wel_tbl where process_id = $process_id;";

$result_previous_process_id = $conn->query($get_previous_process_id_sql);

$row_previous_process_id = $result_previous_process_id->fetch_assoc();
$previous_process_id = $row_previous_process_id['previous_process_id'];
$cat = $row_previous_process_id['cat'];
$output_part = $row_previous_process_id['output_part'];
$component_cat = $row_previous_process_id['component_cat'];
if($previous_process_id == null || $previous_process_id == '' || $previous_process_id == 'null' || $previous_process_id ==   'NULL'){
throw new Exception("Error: Previous process id is null so cannot delete it.");
}


// 2nd update all process which have previous_process_id = deleted process_id to previous_process_id = previous_process_id of deleted process_id
$update_previous_process_id_sql = "update process_wel_tbl set previous_process_id = $previous_process_id where previous_process_id = $process_id;";
if ($conn->query($update_previous_process_id_sql) === TRUE) {

} else {
   throw new Exception("Error: " . $update_previous_process_id_sql . "<br>" . $conn->error);
}
// 3rd  also update input_wel_parts table pre_process_id
$update_input_wel_parts_sql = "update input_wel_parts set previous_process_id = $previous_process_id where previous_process_id = $process_id;";
if ($conn->query($update_input_wel_parts_sql) === TRUE) {

} else {
    throw new Exception("Error: " . $update_input_wel_parts_sql . "<br>" . $conn->error);
}



 

// 4th now there is no process refernced this process as previous process so we can delete it
$delete_process_sql = "delete from process_wel_tbl where process_id = $process_id;";
if ($conn->query($delete_process_sql) === TRUE) {

}
else {
    throw new Exception("Error: " . $delete_process_sql . "<br>" . $conn->error);
}

$new_process_id = 0;

// check if cat = out and output_part is not null then we update 
if($cat == 'out' && $output_part != null && $output_part != '' && $output_part != 'null' && $output_part != 'NULL'){
    
 $update_output_part_sql = "update process_wel_tbl set output_part = $output_part , cat = 'out', component_cat = '$component_cat' where process_id = $previous_process_id;";

 if ($conn->query($update_output_part_sql) === TRUE) {
$new_process_id = $previous_process_id;
 }

  else {
      throw new Exception("Error: " . $update_output_part_sql . "<br>" . $conn->error);
  }
}

     echo $new_process_id;
     $conn->commit();

}
catch (Exception $e) {
    $conn->rollback();
    echo "Error: " . $e->getMessage();
}
$conn->close();
?>
