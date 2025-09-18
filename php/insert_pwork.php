
<?php
 include 'db_head.php';

 $work_type_id =test_input($_GET['work_type_id']);
 $work_status =test_input($_GET['work_status']);
 $pipeline_work =test_input($_GET['pipeline_work']);
 
  
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

$sql = "UPDATE work_type_status SET  pipeline_work = $pipeline_work  WHERE work_type_id= $work_type_id and work_status= $work_status";
 
  
   if ($conn->query($sql) === TRUE) {
   } 
   else {
     echo "Error: " . $sql . "<br>" . $conn->error;
   }


$conn->close();

 ?>





