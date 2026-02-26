<?php
 include 'db_head.php';


$ass_id = test_input($_POST['ass_id']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql =  "UPDATE  assign_product SET finished_details =  'print' WHERE finished_details = 'no_sts' AND ass_id =  $ass_id";

  if ($conn->query($sql) === TRUE) {
  
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  // insert into machine_production_taken 
  $sql_insert_machine_production_taken = "insert into machine_production_taken (ass_id,line_no) values ($ass_id,(SELECT IFNULL(MAX(line_no), 0) + 1 FROM machine_production_taken))";
  if ($conn->query($sql_insert_machine_production_taken) === TRUE) {
  echo "ok";
  } else {
    echo "Error: " . $sql_insert_machine_production_taken . "<br>" . $conn->error;
  }

$conn->close();

 ?>


