
<?php
 include 'db_head.php';

 $phone_id =test_input($_GET['app_phone_id']);
 $fcm =test_input($_GET['fcm']);

 
  echo $phone_id;
  echo $fcm;
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "UPDATE employee SET firebase_uid = $fcm where emp_phone_id = $phone_id";
  
  if ($conn->query($sql) === TRUE) {
    echo "ok";
    
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





