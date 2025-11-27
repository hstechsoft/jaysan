<?php
 include 'db_head.php';

 $dated = test_input($_GET['dated']);
$assign_type = test_input($_GET['assign_type']);
$godown = test_input($_GET['godown']);
$ass_id_array = json_decode($_GET['ass_id_array'], true);
 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
if ($assign_type == "'Production'") {
  $godown = "'0'";

} elseif ($assign_type == "'Finshed'") {
    $dated = "'0000-00-00'";
  // Finished type - keep dated, set godown to 0 is not needed
} else {
  echo "Error: Invalid assign_type. Only 'Production' or 'Finished' allowed.";
  $conn->close();
  exit();
}


foreach ($ass_id_array as $ass_id) {
  $ass_id = test_input($ass_id);
  $sql =  "UPDATE  assign_product SET dated =  $dated,assign_type =  $assign_type,godown =  $godown WHERE ass_id =  $ass_id";

  if ($conn->query($sql) === TRUE) {
  
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}
 echo "ok";

$conn->close();

 ?>



