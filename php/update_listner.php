
<?php
 include 'db_head.php';


 $listner_id =test_input($_GET['listner_id']);
 $lis_res =test_input($_GET['lis_res']);




function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "UPDATE listner SET  status = 'finish',response = $lis_res where listner_id = $listner_id";


  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





