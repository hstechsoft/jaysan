
<?php
 include 'db_head.php';

 $flabel =test_input($_GET['flabel']);
  $fvalue =test_input($_GET['fvalue']);
   $ftype =test_input($_GET['ftype']);
    $fid =test_input($_GET['fid']);

 
  
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "UPDATE custom_field_master SET flabel=$flabel,fvalue= $fvalue,ftype= $ftype  WHERE  fid=$fid";
  
  if ($conn->query($sql) === TRUE) {
    echo "ok";
    
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
 
 



$conn->close();

 ?>





