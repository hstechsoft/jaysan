
<?php
 include 'db_head.php';

 $work_id =test_input($_GET['work_id']);
 $attach_type =test_input($_GET['attach_type']);
 $attach_location =test_input($_GET['attach_location']);
 $cus_id =test_input($_GET['cus_id']);
 

  
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT INTO work_attachment (work_id ,attach_type ,attach_location ,cus_id)
 VALUES ('$work_id' ,'$attach_type' ,'$attach_location' ,'$cus_id')";
  
  if ($conn->query($sql) === TRUE) {
    echo "New record inserted successfully";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





