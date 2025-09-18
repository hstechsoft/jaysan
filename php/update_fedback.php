
<?php
 include 'db_head.php';


 $work_id =test_input($_GET['work_id']);
 $feedback_id =test_input($_GET['feedback_id']);



function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "UPDATE review SET  work_id = $work_id where review_id =  $feedback_id";


  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





