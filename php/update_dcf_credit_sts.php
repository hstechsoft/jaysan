
<?php
 include 'db_head.php';

 $dcf_id =test_input($_GET['dcf_id']);
 $cn_sts =test_input($_GET['cn_sts']);
 

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "UPDATE dcf SET  cn_sts=$cn_sts where dcf_id = $dcf_id";
  
  if ($conn->query($sql) === TRUE) {
    
   

echo "ok";

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>







