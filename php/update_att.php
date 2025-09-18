
<?php
 include 'db_head.php';

 $phone_id =test_input($_GET['phone_id']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "UPDATE attendance SET attendance.logout_time = UNIX_TIMESTAMP( NOW())*1000 WHERE id = (SELECT id FROM attendance WHERE attendance.phone_id = $phone_id AND dated BETWEEN UNIX_TIMESTAMP(CURDATE())*1000 AND UNIX_TIMESTAMP( NOW())*1000 AND attendance.login_time>0 and attendance.logout_time=0 ORDER BY attendance.id DESC LIMIT 1)";
  
  if ($conn->query($sql) === TRUE) {
    
   

echo "done";

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





