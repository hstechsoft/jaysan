<?php
 include 'db_head.php';

 $dname = test_input($_GET['dname']);
$dphone = test_input($_GET['dphone']);
$daddr = test_input($_GET['daddr']);
$dpass = test_input($_GET['dpass']);
$dstatus = test_input($_GET['dstatus']);


 
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "INSERT INTO dealer ( dname,dphone,daddr,dpass,dstatus) VALUES ($dname, $dphone,$daddr,$dpass,$dstatus)";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


