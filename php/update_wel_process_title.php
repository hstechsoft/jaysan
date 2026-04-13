<?php
 include 'db_head.php';


 $process_id =test_input($_POST['process_id']);
 $process_title =sql_nullable(test_input($_POST['process_title']));
 


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}

$sql_update = "update process_wel_tbl set process_title = $process_title where process_id = $process_id;";

  if ($conn->query($sql_update) === TRUE) {
    echo "ok";
  } else {
    echo "Error: " . $sql_update . "<br>" . $conn->error;
  }


    
  



$conn->close();

 ?>


