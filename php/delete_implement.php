
<?php
 include 'db_head.php';


 $edit_process_id =test_input($_GET['edit_process_id']);

 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql_delete_input = "DELETE from input_parts WHERE input_parts.process_id in (


WITH RECURSIVE process_chain AS (
    -- Base Case: Selects a set of rows with 6 columns including process_name
    SELECT p.process_id, p.previous_process_id
    FROM process_tbl p
    JOIN jaysan_process jp ON p.process = jp.process_id
    WHERE p.process_id =  $edit_process_id AND p.cat = 'out'
    
    UNION ALL
    
    -- Recursive Case: Selects a set of rows with the same 6 columns including process_name
    SELECT p.process_id,p.previous_process_id
    FROM process_tbl p
    INNER JOIN process_chain pc ON p.process_id = pc.previous_process_id
    JOIN jaysan_process jp ON p.process = jp.process_id
)

-- Final output
SELECT process_id
FROM process_chain)
";
  
  if ($conn->query($sql_delete_input) === TRUE) {
  

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }



  $sql_update_input = "update input_parts set previous_process_id = '0' WHERE previous_process_id = $edit_process_id";
  
if ($conn->query($sql_update_input) === TRUE) {
 
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}



$sql_delete_prs = "DELETE from process_tbl WHERE process_tbl.process_id in (


WITH RECURSIVE process_chain AS (
    -- Base Case: Selects a set of rows with 6 columns including process_name
    SELECT p.process_id, p.previous_process_id
    FROM process_tbl p
    JOIN jaysan_process jp ON p.process = jp.process_id
    WHERE p.process_id =  $edit_process_id AND p.cat = 'out'
    
    UNION ALL
    
    -- Recursive Case: Selects a set of rows with the same 6 columns including process_name
    SELECT p.process_id,p.previous_process_id
    FROM process_tbl p
    INNER JOIN process_chain pc ON p.process_id = pc.previous_process_id
    JOIN jaysan_process jp ON p.process = jp.process_id
)

-- Final output
SELECT process_id
FROM process_chain)
";
  
  if ($conn->query($sql_delete_prs) === TRUE) {
   

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 
echo "ok";


$conn->close();

 ?>





