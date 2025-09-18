
<?php
 include 'db_head.php';

 $phone_id =test_input($_GET['phone_id']);
 $login_time =($_GET['login_time']);
 $logout_time =($_GET['logout_time']);
 
  
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT INTO attendance ( phone_id, login_time, logout_time,dated) VALUES ($phone_id, '$login_time','$logout_time',UNIX_TIMESTAMP( NOW())*1000);";
  
  if ($conn->query($sql) === TRUE) {
    
   

echo "done";

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





