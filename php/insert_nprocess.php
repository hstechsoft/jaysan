
<?php
 include 'db_head.php';

 $process_id =test_input($_GET['process_id']);
 $edit_process_id =test_input($_GET['edit_process_id']);
 $input_part_id =test_input($_GET['input_part_id']);
 $output_part_id =test_input($_GET['output_part_id']);



 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}







{
$sql_insert_process = "INSERT INTO process_tbl (process, output_part, previous_process_id, cat)
VALUES ($process_id,  $output_part_id, $edit_process_id, 'out')";
  
  if ($conn->query($sql_insert_process) === TRUE) {
    $last_process_id = $conn->insert_id;
    
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}
$sql_update_input = "update input_parts set previous_process_id = $last_process_id  WHERE previous_process_id = $edit_process_id";
  
if ($conn->query($sql_update_input) === TRUE) {
 
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}


{
    $sql_insert_input = "INSERT INTO input_parts (process_id, input_part_id,previous_process_id,qty)
    VALUES ($last_process_id,$input_part_id, $edit_process_id, '1')";
      
      if ($conn->query($sql_insert_input) === TRUE) {
        
        
      } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
      }
    }

$sql_update_process = "update process_tbl set cat = '' WHERE process_id = $edit_process_id";
  
if ($conn->query($sql_update_process) === TRUE) {
 
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}




echo $last_process_id;
 



$conn->close();

 ?>





