
<?php
 include 'db_head.php';

 $device_id =test_input($_GET['device_id']);
 $latti =test_input($_GET['latti']);
 $longi =test_input($_GET['longi']);

 

 
  
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT  INTO bale_count (device_id,latti,longi)
 VALUES ($device_id,$latti,$longi)";
  
  if ($conn->query($sql) === TRUE) {
   
    
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





