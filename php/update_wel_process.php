<?php
 include 'db_head.php';


 $process_id =test_input($_GET['process_id']);
 $process =test_input($_GET['process']);
 


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql_update = "update process_wel_tbl set process = $process where process_id = $process_id;";

  if ($conn->query($sql_update) === TRUE) {
    echo "ok";
  } else {
    echo "Error: " . $sql_update . "<br>" . $conn->error;
  }


    
  



$conn->close();

 ?>


