
<?php
 include 'db_head.php';

 


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT  INTO  listner (status)
 VALUES ('new')";
  
  if ($conn->query($sql) === TRUE) {
    echo $conn->insert_id;
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 



$conn->close();

 ?>





