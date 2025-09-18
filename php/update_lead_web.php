
<?php
 include 'db_head.php';


 $work_id =test_input($_GET['work_id']);
 $lead_id =test_input($_GET['lead_id']);
 $status =test_input($_GET['status']);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "UPDATE api SET  work_id = $work_id , status = $status where lead_id =  $lead_id";


  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





