<?php
 include 'db_head.php';


 $id =test_input($_POST['id']);

 $previous_process_id = sql_nullable(test_input($_POST['previous_process_id']));
 


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}

$sql = "UPDATE process_wel_tbl SET previous_process_id = $previous_process_id WHERE id = $id;";

  if ($conn->query($sql) === TRUE) {
    echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
    
  



$conn->close();

 ?>


