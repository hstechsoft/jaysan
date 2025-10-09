
<?php
 include 'db_head.php';

 $q_type =test_input($_GET['q_type']);
  $q_value =test_input($_GET['q_value']);
   $rqid =test_input($_GET['rqid']);
  
 
  
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


if( $q_type == "'rating'")
{

$sql = "UPDATE rate_quotation SET rating = $q_value WHERE  rqid = $rqid";
}
else
{
$sql = "UPDATE rate_quotation SET important = $q_value WHERE  rqid = $rqid";
}

  
  if ($conn->query($sql) === TRUE) {
    
        echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





