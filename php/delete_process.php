
<?php
 include 'db_head.php';

 $mode = ($_GET['mode']);
 $delete_process_id =test_input($_GET['delete_process_id']);
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




if($mode == 'last' )
{
    $sql_update_cat = "update process_tbl set cat = 'out' ,output_part =  $output_part_id  WHERE process_id = (SELECT previous_process_id from process_tbl WHERE process_id =  $delete_process_id)";
  
  if ($conn->query($sql_update_cat) === TRUE) {
    
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }


 
  $sql_prs = "SELECT previous_process_id from process_tbl WHERE process_id =  $delete_process_id";
  
  $result = $conn->query($sql_prs);

  if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
    echo $row["previous_process_id"];
    }
  } else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}


}

else
{
  echo $edit_process_id;
}


$sql_update_process = "update process_tbl set previous_process_id = (SELECT previous_process_id FROM process_tbl WHERE process_id = $delete_process_id) WHERE previous_process_id = $delete_process_id";
  
if ($conn->query($sql_update_process) === TRUE) {
 
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}


$sql_update_input = "update input_parts set previous_process_id = (SELECT previous_process_id FROM input_parts WHERE process_id = $delete_process_id) WHERE previous_process_id = $delete_process_id";
  
if ($conn->query($sql_update_input) === TRUE) {
 
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}


$sql_delete_input = "DELETE FROM input_parts WHERE process_id = $delete_process_id";
  
  if ($conn->query($sql_delete_input) === TRUE) {
  

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

$sql_delete_prs = "DELETE FROM process_tbl WHERE process_id = $delete_process_id";
  
  if ($conn->query($sql_delete_prs) === TRUE) {
   

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





