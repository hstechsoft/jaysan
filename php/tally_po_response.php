
<?php
 include 'db_head.php';

 $vchno =test_input($_GET['vchno']);
 $status =test_input($_GET['status']);
 $dated =($_GET['dated']);
 
  
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "update tally_transaction set sts=$status where vchno=$vchno";
  
if ($conn->query($sql) === TRUE) {
    echo "Record updated successfully";
} else {
    echo "Error updating record: " . $conn->error;
}
 
 



$conn->close();

 ?>





