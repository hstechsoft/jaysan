<?php
 include 'db_head.php';


 $query_work = ($_GET['query_work']);
 $query_history = ($_GET['query_history']);
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



$sql = $query_work;
  if ( $conn->query($sql) === TRUE) {
  } 
   else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  
$sqlhis = $query_history;
 
  
  
   
    if ($conn->query($sqlhis) === TRUE) {
    } 
    else {
      echo "Error: " . $sqlhis . "<br>" . $conn->error;
    }


$conn->close();

 ?>


