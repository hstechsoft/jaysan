
<?php
 include 'db_head.php';

 $part_id =test_input($_GET['part_id']);
 $bom_id =test_input($_GET['bom_id']);
 if($bom_id =="''" || $part_id =="''"){
    $conn->close();
        echo "Invalid Input";  
     exit();
   
 }
 
  
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql_clear_isdefault = "update bom_output set is_default = null where part_id = $part_id";
  
  if ($conn->query($sql_clear_isdefault) === TRUE) {
    
    
  } else {
    echo "Error: " . $sql_clear_isdefault . "<br>" . $conn->error;
  }


$sql_update = "UPDATE `bom_output` SET `is_default` = 1 WHERE `bom_id` = $bom_id AND part_id = $part_id";
  
  if ($conn->query($sql_update) === TRUE) {
    echo "ok";
    
  } else {
    echo "Error: " . $sql_update . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





