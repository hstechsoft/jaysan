
<?php
 include 'db_head.php';

$old_ass_id = test_input($_GET['old_ass_id']);
$new_ass_id = test_input($_GET['new_ass_id']);
$old_line_no = test_input($_GET['old_line_no']);
$new_line_no = test_input($_GET['new_line_no']);
    
   



function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";

return $data;
}




$sql = "UPDATE machine_production SET line_no = $new_line_no WHERE  ass_id = $old_ass_id";
  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $sql1 = "UPDATE machine_production SET line_no = $old_line_no WHERE  ass_id = $new_ass_id";
  if ($conn->query($sql1) === TRUE) {
  }
    else {
    echo "Error: " . $sql1 . "<br>" . $conn->error;
  }

  echo "ok";
  




$conn->close();

?>





