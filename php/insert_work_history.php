
<?php
 include 'db_head.php';

 $work_id =test_input($_GET['work_id']);
 $his_date =test_input($_GET['his_date']);
 $comments =test_input($_GET['comments']);
 $cus_id =test_input($_GET['cus_id']);
 

  
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT INTO  work_history  ( work_id,his_date,comments,cus_id)
 VALUES ('$work_id' ,'$his_date' ,'$comments' ,'$cus_id')";
  
  if ($conn->query($sql) === TRUE) {
    echo "New record inserted successfully";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





