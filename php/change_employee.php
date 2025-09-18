<?php
 include 'db_head.php';



 $old_emp_id =test_input($_GET['old_emp_id']);
 $new_emp_id =test_input($_GET['new_emp_id']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



$sql = "UPDATE work SET  emp_id = $new_emp_id WHERE emp_id= $old_emp_id";
  if ( $conn->query($sql) === TRUE) {
  } 
   else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }


  
$sql_c = "UPDATE work SET  work_created_by = $new_emp_id WHERE work_created_by = $old_emp_id";
if ( $conn->query($sql_c) === TRUE) {
} 
 else {
  echo "Error: " . $sql_c . "<br>" . $conn->error;
}


$sql_u = "UPDATE employee SET  emp_approve = 'no' WHERE emp_id = $old_emp_id";
if ( $conn->query($sql_u) === TRUE) {
} 
 else {
  echo "Error: " . $sql_u . "<br>" . $conn->error;
}

$sql_d = "DELETE from  employee  WHERE emp_id = $old_emp_id";
if ( $conn->query($sql_d) === TRUE) {
} 
 else {
  echo "Error: " . $sql_d . "<br>" . $conn->error;
}
$conn->close();

 ?>


