<?php
 include 'db_head.php';

 $flabel = test_input($_GET['flabel']);
$fvalue = test_input($_GET['fvalue']);
$ftype = test_input($_GET['ftype']);
$std = test_input($_GET['std']);
$part_id = test_input($_GET['part_id']);

 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO custom_field_master (flabel,fvalue,ftype,std) VALUES ($flabel,$fvalue,$ftype,$std)";

  if ($conn->query($sql) === TRUE) {
    $last_id = $conn->insert_id;
    $sql_part = "INSERT INTO  part_custom_spec (part_id,fid) VALUES ($part_id,$last_id)";

  if ($conn->query($sql_part) === TRUE) {
  echo "ok";
  }
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


