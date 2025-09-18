
<?php
 include 'db_head.php';


 $work_id =test_input($_GET['work_id']);
 $ext_warranty_id =test_input($_GET['ext_warranty_id']);



function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "UPDATE dealer_delivery SET  work_id = $work_id where deid =  $ext_warranty_id";


  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





