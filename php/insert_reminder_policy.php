
<?php
 include 'db_head.php';


 $policy_no =test_input($_GET['policy_no']);
 $status =test_input($_GET['status']);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "INSERT INTO reminder_policy ( policy_no, status) VALUES ($policy_no, $status);";


  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





