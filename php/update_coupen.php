
<?php
 include 'db_head.php';


 $coupen_code =test_input($_GET['coupen_code']);




function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


$sql = "UPDATE coupen SET  used_sts = 'used' where coupen_code = $coupen_code";


  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





