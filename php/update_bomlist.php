
<?php
 include 'db_head.php';


 $bom_id =($_POST['bom_id']);
 $part_id = test_input($_POST['part_id']);


  
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql_update_null = "UPDATE bom_output SET part_id = NULL WHERE part_id = $part_id";

  if ($conn->query($sql_update_null) === TRUE) {
  
    
  } else {
    echo "Error: " . $sql_update_null . "<br>" . $conn->error;
  }

$sql_update = "UPDATE `bom_output` SET `is_default` = 1 WHERE `bom_id` in ($bom_id)";
  
  if ($conn->query($sql_update) === TRUE) {
    echo "ok";
    
  } else {
    echo "Error: " . $sql_update . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





