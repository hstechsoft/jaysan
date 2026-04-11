<?php
 include 'db_head.php';

 $id = test_input($_POST['id']);


 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
// check if input_part_id is null if yes stop the process
$sql_check = "select * from input_wel_parts where id = $id and input_part_id is  null;";
$result_check = $conn->query($sql_check);
if ($result_check->num_rows == 0) {
    echo "Error: cannot delete previous processed part";
    $conn->close();
    exit();
}

 $sql =  "delete from input_wel_parts where id = $id;";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


