
<?php
 include 'db_head.php';


 $bom_id =($_POST['bom_id']);


  
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



$sql_update = "UPDATE `bom_output` SET `is_default` = 1 WHERE `bom_id` in ($bom_id)";
  
  if ($conn->query($sql_update) === TRUE) {
    echo "ok";
    
  } else {
    echo "Error: " . $sql_update . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





