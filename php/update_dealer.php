<?php
 include 'db_head.php';

 $did = test_input($_GET['did']);

 $dstatus = test_input($_GET['dstatus']);

 
 
 $dname = test_input($_GET['dname']);
$dphone = test_input($_GET['dphone']);
$daddr = test_input($_GET['daddr']);
$dpass = test_input($_GET['dpass']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}


 $sql = "UPDATE  dealer SET dname =  $dname,dphone =  $dphone,daddr =  $daddr,dpass =  $dpass,dstatus =  $dstatus WHERE did =  $did";

  if ($conn->query($sql) === TRUE) {
   echo "ok";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();

 ?>


