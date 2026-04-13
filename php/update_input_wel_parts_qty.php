<?php
 include 'db_head.php';


 $id =test_input($_POST['id']);

 $qty = sql_nullable(test_input($_POST['qty']));
 


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}

$sql = "UPDATE input_wel_parts SET qty = $qty WHERE id = $id;";

  if ($conn->query($sql) === TRUE) {
    echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
    
  



$conn->close();

 ?>


