<?php
 include 'db_head.php';

 $exp_id_arr = ($_POST['exp_id_arr']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

foreach($exp_id_arr as $exp_id){
 $sql =  "DELETE  FROM  expense WHERE exp_id =  $exp_id";

  if ($conn->query($sql) === TRUE) {

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

}

   echo "ok";
$conn->close();

 ?>


