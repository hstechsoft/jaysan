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

// check there is any previous process if no that is primary process then we cannot delete it
$sql_check = "select * from process_wel_tbl where process_id = $process_id and previous_process_id is null;";
$result_check = $conn->query($sql_check);
if ($result_check->num_rows > 0) {
    echo "Error: cannot delete primary process";
    $conn->close();
    exit();
}
// if not proceed to delete
// 1st get previous process id of deleted process_id
$previous_process_id = 'NULL';
$cat = '';
$output_part = 'NULL';
$get_previous_process_id_sql = "select previous_process_id,cat,output_part from process_wel_tbl where process_id = $process_id;";
echo $get_previous_process_id_sql;
$result_previous_process_id = $conn->query($get_previous_process_id_sql);

$row_previous_process_id = $result_previous_process_id->fetch_assoc();
$previous_process_id = $row_previous_process_id['previous_process_id'];
$cat = $row_previous_process_id['cat'];
$output_part = $row_previous_process_id['output_part'];
if($previous_process_id == null || $previous_process_id == '' || $previous_process_id == 'null' || $previous_process_id ==   'NULL'){
    echo "Error: previous process id not found";

    $conn->close();
    exit();
}


// 2nd update all process which have previous_process_id = deleted process_id to previous_process_id = previous_process_id of deleted process_id
$update_previous_process_id_sql = "update process_wel_tbl set previous_process_id = $previous_process_id where previous_process_id = $process_id;";
if ($conn->query($update_previous_process_id_sql) === TRUE) {

} else {
    echo "Error: " . $update_previous_process_id_sql . "<br>" . $conn->error;
}
// 3rd  also update input_wel_parts table pre_process_id
$update_input_wel_parts_sql = "update input_wel_parts set previous_process_id = $previous_process_id where previous_process_id = $process_id;";
if ($conn->query($update_input_wel_parts_sql) === TRUE) {

} else {
    echo "Error: " . $update_input_wel_parts_sql . "<br>" . $conn->error;
}

// check if cat = out and output_part is not null then we update 
if($cat == 'out' && $output_part != null && $output_part != '' && $output_part != 'null' && $output_part != 'NULL'){
 $update_output_part_sql = "update process_wel_tbl set output_part =$output_part and cat = 'out' where process_id = $previous_process_id;";
 echo $update_output_part_sql;
 if ($conn->query($update_output_part_sql) === TRUE) {
 }
  else {
      echo "Error: " . $update_output_part_sql . "<br>" . $conn->error;
  }
}

 

// 4th now there is no process refernced this process as previous process so we can delete it
$delete_process_sql = "delete from process_wel_tbl where process_id = $process_id;";
if ($conn->query($delete_process_sql) === TRUE) {
  echo "ok";
}
else {
    echo "Error: " . $delete_process_sql . "<br>" . $conn->error;
}




$conn->close();
?>
