
<?php
 include 'db_head.php';

 $phone_id =test_input($_GET['phone_id']);
 $phone_number =test_input($_GET['phone_number']);
 $call_type =test_input($_GET['call_type']);
 $call_duration =test_input($_GET['call_duration']);
 $call_date =test_input($_GET['call_date']);
 $call_name =test_input($_GET['call_name']);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT IGNORE INTO  call_log (phone_id,phone_number,call_type,call_duration,call_date,call_name)
 VALUES ($phone_id,$phone_number,$call_type,$call_duration,$call_date,$call_name)";
  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





